import ProductCard from './ProductCard'
import type { Produto, Categoria } from '../types'

interface ProductGridProps {
  produtos: Produto[]
  categorias: Categoria[]
}

export default function ProductGrid({ produtos, categorias }: ProductGridProps) {
  // Monta um mapa id → categoria percorrendo os produtos de cada categoria
  const catPorIdProduto = new Map<string, Categoria>()
  for (const cat of categorias) {
    for (const p of cat.produtos) {
      catPorIdProduto.set(p.id, cat)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {produtos.map(produto => (
        <ProductCard
          key={produto.id}
          produto={produto}
          categoria={catPorIdProduto.get(produto.id) ?? categorias[0]}
        />
      ))}
    </div>
  )
}
