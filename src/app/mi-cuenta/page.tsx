'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Select from 'react-select'
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

  return (
    <>
      <Header />
      <main>
        <section className="tp-login-area pt-180 pb-140 p-relative z-index-1 fix">
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-10">
                <div className="tp-login-wrapper">
                  <div className="tp-login-top mb-30 d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="tp-login-title">Mi Cuenta</h3>
                      {user?.isSubscribed ? (
                        <p className="mt-10">Miembro del Club</p>
                      ) : (
                        <p className="mt-10">Usuario sin suscripción — <a href="/club">Unite al Club</a></p>
                      )}
                    </div>
                    <div>
                      <button onClick={handleLogout} className="tp-btn-black btn-green-light-bg" style={{ backgroundColor: '#c2185b', borderColor: '#a8124b' }}>
                        <span className="tp-btn-black-text">Cerrar sesión</span>
                      </button>
                    </div>
                  </div>

                  <ul className="nav nav-tabs mb-20">
                    <li className="nav-item">
                      <button
                        className={`nav-link${activeTab === 'general' ? ' active' : ''}`}
                        onClick={() => setActiveTab('general')}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'general'}
                      >
                        General
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link${activeTab === 'ofertas' ? ' active' : ''}`}
                        onClick={() => setActiveTab('ofertas')}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'ofertas'}
                      >
                        Ofertas Laborales
                      </button>
                    </li>
                  </ul>

                  {activeTab === 'general' && (
                    <div className="mt-20">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input className="form-control" defaultValue={user?.name ?? ''} disabled />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input className="form-control" defaultValue={user?.email ?? ''} disabled />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Usuario</label>
                          <input className="form-control" defaultValue={user?.username ?? ''} disabled />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">LID (WhatsApp)</label>
                          <input className="form-control" defaultValue={(user as any)?.lid ?? ''} disabled />
                        </div>
                      </div>

                      <div className="mt-30">
                        <h5>Cambiar contraseña</h5>
                        <p className="text-muted">Próximamente aquí podrás cambiar tu contraseña.</p>
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
  const [receive, setReceive] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [seniority, setSeniority] = useState<string>('')
  const [provinces, setProvinces] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [phone, setPhone] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const allTechs = useMemo(
    () => [
      'JavaScript','TypeScript','Node','React','Next.js','Vue','Angular','Svelte','Nuxt','Remix',
      'Java','Spring','Kotlin','Quarkus','Micronaut',
      'Python','Django','Flask','FastAPI',
      'Go','Rust','C#','ASP.NET Core','PHP','Laravel','Symfony','Ruby','Rails',
      'SQL','PostgreSQL','MySQL','MongoDB','Redis','Elasticsearch',
      'Docker','Kubernetes','CI/CD','GitHub Actions','GitLab CI',
      'AWS','GCP','Azure','Terraform','Ansible',
      'GraphQL','gRPC','WebSockets','Kafka','RabbitMQ',
      'TailwindCSS','CSS','Sass','Styled Components',
      'Fullstack','UI/UX','Data Science','Arquitecto','Service Desk','DevOps','SRE','QA','Mobile','iOS','Android'
    ],
    []
  )

  const filteredTechs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allTechs
    return allTechs.filter(t => t.toLowerCase().includes(q))
  }, [query, allTechs])

  const toggleTech = (t: string) => {
    setTechnologies(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]))
  }

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
  const isPhoneValid = formatOk(phone)

  const save = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    if (!token) {
      setErrorMsg('Sesión inválida. Iniciá sesión nuevamente.')
      return
    }
    if (receive && !formatOk(phone)) {
      setErrorMsg('Ingresá tu WhatsApp con el formato +54 9 3764 68-6662')
      return
    }
    if (technologies.length === 0) {
      setErrorMsg('Seleccioná al menos una tecnología')
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
          phoneFormatted: receive ? phone : undefined,
          technologies,
          seniority,
          provinces,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data?.error || 'No se pudo guardar')
        return
      }
      setSuccessMsg('Preferencias guardadas')
    } catch (e) {
      setErrorMsg('Error de red al guardar')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="p-20">
      <div className="mb-20">
        <label className="form-label">Tu número de WhatsApp</label>
        <PhoneInput
          defaultCountry="ar"
          value={phone}
          onChange={(val) => setPhone(val)}
          inputProps={{ className: 'form-control' }}
          placeholder="Ingresa tu número (ej. +54 9 3764 68-6662)"
        />
        <small className="text-muted">Incluí el código de país. Ej: +1, +34, +54, etc.</small>
        {!isPhoneValid && phone && (
          <div className="text-danger mt-5" role="alert">Número inválido. Revisá el código de país y formato.</div>
        )}
      </div>

      <div className="form-check form-switch mb-20">
        <input
          className="form-check-input"
          type="checkbox"
          checked={receive}
          onChange={e => {
            const next = e.target.checked
            if (next && !isPhoneValid) {
              setErrorMsg('Ingresá tu WhatsApp con el formato +54 9 3764 68-6662 para activar')
              return
            }
            setReceive(next)
          }}
          id="switch-notif"
          style={{ transform: 'scale(1.4)', transformOrigin: 'left center', marginRight: 10 }}
          disabled={!isPhoneValid && !receive}
          aria-disabled={!isPhoneValid && !receive}
          title={!isPhoneValid && !receive ? 'Completá tu WhatsApp con el formato correcto para activar' : undefined}
        />
        <label className="form-check-label" htmlFor="switch-notif">
          Recibir notificaciones de ofertas laborales
        </label>
        <p className="text-muted mt-5">Para recibirlas debés estar en el grupo de WhatsApp de Ofertas Laborales.</p>
      </div>

      <div className="mb-20">
        <label className="form-label">Tecnologías</label>
        {technologies.length > 0 && (
          <div className="mb-10 d-flex flex-wrap gap-2">
            {technologies.map(t => (
              <span key={t} className="badge rounded-pill text-bg-dark d-flex align-items-center gap-2">
                {t}
                <button type="button" className="btn btn-sm btn-link p-0 text-white" onClick={() => setTechnologies(prev => prev.filter(x => x !== t))} aria-label={`Quitar ${t}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <Select
          isMulti
          classNamePrefix="select"
          placeholder="Buscar y seleccionar..."
          options={allTechs.map(t => ({ value: t, label: t }))}
          value={technologies.map(t => ({ value: t, label: t }))}
          onChange={(vals) => setTechnologies(vals.map(v => v.value))}
        />
      </div>

      <div className="mb-20">
        <label className="form-label">Seniority</label>
        <select className="form-select" value={seniority} onChange={e => setSeniority(e.target.value)}>
          <option value="">Seleccionar...</option>
          <option value="JUNIOR">Junior</option>
          <option value="SEMI_SENIOR">Semi Senior</option>
          <option value="SENIOR">Senior</option>
          <option value="LEAD">Lead</option>
        </select>
      </div>

      <div className="mb-20">
        <label className="form-label">Provincias (incluye CABA)</label>
        <div className="d-flex flex-wrap gap-2">
          {provincias.map(p => {
            const selected = provinces.includes(p)
            return (
              <span
                key={p}
                role="button"
                onClick={() => setProvinces(prev => (selected ? prev.filter(x => x !== p) : [...prev, p]))}
                className={`badge rounded-pill ${selected ? 'text-bg-dark' : 'bg-secondary-subtle text-dark'}`}
                style={{ cursor: 'pointer' }}
              >
                {p}
              </span>
            )
          })}
        </div>
      </div>

      {errorMsg && <div className="alert alert-danger mt-10">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success mt-10">{successMsg}</div>}
      <button onClick={save} className="btn btn-success" disabled={isSyncing || technologies.length === 0}>
        <span>{isSyncing ? 'Guardando...' : 'Guardar'}</span>
      </button>
    </div>
  )
}
