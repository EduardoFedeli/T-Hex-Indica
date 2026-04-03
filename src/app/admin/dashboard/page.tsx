import { getCategorias, getProdutosOferta } from '@/lib/produtos'

export default function DashboardPage() {
  const categorias = getCategorias()
  
  // Desduplicar produtos para a contagem geral do dashboard ser precisa
  const todosProdutos = categorias.flatMap(c => c.produtos)
  const produtosUnicos = new Set(todosProdutos.map(p => p.id)).size
  
  const emOferta = getProdutosOferta().length

  const stats = [
    { label: 'Categorias', value: categorias.length, emoji: '📂' },
    { label: 'Produtos Únicos', value: produtosUnicos, emoji: '📦' },
    { label: 'Em oferta', value: emOferta, emoji: '💰' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-5 shadow-sm transition-colors hover:border-border/80">
            <p className="text-3xl">{s.emoji}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{s.value}</p>
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}