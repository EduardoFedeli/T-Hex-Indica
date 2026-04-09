'use client'

import Image from 'next/image'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

interface ProductCardRankedProps {
  produto: Produto
  categoria: Categoria
  priority?: boolean
  badgeLabel?: string
  badgeColor?: string
}

export default function ProductCardRanked({
  produto,
  categoria,
  priority,
  badgeLabel = 'Mais Vendido',
  badgeColor = '#F97316',
}: ProductCardRankedProps) {
  const precoOriginalReal = (produto as any).precoOriginal || (produto as any).preco_original || produto.preco_original
  const linkDestino = produto.link_afiliado || (produto as any).linkAfiliado || '#'

  const handleTrackClick = () => {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        produtoId: produto.id,
        categoriaSlug: categoria?.slug || (produto as any).categoriaSlugs?.[0] || 'sem-categoria',
      }),
    }).catch(() => {})
  }

  return (
    <a
      href={linkDestino}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleTrackClick}
      className="relative group flex flex-col overflow-hidden rounded-2xl bg-[#1E1E2E] border border-[#2A2A35] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Borda de hover individual */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20"
        style={{ borderColor: badgeColor }}
      />

      {/* Imagem — sem tags sobrepostas */}
      <div className="relative aspect-square w-full overflow-hidden bg-white shrink-0">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            priority={priority}
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {categoria?.emoji || '📦'}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col p-3 gap-1.5">

        {/* Linha 1: Badge sempre presente */}
        <div className="h-5 flex items-center">
          <span
            className="inline-flex items-center text-[9px] md:text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md text-[#0F0F13]"
            style={{ backgroundColor: badgeColor }}
          >
            {badgeLabel}
          </span>
        </div>

        {/* Linha 2: Preço riscado — altura fixa */}
        <div className="h-4 flex items-center">
          {precoOriginalReal && precoOriginalReal > produto.preco && (
            <p className="text-[10px] text-[#A1A1AA] line-through opacity-70 leading-none">
              {formatarPreco(precoOriginalReal)}
            </p>
          )}
        </div>

        {/* Linha 3: Preço + % OFF verde */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <p className="text-base md:text-lg font-black leading-none" style={{ color: badgeColor }}>
            {formatarPreco(produto.preco)}
          </p>
          {produto.desconto_pct && produto.desconto_pct > 0 && (
            <span className="text-[10px] font-black text-[#22C55E]">
              {produto.desconto_pct}% OFF
            </span>
          )}
        </div>

        {/* Linha 4: Nome */}
        <p className="text-xs font-semibold text-[#D4D4D8] leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-white transition-colors">
          {produto.nome}
        </p>

        {/* Botão */}
        <div
          className="mt-1 w-full rounded-xl py-2.5 text-center text-[10px] font-black text-[#0F0F13] group-hover:brightness-110 transition-all flex items-center justify-center gap-1"
          style={{ backgroundColor: badgeColor, boxShadow: `0 4px 12px ${badgeColor}33` }}
        >
          VER OFERTA →
        </div>
      </div>
    </a>
  )
}
