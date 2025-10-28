'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function CreatePostPageContent() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    multimedia: [] as any[]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' })
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/ingresar')
    }
  }, [isAuthenticated, router])

  // Generar captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operation = Math.random() > 0.5 ? '+' : '-'
    
    let question, answer
    if (operation === '+') {
      question = `${num1} + ${num2}`
      answer = num1 + num2
    } else {
      // Asegurar que el resultado sea positivo
      const maxNum = Math.max(num1, num2)
      const minNum = Math.min(num1, num2)
      question = `${maxNum} - ${minNum}`
      answer = maxNum - minNum
    }
    
    setCaptcha({ question, answer, userAnswer: '' })
  }

  // Generar captcha al cargar el componente
  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-resize para textarea
    if (name === 'content' && e.target instanceof HTMLTextAreaElement) {
      const textarea = e.target
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(textarea.scrollHeight, 300) + 'px'
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!isAuthenticated || !token) {
      setError('Debes iniciar sesión para subir archivos')
      return
    }

    if (uploadedFiles.length + files.length > 3) {
      setError('Máximo 3 archivos multimedia permitidos')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/forum/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setUploadedFiles(prev => [...prev, ...data.files])
        setFormData(prev => ({
          ...prev,
          multimedia: [...prev.multimedia, ...data.files]
        }))
      } else {
        setError(data.error || 'Error al subir archivos')
      }
    } catch (err) {
      setError('Error de conexión al subir archivos')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    setFormData(prev => ({
      ...prev,
      multimedia: newFiles
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido')
      return false
    }

    if (formData.title.length < 3 || formData.title.length > 200) {
      setError('El título debe tener entre 3 y 200 caracteres')
      return false
    }

    if (!formData.content.trim()) {
      setError('El contenido es requerido')
      return false
    }

    if (formData.content.length < 10) {
      setError('El contenido debe tener al menos 10 caracteres')
      return false
    }

    if (!captcha.userAnswer.trim()) {
      setError('Debes resolver el captcha')
      return false
    }

    if (parseInt(captcha.userAnswer) !== captcha.answer) {
      setError('La respuesta del captcha es incorrecta')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para crear posts')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/foro/${data.post.slug}`)
      } else {
        setError(data.error || 'Error al crear el post')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  // Si no está autenticado, no renderizar nada (la redirección se maneja en useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <style jsx>{`
        .form-control::placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .form-control::-webkit-input-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .form-control::-moz-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .form-control:-ms-input-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
      `}</style>
      <div className="row justify-content-center" style={{ marginTop: '120px' }}>
        <div className="col-12 col-lg-8">
        <div style={{
          background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
          border: '1px solid #3a3b3f',
          borderRadius: '16px',
          padding: '32px',
          margin: '20px 0'
        }}>
          {/* Header */}
          <div className="text-center mb-4">
            <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>
              ✏️ Crear Nuevo Hilo
            </h2>
            <p style={{ color: '#a0a0a0', margin: 0 }}>
              Comparte tus ideas, preguntas o conocimientos con la comunidad
            </p>
          </div>

          {/* Guías del foro */}
          <div className="mb-4" style={{
            background: 'linear-gradient(135deg, #3a3b3f 0%, #2d2e32 100%)',
            border: '1px solid #4a4b4f',
            borderRadius: '12px',
            padding: '20px',
            borderLeft: '4px solid #D0FF71'
          }}>
            <h6 style={{ 
              color: '#D0FF71', 
              marginBottom: '15px', 
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📋 Guías del Foro
            </h6>
            <ul className="mb-0" style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#ffffff',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li style={{ marginBottom: '8px' }}>Sé respetuoso y constructivo en tus comentarios</li>
              <li style={{ marginBottom: '8px' }}>Usa títulos descriptivos y claros</li>
              <li style={{ marginBottom: '8px' }}>Incluye código cuando sea relevante</li>
              <li>Busca antes de crear posts similares</li>
            </ul>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Título */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                Título del Post *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="Ej: ¿Cómo optimizar consultas SQL en PostgreSQL?"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={200}
                style={{
                  background: '#1a1b1e',
                  border: '2px solid #3a3b3f',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '12px 16px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D0FF71'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f'
                }}
                required
              />
              <div className="form-text" style={{ color: '#a0a0a0', fontSize: '12px' }}>
                {formData.title.length}/200 caracteres
              </div>
            </div>

            {/* Contenido */}
            <div className="mb-4">
              <label htmlFor="content" className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                Contenido *
              </label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                placeholder="Describe tu pregunta, comparte tu conocimiento o inicia una discusión..."
                value={formData.content}
                onChange={handleInputChange}
                rows={25}
                style={{
                  background: '#1a1b1e',
                  border: '2px solid #3a3b3f',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '12px 16px',
                  fontSize: '16px',
                  resize: 'none',
                  minHeight: '300px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D0FF71'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f'
                }}
                required
              />
              <div className="form-text" style={{ color: '#a0a0a0', fontSize: '12px' }}>
                Mínimo 10 caracteres. Puedes usar Markdown para formatear tu texto.
              </div>
            </div>

            {/* Multimedia */}
            <div className="mb-4">
              <label className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                📎 Archivos Multimedia (Opcional)
              </label>
              <div style={{
                background: '#1a1b1e',
                border: '2px dashed #3a3b3f',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                transition: 'border-color 0.3s ease'
              }}>
                <input
                  type="file"
                  id="multimedia"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files)
                    }
                  }}
                  style={{ display: 'none' }}
                  disabled={isUploading || uploadedFiles.length >= 3}
                />
                <label
                  htmlFor="multimedia"
                  style={{
                    cursor: isUploading || uploadedFiles.length >= 3 ? 'not-allowed' : 'pointer',
                    display: 'block',
                    color: isUploading || uploadedFiles.length >= 3 ? '#666' : '#a0a0a0'
                  }}
                >
                  {isUploading ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Subiendo...</span>
                      </div>
                      Subiendo archivos...
                    </>
                  ) : uploadedFiles.length >= 3 ? (
                    'Máximo 3 archivos alcanzado'
                  ) : (
                    <>
                      📁 Arrastra archivos aquí o haz clic para seleccionar
                      <br />
                      <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                        Imágenes, videos cortos (max 50MB), PDFs, documentos (max 10MB)
                      </small>
                    </>
                  )}
                </label>
              </div>

              {/* Lista de archivos subidos */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <h6 style={{ color: '#ffffff', fontSize: '14px', marginBottom: '12px' }}>
                    Archivos subidos ({uploadedFiles.length}/3):
                  </h6>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(208, 255, 113, 0.1)',
                          border: '1px solid rgba(208, 255, 113, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px'
                        }}
                      >
                        <span style={{ color: '#D0FF71' }}>
                          {file.type === 'image' ? '🖼️' : file.type === 'video' ? '🎥' : '📄'}
                        </span>
                        <span style={{ color: '#ffffff' }}>{file.originalName}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '16px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger mb-4" role="alert" style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                color: '#dc3545',
                borderRadius: '8px',
                padding: '12px 16px'
              }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="d-flex gap-3 justify-content-end">
              <button
                type="button"
                className="btn"
                onClick={() => router.back()}
                style={{
                  background: 'rgba(58, 59, 63, 0.5)',
                  color: '#ffffff',
                  border: '1px solid #3a3b3f',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(58, 59, 63, 0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(58, 59, 63, 0.5)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn"
                disabled={isLoading || isUploading}
                style={{
                  background: isLoading || isUploading
                    ? 'rgba(208, 255, 113, 0.5)' 
                    : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                  color: '#1a1b1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  cursor: isLoading || isUploading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && !isUploading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(208, 255, 113, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && !isUploading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Subiendo archivos...
                  </>
                ) : (
                  '🚀 Crear Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}