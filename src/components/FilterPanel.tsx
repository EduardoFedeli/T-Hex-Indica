'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import FilterChip from '@/components/FilterChip'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import type { FiltrosProduto, Loja } from '@/types'
import { SlidersHorizontal } from 'lucide-react'

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
}

function FilterBody({ filtros, onFiltrosChange, tagsDaCategoria, precoMaxTotal, cor }: FilterPanelProps) {
  const precoMin = filtros.precoMin ?? 0
  const precoMax = filtros.precoMax ?? precoMaxTotal

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

  function setOrdenar(ord: FiltrosProduto['ordenar']) {
    onFiltrosChange({ ...filtros, ordenar: filtros.ordenar === ord ? undefined : ord })
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Ordenar */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Ordenar</p>
        <div className="flex flex-wrap gap-2">
          {(['menor-preco', 'maior-desconto', 'az'] as const).map(ord => {
            const labels = { 'menor-preco': 'Menor preço', 'maior-desconto': 'Maior desconto', az: 'A-Z' }
            return (
              <FilterChip
                key={ord}
                label={labels[ord]}
                ativo={filtros.ordenar === ord}
                cor={cor}
                onClick={() => setOrdenar(ord)}
              />
            )
          })}
        </div>
      </div>

      {/* Faixa de preço */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Faixa de preço</p>
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

      {/* Lojas */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Loja</p>
        <div className="flex flex-wrap gap-2">
          {LOJAS.map(loja => (
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

      {/* Tags da categoria */}
      {tagsDaCategoria.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Filtrar por</p>
          <div className="flex flex-wrap gap-2">
            {tagsDaCategoria.map(tag => (
              <FilterChip
                key={tag}
                label={tag}
                ativo={(filtros.tags ?? []).includes(tag)}
                cor={cor}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Limpar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFiltrosChange({})}
        className="mt-2 border-card-border text-muted-foreground"
      >
        Limpar filtros
      </Button>
    </div>
  )
}

export default function FilterPanel(props: FilterPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile: floating button + Sheet */}
      <div className="lg:hidden fixed bottom-20 right-4 z-30">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              style={{ backgroundColor: props.cor }}
              className="rounded-full shadow-lg text-white gap-2"
            >
              <SlidersHorizontal size={16} />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-surface border-card-border rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle className="text-white text-left">Filtros</SheetTitle>
            </SheetHeader>
            <FilterBody {...props} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: static sidebar */}
      <aside className="hidden lg:block w-[220px] shrink-0">
        <div className="sticky top-[100px] rounded-2xl bg-card-bg border border-card-border">
          <p className="px-4 pt-4 text-xs font-bold uppercase tracking-wide text-white">Filtros</p>
          <FilterBody {...props} />
        </div>
      </aside>
    </>
  )
}
