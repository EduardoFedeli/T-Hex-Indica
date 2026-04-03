import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { ProdutosData } from '@/types'
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

  const body = await request.json() as { ids: string[]; action: 'delete' | 'renew' }
  const { ids, action } = body

  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: 'Nenhum ID fornecido' }, { status: 400 })
  }

  const data = readData()
  let modificados = 0

  if (action === 'delete') {
    data.categorias.forEach(cat => {
      const originalLength = cat.produtos.length
      cat.produtos = cat.produtos.filter(p => !ids.includes(p.id))
      modificados += (originalLength - cat.produtos.length)
    })
  } else if (action === 'renew') {
    const novaData = new Date().toISOString()
    data.categorias.forEach(cat => {
      cat.produtos.forEach(p => {
        if (ids.includes(p.id)) {
          p.createdAt = novaData
          modificados++
        }
      })
    })
  }

  if (modificados > 0) {
    writeData(data)
  }

  return NextResponse.json({ ok: true, modificados })
}