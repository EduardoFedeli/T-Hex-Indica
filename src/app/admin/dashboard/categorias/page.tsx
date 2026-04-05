import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categoriasBase = await getCategorias()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Puxando todos os dados para garantir que não vamos perder a coluna certa
  const { data: produtos } = await supabase.from('produtos').select('*')

  const categorias = categoriasBase.map(cat => {
    const contagem = produtos?.filter(p => {
      // 1. Checa se está salvo no formato antigo (string simples)
      if (p.categoriaSlug === cat.slug) return true;
      
      // 2. Checa se está no formato novo (Array)
      if (Array.isArray(p.categoriaSlugs) && p.categoriaSlugs.includes(cat.slug)) return true;
      
      // 3. Fallback: Se o banco de dados retornou o array como texto puro (ex: '["tech", "games"]')
      if (typeof p.categoriaSlugs === 'string' && p.categoriaSlugs.includes(cat.slug)) return true;

      return false;
    }).length || 0;

    return {
      ...cat,
      quantidade: contagem
    }
  })

  return (
    <div>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}