import data from '../data/produtos.json'
import type { Categoria, Produto } from '../types'

const { categorias } = data as { categorias: Categoria[] }

export function getCategorias(): Categoria[] {
  return categorias
}

export function getCategoria(slug: string): Categoria | null {
  return categorias.find(c => c.slug === slug) ?? null
}

export function getProdutosDestaque(limite?: number): Produto[] {
  const todos = categorias.flatMap(c => c.produtos.filter(p => p.destaque))
  return limite ? todos.slice(0, limite) : todos
}
