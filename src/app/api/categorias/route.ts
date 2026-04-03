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

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json() as Omit<Categoria, 'produtos'>
  const data = readData()

  if (data.categorias.find(c => c.slug === body.slug)) {
    return NextResponse.json({ error: 'Slug já existe' }, { status: 409 })
  }

  data.categorias.push({ ...body, produtos: [] })
  writeData(data)

  return NextResponse.json({ ok: true }, { status: 201 })
}
