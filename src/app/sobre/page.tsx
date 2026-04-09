import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Sobre — T-Hex Indica',
  description: 'Saiba mais sobre o T-Hex Indica, como funciona nossa curadoria e nossas políticas.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-page-bg pb-24">
      <Header />

      {/* Hero */}
      <section className="px-5 py-12 text-center flex flex-col items-center justify-center">
        <span className="text-6xl mb-4 select-none">🦖</span>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Sobre o T-Hex Indica
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Curadoria honesta e inteligente de produtos que valem cada centavo do seu bolso.
        </p>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-5 pb-10">
        <div className="rounded-3xl bg-card-bg border border-card-border p-6 md:p-8 space-y-10 shadow-lg">
          
          {/* Seção 1: O que é */}
          <div>
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <span className="text-[#22C55E]">✦</span> O que é o T-Hex Indica?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O T-Hex Indica é o seu radar de ofertas definitivo. Garimpamos diariamente os melhores 
              produtos da Amazon, Shopee e outros grandes marketplaces,tendo sempre foco em qualidade real, 
              custo-benefício e avaliações sinceras de quem já comprou. Nosso objetivo é poupar o seu tempo 
              e evitar que você caia em ciladas na internet.
            </p>
          </div>

          {/* Seção 2: Como funciona (Transparência) */}
          <div>
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <span className="text-[#22C55E]">✦</span> Como o site se mantém?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transparência é a nossa regra número um. Cada produto listado aqui possui um link de afiliado. 
              Isso significa que, quando você clica e finaliza uma compra, nós recebemos uma pequena comissão 
              da loja parceira — <strong>sem adicionar absolutamente nenhum custo extra para você</strong>. 
              É esse modelo que nos permite manter o site 100% gratuito, atualizado e sem anúncios invasivos pulando na sua tela.
            </p>
          </div>

          {/* Seção 3: Explorar e Filtros (Funcionalidades) */}
          <div>
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <span className="text-[#22C55E]">✦</span> A página Explorar & Filtros
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Para facilitar ainda mais a sua busca, criamos a aba <strong>Explorar</strong>. Lá é o nosso painel 
              central onde você pode ver tudo o que o T-Hex encontrou, de todas as categorias, em um só lugar.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use nossos <strong>Filtros Inteligentes</strong> na barra lateral para refinar sua busca! Você pode 
              ajustar a faixa de preço que cabe no seu bolso, escolher suas lojas favoritas (como Amazon ou Mercado Livre) 
              e filtrar por características e tags específicas (como "Feminino", "Gamer" ou "Custo-benefício").
            </p>
          </div>

          {/* Seção 4: A Regra dos 90 Dias (Gatilho de Autoridade) */}
          <div className="bg-[#1A1A24]/50 p-5 rounded-2xl border border-[#2A2A35]">
            <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              Auditoria de Catálogo (A Regra dos 90 Dias)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Não há nada mais frustrante do que clicar em uma oferta incrível e descobrir que o produto acabou ou o preço subiu, certo? 
              Por isso, temos uma política rigorosa de limpeza: <strong>produtos inativos ou esgotados são removidos após 90 dias</strong>. 
              Apenas produtos que continuam em estoque, com preço justo e com alta procura pela comunidade sobrevivem a essa auditoria. 
              Assim, você sempre encontra links que realmente funcionam.
            </p>
          </div>

          {/* Seção 5: Parcerias */}
          <div>
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <span className="text-[#22C55E]">✦</span> Nossas Parcerias
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Nós colaboramos com diversas páginas e criadores de conteúdo que compartilham da nossa visão de trazer as melhores dicas para você. Conheça algumas delas:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: '@bichinz_ — Universo Pet', href: 'https://instagram.com/bichinz_' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#2A2A35] bg-[#0F0F13] px-4 py-2.5 text-xs font-bold text-white transition-all hover:border-[#22C55E] hover:text-[#22C55E] shadow-sm flex items-center gap-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Seção 6: Próximas Atualizações (Roadmap) */}
          <div>
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <span className="text-[#22C55E]">✦</span> Nosso Roadmap
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              O T-Hex Indica está em evolução constante. Nosso compromisso é entregar as melhores ofertas com a melhor experiência. Veja o que está no nosso radar para chegar em breve:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: WhatsApp */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-2xl p-5 relative overflow-hidden group hover:border-[#25D366]/50 transition-colors">
                <div className="absolute top-3 right-3 bg-[#25D366]/10 text-[#25D366] text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-widest">
                  Em Breve
                </div>
                <div className="w-10 h-10 bg-[#1A1A24] rounded-lg mb-3 flex items-center justify-center text-lg group-hover:bg-[#25D366]/20 transition-colors">
                  💬
                </div>
                <h3 className="text-white font-bold text-sm mb-1.5">Grupo no WhatsApp</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Lançaremos grupos segmentados para você receber promoções relâmpago diretamente no seu app principal, complementando nosso Telegram.
                </p>
              </div>

              {/* Card 2: Camisas de Time */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-2xl p-5 relative overflow-hidden group hover:border-[#F97316]/50 transition-colors">
                <div className="absolute top-3 right-3 bg-[#F97316]/10 text-[#F97316] text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-widest">
                  Pesquisa
                </div>
                <div className="w-10 h-10 bg-[#1A1A24] rounded-lg mb-3 flex items-center justify-center text-lg group-hover:bg-[#F97316]/20 transition-colors">
                  ⚽
                </div>
                <h3 className="text-white font-bold text-sm mb-1.5">Camisas de Time</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Uma nova categoria dedicada a vestuário esportivo. Mapeando os melhores fornecedores para trazer camisas com qualidade e preço justo.
                </p>
              </div>

              {/* Card 3: Decoração (Ocupando largura total em telas pequenas se for ímpar, ou mantendo o grid natural) */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-2xl p-5 relative overflow-hidden group hover:border-[#7C3AED]/50 transition-colors sm:col-span-2 md:col-span-1">
                <div className="absolute top-3 right-3 bg-[#7C3AED]/10 text-[#7C3AED] text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-widest">
                  Curadoria
                </div>
                <div className="w-10 h-10 bg-[#1A1A24] rounded-lg mb-3 flex items-center justify-center text-lg group-hover:bg-[#7C3AED]/20 transition-colors">
                  🛋️
                </div>
                <h3 className="text-white font-bold text-sm mb-1.5">Casa & Decoração</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Expandiremos nossa curadoria para incluir itens de decoração, setups gamers e utilidades para o lar com rigoroso filtro de reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 7: Contato */}
          <div className="pt-6 border-t border-card-border">
            <h2 className="text-lg font-black text-white mb-2">Ficou com alguma dúvida?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seja para tirar dúvidas, reportar um link quebrado, sugerir um produto ou conversar sobre parcerias comerciais, sinta-se à vontade para nos chamar!
            </p>
            <a 
              href="mailto:ejstudios.conta@gmail.com" 
              className="inline-block mt-4 text-sm font-bold text-[#22C55E] hover:underline"
            >
              ✉️ ejstudios.conta@gmail.com
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}