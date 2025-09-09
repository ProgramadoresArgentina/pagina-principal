'use client';

import React, { useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import ImageModal from './ImageModal';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  React.useEffect(() => {
    const processMarkdown = async () => {
      try {
        const processedContent = await remark()
          .use(remarkHtml, { sanitize: false })
          .process(content);
        
        // Procesar el HTML para mejorar las imágenes y títulos
        const enhancedHtml = enhanceImages(processedContent.toString());
        const htmlWithIds = addIdsToHeadings(enhancedHtml);
        setHtmlContent(htmlWithIds);
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlContent(content);
      }
    };

    processMarkdown();
  }, [content]);

  // Agregar event listeners para las imágenes después de que se renderice el HTML
  React.useEffect(() => {
    if (htmlContent) {
      const handleImageClick = (e: Event) => {
        const target = e.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
          e.preventDefault();
          setModalImage({
            src: target.src,
            alt: target.alt || 'Imagen'
          });
        }
      };

      const container = document.querySelector('.markdown-content');
      if (container) {
        container.addEventListener('click', handleImageClick);
        
        return () => {
          container.removeEventListener('click', handleImageClick);
        };
      }
    }
  }, [htmlContent]);

  // Función para mejorar el renderizado de imágenes
  const enhanceImages = (html: string): string => {
    return html.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, before, src, after) => {
      // Agregar atributos para mejor rendimiento, accesibilidad y cursor pointer
      const enhancedAttrs = [
        before,
        'loading="lazy"',
        'decoding="async"',
        'style="cursor: pointer;"',
        after
      ].join(' ');
      
      return `<img${enhancedAttrs}src="${src}">`;
    });
  };

  // Función para agregar IDs a los títulos
  const addIdsToHeadings = (html: string): string => {
    return html.replace(/<(h[1-6])([^>]*)>([^<]*)<\/\1>/g, (match, tag, attrs, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
    });
  };

  return (
    <>
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Modal de imagen */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
        />
      )}
    </>
  );
}
