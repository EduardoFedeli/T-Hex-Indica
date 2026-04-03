import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'

export default function CategoriasPage() {
  const categorias = getCategorias()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Categorias ({categorias.length})</h1>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}
