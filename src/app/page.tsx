import { getCategorias, getProdutosDestaque } from '../lib/produtos'
import Header from '../components/Header'
import HeroBanner from '../components/HeroBanner'
import SectionHeader from '../components/SectionHeader'
import CategoryGrid from '../components/CategoryGrid'
import ProductGrid from '../components/ProductGrid'
import BottomNav from '../components/BottomNav'

export default function HomePage() {
  const categorias = getCategorias()
  const destaques = getProdutosDestaque()

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />
      <HeroBanner />

      <SectionHeader title="Categorias" href="/" linkLabel="Ver todas →" />
      <CategoryGrid categorias={categorias} />

      <SectionHeader id="destaques" title="🔥 Em destaque" href="/" linkLabel="Ver mais →" />
      <ProductGrid produtos={destaques} categorias={categorias} />

      <BottomNav />
    </div>
  )
}
