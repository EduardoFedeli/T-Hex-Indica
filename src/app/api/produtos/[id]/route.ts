import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { ProdutosData, Produto } from '@/types'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'produtos.json')

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as ProdutosData
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const payload = await request.json()
  
  // Extrai o produto e o array de categorias alvo da requisição
  const body = (payload.produto || payload) as Produto
  const novasCategorias = payload.categoriaSlugs as string[] | undefined

  const data = readData()
  let modified = false

  if (novasCategorias && novasCategorias.length > 0) {
    // 1. Remove o produto de TODAS as categorias atuais
    data.categorias.forEach(cat => {
      cat.produtos = cat.produtos.filter(p => p.id !== id)
    })
    // 2. Insere a versão atualizada apenas nas categorias selecionadas
    data.categorias.forEach(cat => {
      if (novasCategorias.includes(cat.slug)) {
        cat.produtos.push(body)
        modified = true
      }
    })
  } else {
    // Modo Legado: Apenas atualiza in-place nas categorias em que já existe
    for (const cat of data.categorias) {
      const idx = cat.produtos.findIndex(p => p.id === id)
      if (idx !== -1) {
        cat.produtos[idx] = body
        modified = true
      }
    }
  }

  if (!modified) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })

  writeData(data)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = readData()
  let found = false

  // Varre TODAS as categorias e deleta o ID se existir
  for (const cat of data.categorias) {
    const idx = cat.produtos.findIndex(p => p.id === id)
    if (idx !== -1) {
      cat.produtos.splice(idx, 1)
      found = true
    }
  }

  if (!found) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })

  writeData(data)
  return NextResponse.json({ ok: true })
}