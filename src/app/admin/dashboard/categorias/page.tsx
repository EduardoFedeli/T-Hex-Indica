import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'

export default function CategoriasPage() {
  const categorias = getCategorias()
  return (
    <div>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}
