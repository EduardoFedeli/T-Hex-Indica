'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CategoryForm from './CategoryForm'
import type { Categoria } from '@/types'

interface CategoriesPanelProps {
  categorias: Categoria[]
}

export default function CategoriesPanel({ categorias }: CategoriesPanelProps) {
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  const router = useRouter()

  function handleSaved() {
    setEditando(null)
    setAdicionando(false)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setAdicionando(true)}>+ Nova categoria</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map(cat => (
          <div key={cat.slug} className="rounded-2xl bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: `${cat.cor}22`, border: `1px solid ${cat.cor}55` }}
              >
                {cat.emoji}
              </div>
              <div>
                <p className="font-bold text-gray-900">{cat.nome}</p>
                <p className="text-xs text-gray-500">/{cat.slug}</p>
              </div>
              <div
                className="ml-auto h-4 w-4 rounded-full"
                style={{ backgroundColor: cat.cor }}
                title={cat.cor}
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">{cat.produtos.length} produtos</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditando(cat)}>Editar</Button>
              <Link href={`/${cat.slug}`} target="_blank">
                <Button size="sm" variant="ghost">Ver site →</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Editar categoria</DialogTitle></DialogHeader>
          {editando && <CategoryForm categoria={editando} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nova categoria</DialogTitle></DialogHeader>
          <CategoryForm onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
