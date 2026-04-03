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

export async function GET() {
  return NextResponse.json(readData())
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Agora suporta tanto string única (legado) quanto array de strings (nova arquitetura)
  const body = await request.json() as { categoriaSlugs?: string[]; categoriaSlug?: string; produto: Produto }
  const data = readData()

  const slugsTarget = body.categoriaSlugs || (body.categoriaSlug ? [body.categoriaSlug] : [])
  if (slugsTarget.length === 0) {
    return NextResponse.json({ error: 'Nenhuma categoria informada' }, { status: 400 })
  }

  let inserido = false
  for (const cat of data.categorias) {
    if (slugsTarget.includes(cat.slug)) {
      // Evita duplicidade no mesmo array
      if (!cat.produtos.some(p => p.id === body.produto.id)) {
        cat.produtos.push(body.produto)
        inserido = true
      }
    }
  }

  if (!inserido) {
    return NextResponse.json({ error: 'Categorias não encontradas' }, { status: 404 })
  }

  writeData(data)
  return NextResponse.json({ ok: true }, { status: 201 })
}