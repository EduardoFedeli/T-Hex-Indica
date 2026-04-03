'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/types'

interface CategoryGridProps {
  categorias: Categoria[]
  slugAtivo?: string
}

export default function CategoryGrid({ categorias, slugAtivo }: CategoryGridProps) {
  return (
    <div className="flex flex-nowrap lg:justify-center gap-4 px-4 md:px-4 pt-4 pb-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categorias.map(cat => {
        const ativo = cat.slug === slugAtivo
        const borderSecondary = '#2A2A35'

        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group flex flex-col items-center gap-3 shrink-0 snap-start"
            // Injetamos a cor da categoria como variável CSS para o hover do Tailwind
            style={{ '--cat-color': cat.cor } as React.CSSProperties}
          >
            <div
              className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl md:rounded-[28px] transition-all duration-300 group-hover:scale-95 group-active:scale-90 relative overflow-hidden group-hover:shadow-lg"
              style={{
                backgroundColor: ativo ? cat.cor : '#1A1A24',
                boxShadow: ativo ? `0 8px 20px ${cat.cor}40` : undefined,
                // O truque: A borda e a sombra mudam usando variáveis customizadas que reagem ao hover da classe 'group'
                border: ativo ? `2px solid ${cat.cor}` : `1px solid ${borderSecondary}`,
                '--hover-border': cat.cor,
              } as React.CSSProperties}
            >
              {/* Para o Tailwind pegar o hover na borda via estilo inline */}
              <div className="absolute inset-0 border-2 rounded-2xl md:rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ borderColor: cat.cor }} />
              {/* LÓGICA DE ÍCONE: Imagem IA > Emoji */}
              {cat.iconeUrl ? (
                // O ícone dá uma leve rotacionada para acompanhar o clique/hover
                <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 group-hover:rotate-6">
                  <Image
                    src={cat.iconeUrl}
                    alt={cat.nome}
                    fill
                    sizes="(max-width: 768px) 48px, 56px"
                    className={`object-contain transition-all ${ativo ? 'brightness-0 invert' : ''}`}
                  />
                </div>
              ) : (
                <span className={`text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 ${ativo ? 'drop-shadow-md' : ''}`}>
                  {cat.emoji}
                </span>
              )}

              {/* Reflexo sutil interno */}
              {ativo && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
            </div>

            <span
              className={`text-[11px] md:text-[12px] font-black tracking-widest uppercase transition-colors duration-300 mt-1 ${
                ativo ? 'text-white' : 'text-[#A1A1AA] group-hover:text-[var(--cat-color)]'
              }`}
              style={ativo ? { color: cat.cor } : undefined}
            >
              {cat.nome}
            </span>
          </Link>
        )
      })}
    </div>
  )
}