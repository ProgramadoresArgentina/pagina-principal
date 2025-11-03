'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import './TableOfContents.css';

interface TableOfContentsProps {
  content?: string;
  isPublic?: boolean;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement | null;
}

export default function TableOfContents({ content, isPublic = true }: TableOfContentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Determinar si el contenido está bloqueado basado en la suscripción del usuario y si el artículo es público
  const isLocked = !isPublic && (!isAuthenticated || !user?.isSubscribed);

  // Solo renderizar en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Función para generar ID único basado en el texto
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Extraer títulos del contenido markdown o del DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const extractHeadingsFromMarkdown = () => {
      if (!content) return false;

      // Extraer títulos del markdown usando regex
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = content.match(headingRegex);
      
      if (!matches || matches.length === 0) {
        return false;
      }

      const items: TocItem[] = [];

      matches.forEach((match) => {
        const [, hashes, text] = match.match(/^(#{1,6})\s+(.+)$/) || [];
        if (hashes && text) {
          const level = hashes.length;
          const id = generateId(text);
          
          items.push({
            id,
            text: text.trim(),
            level,
            element: null, // No tenemos el elemento DOM
          });
        }
      });

      if (items.length > 0) {
        setTocItems(items);
        return true;
      }

      return false;
    };

    const extractHeadingsFromDOM = () => {
      // Buscar títulos en el DOM ya renderizado
      const markdownContent = document.querySelector('.markdown-content');
      if (!markdownContent) {
        return false;
      }

      const headings = markdownContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        return false;
      }

      const items: TocItem[] = [];

      headings.forEach((heading) => {
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));
        let id = heading.id;

        // Si no tiene ID, generarlo
        if (!id) {
          id = generateId(text);
          heading.id = id;
        }

        items.push({
          id,
          text,
          level,
          element: heading as HTMLElement,
        });
      });

      if (items.length > 0) {
        setTocItems(items);
        return true;
      }

      return false;
    };

    // Intentar extraer del markdown primero
    if (extractHeadingsFromMarkdown()) {
      return;
    }

    // Si no funciona, intentar del DOM
    const tryExtractFromDOM = () => {
      if (extractHeadingsFromDOM()) {
        return;
      }
      
      // Si no funciona, intentar cada 500ms hasta 10 segundos
      let attempts = 0;
      const maxAttempts = 20;
      
      const interval = setInterval(() => {
        attempts++;
        if (extractHeadingsFromDOM() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    };

    const cleanup = tryExtractFromDOM();
    return cleanup;
  }, [content]);

  // Scroll spy para detectar qué sección está visible
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      if (item.element) {
        observer.observe(item.element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tocItems]);

  // Función para hacer scroll a una sección
  const scrollToSection = (id: string) => {
    if (isLocked) {
      return; // No hacer scroll si el contenido está bloqueado
    }
    
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // Altura aproximada del header fijo
      const offset = element.offsetTop - headerHeight - 20; // 20px de margen adicional
      
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    } else {
      // Si no encontramos el elemento, intentar buscar en el contenido markdown
      // y hacer scroll a una posición aproximada
      console.log('Element not found, trying to scroll to approximate position');
    }
  };

  // Ocultar tabla de contenido por ahora
  return null;
}
