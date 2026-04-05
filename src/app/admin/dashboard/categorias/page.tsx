import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categoriasBase = await getCategorias()
  
  // MUDANÇA CRÍTICA: Usando a SERVICE_ROLE_KEY para o banco não esconder os dados por segurança
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs, categoriaSlug')

  // RASTREADOR: Vai imprimir no terminal do seu VS Code o que o banco está enviando
  console.log("🦖 LOG T-HEX: Total de produtos puxados do banco:", produtos?.length)
  if (produtos && produtos.length > 0) {
    console.log("🦖 LOG T-HEX: Exemplo de categorias do 1º produto:", produtos[0].categoriaSlugs)
  }

  const categorias = categoriasBase.map(cat => {
    const contagem = produtos?.filter(p => {
      if (p.categoriaSlug === cat.slug) return true;
      if (p.categoriaSlugs) {
         let arr = [];
         if (Array.isArray(p.categoriaSlugs)) arr = p.categoriaSlugs;
         else if (typeof p.categoriaSlugs === 'string') {
            try { arr = JSON.parse(p.categoriaSlugs); } catch(e) {}
         }
         if (arr.includes(cat.slug)) return true;
      }
      return false;
    }).length || 0;

    return { ...cat, quantidade: contagem }
  })

  return (
    <div>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}