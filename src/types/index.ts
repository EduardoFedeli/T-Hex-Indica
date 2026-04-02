export type Loja = 'amazon' | 'shopee'

export interface Produto {
  id: string
  nome: string
  preco: string
  imagem: string | null
  link_afiliado: string
  loja: Loja
  destaque: boolean
}

export interface Categoria {
  nome: string
  slug: string
  emoji: string
  cor: string
  descricao: string
  produtos: Produto[]
}

export interface ProdutosData {
  categorias: Categoria[]
}
