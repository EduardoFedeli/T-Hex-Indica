# Achadinhos — Design da Homepage

**Data:** 2026-04-02  
**Status:** Aprovado

---

## Contexto

Site de produtos afiliados (Amazon/Shopee) organizado por nicho. O tráfego vem de perfis de redes sociais temáticos. A homepage é a vitrine geral — o link da bio aponta para `/pets`, mas a home (`/`) agrega todos os nichos.

O John (sócio) adiciona produtos editando apenas `src/data/produtos.json`, sem mexer em código.

---

## Identidade Visual

**Paleta principal:**
- Laranja: `#FF6B35` — cor primária, botões, preços, destaques
- Amarelo: `#FFD23F` — cor secundária, badge "NOVO", gradiente do hero
- Fundo: `#F5F5F5` — página; `#FFFFFF` — cards

**Personalidade:** Vibrante & Energético. Energia alta, emojis, badges chamativos. Funciona bem com audiência jovem de TikTok/Instagram.

**Cor por categoria** (fundo do ícone e da thumb do produto):
| Categoria | Emoji | Cor de fundo |
|-----------|-------|-------------|
| Pets      | 🐾    | `#FFF3ED`   |
| Games     | 🎮    | `#EDF2FF`   |
| Esporte   | 👟    | `#EBFBEE`   |
| Livros    | 📚    | `#FFF9DB`   |
| Roupas    | 👗    | `#FCE4EC`   |
| Casa      | 🏠    | `#F3E8FF`   |

---

## Estrutura da Homepage (`/`)

### 1. Header (sticky)
- Logo: `<span style="color:#FF6B35">acha</span><span style="color:#FFD23F">dinhos</span>` — "acha" em laranja, "dinhos" em amarelo
- Ícones: 🔍 busca e 🔔 notificação (por ora sem funcionalidade, visual apenas)
- Fundo branco, sombra sutil, `position: sticky top-0`

### 2. Hero Banner
- Gradiente `#FF6B35 → #FFD23F` (diagonal 135°)
- Eyebrow: `✨ Curadoria semanal` (uppercase, pequeno)
- Título: `Os melhores achados pra você` (bold 900, ~26px)
- Subtítulo: `Produtos selecionados da Amazon e Shopee`
- Botão CTA branco com texto laranja: `Ver tudo →`
- Dois círculos decorativos brancos semi-transparentes no fundo

### 3. Categorias
- Título de seção `CATEGORIAS` + link `Ver todas →`
- Layout: `flex-wrap: wrap; justify-content: center` — se organiza em grade centralizada
- Cada pill: ícone quadrado (56×56px, border-radius 16px) + label embaixo
- Categoria ativa (contexto da página atual) fica em laranja
- Categorias: Pets, Games, Esporte, Livros, Roupas, Casa

### 4. Produtos em Destaque
- Título de seção `🔥 Em destaque` + link `Ver mais →`
- **Grid de 2 colunas** (`grid-template-columns: 1fr 1fr`, gap 12px)
- Padding lateral 20px

**Card de produto (grid 2 col):**
- Foto/thumb quadrada (aspect-ratio 1:1), fundo colorido da categoria, emoji centralizado
- Badge sobre a foto (canto superior esquerdo): `🔥 DESTAQUE` (laranja) ou `NOVO` (amarelo)
- Abaixo: loja (`🛒 Amazon` / `🏪 Shopee`), nome do produto, preço em laranja
- Botão `Ver oferta →` laranja full-width na base do card
- Todo o card é um `<a>` apontando para `link_afiliado`

### 5. Bottom Navigation (mobile)
- Fixo no rodapé, 4 itens: 🏠 Início · 🔍 Buscar · 🔥 Ofertas · 📂 Categorias
- Item ativo em laranja

---

## Página de Categoria (`/[categoria]`)

Mesma estrutura, mas:
- Hero menor ou ausente — pode ter um banner da categoria com cor própria
- Categoria selecionada fica ativa no carrossel de categorias
- Grid de produtos filtrados pela categoria
- Título: `🐾 Pets — X achados`

---

## Dados (`src/data/produtos.json`)

```json
{
  "categorias": [
    {
      "nome": "Pets",
      "slug": "pets",
      "emoji": "🐾",
      "cor": "#FFF3ED",
      "descricao": "Tudo para seu bichinho",
      "produtos": [
        {
          "id": "001",
          "nome": "Nome do Produto",
          "preco": "R$ 49,90",
          "imagem": "url_ou_null",
          "link_afiliado": "url_amazon_ou_shopee",
          "loja": "amazon",
          "destaque": true
        }
      ]
    }
  ]
}
```

Campo `cor` adicionado à categoria para que o site use dinamicamente no ícone e na thumb. Se `imagem` for `null` ou vazio, renderiza o emoji da categoria no lugar.

---

## Componentes a Criar

| Componente | Responsabilidade |
|---|---|
| `Header` | Logo + ícones, sticky |
| `HeroBanner` | Gradiente laranja, título, CTA |
| `CategoryGrid` | Flex-wrap centralizado de pills |
| `ProductGrid` | Grid 2 colunas de ProductCard |
| `ProductCard` | Thumb + badge + info + botão |
| `BottomNav` | Navegação fixa mobile |
| `SectionHeader` | Título de seção + link "Ver mais" |

---

## Categorias e Produtos Genéricos (fase 1)

Para fase inicial, popular o JSON com ~4 produtos por categoria:

- **Pets** 🐾: coleira, comedouro, arranhador, ração
- **Games** 🎮: controle, headset, mousepad, cadeira gamer
- **Esporte** 👟: tênis, garrafa, corda de pular, mochila
- **Livros** 📚: box Harry Potter, atomic habits, livro de receitas, mangá
- **Roupas** 👗: blusa oversized, calça jogger, moletom, vestido
- **Casa** 🏠: luminária LED, suporte celular, organizador, diffusor

---

## Fora de Escopo (fase 1)

- Busca funcional
- Notificações
- Filtros avançados
- Página de detalhes do produto (clique vai direto para o afiliado)
- Autenticação
