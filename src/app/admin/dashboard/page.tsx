import { createClient } from "@supabase/supabase-js";
import { getCategorias } from "@/lib/produtos";
import { Package, Tags, TrendingDown, Star, Activity, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const categorias = await getCategorias();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // 1. Buscamos produtos e categorias para os cards básicos
  const { data: produtos } = await supabase
    .from("produtos")
    .select("id, nome, precoOriginal, preco, destaque, createdAt")
    .order("createdAt", { ascending: false });

  // 2. Buscamos todos os cliques (o Supabase cuidará da lixeira de 30 dias)
  const { data: clicksData } = await supabase
    .from("clicks_produtos")
    .select("categoria_slug");

  const totalProdutos = produtos?.length || 0;
  const emOferta = produtos?.filter((p) => p.precoOriginal && p.precoOriginal > p.preco).length || 0;
  const destaques = produtos?.filter((p) => p.destaque).length || 0;
  const ultimosProdutos = produtos?.slice(0, 5) || [];

  // 3. Lógica de Agregação: Top 5 Categorias
  const totalClicks = clicksData?.length || 0;
  const clicksPorCategoria = (clicksData || []).reduce((acc: Record<string, number>, curr) => {
    acc[curr.categoria_slug] = (acc[curr.categoria_slug] || 0) + 1;
    return acc;
  }, {});

  const topCategorias = Object.entries(clicksPorCategoria)
    .map(([slug, count]) => {
      const catInfo = categorias.find(c => c.slug === slug);
      return {
        nome: catInfo?.nome || slug,
        emoji: catInfo?.emoji || '📦',
        cor: catInfo?.cor || '#F97316',
        count: count as number,
        percent: totalClicks > 0 ? ((count as number) / totalClicks) * 100 : 0
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Administração T-Hex</h1>
          <p className="text-[#8E8E9F] mt-1">Dados reais de performance dos últimos 30 dias.</p>
        </div>
      </div>

      {/* Nível 1 - KPIs Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[#8E8E9F] text-sm font-medium">Produtos</p>
            <Package className="w-5 h-5 text-[#F97316]" />
          </div>
          <h3 className="text-4xl font-black text-white mt-4">{totalProdutos}</h3>
        </div>

        <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[#8E8E9F] text-sm font-medium">Categorias</p>
            <Tags className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h3 className="text-4xl font-black text-white mt-4">{categorias.length}</h3>
        </div>

        <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[#8E8E9F] text-sm font-medium">Em Oferta</p>
            <TrendingDown className="w-5 h-5 text-[#22C55E]" />
          </div>
          <h3 className="text-4xl font-black text-white mt-4">{emOferta}</h3>
        </div>

        <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[#8E8E9F] text-sm font-medium">Cliques Totais</p>
            <Activity className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h3 className="text-4xl font-black text-white mt-4">{totalClicks}</h3>
        </div>
      </div>

      {/* Nível 2 - Bento Grid Analítico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Painel: Últimos Produtos */}
        <div className="md:col-span-2 bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white">Últimos Cadastros</h2>
            </div>
            <Link href="/admin/produtos" className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#8E8E9F]">
              <thead className="border-b border-[#2A2A35] text-xs uppercase text-[#8E8E9F]">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A35]">
                {ultimosProdutos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-[#1E1E2E] transition-colors">
                    <td className="px-4 py-4 font-medium text-white max-w-[200px] truncate">{produto.nome}</td>
                    <td className="px-4 py-4">
                       <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${produto.destaque ? 'bg-[#EAB308]/10 text-[#EAB308]' : 'bg-[#2A2A35] text-[#8E8E9F]'}`}>
                         {produto.destaque ? 'Destaque' : 'Padrão'}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-[#22C55E] font-bold text-right">
                      {produto.preco ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel: TOP CATEGORIAS (Performance Real) */}
        <div className="bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[#EAB308]" />
            <h2 className="text-xl font-bold text-white">Top Categorias</h2>
          </div>

          <div className="space-y-6 flex-1">
            {topCategorias.length > 0 ? (
              topCategorias.map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>{cat.emoji}</span>
                      <span className="truncate max-w-[120px]">{cat.nome}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#8E8E9F]">{cat.count} cliques</span>
                  </div>
                  {/* Barra de Progresso Visual */}
                  <div className="h-1.5 w-full bg-[#2A2A35] rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${cat.percent}%`,
                        backgroundColor: cat.cor 
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Activity className="w-8 h-8 mb-2" />
                <p className="text-xs">Aguardando primeiros cliques para gerar o ranking.</p>
              </div>
            )}
          </div>

          {totalClicks > 0 && (
            <div className="mt-6 pt-6 border-t border-[#2A2A35]">
              <p className="text-[10px] text-[#8E8E9F] uppercase font-black tracking-widest text-center">
                Dados baseados em {totalClicks} interações
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}