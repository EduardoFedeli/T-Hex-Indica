'use client'

import { useState, useMemo } from 'react'
import type { Categoria, FiltrosProduto } from '@/types'
import { getProdutos } from '@/lib/produtos'
import ProductCard from '@/components/ProductCard'
import FilterPanel from '@/components/FilterPanel'
import CategoryGrid from '@/components/CategoryGrid'
import SectionHeader from '@/components/SectionHeader'

interface CategoriaContentProps {
  cat: Categoria
  todasCategorias: Categoria[]
}

function getTagsDaCategoria(cat: Categoria): string[] {
  const set = new Set<string>()
  for (const p of cat.produtos) {
    for (const tag of p.tags ?? []) set.add(tag)
  }
  return Array.from(set).sort()
}

export default function CategoriaContent({ cat, todasCategorias }: CategoriaContentProps) {
  const [filtros, setFiltros] = useState<FiltrosProduto>({})

  const precoMaxTotal = useMemo(
    () => Math.ceil(Math.max(...cat.produtos.map(p => p.preco)) / 10) * 10,
    [cat.produtos]
  )

  const produtosFiltrados = useMemo(
    () => getProdutos(cat.slug, filtros),
    [cat.slug, filtros]
  )

  const tags = useMemo(() => getTagsDaCategoria(cat), [cat])

  return (
    <div className="min-h-screen bg-page-bg pb-24">
      {/* Hero */}
      <section
        className="px-5 py-8 md:flex md:items-center md:justify-between md:py-12"
        style={{
          background: `linear-gradient(135deg, ${cat.cor}33 0%, transparent 70%)`,
          borderBottom: `1px solid ${cat.cor}33`,
        }}
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            categoria
          </p>
          <h1
            className="mt-1 text-3xl font-black lg:text-4xl"
            style={{ color: cat.cor }}
          >
            {cat.nome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{cat.descricao}</p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {produtosFiltrados.length} achados
          </p>
        </div>
        <span className="mt-4 block text-6xl md:mt-0 md:text-8xl">{cat.emoji}</span>
      </section>

      {/* Category strip */}
      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={todasCategorias} slugAtivo={cat.slug} />

      {/* Products + filter */}
      <div className="flex gap-6 px-4 pt-2">
        <FilterPanel
          filtros={filtros}
          onFiltrosChange={setFiltros}
          tagsDaCategoria={tags}
          precoMaxTotal={precoMaxTotal}
          cor={cat.cor}
        />

        <div className="flex-1 min-w-0">
          <SectionHeader title={`${cat.nome} — ${produtosFiltrados.length} achados`} />
          {produtosFiltrados.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {produtosFiltrados.map(produto => (
                <ProductCard key={produto.id} produto={produto} categoria={cat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
