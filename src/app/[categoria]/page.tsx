import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategorias, getCategoria } from '@/lib/produtos'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import CategoriaContent from './CategoriaContent'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)
  if (!cat) return {}
  return {
    title: `${cat.nome} — Achadinhos`,
    description: cat.descricao,
  }
}

export async function generateStaticParams() {
  return getCategorias().map(c => ({ categoria: c.slug }))
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)
  if (!cat) notFound()

  const todasCategorias = getCategorias()

  return (
    <>
      <Header />
      <CategoriaContent cat={cat} todasCategorias={todasCategorias} />
      <BottomNav />
    </>
  )
}
