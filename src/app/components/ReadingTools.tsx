'use client';

import React, { useState, useEffect } from 'react';
import './ReadingTools.css';

interface ReadingToolsProps {
  content: string;
  title: string;
  slug: string;
  author: string;
}

export default function ReadingTools({ content, title, slug, author }: ReadingToolsProps) {
  const [readingTime, setReadingTime] = useState(0);
  const [fontSize, setFontSize] = useState<string>('medium');
  const [showTools, setShowTools] = useState(true);

  // Cargar preferencia de tamaño de fuente desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('article-font-size');
      if (savedFontSize && ['small', 'medium', 'large', 'xlarge'].includes(savedFontSize)) {
        setFontSize(savedFontSize);
      }
    }
  }, []);

  // Calcular tiempo de lectura (promedio 200 palabras por minuto)
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    setReadingTime(time);
  }, [content]);

  // Aplicar modo lectura permanentemente
  useEffect(() => {
    const articleContent = document.querySelector('.article-content-container');
    if (articleContent) {
      articleContent.classList.add('reading-mode');
    }
  }, []);

  // Aplicar tamaño de fuente inicial y cuando cambia
  useEffect(() => {
    const articleContent = document.querySelector('.article-content-container');
    if (articleContent) {
      // Remover todas las clases de tamaño
      articleContent.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
      // Agregar la clase del tamaño seleccionado
      articleContent.classList.add(`font-${fontSize}`);
    }
  }, [fontSize]);

  // Guardar preferencia en localStorage cuando cambia el tamaño
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('article-font-size', fontSize);
    }
  }, [fontSize]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${title} por ${author}`;

  const handleShare = async (platform: string) => {
    const url = shareUrl;
    const text = shareText;

    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Enlace copiado al portapapeles');
        } catch (err) {
          alert('Error al copiar el enlace');
        }
        break;
    }
  };

  return (
    <div className={`reading-tools ${showTools ? 'visible' : ''}`}>
      <div className="reading-tools-container">
        <div className="reading-tools-main">
          {/* Tiempo de lectura */}
          <div className="reading-time" title="Tiempo estimado de lectura">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4.19997V8.99997L12.2 10.6M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{readingTime} min</span>
          </div>

          {/* Tamaño de fuente */}
          <div className="font-size-control">
            <button
              className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
              onClick={() => setFontSize('small')}
              title="Tamaño pequeño"
              aria-label="Tamaño pequeño"
            >
              A
            </button>
            <button
              className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
              onClick={() => setFontSize('medium')}
              title="Tamaño medio"
              aria-label="Tamaño medio"
            >
              A
            </button>
            <button
              className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setFontSize('large')}
              title="Tamaño grande"
              aria-label="Tamaño grande"
            >
              A
            </button>
            <button
              className={`font-size-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
              onClick={() => setFontSize('xlarge')}
              title="Tamaño extra grande"
              aria-label="Tamaño extra grande"
            >
              A
            </button>
          </div>

          {/* Botón compartir */}
          <div className="share-dropdown">
            <button className="share-button" title="Compartir artículo">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.75C13.2426 6.75 14.25 5.74264 14.25 4.5C14.25 3.25736 13.2426 2.25 12 2.25C10.7574 2.25 9.75 3.25736 9.75 4.5C9.75 5.74264 10.7574 6.75 12 6.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15.75C13.2426 15.75 14.25 14.7426 14.25 13.5C14.25 12.2574 13.2426 11.25 12 11.25C10.7574 11.25 9.75 12.2574 9.75 13.5C9.75 14.7426 10.7574 15.75 12 15.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9.75C7.24264 9.75 8.25 8.74264 8.25 7.5C8.25 6.25736 7.24264 5.25 6 5.25C4.75736 5.25 3.75 6.25736 3.75 7.5C3.75 8.74264 4.75736 9.75 6 9.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.0332 5.48334L6.9668 7.01667M6.9668 10.9833L11.0332 12.5167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="share-menu">
              <button onClick={() => handleShare('linkedin')} className="share-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>
              <button onClick={() => handleShare('copy')} className="share-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 2 0 01-2-2V4a2 2 2 0 012-2h9a2 2 2 0 012 2v1"/>
                </svg>
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

