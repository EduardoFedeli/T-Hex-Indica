'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Categoria } from '@/types'

interface CategoryFormProps {
  categoria?: Categoria
  onSave: () => void
  onCancel: () => void
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function CategoryForm({ categoria, onSave, onCancel }: CategoryFormProps) {
  const isEdit = !!categoria
  const [nome, setNome] = useState(categoria?.nome ?? '')
  const [slug, setSlug] = useState(categoria?.slug ?? '')
  const [emoji, setEmoji] = useState(categoria?.emoji ?? '')
  const [cor, setCor] = useState(categoria?.cor ?? '#F97316')
  const [descricao, setDescricao] = useState(categoria?.descricao ?? '')
  const [loading, setLoading] = useState(false)

  function handleNomeChange(v: string) {
    setNome(v)
    if (!isEdit) setSlug(toSlug(v))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const body = { nome, slug, emoji, cor, descricao }
    const url = isEdit ? `/api/categorias/${categoria!.slug}` : '/api/categorias'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSave()
    } else {
      const err = await res.json() as { error?: string }
      alert(err.error ?? 'Erro ao salvar.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label>Nome</Label>
        <Input value={nome} onChange={e => handleNomeChange(e.target.value)} required />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
          readOnly={isEdit}
          className={isEdit ? 'bg-gray-50' : ''}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Emoji</Label>
          <Input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🐾" required />
        </div>
        <div>
          <Label>Cor accent</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cor}
              onChange={e => setCor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border"
            />
            <Input value={cor} onChange={e => setCor(e.target.value)} placeholder="#F97316" />
          </div>
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Input value={descricao} onChange={e => setDescricao(e.target.value)} required />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
