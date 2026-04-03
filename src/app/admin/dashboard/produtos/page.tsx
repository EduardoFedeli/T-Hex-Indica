import { getCategorias } from '@/lib/produtos'
import ProductsTable from '@/components/admin/ProductsTable'

export default function ProdutosPage() {
  const categorias = getCategorias()

  const produtos = categorias.flatMap(cat =>
    cat.produtos.map(p => ({
      ...p,
      categoriaSlug: cat.slug,
      categoriaNome: cat.nome,
    }))
  )

  return (
    <div>
      <ProductsTable produtos={produtos} categorias={categorias} />
    </div>
  )
}
