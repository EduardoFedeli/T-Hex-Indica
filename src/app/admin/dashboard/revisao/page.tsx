'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Save, CheckCircle2, Bot } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface ProdutoRevisao {
  id: string
  nome: string
  linkAfiliado: string
  preco: number
  preco_original: number | null
  lojaOrigem: string
  novoPreco?: string 
  novoPrecoOriginal?: string
  salvando?: boolean
}

export default function RevisaoManualPage() {
  const [produtos, setProdutos] = useState<ProdutoRevisao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarFila()
  }, [])

  async function carregarFila() {
    // 1. Busca quais marketplaces estão com o scraper DESATIVADO
    const { data: mkts, error: errMkt } = await supabase
      .from('marketplaces')
      .select('slug')
      .eq('scraper_ativo', false)

    if (errMkt) {
      console.error('[FILA ERROR] Erro ao buscar marketplaces:', errMkt)
      setLoading(false)
      return
    }

    if (!mkts || mkts.length === 0) {
      setProdutos([])
      setLoading(false)
      return
    }

    const slugsBloqueados = mkts.map(m => m.slug)

    // 2. Busca os produtos incluindo o preco_original
    const { data: prods, error: errProds } = await supabase
      .from('produtos')
      .select('id, nome, linkAfiliado, preco, preco_original, lojaOrigem')
      .in('lojaOrigem', slugsBloqueados)

    if (errProds) {
      console.error('[FILA ERROR] Erro ao buscar produtos:', errProds)
      alert(`Erro no banco: ${errProds.message}`)
    }

    if (prods) {
      setProdutos(prods.map(p => ({ 
        ...p, 
        novoPreco: p.preco ? p.preco.toString() : '',
        novoPrecoOriginal: p.preco_original ? p.preco_original.toString() : ''
      })))
    }
    setLoading(false)
  }

  function handlePriceChange(id: string, field: 'novoPreco' | 'novoPrecoOriginal', value: string) {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function salvarPreco(id: string) {
    const prod = produtos.find(p => p.id === id)
    if (!prod || !prod.novoPreco) return

    const precoNum = parseFloat(prod.novoPreco.replace(',', '.'))
    const precoOrigNum = prod.novoPrecoOriginal ? parseFloat(prod.novoPrecoOriginal.replace(',', '.')) : null

    if (isNaN(precoNum)) return alert('O Preço Atual é inválido.')
    if (precoOrigNum && precoOrigNum <= precoNum) return alert('O Preço Original deve ser maior que o Preço Atual.')

    // Cálculo automático da porcentagem de desconto
    let desconto_pct = null
    if (precoOrigNum && precoOrigNum > precoNum) {
      desconto_pct = Math.round((1 - precoNum / precoOrigNum) * 100)
    }

    setProdutos(prev => prev.map(p => p.id === id ? { ...p, salvando: true } : p))

    const { error } = await supabase
      .from('produtos')
      .update({ 
        preco: precoNum, 
        preco_original: precoOrigNum,
        desconto_pct: desconto_pct, // Salva o desconto para a vitrine renderizar as badges
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id)

    if (!error) {
      // Remove da lista instantaneamente após salvar para esvaziar a fila
      setProdutos(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Erro ao salvar no banco.')
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, salvando: false } : p))
    }
  }

  if (loading) return <div className="p-8 text-white font-bold animate-pulse">Carregando fila de revisão...</div>

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20">
      <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Bot className="text-primary" size={28} /> Fila de Revisão Manual
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Produtos de marketplaces blindados (`scraper_ativo = false`). Ideal para revisão via Agentes de IA.
          </p>
        </div>
        <div className="bg-[#0F0F13] px-4 py-2 rounded-xl border border-[#2A2A35] text-center">
          <span className="block text-2xl font-black text-primary">{produtos.length}</span>
          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Pendentes</span>
        </div>
      </div>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <CheckCircle2 size={48} className="text-[#22C55E]" />
          <p className="text-white font-black text-xl">Fila Limpa!</p>
          <p className="text-gray-500 text-sm">Todos os produtos manuais estão atualizados.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300 min-w-[900px]">
            <thead className="text-[10px] uppercase bg-[#0F0F13] text-gray-500 font-black tracking-widest border-b border-[#2A2A35]">
              <tr>
                <th className="px-5 py-4">Produto & Loja</th>
                <th className="px-5 py-4 text-right">Banco Atual</th>
                <th className="px-5 py-4 text-center">Auditoria</th>
                <th className="px-5 py-4 w-32">Novo Preço (R$)</th>
                <th className="px-5 py-4 w-32">Preço Orig. (R$)</th>
                <th className="px-5 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(prod => (
                <tr key={prod.id} className="border-b border-[#2A2A35] hover:bg-white/5 transition-colors">
                  {/* NOME E LOJA */}
                  <td className="px-5 py-3">
                    <p className="font-bold text-white text-xs line-clamp-1 mb-1 max-w-sm" title={prod.nome}>{prod.nome}</p>
                    <span className="text-[9px] font-black uppercase bg-[#0F0F13] px-2 py-0.5 rounded border border-[#2A2A35]">
                      {prod.lojaOrigem}
                    </span>
                  </td>
                  
                  {/* PREÇOS ATUAIS NO BANCO */}
                  <td className="px-5 py-3 text-right font-mono">
                    <div className="flex flex-col items-end">
                      <span className="text-[#22C55E] font-bold text-xs">R$ {prod.preco.toFixed(2)}</span>
                      {prod.preco_original && (
                        <span className="text-[#8E8E9F] text-[10px] line-through">R$ {prod.preco_original.toFixed(2)}</span>
                      )}
                    </div>
                  </td>

                  {/* LINK EXTERNO */}
                  <td className="px-5 py-3 text-center">
                    <a 
                      href={prod.linkAfiliado} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      Abrir Link <ExternalLink size={12} />
                    </a>
                  </td>

                  {/* INPUT NOVO PREÇO */}
                  <td className="px-5 py-3">
                    <Input 
                      type="number" 
                      step="0.01"
                      value={prod.novoPreco}
                      onChange={e => handlePriceChange(prod.id, 'novoPreco', e.target.value)}
                      className="w-full h-8 bg-[#0F0F13] border-[#2A2A35] text-primary font-bold"
                    />
                  </td>

                  {/* INPUT NOVO PREÇO ORIGINAL */}
                  <td className="px-5 py-3">
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Opcional"
                      value={prod.novoPrecoOriginal}
                      onChange={e => handlePriceChange(prod.id, 'novoPrecoOriginal', e.target.value)}
                      className="w-full h-8 bg-[#0F0F13] border-[#2A2A35] text-[#8E8E9F]"
                    />
                  </td>

                  {/* AÇÃO */}
                  <td className="px-5 py-3 text-right">
                    <Button 
                      onClick={() => salvarPreco(prod.id)}
                      disabled={prod.salvando}
                      size="sm"
                      className="h-8 bg-[#22C55E] text-black font-black text-xs hover:bg-[#22C55E]/80 disabled:opacity-50"
                    >
                      {prod.salvando ? '...' : <><Save size={14} className="mr-1" /> Salvar</>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}