'use client';

import React, { useState, useMemo, JSX } from 'react';
import Pagination from './Pagination';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  image: string | null | undefined;
  isPublic: boolean;
  isSubscriberOnly?: boolean;
  excerpt: string;
  content: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

// Función para formatear fechas de manera concisa
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function BlogGrid({ posts }: BlogGridProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // 3 columnas x 3 filas

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.slice(startIndex, endIndex);
  }, [posts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Blog Grid */}
      <div className="tp-blog-masonry-ptb pb-70">
        <div className="container container-1330">
          <div className="row grid">
            {paginatedPosts.map((post, index) => {
              const cardType = index % 2;
              const isCardType2 = cardType === 1;
              const isCardType3 = cardType === 2;
              
              return (
                <div key={post.slug} className="col-12 col-md-6 col-lg-4 grid-item">
                  <div className={`tp-blog-masonry-item${isCardType2 ? '-2' : isCardType3 ? '-3' : ''} mb-30`}>
                    {/* Header con usuario y fecha - solo para cards tipo 1 y 2 */}
                    {!isCardType3 && (
                      <div className="tp-blog-masonry-item-top d-flex justify-content-between align-items-center mb-30">
                        <div className="tp-blog-masonry-item-user d-flex align-items-center">
                          <div className="tp-blog-masonry-item-user-content">
                            <span>{post.author}</span>
                            <p>Administrador</p>
                          </div>
                        </div>
                        <div className="tp-blog-masonry-item-time">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M9 4.19997V8.99997L12.2 10.6M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {formatDate(post.date)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Imagen - solo para cards tipo 1 */}
                    {!isCardType2 && !isCardType3 && post.image && (
                      <div className="tp-blog-masonry-thumb mb-30">
                        <a href={`/articulos/${post.slug}`}>
                          <img src={post.image} alt={post.title} />
                        </a>
                      </div>
                    )}
                    
                    {/* Icono para cards tipo 3 */}
                    {isCardType3 && (
                      <div className="tp-blog-masonry-item-icon">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="16" viewBox="0 0 26 16" fill="none">
                            <path d="M2.21529 16L1.80505 15.0881C2.57083 14.7565 3.30926 14.3696 4.02034 13.9275C4.73142 13.4853 5.36045 13.0155 5.90743 12.5181C6.50912 11.9655 6.97405 11.4404 7.30224 10.943L6.48177 10.1969H5.66129C4.51262 10.1969 3.5007 9.97582 2.62553 9.53368C1.80505 9.09154 1.14867 8.48359 0.656382 7.70984C0.218794 6.9361 0 6.05181 0 5.05699C0 4.06218 0.246143 3.1779 0.738429 2.40415C1.28541 1.6304 1.99649 1.05009 2.87167 0.663214C3.74684 0.221071 4.73142 0 5.82539 0C6.91935 0 7.90393 0.221071 8.7791 0.663214C9.65428 1.10536 10.338 1.7133 10.8303 2.48705C11.3226 3.2608 11.5687 4.14508 11.5687 5.1399C11.5687 6.35579 11.3226 7.51641 10.8303 8.62176C10.3927 9.67185 9.76367 10.6667 8.9432 11.6062C8.12272 12.5458 7.13815 13.4024 5.98948 14.1762C4.84081 14.8946 3.58275 15.5026 2.21529 16ZM16.6466 16L16.2363 15.0881C17.0021 14.7565 17.7405 14.3696 18.4516 13.9275C19.1627 13.4853 19.7917 13.0155 20.3387 12.5181C20.9404 11.9655 21.4053 11.4404 21.7335 10.943L20.913 10.1969H20.0926C18.9439 10.1969 17.932 9.97582 17.0568 9.53368C16.2363 9.09154 15.5799 8.48359 15.0877 7.70984C14.6501 6.9361 14.4313 6.05181 14.4313 5.05699C14.4313 4.06218 14.6774 3.1779 15.1697 2.40415C15.7167 1.6304 16.4278 1.05009 17.3029 0.663214C18.1781 0.221071 19.1627 0 20.2567 0C21.3506 0 22.3352 0.221071 23.2104 0.663214C24.0856 1.10536 24.7693 1.7133 25.2616 2.48705C25.7539 3.2608 26 4.14508 26 5.1399C26 6.35579 25.7539 7.51641 25.2616 8.62176C24.824 9.67185 24.195 10.6667 23.3745 11.6062C22.554 12.5458 21.5694 13.4024 20.4208 14.1762C19.2721 14.8946 18.014 15.5026 16.6466 16Z" fill="#D0FF71" />
                          </svg>
                        </span>
                      </div>
                    )}
                    
                    {/* Contenido principal */}
                    <div className="tp-blog-masonry-content">
                      <div className="tp-blog-masonry-tag mb-15">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                            <path d="M4.39012 4.13048H4.39847M13.6056 8.14369L8.74375 12.6328C8.6178 12.7492 8.46823 12.8415 8.30359 12.9046C8.13896 12.9676 7.96248 13 7.78426 13C7.60604 13 7.42956 12.9676 7.26493 12.9046C7.10029 12.8415 6.95072 12.7492 6.82477 12.6328L1 7.2609V1H7.78087L13.6056 6.37811C13.8582 6.61273 14 6.93009 14 7.2609C14 7.59171 13.8582 7.90908 13.6056 8.14369Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Título y botón para cards tipo 1 y 2 */}
                      {!isCardType3 && (
                        <>
                          <h4 className="tp-blog-masonry-title">
                            <a className="tp-line-white" href={`/articulos/${post.slug}`}>
                              {post.title}
                              {post.isSubscriberOnly && (
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="18" 
                                  height="18" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  style={{ 
                                    marginLeft: '8px', 
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
                                  }}
                                  aria-label="Solo para miembros del Club"
                                >
                                  <title>Solo para miembros del Club</title>
                                  <path 
                                    d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" 
                                    stroke="#FFD700" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                              {!post.isPublic && !post.isSubscriberOnly && (
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  style={{ 
                                    marginLeft: '8px', 
                                    display: 'inline-block',
                                    verticalAlign: 'middle'
                                  }}
                                >
                                  <path 
                                    d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" 
                                    stroke="#D0FF71" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </a>
                          </h4>
                          <div className="tp-blog-masonry-btn">
                            <a href={`/articulos/${post.slug}`}>
                              Leer más
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </a>
                          </div>
                        </>
                      )}
                      
                      {/* Contenido especial para cards tipo 3 */}
                      {isCardType3 && (
                        <div className="tp-blog-masonry-item-text">
                          <span>
                            {post.excerpt}
                            {post.isSubscriberOnly && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                style={{ 
                                  marginLeft: '6px', 
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
                                }}
                                aria-label="Solo para miembros del Club"
                              >
                                <title>Solo para miembros del Club</title>
                                <path 
                                  d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" 
                                  stroke="#FFD700" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            {!post.isPublic && !post.isSubscriberOnly && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                style={{ 
                                  marginLeft: '6px', 
                                  display: 'inline-block',
                                  verticalAlign: 'middle'
                                }}
                              >
                                <path 
                                  d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" 
                                  stroke="#D0FF71" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <p>{post.author}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div className="container container-1330">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
