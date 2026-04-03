'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import type { Produto, Categoria, Loja } from '@/types'

const LOJAS: Loja[] = ['amazon', 'shopee', 'magalu', 'mercadolivre', 'americanas', 'casasbahia', 'centauro', 'aliexpress']

// Suporte retroativo para quando a prop antiga tinha apenas categoriaSlug
interface ProdutoComCategoria extends Produto {
  categoriaSlug?: string
  categoriaSlugs?: string[]
}

interface ProductFormProps {
  categorias: Categoria[]
  produto?: ProdutoComCategoria
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ categorias, produto, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!produto
  const [nome, setNome] = useState(produto?.nome ?? '')
  
  // Inicializa o array de categorias. Se for um produto antigo com apenas 'categoriaSlug', transforma em array.
  const initialCategories = produto?.categoriaSlugs?.length 
    ? produto.categoriaSlugs 
    : (produto?.categoriaSlug ? [produto.categoriaSlug] : [categorias[0]?.slug ?? ''])
  
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(initialCategories)
  
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? '')
  const [precoOriginal, setPrecoOriginal] = useState(produto?.preco_original?.toString() ?? '')
  const [desconto, setDesconto] = useState(produto?.desconto_pct?.toString() ?? '')
  const [imagem, setImagem] = useState(produto?.imagem ?? '')
  const [linkAfiliado, setLinkAfiliado] = useState(produto?.link_afiliado ?? '')
  const [loja, setLoja] = useState<Loja>(produto?.loja ?? 'amazon')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(produto?.tags ?? [])
  const [destaque, setDestaque] = useState(produto?.destaque ?? false)
  const [novo, setNovo] = useState(produto?.novo ?? false)
  // Estado para capturar e editar a data formatada para o input date (YYYY-MM-DD)
  const [dataCadastro, setDataCadastro] = useState(
    produto?.createdAt 
      ? new Date(produto.createdAt).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  )
  const [loading, setLoading] = useState(false)

  function handlePrecoOriginalChange(v: string) {
    setPrecoOriginal(v)
    const orig = parseFloat(v)
    const atual = parseFloat(preco)
    if (!isNaN(orig) && !isNaN(atual) && orig > 0) {
      setDesconto(String(Math.round((1 - atual / orig) * 100)))
    }
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  function toggleCategoria(slug: string) {
    setSelectedCategorias(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    if (selectedCategorias.length === 0) {
      alert('Selecione ao menos uma categoria.')
      return
    }
    
    setLoading(true)

    const novoProduto: Produto = {
      id: produto?.id ?? `prod-${Date.now()}`,
      nome,
      preco: parseFloat(preco),
      preco_original: precoOriginal ? parseFloat(precoOriginal) : undefined,
      desconto_pct: desconto ? parseInt(desconto) : undefined,
      imagem: imagem || null,
      link_afiliado: linkAfiliado,
      loja,
      tags: tags.length > 0 ? tags : undefined,
      destaque,
      novo,
      // Força a atualização da data escolhida no calendário manualmente (mantendo horário neutro Z)
      createdAt: new Date(`${dataCadastro}T12:00:00Z`).toISOString(),
    }

    const url = isEdit ? `/api/produtos/${produto!.id}` : '/api/produtos'
    const method = isEdit ? 'PUT' : 'POST'
    
    // Novo payload unificado enviando o produto e as categorias alvo
    const body = {
      produto: novoProduto,
      categoriaSlugs: selectedCategorias
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSave()
    } else {
      alert('Erro ao salvar produto.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-foreground">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Nome do Produto <span className="text-primary font-bold">*</span></Label>
          <Input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
            className="bg-background border-input focus-visible:ring-primary"
          />
        </div>
        
        <div className="sm:col-span-2 space-y-2">
          <Label>Categorias (Selecione uma ou mais)</Label>
          <div className="flex flex-wrap gap-2">
            {categorias.map(c => {
              const isSelected = selectedCategorias.includes(c.slug)
              return (
                <Badge
                  key={c.slug}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleCategoria(c.slug)}
                  className={`cursor-pointer px-3 py-1 text-sm select-none transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent' 
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {c.emoji} {c.nome}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Loja</Label>
          <select
            value={loja}
            onChange={e => setLoja(e.target.value as Loja)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {LOJAS.map(l => <option key={l} value={l} className="bg-card text-foreground">{l}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Preço atual (R$)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={preco} 
            onChange={e => setPreco(e.target.value)} 
            required 
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Preço original (R$)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={precoOriginal} 
            onChange={e => handlePrecoOriginalChange(e.target.value)} 
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Desconto %</Label>
          <Input 
            type="number" 
            value={desconto} 
            onChange={e => setDesconto(e.target.value)} 
            className="bg-background border-input"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label>URL da imagem</Label>
          <div className="flex gap-3 items-center">
            <Input 
              value={imagem} 
              onChange={e => setImagem(e.target.value)} 
              placeholder="https://..." 
              className="bg-background border-input flex-1"
            />
            {imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagem} alt="" className="h-10 w-10 rounded-md object-cover border border-border shrink-0" />
            )}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label>Link afiliado</Label>
          <Input 
            value={linkAfiliado} 
            onChange={e => setLinkAfiliado(e.target.value)} 
            placeholder="https://amzn.to/..." 
            required 
            className="bg-background border-input"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label>Tags (Aperte Enter para adicionar)</Label>
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Ex: smartphone, custo-beneficio..."
            className="bg-background border-input"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <button 
                key={tag} 
                type="button" 
                onClick={() => removeTag(tag)} 
                className="flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1.5 border-t border-border pt-5 mt-2">
          <Label>Data de Cadastro (Para auditoria de +90 dias)</Label>
          <Input 
            type="date"
            value={dataCadastro}
            onChange={e => setDataCadastro(e.target.value)}
            className="bg-background border-input max-w-[200px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Você pode backdatar um produto para testar o filtro, ou forçar uma renovação manual.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border mt-2">
          <Switch id="destaque" checked={destaque} onCheckedChange={setDestaque} />
          <Label htmlFor="destaque" className="cursor-pointer">Destaque na vitrine</Label>
        </div>

        <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border">
          <Switch id="novo" checked={novo} onCheckedChange={setNovo} />
          <Label htmlFor="novo" className="cursor-pointer">Selo de Novo</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  )
}