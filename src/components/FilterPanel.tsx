'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FilterChip from '@/components/FilterChip'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import type { FiltrosProduto, Loja } from '@/types'

const LOJAS: Loja[] = ['amazon', 'shopee', 'magalu', 'mercadolivre', 'americanas', 'casasbahia', 'centauro', 'aliexpress']
const LOJA_LABEL: Record<Loja, string> = {
  amazon: 'Amazon', shopee: 'Shopee', magalu: 'Magalu',
  mercadolivre: 'Mercado Livre', americanas: 'Americanas',
  casasbahia: 'Casas Bahia', centauro: 'Centauro', aliexpress: 'AliExpress',
}

interface FilterPanelProps {
  filtros: FiltrosProduto
  onFiltrosChange: (f: FiltrosProduto) => void
  tagsDaCategoria: string[]
  precoMaxTotal: number
  cor: string
  marketplacesDisponiveis: string[] 
}

export default function FilterPanel({ filtros, onFiltrosChange, tagsDaCategoria, precoMaxTotal, cor, marketplacesDisponiveis }: FilterPanelProps) {
  const precoMin = filtros.precoMin ?? 0
  const precoMax = filtros.precoMax ?? precoMaxTotal
  const [buscaTag, setBuscaTag] = useState('')

  function toggleLoja(loja: Loja) {
    const current = filtros.lojas ?? []
    const next = current.includes(loja)
      ? current.filter(l => l !== loja)
      : [...current, loja]
    onFiltrosChange({ ...filtros, lojas: next.length > 0 ? next : undefined })
  }

  function toggleTag(tag: string) {
    const current = filtros.tags ?? []
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag]
    onFiltrosChange({ ...filtros, tags: next.length > 0 ? next : undefined })
  }

  const lojasAtivas = LOJAS.filter(loja => marketplacesDisponiveis.includes(loja))

  return (
    // O contêiner pai controla o layout, o FilterPanel apenas renderiza o conteúdo
    <div className="flex flex-col gap-8 bg-[#1A1A24] md:border md:border-[#2A2A35] rounded-3xl md:shadow-sm">
      
      {/* Título (Só aparece no Desktop, pois no Mobile o SheetTitle já faz isso) */}
      <div className="hidden md:block px-6 py-5 border-b border-[#2A2A35]">
        <p className="text-sm font-black uppercase tracking-widest text-white">Filtros</p>
      </div>

      <div className="flex flex-col gap-8 p-6 md:pt-6 pt-0">
        <div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">Faixa de preço</p>
          <PriceRangeSlider
            min={0}
            max={precoMaxTotal}
            value={[precoMin, precoMax]}
            onChange={([min, max]) =>
              onFiltrosChange({
                ...filtros,
                precoMin: min > 0 ? min : undefined,
                precoMax: max < precoMaxTotal ? max : undefined,
              })
            }
            cor={cor}
          />
        </div>

        {lojasAtivas.length > 0 && (
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">Marketplace</p>
            <div className="flex flex-wrap gap-2">
              {lojasAtivas.map(loja => (
                <FilterChip
                  key={loja}
                  label={LOJA_LABEL[loja]}
                  ativo={(filtros.lojas ?? []).includes(loja)}
                  cor={cor}
                  onClick={() => toggleLoja(loja)}
                />
              ))}
            </div>
          </div>
        )}

        {tagsDaCategoria.length > 0 && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#A1A1AA]">
                Filtrar por ({tagsDaCategoria.length})
              </p>
            </div>

            {/* INPUT DE BUSCA DE TAGS */}
            <input
              type="text"
              placeholder="Buscar característica..."
              value={buscaTag}
              onChange={(e) => setBuscaTag(e.target.value)}
              className="w-full h-10 mb-4 rounded-xl bg-[#0F0F13] border border-[#2A2A35] px-4 text-xs text-white placeholder-[#A1A1AA] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E] transition-all"
              style={{ '--tw-ring-color': cor, borderColor: buscaTag ? cor : '' } as React.CSSProperties}
            />

            {/* CONTÊINER COM SCROLL E LIMITE DE ALTURA */}
            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#2A2A35] [&::-webkit-scrollbar-thumb]:rounded-full">
              {tagsDaCategoria
                .filter(tag => tag.toLowerCase().includes(buscaTag.toLowerCase()))
                .map(tag => (
                  <FilterChip
                    key={tag}
                    label={tag}
                    ativo={(filtros.tags ?? []).includes(tag)}
                    cor={cor}
                    onClick={() => toggleTag(tag)}
                  />
              ))}
              
              {/* Mensagem se não encontrar nenhuma tag */}
              {tagsDaCategoria.filter(tag => tag.toLowerCase().includes(buscaTag.toLowerCase())).length === 0 && (
                <p className="text-xs text-[#A1A1AA] w-full text-center py-2">
                  Nenhum filtro encontrado.
                </p>
              )}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => onFiltrosChange({})}
          className="mt-2 w-full h-11 border-[#2A2A35] bg-transparent text-[#A1A1AA] hover:bg-[#2A2A35] hover:text-white transition-all rounded-xl font-bold text-xs"
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}