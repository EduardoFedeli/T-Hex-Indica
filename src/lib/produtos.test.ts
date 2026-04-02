import { describe, it, expect } from 'vitest'
import {
  getCategorias,
  getCategoria,
  getProdutosDestaque,
  getProdutos,
  getProdutosOferta,
  formatarPreco,
} from './produtos'

describe('getCategorias', () => {
  it('retorna todas as categorias', () => {
    const cats = getCategorias()
    expect(cats.length).toBeGreaterThanOrEqual(4)
  })

  it('cada categoria tem slug, nome, emoji e cor hex', () => {
    for (const cat of getCategorias()) {
      expect(cat.slug).toBeTruthy()
      expect(cat.nome).toBeTruthy()
      expect(cat.emoji).toBeTruthy()
      expect(cat.cor).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('getCategoria', () => {
  it('retorna a categoria pelo slug', () => {
    const cat = getCategoria('pets')
    expect(cat?.nome).toBe('Pets')
  })

  it('retorna null para slug inexistente', () => {
    expect(getCategoria('nao-existe')).toBeNull()
  })
})

describe('getProdutosDestaque', () => {
  it('retorna apenas produtos com destaque: true', () => {
    expect(getProdutosDestaque().every(p => p.destaque)).toBe(true)
  })

  it('aceita limite opcional', () => {
    expect(getProdutosDestaque(3)).toHaveLength(3)
  })
})

describe('getProdutos', () => {
  it('retorna todos os produtos da categoria sem filtros', () => {
    const produtos = getProdutos('pets')
    expect(produtos.length).toBeGreaterThanOrEqual(6)
  })

  it('filtra por loja', () => {
    const amazon = getProdutos('pets', { lojas: ['amazon'] })
    expect(amazon.every(p => p.loja === 'amazon')).toBe(true)
  })

  it('filtra por faixa de preço', () => {
    const baratos = getProdutos('pets', { precoMin: 0, precoMax: 60 })
    expect(baratos.every(p => p.preco <= 60)).toBe(true)
  })

  it('filtra por tag', () => {
    const cachorro = getProdutos('pets', { tags: ['cachorro'] })
    expect(cachorro.every(p => p.tags?.includes('cachorro'))).toBe(true)
  })

  it('ordena por menor preço', () => {
    const produtos = getProdutos('pets', { ordenar: 'menor-preco' })
    for (let i = 1; i < produtos.length; i++) {
      expect(produtos[i].preco).toBeGreaterThanOrEqual(produtos[i - 1].preco)
    }
  })

  it('ordena por maior desconto', () => {
    const produtos = getProdutos('pets', { ordenar: 'maior-desconto' })
    for (let i = 1; i < produtos.length; i++) {
      const a = produtos[i - 1].desconto_pct ?? 0
      const b = produtos[i].desconto_pct ?? 0
      expect(a).toBeGreaterThanOrEqual(b)
    }
  })

  it('ordena a-z', () => {
    const produtos = getProdutos('pets', { ordenar: 'az' })
    for (let i = 1; i < produtos.length; i++) {
      expect(produtos[i].nome.localeCompare(produtos[i - 1].nome)).toBeGreaterThanOrEqual(0)
    }
  })

  it('retorna array vazio para slug inexistente', () => {
    expect(getProdutos('nao-existe')).toHaveLength(0)
  })
})

describe('getProdutosOferta', () => {
  it('retorna apenas produtos com desconto_pct > 0', () => {
    const oferta = getProdutosOferta()
    expect(oferta.every(p => (p.desconto_pct ?? 0) > 0)).toBe(true)
  })

  it('ordena por maior desconto primeiro', () => {
    const oferta = getProdutosOferta()
    for (let i = 1; i < oferta.length; i++) {
      expect(oferta[i - 1].desconto_pct!).toBeGreaterThanOrEqual(oferta[i].desconto_pct!)
    }
  })
})

describe('formatarPreco', () => {
  it('formata número como BRL', () => {
    expect(formatarPreco(49.90)).toMatch(/R\$/)
    expect(formatarPreco(49.90)).toMatch(/49/)
  })
})
