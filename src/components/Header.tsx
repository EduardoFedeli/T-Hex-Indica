'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { formatarPreco } from '@/lib/produtos'
import type { Categoria } from '@/types'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const removeAcentos = (str: string) => {
  if (!str) return ""
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

interface CategoriaComImagem extends Categoria {
  imagem_url?: string
}

export default function Header() {
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [todosProdutos, setTodosProdutos] = useState<any[]>([])
  const [categoriasMenu, setCategoriasMenu] = useState<CategoriaComImagem[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.from('produtos').select('*').then(({ data, error }) => {
      if (error) console.error("Erro ao carregar produtos:", error)
      else if (data) setTodosProdutos(data)
    })

    supabase.from('categorias').select('*').then(({ data, error }) => {
      if (!error && data) {
        setCategoriasMenu(data.sort((a, b) => a.nome.localeCompare(b.nome)))
      }
    })
  }, [])

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsFocused(false)
    }
    document.addEventListener("mousedown", clickOut)
    return () => document.removeEventListener("mousedown", clickOut)
  }, [])

  const resultadosBusca = useMemo(() => {
    if (busca.trim().length < 2) return []
    const termosDigitados = removeAcentos(busca).split(' ').filter(Boolean)
    return todosProdutos
      .filter(p => {
        const nomeNorm = removeAcentos(p.nome)
        const lojaNorm = removeAcentos(p.lojaOrigem || p.loja || '')
        const tagsNorm = Array.isArray(p.tags) ? p.tags.map((t: string) => removeAcentos(t)).join(' ') : ''
        const textoCompletoDoProduto = `${nomeNorm} ${lojaNorm} ${tagsNorm}`
        return termosDigitados.every(termo => textoCompletoDoProduto.includes(termo))
      })
      .slice(0, 6)
  }, [busca, todosProdutos])

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35] transition-colors duration-500">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-4 md:px-8 gap-4 md:gap-8">
        
        {/* BLOCO 1: ESQUERDA (Logo + Categorias) */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 transition-transform hover:scale-105 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md">
              <Image src="/assets/mascot/icone3.png" alt="T-Hex Mascote" fill sizes="(max-width: 768px) 100px, 150px" className="object-contain" />
            </div>
            <span className="hidden xl:block text-2xl font-black text-white uppercase tracking-tighter">
              <span style={{ color: 'var(--brand-color, #22C55E)' }} className="transition-colors duration-500">T-HEX</span> INDICA
            </span>
          </Link>

          {/* Menu Categorias */}
          <div className="relative group/menu h-20 flex items-center">
            <button className="hidden md:flex px-2 items-center text-[#A1A1AA] font-bold text-sm transition-all hover:text-white whitespace-nowrap gap-1.5">
              Categorias
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover/menu:opacity-100 transition-transform group-hover/menu:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {/* Backdrop */}
            <div className="fixed inset-x-0 top-20 h-[calc(100vh-80px)] bg-[#0F0F13]/60 backdrop-blur-[2px] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-40" />
            
            {/* Dropdown Vertical Unificado */}
            {categoriasMenu.length > 0 && (
              <div className="absolute top-[70px] left-0 pt-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-50 w-[260px]">
                <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-2 flex flex-col">
                  {categoriasMenu.map(cat => (
                    <Link 
                      key={cat.slug} 
                      href={`/${cat.slug}`}
                      className="px-6 py-3 text-sm font-bold text-[#A1A1AA] hover:bg-[#2A2A35] hover:text-[var(--hover-color)] transition-colors"
                      style={{ '--hover-color': cat.cor } as React.CSSProperties}
                    >
                      {cat.nome}
                    </Link>
                  ))}
                  <div className="h-px w-full bg-[#2A2A35] my-2" />
                  <Link href="/mais-vendidos" className="px-6 py-3 text-sm font-bold text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] transition-colors">Mais vendidos</Link>
                  <Link href="/novidades" className="px-6 py-3 text-sm font-bold text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] transition-colors">Novidades</Link>
                  <Link href="/explorar" className="px-6 py-3 text-sm font-bold text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] transition-colors">Todos os Produtos</Link>
                  <div className="h-px w-full bg-[#2A2A35] my-2" />
                  <Link href="/categorias" className="px-6 py-3 text-sm font-black text-[#22C55E] hover:bg-[#2A2A35] transition-colors">Ver todas as categorias</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BLOCO 2: CENTRO (Busca Ampla) */}
        <div className="flex-1 w-full max-w-2xl relative" ref={searchRef}>
          <div className="relative group w-full">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Buscar ofertas, lojas ou categorias..."
              className="w-full h-10 md:h-11 rounded-full bg-[#0F0F13] border border-[#2A2A35] pl-5 pr-12 text-sm text-white focus:outline-none transition-all duration-300"
              style={{ borderColor: isFocused ? 'var(--brand-color, #22C55E)' : '#2A2A35' }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          {/* Resultados da Busca Dropdown */}
          {isFocused && busca.trim().length >= 2 && (
            <div className="absolute top-14 left-0 right-0 bg-[#1A1A24] border border-[#2A2A35] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50">
              {resultadosBusca.length > 0 ? (
                <ul>
                  {resultadosBusca.map((prod) => {
                    const imgUrl = prod.imagem_url || prod.imagemUrl || prod.imagem || ''
                    const linkAfiliado = prod.link_afiliado || prod.linkAfiliado || '#'
                    return (
                      <li key={prod.id}>
                        <a href={linkAfiliado} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 hover:bg-[#2A2A35] border-b border-[#2A2A35]/50 last:border-0 group/item">
                          {imgUrl && <img src={imgUrl} alt={prod.nome} className="h-10 w-10 rounded bg-white object-contain shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{prod.nome}</p>
                            <p className="text-xs font-black transition-colors" style={{ color: 'var(--brand-color, #22C55E)' }}>{formatarPreco(prod.preco)}</p>
                          </div>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-xs text-[#A1A1AA] font-bold uppercase tracking-widest">Nenhum achadinho encontrado</div>
              )}
            </div>
          )}
        </div>

        {/* BLOCO 3: DIREITA (Sobre + Explorar) */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link 
            href="/sobre" 
            className="hidden md:block text-sm font-bold text-[#A1A1AA] hover:text-white transition-colors"
          >
            Sobre
          </Link>
          
          <Link 
            href="/explorar" 
            className="flex px-4 md:px-6 h-9 md:h-10 items-center justify-center rounded-full bg-white/5 text-white font-bold text-[10px] md:text-sm uppercase transition-all hover:text-[#0F0F13] whitespace-nowrap active:scale-95"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim() || '#22C55E'
              e.currentTarget.style.color = '#0F0F13'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'white'
            }}
          >
            Explorar
          </Link>
        </div>

      </div>
    </header>
  )
}