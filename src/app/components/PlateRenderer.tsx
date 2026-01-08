'use client'

import React from 'react'
import { TElement, TText } from '@udecode/plate-common'

interface PlateRendererProps {
  content: TElement[] | string
}

export default function PlateRenderer({ content }: PlateRendererProps) {
  // Si el contenido es HTML (string), renderizarlo directamente
  if (typeof content === 'string') {
    return (
      <div 
        className="plate-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          color: '#ffffff',
        }}
      />
    )
  }
  const renderElement = (element: TElement, index: number): React.ReactNode => {
    const { type, children, ...props } = element

    switch (type) {
      case 'h1':
        return (
          <h1 key={index} style={{ fontSize: '2em', fontWeight: 'bold', margin: '0.67em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h1>
        )
      case 'h2':
        return (
          <h2 key={index} style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '0.75em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={index} style={{ fontSize: '1.17em', fontWeight: 'bold', margin: '0.83em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h3>
        )
      case 'h4':
        return (
          <h4 key={index} style={{ fontSize: '1em', fontWeight: 'bold', margin: '0.83em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h4>
        )
      case 'h5':
        return (
          <h5 key={index} style={{ fontSize: '0.83em', fontWeight: 'bold', margin: '0.83em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h5>
        )
      case 'h6':
        return (
          <h6 key={index} style={{ fontSize: '0.67em', fontWeight: 'bold', margin: '0.83em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </h6>
        )
      case 'blockquote':
        return (
          <blockquote
            key={index}
            style={{
              borderLeft: '4px solid #D0FF71',
              paddingLeft: '16px',
              margin: '1em 0',
              color: '#a0a0a0',
              fontStyle: 'italic',
            }}
          >
            {renderChildren(children)}
          </blockquote>
        )
      case 'code_block':
        return (
          <pre
            key={index}
            style={{
              background: '#2a2b2e',
              padding: '16px',
              borderRadius: '8px',
              overflowX: 'auto',
              margin: '1em 0',
            }}
          >
            <code style={{ fontFamily: 'monospace', color: '#D0FF71' }}>
              {renderChildren(children)}
            </code>
          </pre>
        )
      case 'ul':
        return (
          <ul key={index} style={{ margin: '1em 0', paddingLeft: '2em', color: '#ffffff' }}>
            {renderChildren(children)}
          </ul>
        )
      case 'ol':
        return (
          <ol key={index} style={{ margin: '1em 0', paddingLeft: '2em', color: '#ffffff' }}>
            {renderChildren(children)}
          </ol>
        )
      case 'li':
        return (
          <li key={index} style={{ margin: '0.5em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </li>
        )
      case 'img':
        return (
          <img
            key={index}
            src={(props.url || props.src) as string | undefined}
            alt={(props.alt as string) || ''}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              margin: '1em 0',
            }}
          />
        )
      case 'a':
        return (
          <a
            key={index}
            href={(props.url || props.href) as string | undefined}
            target={(props.target as string) || '_blank'}
            rel="noopener noreferrer"
            style={{ color: '#D0FF71', textDecoration: 'underline' }}
          >
            {renderChildren(children)}
          </a>
        )
      case 'table':
        return (
          <table key={index} style={{ width: '100%', borderCollapse: 'collapse', margin: '1em 0' }}>
            {renderChildren(children)}
          </table>
        )
      case 'tr':
        return (
          <tr key={index}>
            {renderChildren(children)}
          </tr>
        )
      case 'td':
        return (
          <td
            key={index}
            style={{
              border: '1px solid #3a3b3f',
              padding: '8px',
              textAlign: 'left',
              color: '#ffffff',
            }}
          >
            {renderChildren(children)}
          </td>
        )
      case 'th':
        return (
          <th
            key={index}
            style={{
              border: '1px solid #3a3b3f',
              padding: '8px',
              textAlign: 'left',
              background: '#2a2b2e',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            {renderChildren(children)}
          </th>
        )
      case 'hr':
        return (
          <hr
            key={index}
            style={{
              border: 'none',
              borderTop: '1px solid #3a3b3f',
              margin: '2em 0',
            }}
          />
        )
      case 'p':
      default:
        return (
          <p key={index} style={{ margin: '1em 0', color: '#ffffff' }}>
            {renderChildren(children)}
          </p>
        )
    }
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
        if (textNode.strikethrough) {
          text = <del key={index}>{text}</del>
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

      if ('type' in child) {
        return renderElement(child as TElement, index)
      }

      return null
    })
  }

  if (!content || content.length === 0) {
    return <p style={{ color: '#a0a0a0' }}>No hay contenido disponible.</p>
  }

  return <div className="plate-content">{content.map((element, index) => renderElement(element, index))}</div>
}
