'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BlogGrid from './BlogGrid';
import { BlogPost, PaginatedPosts } from '@/lib/blog';

interface InfiniteScrollBlogProps {
  initialPosts: BlogPost[];
  initialHasNextPage: boolean;
  initialCurrentPage: number;
}

export default function InfiniteScrollBlog({ 
  initialPosts, 
  initialHasNextPage, 
  initialCurrentPage 
}: InfiniteScrollBlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Función para cargar más posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/paginated?page=${currentPage + 1}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar más artículos');
      }

      const data: PaginatedPosts = await response.json();
      
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setCurrentPage(data.currentPage);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasNextPage, isLoading]);

  // Configurar el Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isLoading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePosts, hasNextPage, isLoading]);

  return (
    <>
      <BlogGrid posts={posts} />
      
      {/* Loading indicator */}
      <div ref={loadingRef} className="tp-blog-loading">
        {isLoading && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <div className="tp-blog-loading-content">
                  <div className="tp-blog-spinner">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                  <p className="tp-blog-loading-text">
                    Cargando más artículos...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <div className="tp-blog-error">
                  <p className="text-danger">
                    {error}
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={loadMorePosts}
                    disabled={isLoading}
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!hasNextPage && posts.length > 0 && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <div className="tp-blog-end">
                  <p className="text-muted">
                    Has llegado al final de los artículos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
