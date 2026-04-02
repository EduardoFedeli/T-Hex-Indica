import { describe, it, expect } from 'vitest'
import { getCategorias, getCategoria, getProdutosDestaque } from './produtos'

describe('getCategorias', () => {
  it('retorna todas as 6 categorias', () => {
    const cats = getCategorias()
    expect(cats).toHaveLength(6)
  })

  it('cada categoria tem slug, nome e emoji', () => {
    const cats = getCategorias()
    for (const cat of cats) {
      expect(cat.slug).toBeTruthy()
      expect(cat.nome).toBeTruthy()
      expect(cat.emoji).toBeTruthy()
    }
  })
})

describe('getCategoria', () => {
  it('retorna a categoria pelo slug', () => {
    const cat = getCategoria('pets')
    expect(cat).not.toBeNull()
    expect(cat?.nome).toBe('Pets')
  })

  it('retorna null para slug inexistente', () => {
    const cat = getCategoria('nao-existe')
    expect(cat).toBeNull()
  })
})

describe('getProdutosDestaque', () => {
  it('retorna apenas produtos com destaque: true', () => {
    const produtos = getProdutosDestaque()
    expect(produtos.every(p => p.destaque)).toBe(true)
  })

  it('retorna produtos de múltiplas categorias', () => {
    const produtos = getProdutosDestaque()
    expect(produtos.length).toBeGreaterThan(1)
  })

  it('aceita limite opcional', () => {
    const produtos = getProdutosDestaque(4)
    expect(produtos).toHaveLength(4)
  })
})
