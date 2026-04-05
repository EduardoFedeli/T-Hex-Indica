'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Switch } from '@/components/ui/switch'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function MarketplacesPage() {
  const [lojas, setLojas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarLojas()
  }, [])

  async function carregarLojas() {
    const { data } = await supabase.from('marketplaces').select('*').order('nome')
    if (data) setLojas(data)
    setLoading(false)
  }

  async function toggleStatus(id: string, statusAtual: boolean) {
    // Atualiza visualmente na hora (otimista)
    setLojas(lojas.map(l => l.id === id ? { ...l, ativo: !statusAtual } : l))
    
    // Atualiza no banco
    await supabase.from('marketplaces').update({ ativo: !statusAtual }).eq('id', id)
  }

  if (loading) return <div className="text-white p-8">Carregando marketplaces...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Marketplaces 🛒</h1>
        <p className="text-muted-foreground">Gerencie as lojas afiliadas ativas no T-Hex Indica.</p>
      </div>

      <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#0F0F13] text-gray-400">
            <tr>
              <th className="px-6 py-4">Loja</th>
              <th className="px-6 py-4">Slug (Identificador)</th>
              <th className="px-6 py-4">Cor da Tag</th>
              <th className="px-6 py-4 text-right">Status (Visível no Site)</th>
            </tr>
          </thead>
          <tbody>
            {lojas.map(loja => (
              <tr key={loja.id} className="border-b border-[#2A2A35] hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: loja.cor }} />
                  <span className="text-white">{loja.nome}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{loja.slug}</td>
                <td className="px-6 py-4 font-mono text-xs" style={{ color: loja.cor }}>{loja.cor}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(loja.id, loja.ativo)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      loja.ativo 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E] hover:text-black' 
                        : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {loja.ativo ? 'ATIVO' : 'INATIVO'}
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