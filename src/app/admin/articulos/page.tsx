'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/app/components/Navigation'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'
import PlateEditor from '@/app/components/PlateEditor'
import { TElement } from '@udecode/plate-common'

// Estilos para los placeholders
const placeholderStyles = `
  .admin-search-input::placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-search-input::-webkit-input-placeholder {
    color: #a0a0a0 !important;
  }
  .admin-search-input::-moz-placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-search-input:-ms-input-placeholder {
    color: #a0a0a0 !important;
  }
  .admin-title-input {
    color: #ffffff !important;
  }
  .admin-title-input::placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-title-input::-webkit-input-placeholder {
    color: #a0a0a0 !important;
  }
  .admin-title-input::-moz-placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-title-input:-ms-input-placeholder {
    color: #a0a0a0 !important;
  }
`

interface Article {
  id: string
  title: string
  slug: string
  content: TElement[]
  isPublic: boolean
  isSubscriberOnly?: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

const defaultContent: TElement[] = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]

export default function AdminArticulosPage() {
  const { isAuthenticated, isLoading, token, user } = useAuth()
  const router = useRouter()

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)

  // Form state - simplificado
  const [formData, setFormData] = useState<{
    title: string
    slug: string
    content: TElement[]
    isPublic: boolean
    isSubscriberOnly: boolean
  }>({
    title: '',
    slug: '',
    content: defaultContent,
    isPublic: true,
    isSubscriberOnly: false,
  })
  const [saving, setSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/ingresar?redirect=/admin/articulos')
    } else if (!isLoading && user?.role?.name !== 'Administrador') {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router, user])

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        public: 'false', // Mostrar todos para admin
      })
      if (search) {
        params.append('search', search)
      }

      const res = await fetch(`/api/articles?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error('Error al cargar artículos')
      }

      const data = await res.json()
      
      // Asegurar que el contenido de cada artículo sea un array válido
      const articlesWithValidContent = (data.articles || []).map((article: any) => {
        let content = defaultContent
        if (article.content) {
          if (Array.isArray(article.content) && article.content.length > 0) {
            content = article.content
          } else if (typeof article.content === 'string') {
            try {
              const parsed = JSON.parse(article.content)
              if (Array.isArray(parsed) && parsed.length > 0) {
                content = parsed
              }
            } catch (e) {
              // Error parsing content
            }
          }
        }
        return { ...article, content }
      })
      
      setArticles(articlesWithValidContent)
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalArticles(data.pagination?.total || 0)
    } catch (error) {
      // Error loading articles
    } finally {
      setLoading(false)
    }
  }, [token, page, search])

  useEffect(() => {
    if (token && user?.role?.name === 'Administrador') {
      loadArticles()
    }
  }, [token, page, search, user, loadArticles])

  const generateSlug = (title: string) => {
    if (!title || title.trim().length === 0) {
      return 'articulo-' + Date.now()
    }
    
    let slug = title
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .replace(/(^-|-$)/g, '') // Eliminar guiones al inicio y final
    
    // Si el slug está vacío después de procesar, generar uno por defecto
    if (!slug || slug.length === 0) {
      slug = 'articulo-' + Date.now()
    }
    
    // Limitar longitud del slug
    if (slug.length > 100) {
      slug = slug.substring(0, 100)
    }
    
    return slug
  }

  // Generar slug automáticamente cuando cambia el título (solo si no fue editado manualmente)
  useEffect(() => {
    if (formData.title && !slugManuallyEdited) {
      const autoSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }, [formData.title, slugManuallyEdited])

  const handleSave = async () => {
    try {
      setSaving(true)

      if (!formData.title.trim() || !formData.content) {
        return
      }

      // Usar el slug del formulario, o generar uno si está vacío
      const slug = formData.slug.trim() || generateSlug(formData.title)

      const url = editingArticle
        ? `/api/articles/${editingArticle.slug}`
        : '/api/articles'
      const method = editingArticle ? 'PUT' : 'POST'

      // Asegurar que publishedAt se establezca correctamente
      const publishedAtValue = formData.isPublic ? new Date().toISOString() : null
      
      const payload = {
        title: formData.title.trim(),
        slug: slug.trim(),
        content: formData.content,
        isPublic: formData.isPublic,
        isSubscriberOnly: formData.isSubscriberOnly,
        publishedAt: publishedAtValue,
        description: formData.title.trim(), // Usar título como descripción
        excerpt: formData.title.trim(), // Usar título como excerpt
        category: 'General',
        author: user?.name || 'Programadores Argentina',
        authorImage: null,
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al guardar artículo')
      }

      const savedArticle = await res.json()

      setEditingArticle(null)
      resetForm()
      loadArticles()
      setShowEditor(false)
      
      // Si es público, redirigir al artículo después de un breve delay
      if (formData.isPublic && savedArticle.article?.slug) {
        setTimeout(() => {
          window.location.href = `/articulos/${savedArticle.article.slug}`
        }, 500)
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content || defaultContent,
      isPublic: article.isPublic,
      isSubscriberOnly: article.isSubscriberOnly || false,
    })
    
    // Asegurar que el contenido sea un array válido
    let content = defaultContent
    if (article.content) {
      if (Array.isArray(article.content) && article.content.length > 0) {
        content = article.content
      } else if (typeof article.content === 'string') {
        try {
          const parsed = JSON.parse(article.content)
          if (Array.isArray(parsed) && parsed.length > 0) {
            content = parsed
          }
        } catch (e) {
          // Error parsing content
        }
      }
    }
    
    setFormData({
      title: article.title,
      slug: article.slug,
      content: content,
      isPublic: article.isPublic,
      isSubscriberOnly: article.isSubscriberOnly || false,
    })
    setSlugManuallyEdited(true) // Al editar, el slug ya existe, no generar automáticamente
    setShowEditor(true)
    
    // Scroll al formulario después de un breve delay
    setTimeout(() => {
      const formElement = document.getElementById('article-editor-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return
    }

    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error('Error al eliminar artículo')
      }

      loadArticles()
    } catch (error) {
      // Error silencioso
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: defaultContent,
      isPublic: true,
      isSubscriberOnly: false,
    })
    setEditingArticle(null)
    setSlugManuallyEdited(false)
    setShowEditor(false)
  }

  const handleCreateNew = () => {
    resetForm()
    setShowEditor(true)
    // Scroll al formulario después de un breve delay
    setTimeout(() => {
      const formElement = document.getElementById('article-editor-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  if (isLoading || !isAuthenticated || user?.role?.name !== 'Administrador') {
    return (
      <>
        <Navigation />
        <main style={{ background: '#0a0b0d', minHeight: '100vh', paddingTop: '120px' }}>
          <div className="container">
            <p style={{ color: '#a0a0a0', textAlign: 'center' }}>Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: placeholderStyles }} />
      <Navigation />
      <main style={{ background: '#0a0b0d', minHeight: '100vh' }}>
        <section className="pt-120 pb-140">
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-12">
                {/* Header */}
                <div className="mb-40">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                      <h2 style={{ color: '#D0FF71', marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' }}>
                        Artículos
                      </h2>
                      {!loading && (
                        <p style={{ color: '#a0a0a0', margin: 0, fontSize: '14px' }}>
                          {search ? (
                            <>
                              Mostrando <strong style={{ color: '#D0FF71' }}>{articles.length}</strong> de <strong style={{ color: '#D0FF71' }}>{totalArticles}</strong> artículo{totalArticles !== 1 ? 's' : ''}
                            </>
                          ) : (
                            <>
                              Total: <strong style={{ color: '#D0FF71' }}>{totalArticles}</strong> artículo{totalArticles !== 1 ? 's' : ''}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista de artículos - PRIMERO */}
                <div className="mb-40">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>Lista de Artículos</h3>
                    <button
                      onClick={handleCreateNew}
                      style={{
                        background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                        color: '#1a1b1e',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      + Crear Artículo
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <input
                      type="text"
                      placeholder="Buscar por título..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                      }}
                      className="admin-search-input"
                      style={{
                        flex: 1,
                        minWidth: '250px',
                        maxWidth: '500px',
                        padding: '12px 16px',
                        background: '#1a1b1e',
                        border: '2px solid #3a3b3f',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#D0FF71'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#3a3b3f'}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        style={{
                          padding: '12px 16px',
                          background: 'transparent',
                          border: '1px solid #3a3b3f',
                          borderRadius: '8px',
                          color: '#a0a0a0',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Articles List */}
                  {loading ? (
                    <div style={{ textAlign: 'center', color: '#ffffff', padding: '40px' }}>
                      <p>Cargando artículos...</p>
                    </div>
                  ) : articles.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#a0a0a0', padding: '40px' }}>
                      <p>No hay artículos</p>
                    </div>
                  ) : (
                    <div style={{
                      background: '#1a1b1e',
                      border: '1px solid #3a3b3f',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ background: '#2d2e32', borderBottom: '1px solid #3a3b3f' }}>
                              <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                                Título
                              </th>
                              <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                                Estado
                              </th>
                              <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                                Fecha
                              </th>
                              <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {articles.map((article) => (
                              <tr key={article.id} style={{ borderBottom: '1px solid #3a3b3f' }}>
                                <td style={{ padding: '16px', color: '#ffffff', fontSize: '14px' }}>
                                  {article.title}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: article.isPublic ? '#D0FF71' : '#3a3b3f',
                                    color: article.isPublic ? '#0f0f10' : '#a0a0a0',
                                  }}>
                                    {article.isPublic ? 'Publicado' : 'Borrador'}
                                  </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center', color: '#a0a0a0', fontSize: '12px' }}>
                                  {new Date(article.createdAt).toLocaleDateString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button
                                      onClick={() => window.open(`/articulos/${article.slug}`, '_blank')}
                                      style={{
                                        background: 'transparent',
                                        border: '1px solid #3a3b3f',
                                        color: '#ffffff',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                      }}
                                      title="Ver artículo"
                                    >
                                      Ver
                                    </button>
                                    <button
                                      onClick={() => handleEdit(article)}
                                      style={{
                                        background: 'transparent',
                                        border: '1px solid #3a3b3f',
                                        color: '#D0FF71',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                      }}
                                      title="Editar artículo"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDelete(article.slug)}
                                      style={{
                                        background: 'transparent',
                                        border: '1px solid #3a3b3f',
                                        color: '#ff6b6b',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                      }}
                                      title="Eliminar artículo"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        style={{
                          padding: '8px 16px',
                          background: page === 1 ? '#3a3b3f' : '#2d2e32',
                          border: '1px solid #3a3b3f',
                          borderRadius: '8px',
                          color: page === 1 ? '#6c757d' : '#ffffff',
                          cursor: page === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        Anterior
                      </button>
                      <span style={{ color: '#a0a0a0', padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                        Página {page} de {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                        style={{
                          padding: '8px 16px',
                          background: page === totalPages ? '#3a3b3f' : '#2d2e32',
                          border: '1px solid #3a3b3f',
                          borderRadius: '8px',
                          color: page === totalPages ? '#6c757d' : '#ffffff',
                          cursor: page === totalPages ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>

                {/* Formulario de creación/edición - SOLO SE MUESTRA SI showEditor ES TRUE */}
                {showEditor && (
                  <div id="article-editor-form" style={{
                    background: '#1a1b1e',
                    border: '1px solid #3a3b3f',
                    borderRadius: '12px',
                    padding: '30px',
                    marginBottom: '40px',
                  }}>
                    {/* Header del formulario */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ color: '#D0FF71', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                        {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                      </h3>
                      <button
                        onClick={resetForm}
                        style={{
                          background: 'transparent',
                          color: '#a0a0a0',
                          border: '1px solid #3a3b3f',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  {/* Título */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Título del artículo"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#2d2e32',
                        border: '2px solid #3a3b3f',
                        borderRadius: '8px',
                        color: '#ffffff !important',
                        fontSize: '16px',
                      }}
                      className="admin-title-input"
                    />
                  </div>

                  {/* URL (Slug) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                      URL del artículo
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#a0a0a0', fontSize: '14px', whiteSpace: 'nowrap' }}>/articulos/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          // Marcar que el slug fue editado manualmente
                          setSlugManuallyEdited(true)
                          
                          // Normalizar el slug mientras se escribe: solo letras, números y guiones
                          let slug = e.target.value
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                            .replace(/[^a-z0-9-]/g, '-') // Solo letras, números y guiones
                            .replace(/-+/g, '-') // Múltiples guiones a uno solo
                            .replace(/(^-|-$)/g, '') // Eliminar guiones al inicio y final
                          
                          // Limitar longitud
                          if (slug.length > 100) {
                            slug = slug.substring(0, 100)
                          }
                          
                          setFormData({ ...formData, slug })
                        }}
                        onFocus={() => setSlugManuallyEdited(true)}
                        placeholder="url-del-articulo"
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          padding: '12px 16px',
                          background: '#2d2e32',
                          border: '2px solid #3a3b3f',
                          borderRadius: '8px',
                          color: '#ffffff !important',
                          fontSize: '16px',
                        }}
                        className="admin-title-input"
                      />
                    </div>
                    <p style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '4px', margin: 0 }}>
                      Se genera automáticamente desde el título si lo dejas vacío. Solo letras, números y guiones.
                    </p>
                  </div>

                  {/* Contenido */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                      Contenido *
                    </label>
                    <PlateEditor
                      value={formData.content || defaultContent}
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          setFormData({ ...formData, content: value })
                        }
                      }}
                      placeholder="Escribe el contenido del artículo aquí..."
                    />
                  </div>

                  {/* Estado Público/Draft */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                    />
                    <label htmlFor="isPublic" style={{ color: '#ffffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '50px',
                        height: '26px',
                        background: formData.isPublic ? '#D0FF71' : '#3a3b3f',
                        borderRadius: '13px',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '2px',
                          left: formData.isPublic ? '26px' : '2px',
                          width: '22px',
                          height: '22px',
                          background: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.2s',
                        }} />
                      </span>
                      {formData.isPublic ? 'Publicado' : 'Borrador'}
                    </label>
                  </div>

                  {/* Solo para suscriptores */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <input
                      type="checkbox"
                      id="isSubscriberOnly"
                      checked={formData.isSubscriberOnly}
                      onChange={(e) => setFormData({ ...formData, isSubscriberOnly: e.target.checked })}
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                    />
                    <label htmlFor="isSubscriberOnly" style={{ color: '#ffffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '50px',
                        height: '26px',
                        background: formData.isSubscriberOnly ? '#FFD700' : '#3a3b3f',
                        borderRadius: '13px',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '2px',
                          left: formData.isSubscriberOnly ? '26px' : '2px',
                          width: '22px',
                          height: '22px',
                          background: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.2s',
                        }} />
                      </span>
                      Solo para miembros del Club
                      {formData.isSubscriberOnly && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          style={{ 
                            marginLeft: '4px',
                            filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
                          }}
                        >
                          <path 
                            d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" 
                            stroke="#FFD700" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </label>
                  </div>

                  {/* Botones */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        background: saving ? '#3a3b3f' : '#D0FF71',
                        color: saving ? '#a0a0a0' : '#0f0f10',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {saving ? 'Guardando...' : editingArticle ? 'Actualizar' : 'Crear Artículo'}
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
