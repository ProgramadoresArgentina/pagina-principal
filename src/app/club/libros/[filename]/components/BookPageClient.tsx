'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/lib/books';
import BookViewer from './BookViewer';

interface BookPageClientProps {
  book: Book;
}

export default function BookPageClient({ book }: BookPageClientProps) {
  const { user, token, isAuthenticated } = useAuth();
  const [bookWithProgress, setBookWithProgress] = useState<Book>(book);
  const [loading, setLoading] = useState(false);

  // Cargar progreso del usuario cuando esté autenticado
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!isAuthenticated || !user?.id || !token) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/books/progress?bookFilename=${encodeURIComponent(book.filename)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.progress) {
            setBookWithProgress(prev => ({
              ...prev,
              progress: data.progress,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [isAuthenticated, user?.id, token, book.filename]);

  if (loading) {
    return (
      <div className="book-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando progreso...</span>
        </div>
        <p className="mt-3">Cargando tu progreso de lectura...</p>
      </div>
    );
  }

  return <BookViewer book={bookWithProgress} />;
}