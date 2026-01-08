import React from 'react'
import { TElement, TText } from '@udecode/plate-common'

/**
 * Extrae el texto del primer párrafo del contenido Plate
 */
export function extractFirstParagraph(content: any): string {
  if (!content || !Array.isArray(content)) {
    return ''
  }

  // Buscar el primer elemento de tipo 'p' (párrafo)
  const firstParagraph = content.find((element: TElement) => element.type === 'p')

  if (!firstParagraph || !firstParagraph.children) {
    return ''
  }

  // Extraer el texto de los hijos
  const extractText = (children: any[]): string => {
    return children
      .map((child) => {
        if (typeof child === 'string') {
          return child
        }
        if ('text' in child) {
          return (child as TText).text || ''
        }
        if ('children' in child) {
          return extractText(child.children)
        }
        return ''
      })
      .join('')
  }

  return extractText(firstParagraph.children).trim()
}

/**
 * Renderiza solo el primer párrafo del contenido Plate
 */
export function renderFirstParagraph(content: any): React.ReactNode {
  if (!content || !Array.isArray(content)) {
    return null
  }

  const firstParagraph = content.find((element: TElement) => element.type === 'p')

  if (!firstParagraph) {
    return null
  }

  const renderChildren = (children: any[]): React.ReactNode => {
    if (!children || children.length === 0) return null

    return children.map((child, index) => {
      if (typeof child === 'string') {
        return child
      }

      if ('text' in child) {
        const textNode = child as TText
        let text: React.ReactNode = textNode.text

        if (textNode.bold) {
          text = <strong key={index}>{text}</strong>
        }
        if (textNode.italic) {
          text = <em key={index}>{text}</em>
        }
        if (textNode.underline) {
          text = <u key={index}>{text}</u>
        }
        if (textNode.code) {
          text = (
            <code
              key={index}
              style={{
                background: '#2a2b2e',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                color: '#D0FF71',
              }}
            >
              {text}
            </code>
          )
        }

        return text
      }

      return null
    })
  }

  return (
    <p style={{ margin: '1em 0', color: '#ffffff' }}>
      {renderChildren(firstParagraph.children || [])}
    </p>
  )
}
