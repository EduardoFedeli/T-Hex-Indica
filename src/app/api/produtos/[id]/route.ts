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
  const body = await request.json() as Produto
  const data = readData()

  let found = false
  for (const cat of data.categorias) {
    const idx = cat.produtos.findIndex(p => p.id === id)
    if (idx !== -1) {
      cat.produtos[idx] = body
      found = true
      break
    }
  }

  if (!found) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

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
  for (const cat of data.categorias) {
    const idx = cat.produtos.findIndex(p => p.id === id)
    if (idx !== -1) {
      cat.produtos.splice(idx, 1)
      found = true
      break
    }
  }

  if (!found) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

  writeData(data)
  return NextResponse.json({ ok: true })
}
