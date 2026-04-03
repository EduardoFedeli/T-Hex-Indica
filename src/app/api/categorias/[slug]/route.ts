import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { ProdutosData, Categoria } from '@/types'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'produtos.json')

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as ProdutosData
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { slug } = await params
  const body = await request.json() as Partial<Omit<Categoria, 'produtos'>>
  const data = readData()

  const idx = data.categorias.findIndex(c => c.slug === slug)
  if (idx === -1) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
  }

  data.categorias[idx] = { ...data.categorias[idx], ...body }
  writeData(data)

  return NextResponse.json({ ok: true })
}
