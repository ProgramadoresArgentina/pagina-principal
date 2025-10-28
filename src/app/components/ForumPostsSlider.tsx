"use client";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";

// Declaración de tipos para Swiper
declare global {
  interface Window {
    Swiper: any
  }
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPinned: boolean;
  viewCount: number;
  applauseCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
  commentCount: number;
}

export default function ForumPostsSlider(): JSX.Element {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/forum/posts?limit=6&sort=recent');
        const data = await response.json();
        if (data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error al cargar posts del foro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Inicializar Swiper cuando el componente se monte
    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        new window.Swiper('.forum-posts-swiper', {
          slidesPerView: 'auto',
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: false,
          },
          direction: 'horizontal',
          speed: 800,
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          },
        });
      } else {
        // Si Swiper no está listo, intentar de nuevo
        setTimeout(initSwiper, 100);
      }
    };

    if (!loading && posts.length > 0) {
      setTimeout(initSwiper, 100);
    }
  }, [loading, posts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="forum-posts-slider-area pt-120 pb-80">
        <div className="container container-1430">
          <div className="row">
            <div className="col-12">
              <div className="tp-section-title-box text-center mb-60">
                <span className="tp-section-subtitle pre">Últimas Discusiones</span>
                <h2 className="tp-section-title">Lo que se habla en el foro</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-30">
                <div className="forum-post-card-skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-content"></div>
                  <div className="skeleton-footer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-posts-slider-area pt-120 pb-80">
      <div className="container container-1430">
        <div className="row">
          <div className="col-12">
            <div className="tp-section-title-box text-center mb-60">
              <span className="tp-section-subtitle pre">Últimas Discusiones</span>
              <h2 className="tp-section-title">Lo que se habla en el foro</h2>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="swiper-container forum-posts-swiper">
              <div className="swiper-wrapper">
                {posts.map((post) => (
                  <div key={post.id} className="swiper-slide">
                    <Link href={`/foro/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="forum-post-card tp_fade_anim">
                      <div className="forum-post-header">
                        <div className="author-info">
                          <div className="author-avatar">
                            {post.author.avatar ? (
                              <img 
                                src={post.author.avatar} 
                                alt={post.author.name}
                                width="40"
                                height="40"
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {post.author.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="author-details">
                            <h5 className="author-name">{post.author.name}</h5>
                            <span className="post-time">{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                        {post.isPinned && (
                          <div className="pinned-badge">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 0L10.5 3.5H8.5V12L7.5 13L6.5 12V3.5H4.5L8 0Z" fill="#FFD700"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="forum-post-content">
                        <h4 className="post-title">
                          {post.title}
                        </h4>
                        <p className="post-excerpt">
                          {truncateText(post.content.replace(/<[^>]*>/g, ''))}
                        </p>
                      </div>
                      
                      <div className="forum-post-footer">
                        <div className="post-stats">
                          <div className="stat-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 14L3.5 9.5H6V2H10V9.5H12.5L8 14Z" fill="currentColor"/>
                            </svg>
                            <span>{post.applauseCount}</span>
                          </div>
                          <div className="stat-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 1C9.1 1 10 1.9 10 3C10 4.1 9.1 5 8 5C6.9 5 6 4.1 6 3C6 1.9 6.9 1 8 1ZM8 6C10.2 6 12 7.8 12 10V11H4V10C4 7.8 5.8 6 8 6Z" fill="currentColor"/>
                            </svg>
                            <span>{post.commentCount}</span>
                          </div>
                          <div className="stat-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 1C11.3 1 14 3.7 14 7C14 10.3 11.3 13 8 13C4.7 13 2 10.3 2 7C2 3.7 4.7 1 8 1ZM8 2C5.2 2 3 4.2 3 7C3 9.8 5.2 12 8 12C10.8 12 13 9.8 13 7C13 4.2 10.8 2 8 2ZM8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4Z" fill="currentColor"/>
                            </svg>
                            <span>{post.viewCount}</span>
                          </div>
                        </div>
                        <div className="read-more-btn">
                          Leer más
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-50">
          <div className="col-12 text-center">
            <div className="forum-actions">
              <Link href="/foro" className="tp-btn-black-radius btn-blue-bg d-inline-flex align-items-center justify-content-between mr-15">
                <span>
                  <span className="text-1">Crear post</span>
                  <span className="text-2">Nuevo</span>
                </span>
                <i>
                  <span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1V11M1 6H11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1V11M1 6H11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .forum-posts-slider-area {
          background: linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%);
        }
        
        .forum-post-card {
          background: linear-gradient(135deg, #3a3b3f 0%, #2d2e32 100%);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #4a4b4f;
        }
        
        .forum-post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
          border-color: #D0FF71;
        }
        
        .forum-post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1b1e;
          font-weight: bold;
          font-size: 16px;
        }
        
        .author-details {
          display: flex;
          flex-direction: column;
        }
        
        .author-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
        }
        
        .post-time {
          font-size: 12px;
          color: #a0a0a0;
          margin-top: 2px;
        }
        
        .pinned-badge {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 6px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .forum-post-content {
          flex: 1;
          margin-bottom: 16px;
        }
        
        .post-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .post-title a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .post-title a:hover {
          color: #D0FF71;
        }
        
        .post-excerpt {
          font-size: 14px;
          color: #a0a0a0;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .forum-post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        
        .post-stats {
          display: flex;
          gap: 16px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #a0a0a0;
          font-size: 12px;
        }
        
        .read-more-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #D0FF71;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .read-more-btn:hover {
          color: #a8d65a;
        }
        
        .forum-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .forum-post-card-skeleton {
          background: linear-gradient(135deg, #3a3b3f 0%, #2d2e32 100%);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          height: 280px;
          border: 1px solid #4a4b4f;
        }
        
        .skeleton-header {
          height: 40px;
          background: linear-gradient(90deg, #4a4b4f 25%, #3a3b3f 50%, #4a4b4f 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .skeleton-content {
          height: 120px;
          background: linear-gradient(90deg, #4a4b4f 25%, #3a3b3f 50%, #4a4b4f 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .skeleton-footer {
          height: 20px;
          background: linear-gradient(90deg, #4a4b4f 25%, #3a3b3f 50%, #4a4b4f 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }
        
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        @media (max-width: 768px) {
          .forum-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .forum-post-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
