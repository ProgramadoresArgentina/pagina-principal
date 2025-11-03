'use client';

import React, { useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import ImageModal from './ImageModal';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  slug?: string;
}

export default function MarkdownRenderer({ content, slug }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  React.useEffect(() => {
    const processMarkdown = async () => {
      try {
        const processedContent = await remark()
          .use(remarkHtml, { sanitize: false })
          .process(content);
        
        // Procesar el HTML para mejorar las imágenes, videos y títulos
        const enhancedHtml = enhanceImages(processedContent.toString());
        const htmlWithVideos = processVideoPaths(enhancedHtml);
        const htmlWithIds = addIdsToHeadings(htmlWithVideos);
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

  // Función para procesar rutas de videos en el HTML
  const processVideoPaths = (html: string): string => {
    // Si no hay slug, intentar obtenerlo de la URL
    const articleSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.match(/\/articulos\/([^\/]+)/)?.[1] : '');
    
    if (!articleSlug) return html;
    
    // Construir el folderName - el slug puede necesitar el prefijo numérico
    // Por ahora usamos el slug directamente, pero esto puede necesitar ajuste
    const folderName = articleSlug;
    
    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    const bucketName = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || process.env.MINIO_BUCKET_NAME || 'articulos';
    
    const convertToMinIOUrl = (path: string): string => {
      if (path.startsWith('http') || path.startsWith('/assets/')) {
        return path;
      }
      
      // Limpiar la ruta relativa (eliminar ./ o ../)
      const cleanPath = path.replace(/^\.\//, '').replace(/^\.\.\//, '');
      const fullPath = `${folderName}/${cleanPath}`;
      return `${minioEndpoint}/${bucketName}/${fullPath}`;
    };
    
    // Procesar <source src="..."> - puede estar en cualquier orden de atributos
    let processed = html.replace(/<source([^>]*src=["'])([^"']+)(["'][^>]*)>/gi, (match, before, src, after) => {
      const minioUrl = convertToMinIOUrl(src);
      return `<source${before}${minioUrl}${after}>`;
    });
    
    // Procesar <video src="..."> - puede estar en cualquier orden de atributos
    processed = processed.replace(/<video([^>]*src=["'])([^"']+)(["'][^>]*)>/gi, (match, before, src, after) => {
      const minioUrl = convertToMinIOUrl(src);
      return `<video${before}${minioUrl}${after}>`;
    });
    
    return processed;
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
