# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Achadinhos

Site de produtos afiliados (Amazon/Shopee) organizado por nicho. O tráfego vem de perfis de redes sociais temáticos — o primeiro é o **Bichinz** (@bichinz_), perfil de pets. Quem clica no link do perfil cai direto na categoria de pets do site, não na home geral.

## Stack

- **Next.js 16.2.2** (App Router) — versão com breaking changes, ver AGENTS.md
- **React 19.2.4** — breaking changes em relação ao React 18
- **Tailwind CSS v4** — breaking changes em relação ao v3 (nova sintaxe, sem `tailwind.config.js`)
- TypeScript 5
- shadcn/ui (via pacote `shadcn` v4, com `radix-ui` como peer)
- JSON local como "banco de dados" de produtos (sem back-end na fase 1)

## Estrutura do Projeto

O projeto está no início — a estrutura abaixo é o alvo planejado, não o estado atual.

```
src/
├── app/
│   ├── page.tsx               # Home geral (futuramente; hoje é placeholder)
│   ├── [categoria]/
│   │   └── page.tsx           # Página de categoria (ex: /pets, /casa)
│   └── layout.tsx
├── components/
│   ├── ui/                    # Componentes shadcn (gerados via CLI)
│   ├── ProductCard.tsx
│   ├── CategoryGrid.tsx
│   └── Header.tsx
├── data/
│   └── produtos.json          # Fonte de verdade de todos os produtos
└── lib/
    └── produtos.ts            # Funções para ler/filtrar o JSON
```

## Como os Produtos Funcionam

Toda adição de produto/categoria é feita APENAS no arquivo `src/data/produtos.json`. O site lê esse arquivo automaticamente. Nenhum outro arquivo precisa ser tocado.

Estrutura do JSON:
```json
{
  "categorias": [
    {
      "nome": "Pets",
      "slug": "pets",
      "emoji": "🐾",
      "descricao": "Tudo para seu bichinho",
      "produtos": [
        {
          "id": "001",
          "nome": "Nome do Produto",
          "preco": "R$ 49,90",
          "imagem": "url_da_imagem",
          "link_afiliado": "url_amazon_ou_shopee",
          "loja": "amazon",
          "destaque": false
        }
      ]
    }
  ]
}
```

## Regras de Desenvolvimento

- Componentes sempre em TypeScript com tipagem explícita
- Estilização apenas com Tailwind + shadcn/ui — sem CSS customizado salvo exceções pontuais
- Commits no padrão Conventional Commits: `feat:`, `fix:`, `chore:`, `style:`
- Rodar `npm run build` antes de qualquer commit para garantir que não quebrou nada
- Nunca hardcodar produtos no JSX — sempre vir do JSON
- **Tailwind v4**: não existe `tailwind.config.js` — configuração vai em `globals.css` com `@theme`. Tokens customizados usam CSS custom properties dentro de `@theme {}`.
- **shadcn**: adicionar componentes via `npx shadcn add <componente>`, não copiar manualmente.

## Comandos

```bash
npm run dev      # Servidor local
npm run build    # Build de produção
npm run lint     # Lint (ESLint 9 com flat config)
npx shadcn add <componente>   # Adicionar componente shadcn
```

## Contexto do Negócio

- Fase 1: só a categoria Pets está ativa (vinda do perfil @bichinz_)
- O link na bio do Instagram/TikTok aponta para `/pets`, não para a home
- Futuramente outras categorias serão adicionadas conforme novos perfis sociais forem criados
- O sócio (John) adiciona produtos editando apenas o `produtos.json` — sem precisar mexer em código