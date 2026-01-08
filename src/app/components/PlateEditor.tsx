'use client'

import React, { useMemo, useCallback, useState, useEffect } from 'react'
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
    return ''
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
        if (child.text) {
          let text = child.text
          if (child.bold) text = `<strong>${text}</strong>`
          if (child.italic) text = `<em>${text}</em>`
          if (child.underline) text = `<u>${text}</u>`
          if (child.strikethrough) text = `<del>${text}</del>`
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
        return `<ul>${html}</ul>`
      case 'ol':
        return `<ol>${html}</ol>`
      case 'li':
        return `<li>${html}</li>`
      case 'img':
        return `<img src="${props.url || props.src || ''}" alt="${props.alt || ''}" />`
      case 'a':
        return `<a href="${props.url || props.href || '#'}">${html}</a>`
      case 'p':
      default:
        return `<p>${html}</p>`
    }
  }).join('')
}

// Convertir HTML a formato Plate/Slate simple
const htmlToPlate = (html: string): TElement[] => {
  if (!html || typeof html !== 'string' || html.trim() === '') {
    return [
      {
        type: 'p',
        children: [{ text: '' }],
      },
    ]
  }

  // Crear un parser temporal
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  const convertNode = (node: Node): TElement | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Los nodos de texto no son TElement, se manejan dentro de los elementos padre
      return null
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const element = node as HTMLElement
    const tagName = element.tagName.toLowerCase()
    const children: any[] = []

    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || ''
        if (text.trim()) {
          children.push({ text })
        }
      } else {
        const converted = convertNode(child)
        if (converted) {
          if ('text' in converted) {
            // Es un nodo de texto, aplicar formato
            const textNode = converted as any
            const parent = element
            if (parent.tagName === 'STRONG' || parent.tagName === 'B') {
              textNode.bold = true
            }
            if (parent.tagName === 'EM' || parent.tagName === 'I') {
              textNode.italic = true
            }
            if (parent.tagName === 'U') {
              textNode.underline = true
            }
            if (parent.tagName === 'DEL' || parent.tagName === 'S') {
              textNode.strikethrough = true
            }
            if (parent.tagName === 'CODE') {
              textNode.code = true
            }
            children.push(textNode)
          } else {
            children.push(converted)
          }
        }
      }
    })

    // Si no hay children, agregar uno vacío
    if (children.length === 0) {
      children.push({ text: '' })
    }

    const props: any = {}

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return { type: tagName, children }
      case 'blockquote':
        return { type: 'blockquote', children }
      case 'pre':
        return { type: 'code_block', children }
      case 'ul':
        return { type: 'ul', children }
      case 'ol':
        return { type: 'ol', children }
      case 'li':
        return { type: 'li', children }
      case 'img':
        props.url = element.getAttribute('src') || ''
        props.alt = element.getAttribute('alt') || ''
        return { type: 'img', ...props, children: [{ text: '' }] }
      case 'a':
        props.url = element.getAttribute('href') || '#'
        return { type: 'a', ...props, children }
      case 'p':
      default:
        return { type: 'p', children }
    }
  }

  const result: TElement[] = []
  Array.from(body.childNodes).forEach((node) => {
    const converted = convertNode(node)
    if (converted && !('text' in converted)) {
      result.push(converted as TElement)
    }
  })

  return result.length > 0 ? result : [
    {
      type: 'p',
      children: [{ text: '' }],
    },
  ]
}

export default function PlateEditor({ value, onChange, placeholder, onImageUpload }: PlateEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Asegurar que solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Convertir value a HTML si es un array de TElement
  const htmlValue = useMemo(() => {
    if (!value) {
      return ''
    }
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      return plateToHtml(value)
    }
    return ''
  }, [value])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: htmlValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const plateContent = htmlToPlate(html)
      onChange(plateContent)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  })

  // Manejar carga de imágenes
  const handleImageUpload = useCallback(async () => {
    if (!onImageUpload || !editor) return

    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
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
  }, [editor, onImageUpload])

  // Toolbar
  const Toolbar = () => {
    if (!editor) return null

    return (
      <div style={{
        borderBottom: '1px solid #3a3b3f',
        padding: '8px 12px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        background: '#2d2e32',
      }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('heading', { level: 1 }) ? '#D0FF71' : 'transparent',
            color: editor.isActive('heading', { level: 1 }) ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('heading', { level: 2 }) ? '#D0FF71' : 'transparent',
            color: editor.isActive('heading', { level: 2 }) ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('heading', { level: 3 }) ? '#D0FF71' : 'transparent',
            color: editor.isActive('heading', { level: 3 }) ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          H3
        </button>
        <div style={{ width: '1px', background: '#3a3b3f', margin: '0 4px' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('bold') ? '#D0FF71' : 'transparent',
            color: editor.isActive('bold') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('italic') ? '#D0FF71' : 'transparent',
            color: editor.isActive('italic') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontStyle: 'italic',
          }}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('strike') ? '#D0FF71' : 'transparent',
            color: editor.isActive('strike') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'line-through',
          }}
        >
          <del>S</del>
        </button>
        <div style={{ width: '1px', background: '#3a3b3f', margin: '0 4px' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('bulletList') ? '#D0FF71' : 'transparent',
            color: editor.isActive('bulletList') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('blockquote') ? '#D0FF71' : 'transparent',
            color: editor.isActive('blockquote') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          &quot;
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          style={{
            padding: '6px 12px',
            background: editor.isActive('codeBlock') ? '#D0FF71' : 'transparent',
            color: editor.isActive('codeBlock') ? '#0f0f10' : '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        >
          {'</>'}
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid #3a3b3f',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🖼️
        </button>
      </div>
    )
  }

  // Sincronizar el contenido cuando value cambia externamente
  React.useEffect(() => {
    if (editor && htmlValue !== editor.getHTML()) {
      editor.commands.setContent(htmlValue)
    }
  }, [htmlValue, editor])

  if (!isMounted || !editor) {
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
      minHeight: '400px',
    }}>
      <Toolbar />
      <EditorContent 
        editor={editor}
        style={{
          padding: '16px',
          color: '#ffffff',
          minHeight: '400px',
        }}
      />
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          color: #ffffff !important;
          min-height: 400px;
          background: #1a1b1e !important;
        }
        .ProseMirror * {
          color: #ffffff !important;
        }
        .ProseMirror p {
          color: #ffffff !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a0a0a0 !important;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
          color: #ffffff !important;
          font-weight: bold;
        }
        .ProseMirror strong {
          color: #ffffff !important;
        }
        .ProseMirror em {
          color: #ffffff !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #D0FF71;
          padding-left: 16px;
          color: #a0a0a0 !important;
          font-style: italic;
        }
        .ProseMirror code {
          background: #2a2b2e;
          padding: 2px 6px;
          border-radius: 4px;
          color: #D0FF71 !important;
          font-family: monospace;
        }
        .ProseMirror pre {
          background: #2a2b2e;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background: transparent;
          padding: 0;
          color: #D0FF71 !important;
        }
        .ProseMirror a {
          color: #D0FF71 !important;
          text-decoration: underline;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
          padding-left: 2em;
          color: #ffffff !important;
        }
        .ProseMirror li {
          margin: 0.5em 0;
          color: #ffffff !important;
        }
        .ProseMirror ul li::marker,
        .ProseMirror ol li::marker {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  )
}
