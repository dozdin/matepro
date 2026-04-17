'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'general', name: 'General', color: 'bg-slate-500' },
  { id: 'tecnic', name: 'Tècnic', color: 'bg-blue-500' },
  { id: 'seguretat', name: 'Seguretat', color: 'bg-red-500' },
  { id: 'suggeriments', name: 'Suggeriments', color: 'bg-emerald-500' },
  { id: 'ajuda', name: 'Ajuda', color: 'bg-amber-500' },
]

export default function NewForumThreadPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Redirect to forum
    router.push('/forum')
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ''
    let cursorOffset = 0

    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'text en negreta'}**`
        cursorOffset = selectedText ? 0 : 2
        break
      case 'italic':
        newText = `*${selectedText || 'text en cursiva'}*`
        cursorOffset = selectedText ? 0 : 1
        break
      case 'list':
        newText = `\n- ${selectedText || 'Element de llista'}`
        cursorOffset = 3
        break
      case 'link':
        newText = `[${selectedText || 'text'}](url)`
        cursorOffset = selectedText ? selectedText.length + 3 : 1
        break
      case 'code':
        newText = `\`${selectedText || 'codi'}\``
        cursorOffset = selectedText ? 0 : 1
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + (selectedText ? newText.length : cursorOffset)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/forum"
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nou Tema</h1>
          <p className="text-muted-foreground">Crea un nou fil de discussió</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Categoria <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  categoryId === category.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', category.color)} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Títol <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escriu un títol descriptiu..."
            required
            className="h-12 w-full rounded-lg border border-input bg-muted/50 px-4 text-lg placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Contingut <span className="text-destructive">*</span>
          </label>
          
          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 border border-border border-b-0 rounded-t-lg bg-muted/30 p-2">
            <button
              type="button"
              onClick={() => insertFormatting('bold')}
              className="rounded p-2 hover:bg-muted transition-colors"
              title="Negreta"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('italic')}
              className="rounded p-2 hover:bg-muted transition-colors"
              title="Cursiva"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('list')}
              className="rounded p-2 hover:bg-muted transition-colors"
              title="Llista"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('link')}
              className="rounded p-2 hover:bg-muted transition-colors"
              title="Enllaç"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('code')}
              className="rounded p-2 hover:bg-muted transition-colors"
              title="Codi"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escriu el contingut del teu tema... (Suporta Markdown)"
            required
            rows={12}
            className="w-full rounded-b-lg border border-input bg-muted/50 px-4 py-3 placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Suporta Markdown: **negreta**, *cursiva*, `codi`, [enllaç](url)
          </p>
        </div>

        {/* Preview */}
        {content && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Previsualització</h3>
            <div className="prose prose-sm prose-invert max-w-none">
              <h2 className="text-xl font-bold mb-2">{title || 'Títol del tema'}</h2>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {content}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/forum"
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel·lar
          </Link>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || !categoryId || isSubmitting}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Publicant...' : 'Publicar Tema'}
          </button>
        </div>
      </form>
    </div>
  )
}
