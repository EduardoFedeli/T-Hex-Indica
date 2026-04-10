import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  // 1. Busca as categorias básicas
  const categoriasBase = await getCategorias()
  
  // 2. Conecta no Supabase usando a SERVICE_ROLE_KEY
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. CORREÇÃO: Busca as DUAS colunas (plural e singular) para garantir compatibilidade com produtos antigos
  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs, categoriaSlug')

  // 4. Faz a matemática da contagem blindada
  const categoriasComContagem = categoriasBase.map(cat => {
    const contagem = produtos?.filter(p => {
      let slugsArray: string[] = [];
      
      // Checa o formato novo (Array)
      if (Array.isArray(p.categoriaSlugs)) {
        slugsArray = p.categoriaSlugs;
      } else if (typeof p.categoriaSlugs === 'string') {
        try { slugsArray = JSON.parse(p.categoriaSlugs); } catch (e) {}
      }

      // Valida se está no array novo OU se está na coluna antiga (fallback)
      const noArrayNovo = slugsArray.includes(cat.slug);
      const naColunaAntiga = p.categoriaSlug === cat.slug;

      return noArrayNovo || naColunaAntiga;
    }).length || 0;

    return {
      ...cat,
      quantidade: contagem
    }
  })

  // 5. Manda para o componente visual
  return (
    <div>
      <CategoriesPanel categorias={categoriasComContagem} />
    </div>
  )
}