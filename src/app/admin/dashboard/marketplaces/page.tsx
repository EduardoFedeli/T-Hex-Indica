'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function MarketplacesPage() {
  const [lojas, setLojas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados do Formulário
  const [showForm, setShowForm] = useState(false)
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [dominios, setDominios] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarLojas()
  }, [])

  async function carregarLojas() {
    const { data } = await supabase.from('marketplaces').select('*').order('nome')
    if (data) setLojas(data)
    setLoading(false)
  }

  async function toggleStatus(id: string, statusAtual: boolean) {
    setLojas(lojas.map(l => l.id === id ? { ...l, ativo: !statusAtual } : l))
    await supabase.from('marketplaces').update({ ativo: !statusAtual }).eq('id', id)
  }

  // Gera o slug automaticamente enquanto você digita o nome (Ex: Mercado Livre -> mercadolivre)
  function handleNomeChange(val: string) {
    setNome(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, ''))
  }

  async function handleSalvar(e: FormEvent) {
    e.preventDefault()
    setSalvando(true)
    
    // Coringa para não quebrar a tabela antiga que exigia cor
    const corPadrao = '#A1A1AA' 

    const { data, error } = await supabase.from('marketplaces').insert([{
      nome: nome.trim(),
      slug: slug.trim(),
      dominios: dominios.trim(),
      cor: corPadrao,
      ativo: true // Já nasce ativo
    }]).select()

    if (error) {
      alert(`Erro ao salvar: ${error.message}`)
    } else if (data) {
      setLojas([...lojas, data[0]].sort((a, b) => a.nome.localeCompare(b.nome)))
      setNome(''); setSlug(''); setDominios('')
      setShowForm(false)
    }
    setSalvando(false)
  }

  if (loading) return <div className="text-white p-8">Carregando marketplaces...</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Marketplaces 🛒</h1>
          <p className="text-muted-foreground">Cadastre lojas e defina os domínios para a detecção automática de links.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#22C55E] text-black font-bold hover:bg-[#22C55E]/80">
          {showForm ? 'Cancelar' : '+ Novo Marketplace'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSalvar} className="bg-[#1A1A24] border border-[#2A2A35] p-5 rounded-xl flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nome da Loja *</Label>
              <Input required value={nome} onChange={e => handleNomeChange(e.target.value)} placeholder="Ex: Amazon" className="bg-[#0F0F13] border-[#2A2A35] h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Slug (Identificador) *</Label>
              <Input required value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="Ex: amazon" className="bg-[#0F0F13] border-[#2A2A35] h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Padrões de Link (Domínios) *</Label>
              <Input required value={dominios} onChange={e => setDominios(e.target.value)} placeholder="Ex: amazon.com.br, amzn.to" className="bg-[#0F0F13] border-[#2A2A35] h-9" />
            </div>
          </div>
          <p className="text-[10px] text-gray-500">Dica: Separe os domínios por vírgula. O T-Hex vai usar isso para adivinhar a loja quando você colar um link no cadastro de produtos.</p>
          <div className="flex justify-end">
            <Button type="submit" disabled={salvando} className="bg-primary text-primary-foreground font-bold h-9">
              {salvando ? 'Salvando...' : 'Salvar Loja'}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#0F0F13] text-gray-400">
            <tr>
              <th className="px-6 py-4">Loja</th>
              <th className="px-6 py-4">Padrões de Link Cadastrados</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {lojas.map(loja => (
              <tr key={loja.id} className="border-b border-[#2A2A35] hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{loja.nome}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">{loja.dominios || 'Nenhum domínio cadastrado'}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(loja.id, loja.ativo)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      loja.ativo 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E] hover:text-black' 
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    {loja.ativo ? 'ATIVO' : 'PAUSADO'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}