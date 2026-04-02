'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/', label: 'Início', emoji: '🏠' },
  { href: '/buscar', label: 'Buscar', emoji: '🔍' },
  { href: '/ofertas', label: 'Ofertas', emoji: '🔥' },
  { href: '/categorias', label: 'Categorias', emoji: '📂' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-gray-100 bg-white pb-4 pt-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {ITENS.map(item => {
        const ativo = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[9px] font-semibold ${
              ativo ? 'text-brand' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
