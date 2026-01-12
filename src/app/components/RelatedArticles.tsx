'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/blog';
import './RelatedArticles.css';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string | null;
  author: string;
}

interface RelatedArticlesProps {
  articles: BlogPost[];
  currentSlug: string;
}

export default function RelatedArticles({ articles, currentSlug }: RelatedArticlesProps) {
  // Validar que articles existe y es un array
  if (!articles || !Array.isArray(articles)) {
    return null;
  }

  // Filtrar el artículo actual
  const relatedArticles = articles
    .filter(article => article.slug !== currentSlug)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="related-articles">
      <div className="related-articles-header">
        <h3>Artículos Relacionados</h3>
        <p>Contenido que también te puede interesar</p>
      </div>
      <div className="related-articles-grid">
        {relatedArticles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/articulos/${article.slug}`}
            className="related-article-card"
          >
            <div className="related-article-content">
              <h4>{article.title}</h4>
              <p>{article.excerpt || article.title.substring(0, 120)}...</p>
              <div className="related-article-meta">
                <span className="related-article-author">{article.author}</span>
                <span className="related-article-date">
                  {formatDate(article.date)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

