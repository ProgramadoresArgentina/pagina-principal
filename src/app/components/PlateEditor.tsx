'use client'

import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TElement } from '@udecode/plate-common'

interface PlateEditorProps {
  value?: TElement[] | null | undefined | string
  onChange: (value: TElement[] | string) => void
  placeholder?: string
  onImageUpload?: (file: File) => Promise<string>
}

// Convertir contenido Plate/Slate a HTML
const plateToHtml = (content: TElement[]): string => {
  if (!content || !Array.isArray(content)) {
    return '<p></p>'
  }

  return content.map((element) => {
    if (typeof element === 'string') {
      return element
    }

    const { type, children, ...props } = element as any
    let html = ''

    if (children && Array.isArray(children)) {
      html = children.map((child: any) => {
        if (typeof child === 'string') {
          return child
        }
        if (child.text !== undefined) {
          let text = child.text || ''
          // Escapar HTML
          text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          if (child.bold) text = `<strong>${text}</strong>`
          if (child.italic) text = `<em>${text}</em>`
          if (child.underline) text = `<u>${text}</u>`
          if (child.strikethrough || child.strike) text = `<s>${text}</s>`
          if (child.code) text = `<code>${text}</code>`
          return text
        }
        if (child.type) {
          return plateToHtml([child])
        }
        return ''
      }).join('')
    }

    switch (type) {
      case 'h1':
        return `<h1>${html}</h1>`
      case 'h2':
        return `<h2>${html}</h2>`
      case 'h3':
        return `<h3>${html}</h3>`
      case 'h4':
        return `<h4>${html}</h4>`
      case 'h5':
        return `<h5>${html}</h5>`
      case 'h6':
        return `<h6>${html}</h6>`
      case 'blockquote':
        return `<blockquote>${html}</blockquote>`
      case 'code_block':
        return `<pre><code>${html}</code></pre>`
      case 'ul':
      case 'bulleted-list':
        return `<ul>${html}</ul>`
      case 'ol':
      case 'numbered-list':
        return `<ol>${html}</ol>`
      case 'li':
      case 'list-item':
        return `<li>${html}</li>`
      case 'img':
      case 'image':
        return `<img src="${props.url || props.src || ''}" alt="${props.alt || ''}" />`
      case 'a':
      case 'link':
        return `<a href="${props.url || props.href || '#'}">${html}</a>`
      case 'p':
      default:
        return `<p>${html || '<br>'}</p>`
    }
  }).join('')
}

// Convertir HTML a formato Plate/Slate
const htmlToPlate = (html: string): TElement[] => {
  if (!html || typeof html !== 'string' || html.trim() === '' || html === '<p></p>') {
    return [{ type: 'p', children: [{ text: '' }] }]
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  const processTextNode = (node: Node, formatting: any = {}): any => {
    const text = node.textContent || ''
    return { text, ...formatting }
  }

  const processInlineElement = (element: HTMLElement, formatting: any = {}): any[] => {
    const tagName = element.tagName.toLowerCase()
    const newFormatting = { ...formatting }

    if (tagName === 'strong' || tagName === 'b') newFormatting.bold = true
    if (tagName === 'em' || tagName === 'i') newFormatting.italic = true
    if (tagName === 'u') newFormatting.underline = true
    if (tagName === 's' || tagName === 'del' || tagName === 'strike') newFormatting.strikethrough = true
    if (tagName === 'code' && element.parentElement?.tagName.toLowerCase() !== 'pre') newFormatting.code = true

    const results: any[] = []
    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || ''
        if (text) {
          results.push({ text, ...newFormatting })
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        results.push(...processInlineElement(child as HTMLElement, newFormatting))
      }
    })

    return results.length > 0 ? results : [{ text: '', ...newFormatting }]
  }

  const convertElement = (element: HTMLElement): TElement | null => {
    const tagName = element.tagName.toLowerCase()

    // Procesar children
    const children: any[] = []
    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || ''
        if (text) {
          children.push({ text })
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childEl = child as HTMLElement
        const childTag = childEl.tagName.toLowerCase()

        // Elementos inline
        if (['strong', 'b', 'em', 'i', 'u', 's', 'del', 'strike', 'code', 'a', 'span'].includes(childTag)) {
          children.push(...processInlineElement(childEl))
        } else {
          // Elementos block anidados (como li dentro de ul)
          const converted = convertElement(childEl)
          if (converted) {
            children.push(converted)
          }
        }
      }
    })

    // Asegurar que siempre hay al menos un child
    if (children.length === 0) {
      children.push({ text: '' })
    }

    switch (tagName) {
      case 'h1': return { type: 'h1', children }
      case 'h2': return { type: 'h2', children }
      case 'h3': return { type: 'h3', children }
      case 'h4': return { type: 'h4', children }
      case 'h5': return { type: 'h5', children }
      case 'h6': return { type: 'h6', children }
      case 'blockquote': return { type: 'blockquote', children }
      case 'pre': return { type: 'code_block', children: [{ text: element.textContent || '' }] }
      case 'ul': return { type: 'ul', children }
      case 'ol': return { type: 'ol', children }
      case 'li': return { type: 'li', children }
      case 'img':
        return {
          type: 'img',
          url: element.getAttribute('src') || '',
          alt: element.getAttribute('alt') || '',
          children: [{ text: '' }]
        } as any
      case 'p':
      case 'div':
      default:
        return { type: 'p', children }
    }
  }

  const result: TElement[] = []
  Array.from(body.children).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const converted = convertElement(child as HTMLElement)
      if (converted) {
        result.push(converted)
      }
    }
  })

  return result.length > 0 ? result : [{ type: 'p', children: [{ text: '' }] }]
}

export default function PlateEditor({ value, onChange, placeholder = 'Escribe aquí...', onImageUpload }: PlateEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isInternalChange = useRef(false)
  const lastExternalValue = useRef<string>('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Convertir value inicial a HTML
  const initialHtml = useMemo(() => {
    if (!value) return '<p></p>'
    if (typeof value === 'string') return value
    if (Array.isArray(value)) return plateToHtml(value)
    return '<p></p>'
  }, []) // Solo calcular una vez al montar

  // Guardar el valor externo para comparaciones
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        lastExternalValue.current = value
      } else if (Array.isArray(value)) {
        lastExternalValue.current = plateToHtml(value)
      }
    }
  }, [value])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true
      const html = editor.getHTML()
      const plateContent = htmlToPlate(html)
      onChange(plateContent)
      // Reset flag después de un tick
      setTimeout(() => {
        isInternalChange.current = false
      }, 0)
    },
    editorProps: {
      attributes: {
        class: 'plate-editor-content',
        spellcheck: 'true',
      },
    },
  })

  // Solo sincronizar si el cambio viene de afuera y es diferente
  useEffect(() => {
    if (!editor || isInternalChange.current) return

    let newHtml = ''
    if (typeof value === 'string') {
      newHtml = value
    } else if (Array.isArray(value)) {
      newHtml = plateToHtml(value)
    }

    // Solo actualizar si realmente cambió desde afuera
    if (newHtml && newHtml !== lastExternalValue.current && newHtml !== editor.getHTML()) {
      lastExternalValue.current = newHtml
      editor.commands.setContent(newHtml)
    }
  }, [value, editor])

  // Insertar link
  const insertLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL del enlace:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  // Insertar imagen por URL
  const insertImageByUrl = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL de la imagen:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Subir imagen
  const handleImageUpload = useCallback(async () => {
    if (!onImageUpload || !editor) {
      insertImageByUrl()
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        try {
          const url = await onImageUpload(file)
          editor.chain().focus().setImage({ src: url }).run()
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Error al subir la imagen')
        }
      }
    }
  }, [editor, onImageUpload, insertImageByUrl])

  // Botón del toolbar
  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: '6px 10px',
        background: isActive ? '#D0FF71' : 'transparent',
        color: isActive ? '#0f0f10' : '#ffffff',
        border: '1px solid #3a3b3f',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: isActive ? 'bold' : 'normal',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '32px',
        height: '32px',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#3a3b3f'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {children}
    </button>
  )

  const Divider = () => (
    <div style={{ width: '1px', background: '#3a3b3f', margin: '0 4px', height: '24px' }} />
  )

  if (!isMounted) {
    return (
      <div style={{
        border: '2px solid #3a3b3f',
        borderRadius: '8px',
        background: '#1a1b1e',
        minHeight: '400px',
        padding: '16px',
        color: '#a0a0a0',
      }}>
        Cargando editor...
      </div>
    )
  }

  return (
    <div style={{
      border: '2px solid #3a3b3f',
      borderRadius: '8px',
      background: '#1a1b1e',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      {editor && (
        <div style={{
          borderBottom: '1px solid #3a3b3f',
          padding: '8px 12px',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          background: '#2d2e32',
          alignItems: 'center',
        }}>
          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Título 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Título 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Título 3"
          >
            H3
          </ToolbarButton>

          <Divider />

          {/* Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Negrita (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Cursiva (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
                    <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Tachado"
          >
            <s>S</s>
          </ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Lista con viñetas"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Lista numerada"
          >
            1.
          </ToolbarButton>

          <Divider />

          {/* Blocks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Cita"
          >
            &ldquo;
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Bloque de código"
          >
            {'</>'}
          </ToolbarButton>

          <Divider />

          {/* Link & Image */}
          <ToolbarButton
            onClick={insertLink}
            isActive={editor.isActive('link')}
            title="Insertar enlace"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton
            onClick={handleImageUpload}
            title="Insertar imagen"
          >
            🖼️
          </ToolbarButton>

          <Divider />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Deshacer (Ctrl+Z)"
          >
            ↩
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Rehacer (Ctrl+Y)"
          >
            ↪
          </ToolbarButton>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: '400px',
        }}
      />

      <style jsx global>{`
        .plate-editor-content {
          padding: 16px 20px;
          min-height: 400px;
          outline: none !important;
          color: #ffffff;
          font-size: 16px;
          line-height: 1.7;
        }

        .plate-editor-content > * {
          color: #ffffff;
        }

        .plate-editor-content p {
          margin: 0 0 1em 0;
          color: #ffffff;
        }

        .plate-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #666;
          pointer-events: none;
          height: 0;
        }

        .plate-editor-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #ffffff;
        }

        .plate-editor-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #ffffff;
        }

        .plate-editor-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #ffffff;
        }

        .plate-editor-content h4 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #ffffff;
        }

        .plate-editor-content strong {
          font-weight: bold;
          color: #ffffff;
        }

        .plate-editor-content em {
          font-style: italic;
          color: #ffffff;
        }

        .plate-editor-content u {
          text-decoration: underline;
          color: #ffffff;
        }

        .plate-editor-content s {
          text-decoration: line-through;
          color: #a0a0a0;
        }

        .plate-editor-content blockquote {
          border-left: 4px solid #D0FF71;
          padding-left: 16px;
          margin: 1em 0;
          color: #a0a0a0;
          font-style: italic;
        }

        .plate-editor-content code {
          background: #2d2e32;
          padding: 2px 6px;
          border-radius: 4px;
          color: #D0FF71;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9em;
        }

        .plate-editor-content pre {
          background: #2d2e32;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .plate-editor-content pre code {
          background: transparent;
          padding: 0;
          color: #D0FF71;
        }

        .plate-editor-content .editor-link,
        .plate-editor-content a {
          color: #D0FF71;
          text-decoration: underline;
          cursor: pointer;
        }

        .plate-editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
          display: block;
        }

        .plate-editor-content ul,
        .plate-editor-content ol {
          margin: 1em 0;
          padding-left: 1.5em;
          color: #ffffff;
        }

        .plate-editor-content li {
          margin: 0.25em 0;
          color: #ffffff;
        }

        .plate-editor-content li p {
          margin: 0;
        }

        .plate-editor-content hr {
          border: none;
          border-top: 1px solid #3a3b3f;
          margin: 2em 0;
        }

        /* Selection */
        .plate-editor-content ::selection {
          background: rgba(208, 255, 113, 0.3);
        }
      `}</style>
    </div>
  )
}
