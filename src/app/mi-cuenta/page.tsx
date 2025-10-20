'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'

export default function MiCuentaPage() {
  const { isAuthenticated, isLoading, user, logout, token } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'general' | 'ofertas'>('general')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/ingresar?redirect=/mi-cuenta')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Calcular meses de suscripción desde createdAt
  const getSubscriptionMonths = () => {
    if (!user?.createdAt) {
      return 0
    }
    
    const createdDate = new Date(user.createdAt)
    const now = new Date()
    
    const yearsDiff = now.getFullYear() - createdDate.getFullYear()
    const monthsDiff = now.getMonth() - createdDate.getMonth()
    const totalMonths = yearsDiff * 12 + monthsDiff
    
    // Si fue creado este mes, cuenta como 1 mes
    const months = totalMonths === 0 ? 1 : totalMonths
    
    return Math.max(1, months) // Mínimo 1 mes
  }

  const subscriptionMonths = getSubscriptionMonths()

  return (
    <>
      <Header />
      <main style={{ background: '#0a0b0d', minHeight: '100vh' }}>
        <section className="tp-login-area pt-120 pb-140 p-relative z-index-1 fix" style={{ background: 'transparent' }}>
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-10">
                <div className="tp-login-wrapper" style={{ background: 'transparent', boxShadow: 'none' }}>
                  <div className="tp-login-top mb-30 d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="tp-login-title" style={{ color: '#ffffff' }}>Mi Cuenta</h3>
                      {user?.isSubscribed ? (
                        <p className="mt-10" style={{ color: '#D0FF71' }}>
                          ✨ Miembro del Club · {subscriptionMonths} {subscriptionMonths === 1 ? 'mes' : 'meses'}
                        </p>
                      ) : (
                        <p className="mt-10" style={{ color: '#a0a0a0' }}>
                          Usuario sin suscripción — <a href="/club" style={{ color: '#D0FF71', textDecoration: 'underline' }}>Unite al Club</a>
                        </p>
                      )}
                    </div>
                    <div>
                      <button 
                        onClick={handleLogout} 
                        style={{
                          background: 'linear-gradient(135deg, #c2185b 0%, #a8124b 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                      Cerrar sesión
                      </button>
                    </div>
                  </div>

                  <div className="mb-4" style={{ 
                    display: 'flex', 
                    gap: '12px',
                    borderBottom: '2px solid #3a3b3f',
                    paddingBottom: '0'
                  }}>
                      <button
                        onClick={() => setActiveTab('general')}
                        type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'general' ? '2px solid #D0FF71' : '2px solid transparent',
                        color: activeTab === 'general' ? '#D0FF71' : '#a0a0a0',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '-2px'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'general') {
                          e.currentTarget.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'general') {
                          e.currentTarget.style.color = '#a0a0a0';
                        }
                      }}
                    >
                      👤 General
                      </button>
                      <button
                        onClick={() => setActiveTab('ofertas')}
                        type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'ofertas' ? '2px solid #D0FF71' : '2px solid transparent',
                        color: activeTab === 'ofertas' ? '#D0FF71' : '#a0a0a0',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '-2px'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'ofertas') {
                          e.currentTarget.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'ofertas') {
                          e.currentTarget.style.color = '#a0a0a0';
                        }
                      }}
                    >
                      💼 Ofertas Laborales
                      </button>
                  </div>

                  {activeTab === 'general' && (
                    <div className="mt-20">
                      {/* Información personal */}
                      <div className="card mb-4" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4" style={{ color: '#D0FF71' }}>
                            📋 Información Personal
                          </h5>
                          <div className="row g-4">
                        <div className="col-md-6">
                              <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '8px' }}>
                                Nombre completo
                              </label>
                              <input 
                                className="form-control" 
                                defaultValue={user?.name ?? ''} 
                                disabled 
                                style={{
                                  background: '#2d2e32',
                                  border: '1px solid #3a3b3f',
                                  color: '#ffffff',
                                  padding: '12px'
                                }}
                              />
                        </div>
                        <div className="col-md-6">
                              <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '8px' }}>
                                Nombre de usuario
                              </label>
                              <input 
                                className="form-control" 
                                defaultValue={user?.username ?? ''} 
                                disabled 
                                style={{
                                  background: '#2d2e32',
                                  border: '1px solid #3a3b3f',
                                  color: '#ffffff',
                                  padding: '12px'
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '8px' }}>
                                Email
                              </label>
                              <input 
                                className="form-control" 
                                defaultValue={user?.email ?? ''} 
                                disabled 
                                style={{
                                  background: '#2d2e32',
                                  border: '1px solid #3a3b3f',
                                  color: '#ffffff',
                                  padding: '12px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Suscripción */}
                      <div className="card mb-4" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-3" style={{ color: '#D0FF71' }}>
                            ✨ Estado de Suscripción
                          </h5>
                          {user?.isSubscribed ? (
                            <div style={{ 
                              background: 'linear-gradient(135deg, rgba(208, 255, 113, 0.1) 0%, rgba(168, 214, 90, 0.1) 100%)',
                              border: '1px solid rgba(208, 255, 113, 0.3)',
                              borderRadius: '8px',
                              padding: '16px'
                            }}>
                              <div className="d-flex align-items-center gap-2">
                                <span style={{ fontSize: '24px' }}>🎉</span>
                                <div>
                                  <p className="mb-1" style={{ color: '#D0FF71', fontWeight: '600', fontSize: '16px' }}>
                                    Miembro activo del Club
                                  </p>
                                  <p className="mb-0" style={{ color: '#a0a0a0', fontSize: '13px' }}>
                                    {subscriptionMonths} {subscriptionMonths === 1 ? 'mes' : 'meses'} suscrito · Acceso completo a todos los beneficios
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ 
                              background: 'rgba(255, 165, 0, 0.1)',
                              border: '1px solid rgba(255, 165, 0, 0.3)',
                              borderRadius: '8px',
                              padding: '16px'
                            }}>
                              <p className="mb-2" style={{ color: '#FFA500', fontWeight: '600' }}>
                                Sin suscripción activa
                              </p>
                              <p className="mb-3" style={{ color: '#a0a0a0', fontSize: '13px' }}>
                                Únete al Club para acceder a la biblioteca, ofertas laborales y más
                              </p>
                              <a href="/club" className="tp-btn-black btn-green-light-bg">
                                <span className="tp-btn-black-text">Ver planes</span>
                              </a>
                        </div>
                          )}
                        </div>
                      </div>

                      {/* Seguridad */}
                      <div className="card" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-3" style={{ color: '#D0FF71' }}>
                            🔒 Seguridad
                          </h5>
                          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                            Próximamente podrás cambiar tu contraseña y configurar la autenticación de dos factores.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ofertas' && (
                    <div className="mt-20">
                      {user?.isSubscribed ? (
                        <OfertasLaboralesForm token={token} />
                      ) : (
                        <PreviewOfertasLaborales />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function PreviewOfertasLaborales() {
  return (
    <div className="p-20">
      <p className="mb-15">
        Activá notificaciones de ofertas laborales y filtrá por tecnologías, seniority y provincia.
      </p>
      <ul className="mb-15">
        <li>Switch de notificaciones (requiere estar en el grupo de WhatsApp de Ofertas Laborales)</li>
        <li>Selector y buscador de tecnologías (JavaScript, TypeScript, Node, Java, Spring, etc.)</li>
        <li>Filtros por seniority y provincia (incluye CABA)</li>
      </ul>
      <a href="/club" className="tp-btn-black btn-green-light-bg">
        <span className="tp-btn-black-text">Suscribirme para acceder</span>
      </a>
    </div>
  )
}

function OfertasLaboralesForm({ token }: { token: string | null }) {
  const { user } = useAuth()
  const [receive, setReceive] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [seniority, setSeniority] = useState<string>('')
  const [provinces, setProvinces] = useState<string[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  // Modal para enlazar WhatsApp
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [modalPhone, setModalPhone] = useState('')
  const [isLinking, setIsLinking] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  const techsByCategory = useMemo(
    () => ({
      'Frontend': [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 
        'Svelte', 'Nuxt', 'Remix', 'HTML', 'CSS', 'TailwindCSS', 
        'Sass', 'Styled Components', 'Material-UI', 'Bootstrap'
      ],
      'Backend': [
        'Node.js', 'Express', 'NestJS', 'Java', 'Spring', 'Spring Boot',
        'Kotlin', 'Quarkus', 'Micronaut', 'Python', 'Django', 'Flask', 
        'FastAPI', 'Go', 'Gin', 'Fiber', 'Rust', 'C#', 'ASP.NET Core', 
        '.NET', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Rails'
      ],
      'Bases de Datos': [
        'SQL', 'PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Redis', 
        'Elasticsearch', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra',
        'Neo4j', 'Firebase', 'Supabase'
      ],
      'DevOps & Cloud': [
        'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GitLab CI',
        'Jenkins', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 
        'CloudFormation', 'Pulumi', 'Nginx', 'Apache', 'Linux'
      ],
      'Mobile': [
        'React Native', 'Flutter', 'Swift', 'iOS', 'Kotlin', 'Android',
        'Xamarin', 'Ionic', 'Cordova'
      ],
      'Data & AI': [
        'Python', 'Data Science', 'Machine Learning', 'AI', 'TensorFlow',
        'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'Power BI', 'Tableau',
        'Apache Spark', 'Hadoop', 'Airflow'
      ],
      'Testing': [
        'Jest', 'Cypress', 'Selenium', 'Playwright', 'JUnit', 'PyTest',
        'Postman', 'k6', 'JMeter'
      ],
      'Otros': [
        'GraphQL', 'REST API', 'gRPC', 'WebSockets', 'Kafka', 'RabbitMQ',
        'Microservicios', 'Git', 'Agile', 'Scrum'
      ],
      'Roles': [
        'Fullstack', 'Frontend', 'Backend', 'DevOps', 'SRE', 'QA', 
        'QA Manual', 'QA Automation', 'Arquitecto', 'Tech Lead', 
        'Engineering Manager', 'Product Manager', 'Scrum Master',
        'UI/UX Designer', 'Data Engineer', 'Data Analyst', 'Data Scientist',
        'ML Engineer', 'Mobile Developer', 'Security Engineer', 
        'Service Desk', 'Soporte Técnico', 'Help Desk'
      ]
    }),
    []
  )
  
  const [activeCategory, setActiveCategory] = useState<string>('Todos')

  const provincias = [
    'CABA','Buenos Aires','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán'
  ]

  useEffect(() => {
    // Cargar preferencias existentes
    const load = async () => {
      if (!token) return
      try {
        const res = await fetch('/api/me/job-preferences', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setReceive(!!data.receiveJobNotifications)
          setTechnologies(data.technologies || [])
          setSeniority(data.seniority || '')
          setProvinces(data.provinces || [])
        }
      } catch {}
    }
    load()
  }, [token])

  const formatOk = (value: string) => {
    // Validación internacional (E.164) usando libphonenumber-js
    try { return isValidPhoneNumber(value) } catch { return false }
  }

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      // Si intenta activar notificaciones, verificar si tiene LID
      if (!(user as any)?.lid) {
        // Abrir modal para enlazar WhatsApp
        setShowLinkModal(true)
        setModalPhone('')
        setModalError(null)
        setModalSuccess(null)
      } else {
        // Ya tiene LID, activar notificaciones automáticamente
        setReceive(true)
        await saveNotificationState(true)
      }
    } else {
      // Desactivar notificaciones automáticamente
      setReceive(false)
      await saveNotificationState(false)
    }
  }

  const saveNotificationState = async (receiveNotifications: boolean) => {
    if (!token) return

    try {
      setIsSyncing(true)
      const res = await fetch('/api/me/job-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receive: receiveNotifications,
          technologies,
          seniority: seniority || null,
          provinces,
        }),
      })
      
      if (!res.ok) {
        setErrorMsg('No se pudo actualizar el estado de notificaciones')
        return
      }
      
      // Si desactivó las notificaciones, recargar para mostrar que se desenlazó WhatsApp
      if (!receiveNotifications) {
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (e) {
      setErrorMsg('Error de red al actualizar notificaciones')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLinkWhatsApp = async () => {
    setModalError(null)
    setModalSuccess(null)

    if (!token) {
      setModalError('Sesión inválida. Iniciá sesión nuevamente.')
      return
    }

    if (!formatOk(modalPhone)) {
      setModalError('Ingresá tu WhatsApp con el formato +54 9 3764 68-6662')
      return
    }

    try {
      setIsLinking(true)
      
      // 1. Enlazar WhatsApp
      const resLink = await fetch('/api/me/link-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneFormatted: modalPhone,
        }),
      })
      const dataLink = await resLink.json()
      
      if (!resLink.ok) {
        setModalError(dataLink?.error || 'No se pudo enlazar WhatsApp')
        return
      }
      
      // 2. Activar notificaciones automáticamente
      const resPref = await fetch('/api/me/job-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receive: true,
          technologies,
          seniority: seniority || null,
          provinces,
        }),
      })
      
      if (!resPref.ok) {
        setModalError('WhatsApp enlazado pero no se pudieron activar las notificaciones. Intentá guardar manualmente.')
        return
      }
      
      // Éxito: mostrar mensaje
      setModalSuccess('✅ WhatsApp enlazado y notificaciones activadas')
      
      // Esperar 1.5 segundos para que el usuario vea el mensaje y recargar
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (e) {
      setModalError('Error de red al enlazar WhatsApp')
    } finally {
      setIsLinking(false)
    }
  }

  const save = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    if (!token) {
      setErrorMsg('Sesión inválida. Iniciá sesión nuevamente.')
      return
    }
    if (receive && technologies.length === 0) {
      setErrorMsg('Seleccioná al menos una tecnología para recibir notificaciones')
      return
    }
    
    try {
      setIsSyncing(true)
      const res = await fetch('/api/me/job-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receive,
          technologies,
          seniority: seniority || null,
          provinces,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data?.error || 'No se pudo guardar')
        return
      }
      setSuccessMsg('✅ Preferencias guardadas correctamente')
    } catch (e) {
      setErrorMsg('Error de red al guardar')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div style={{ background: '#1a1b1e', border: '1px solid #3a3b3f', borderRadius: '12px', padding: '24px' }}>
      <h5 className="mb-4" style={{ color: '#D0FF71' }}>
        Configuración de Ofertas Laborales
      </h5>
      
      {/* LID (WhatsApp) - Solo mostrar si tiene LID */}
      {(user as any)?.lid && (
        <div className="mb-4" style={{ 
          background: 'rgba(208, 255, 113, 0.05)', 
          border: '1px solid rgba(208, 255, 113, 0.2)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <label className="form-label" style={{ color: '#D0FF71', fontSize: '14px', fontWeight: '600' }}>
            ✅ WhatsApp Enlazado
          </label>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
            Tu número de WhatsApp está enlazado correctamente.
          </p>
        </div>
      )}

      <div className="mb-4" style={{
        background: '#2d2e32',
        border: '1px solid #3a3b3f',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={receive}
          onChange={e => handleToggleNotifications(e.target.checked)}
          id="switch-notif"
            style={{ 
              width: '48px',
              height: '24px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          />
          <label className="form-check-label ms-2" htmlFor="switch-notif" style={{ cursor: 'pointer', color: '#ffffff', fontWeight: '600' }}>
            🔔 Recibir notificaciones de ofertas laborales
          </label>
        </div>
        
        <p className="text-muted mt-2 mb-0" style={{ fontSize: '13px', paddingLeft: '58px' }}>
          {(user as any)?.lid 
            ? 'Necesitás estar en el grupo de WhatsApp de Ofertas Laborales' 
            : 'Primero enlazá tu WhatsApp para recibir notificaciones'}
        </p>
      </div>

      <div className="mb-4">
        <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '12px' }}>
          💻 Tecnologías y Roles {technologies.length > 0 && (
            <span style={{ color: '#D0FF71', marginLeft: '8px' }}>
              ({technologies.length} seleccionada{technologies.length !== 1 ? 's' : ''})
            </span>
          )}
        </label>
        
        {/* Filtros por categoría */}
        <div className="mb-3 d-flex flex-wrap gap-2" style={{ 
          paddingBottom: '12px',
          borderBottom: '1px solid #3a3b3f'
        }}>
          <button
            onClick={() => setActiveCategory('Todos')}
            style={{
              background: activeCategory === 'Todos' 
                ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                : '#2d2e32',
              color: activeCategory === 'Todos' ? '#1a1b1e' : '#ffffff',
              border: '1px solid ' + (activeCategory === 'Todos' ? '#D0FF71' : '#3a3b3f'),
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ✨ Todos {technologies.length > 0 && `(${technologies.length})`}
          </button>
          {Object.keys(techsByCategory).map(category => {
            const categoryTechs = techsByCategory[category as keyof typeof techsByCategory] || []
            const selectedCount = categoryTechs.filter(t => technologies.includes(t)).length
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  background: activeCategory === category 
                    ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                    : '#2d2e32',
                  color: activeCategory === category ? '#1a1b1e' : '#ffffff',
                  border: '1px solid ' + (activeCategory === category ? '#D0FF71' : '#3a3b3f'),
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {category} {selectedCount > 0 && `(${selectedCount})`}
              </button>
            )
          })}
      </div>

        {/* Tecnologías filtradas */}
        <div className="d-flex flex-wrap gap-2">
          {(activeCategory === 'Todos' 
            ? Array.from(new Set(Object.values(techsByCategory).flat())) // Eliminar duplicados
            : techsByCategory[activeCategory as keyof typeof techsByCategory] || []
          ).map((t, idx) => {
            const selected = technologies.includes(t)
            return (
              <span
                key={`${activeCategory}-${t}-${idx}`}
                role="button"
                onClick={() => setTechnologies(prev => (selected ? prev.filter(x => x !== t) : [...prev, t]))}
                style={{
                  background: selected 
                    ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                    : '#3a3b3f',
                  color: selected ? '#1a1b1e' : '#a0a0a0',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = '#4a4b4f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = '#3a3b3f';
                  }
                }}
              >
                {t}
              </span>
            )
          })}
          </div>
      </div>

      <div className="mb-4">
        <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '8px' }}>
          📊 Seniority (opcional)
        </label>
        <select 
          className="form-select" 
          value={seniority} 
          onChange={e => setSeniority(e.target.value)}
          style={{
            background: '#2d2e32',
            border: '1px solid #3a3b3f',
            color: '#ffffff',
            padding: '12px'
          }}
        >
          <option value="">Sin preferencia</option>
          <option value="JUNIOR">Junior</option>
          <option value="SEMI_SENIOR">Semi Senior</option>
          <option value="SENIOR">Senior</option>
          <option value="LEAD">Lead</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label" style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '12px' }}>
          📍 Provincias (opcional, si no agregas ninguna no tendrá filtros y tomará tambien remoto)
        </label>
        <div className="d-flex flex-wrap gap-2">
          {provincias.map(p => {
            const selected = provinces.includes(p)
            return (
              <span
                key={p}
                role="button"
                onClick={() => setProvinces(prev => (selected ? prev.filter(x => x !== p) : [...prev, p]))}
                style={{
                  background: selected 
                    ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                    : '#3a3b3f',
                  color: selected ? '#1a1b1e' : '#a0a0a0',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {p}
              </span>
            )
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" style={{ 
          marginTop: '16px',
          whiteSpace: 'pre-line',
          lineHeight: '1.6'
        }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success" style={{ 
          marginTop: '16px',
          whiteSpace: 'pre-line',
          lineHeight: '1.6'
        }}>
          {successMsg}
        </div>
      )}
      
      <button 
        onClick={save} 
        disabled={isSyncing}
        style={{
          background: isSyncing 
            ? '#6c757d' 
            : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
          color: '#1a1b1e',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 32px',
          fontSize: '15px',
          fontWeight: '700',
          cursor: isSyncing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          marginTop: '16px'
        }}
      >
        {isSyncing ? '⏳ Guardando...' : '💾 Guardar preferencias'}
      </button>

      {/* Modal para enlazar WhatsApp */}
      {showLinkModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => {
            if (!isLinking && !modalSuccess) {
              setShowLinkModal(false)
            }
          }}
        >
          <div 
            style={{
              background: '#1a1b1e',
              border: '2px solid #D0FF71',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: '#D0FF71', marginBottom: '16px', fontSize: '20px', fontWeight: '700' }}>
              📱 Enlazar WhatsApp
            </h4>
            
            <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
              Para recibir notificaciones de ofertas laborales, necesitamos enlazar tu número de WhatsApp con tu cuenta.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Número de WhatsApp
              </label>
              <style jsx>{`
                :global(.react-international-phone-input-container) {
                  display: flex !important;
                  align-items: center !important;
                  background: #2d2e32 !important;
                  border: 1px solid #3a3b3f !important;
                  border-radius: 4px !important;
                  padding: 0 !important;
                }
                :global(.react-international-phone-country-selector-button) {
                  background: #2d2e32 !important;
                  border: none !important;
                  border-right: 1px solid #3a3b3f !important;
                  padding: 12px 8px !important;
                  height: 100% !important;
                  display: flex !important;
                  align-items: center !important;
                }
                :global(.react-international-phone-country-selector-button__button-content) {
                  display: flex !important;
                  align-items: center !important;
                  gap: 4px !important;
                }
                :global(.react-international-phone-country-selector-button__flag-emoji) {
                  font-size: 20px !important;
                  line-height: 1 !important;
                }
                :global(.react-international-phone-input) {
                  background: #2d2e32 !important;
                  border: none !important;
                  color: #ffffff !important;
                  padding: 12px !important;
                  flex: 1 !important;
                }
                :global(.react-international-phone-input::placeholder) {
                  color: #6c757d !important;
                }
              `}</style>
              <PhoneInput
                defaultCountry="ar"
                value={modalPhone}
                onChange={(val) => setModalPhone(val)}
                placeholder="Ej: +54 9 3764 68-6662"
                disabled={isLinking || !!modalSuccess}
              />
              <small className="text-muted d-block mt-2" style={{ fontSize: '12px' }}>
                Incluí el código de país. Ej: +54, +1, +34, etc.
              </small>
            </div>

            {modalError && (
              <div 
                style={{ 
                  background: 'rgba(220, 53, 69, 0.1)',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#dc3545',
                  fontSize: '13px',
                  marginBottom: '16px',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6'
                }}
              >
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div 
                style={{ 
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px solid rgba(40, 167, 69, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#28a745',
                  fontSize: '13px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}
              >
                {modalSuccess}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLinkModal(false)}
                disabled={isLinking || !!modalSuccess}
                style={{
                  background: '#3a3b3f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (isLinking || modalSuccess) ? 'not-allowed' : 'pointer',
                  opacity: (isLinking || modalSuccess) ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLinkWhatsApp}
                disabled={isLinking || !!modalSuccess}
                style={{
                  background: isLinking || modalSuccess
                    ? '#6c757d' 
                    : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                  color: '#1a1b1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: (isLinking || modalSuccess) ? 'not-allowed' : 'pointer',
                }}
              >
                {isLinking ? '⏳ Enlazando...' : (modalSuccess ? '✅ Enlazado' : '🔗 Enlazar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
