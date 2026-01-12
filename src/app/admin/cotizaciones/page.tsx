'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { formatUsdRange, getProjectQuoteSummary, type ProjectQuoteAnswers } from '@/lib/projectQuote';

type Quote = {
  id: string;
  email: string;
  answers: unknown;
  estimateMinUsd: number;
  estimateMaxUsd: number;
  responded: boolean;
  respondedAt: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const placeholderStyles = `
  .admin-note::placeholder { color: #a0a0a0 !important; opacity: 1; }
`;

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'menos de un minuto';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'día' : 'días'}`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'año' : 'años'}`;
}

export default function AdminCotizacionesPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondedFilter, setRespondedFilter] = useState<string>(''); // '' | 'true' | 'false'
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 30, total: 0, totalPages: 0 });
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/ingresar?redirect=/admin/cotizaciones');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (token) loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pagination.page, respondedFilter]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (respondedFilter !== '') params.append('responded', respondedFilter);

      const res = await fetch(`/api/admin/project-quotes/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          router.push('/');
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Error al cargar cotizaciones');
      }

      const data = await res.json();
      setQuotes(data.quotes);
      setPagination(data.pagination);
      setDraftNotes((prev) => {
        const next = { ...prev };
        for (const q of data.quotes as Quote[]) {
          if (next[q.id] === undefined) next[q.id] = q.adminNote ?? '';
        }
        return next;
      });
    } catch (e) {
      console.error('Error al cargar cotizaciones:', e);
    } finally {
      setLoading(false);
    }
  };

  const fmtEstimate = (q: Quote) => formatUsdRange({ minUsd: q.estimateMinUsd, maxUsd: q.estimateMaxUsd });

  const stats = useMemo(() => {
    const responded = quotes.filter((q) => q.responded).length;
    const pending = quotes.filter((q) => !q.responded).length;
    return { responded, pending };
  }, [quotes]);

  const toggleResponded = async (id: string, next: boolean) => {
    if (saving.has(id)) return;
    try {
      setSaving((p) => new Set(p).add(id));
      const res = await fetch(`/api/admin/project-quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responded: next }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el estado');
      const data = await res.json();
      setQuotes((prev) => prev.map((q) => (q.id === id ? data.quote : q)));
    } catch (e) {
      console.error(e);
      alert('Error al actualizar el estado');
    } finally {
      setSaving((p) => {
        const n = new Set(p);
        n.delete(id);
        return n;
      });
    }
  };

  const saveNote = async (id: string) => {
    if (saving.has(id)) return;
    try {
      setSaving((p) => new Set(p).add(id));
      const res = await fetch(`/api/admin/project-quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNote: draftNotes[id] ?? '' }),
      });
      if (!res.ok) throw new Error('No se pudo guardar la nota');
      const data = await res.json();
      setQuotes((prev) => prev.map((q) => (q.id === id ? data.quote : q)));
    } catch (e) {
      console.error(e);
      alert('Error al guardar la nota');
    } finally {
      setSaving((p) => {
        const n = new Set(p);
        n.delete(id);
        return n;
      });
    }
  };

  if (isLoading || loading) {
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
    );
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
                <div className="mb-40">
                  <h2 style={{ color: '#D0FF71', marginBottom: '10px' }}>Cotizaciones de Proyectos</h2>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: 0 }}>
                    Últimas cotizaciones enviadas desde el cotizador público.
                  </p>
                </div>

                <div className="mb-30" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ color: '#a0a0a0', fontSize: '14px' }}>Filtro:</label>
                  <select
                    value={respondedFilter}
                    onChange={(e) => {
                      setRespondedFilter(e.target.value);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    style={{
                      background: '#1a1b1e',
                      border: '1px solid #3a3b3f',
                      color: '#ffffff',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      minWidth: '220px',
                    }}
                  >
                    <option value="">Todas</option>
                    <option value="false">No respondidas</option>
                    <option value="true">Respondidas</option>
                  </select>

                  <div
                    style={{
                      background: '#1a1b1e',
                      border: '1px solid #3a3b3f',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      gap: '18px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                      Total: <strong style={{ color: '#D0FF71' }}>{pagination.total}</strong>
                    </span>
                    <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                      Pendientes: <strong style={{ color: '#FFA500' }}>{stats.pending}</strong>
                    </span>
                    <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                      Respondidas: <strong style={{ color: '#4CAF50' }}>{stats.responded}</strong>
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#1a1b1e',
                    border: '1px solid #3a3b3f',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#2d2e32', borderBottom: '1px solid #3a3b3f' }}>
                          <th style={{ padding: '14px 16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Fecha
                          </th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Email
                          </th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Estimado
                          </th>
                          <th style={{ padding: '14px 16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Estado
                          </th>
                          <th style={{ padding: '14px 16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((q) => {
                          const isSaving = saving.has(q.id);
                          return (
                            <tr
                              key={q.id}
                              style={{ borderBottom: '1px solid #3a3b3f', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#2d2e32')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ color: '#ffffff', fontSize: '13px' }}>
                                  {new Date(q.createdAt).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </div>
                                <div style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>{getTimeAgo(q.createdAt)}</div>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>{q.email}</div>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ color: '#D0FF71', fontWeight: 700, fontSize: '14px' }}>{fmtEstimate(q)}</div>
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    background: q.responded ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                                    color: q.responded ? '#4CAF50' : '#FFA500',
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {q.responded ? 'Respondida' : 'Pendiente'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <button
                                  onClick={() => setSelectedQuote(q)}
                                  style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.4)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  Ver detalle
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {pagination.totalPages > 1 && (
                    <div
                      style={{
                        padding: '20px',
                        borderTop: '1px solid #3a3b3f',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                        disabled={pagination.page === 1}
                        style={{
                          background: pagination.page === 1 ? '#2d2e32' : '#3a3b3f',
                          color: pagination.page === 1 ? '#666' : '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ← Anterior
                      </button>
                      <span style={{ color: '#a0a0a0', padding: '8px 16px', fontSize: '13px' }}>
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        style={{
                          background: pagination.page === pagination.totalPages ? '#2d2e32' : '#3a3b3f',
                          color: pagination.page === pagination.totalPages ? '#666' : '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Sidebar de detalles */}
      {selectedQuote && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSelectedQuote(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 9998,
              animation: 'fadeIn 0.2s ease',
            }}
          />
          {/* Sidebar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '600px',
              height: '100vh',
              background: '#1a1b1e',
              borderLeft: '1px solid #3a3b3f',
              zIndex: 9999,
              overflowY: 'auto',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
              animation: 'slideInRight 0.3s ease',
            }}
          >
            <div style={{ padding: '24px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Detalle de cotización</h3>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {new Date(selectedQuote.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  style={{
                    background: '#3a3b3f',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '18px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#4a4b4f')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#3a3b3f')}
                >
                  ×
                </button>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '6px' }}>Email</div>
                <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600 }}>{selectedQuote.email}</div>
              </div>

              {/* Estimado */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '6px' }}>Estimado</div>
                <div style={{ color: '#D0FF71', fontSize: '18px', fontWeight: 700 }}>{fmtEstimate(selectedQuote)}</div>
              </div>

              {/* Estado */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>Estado</div>
                <label
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '26px',
                    cursor: saving.has(selectedQuote.id) ? 'not-allowed' : 'pointer',
                    opacity: saving.has(selectedQuote.id) ? 0.6 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedQuote.responded}
                    onChange={() => {
                      toggleResponded(selectedQuote.id, !selectedQuote.responded);
                      setSelectedQuote((prev) => (prev ? { ...prev, responded: !prev.responded } : null));
                    }}
                    disabled={saving.has(selectedQuote.id)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: selectedQuote.responded ? '#4CAF50' : '#3a3b3f',
                      borderRadius: '26px',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '20px',
                        width: '20px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        transition: 'transform 0.3s',
                        transform: selectedQuote.responded ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </span>
                </label>
                <span style={{ color: '#a0a0a0', fontSize: '13px', marginLeft: '12px' }}>
                  {selectedQuote.responded ? 'Respondida' : 'Pendiente'}
                </span>
              </div>

              {/* Respuestas */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '12px', fontWeight: 600 }}>Respuestas</div>
                <div style={{ background: '#0f1012', border: '1px solid #3a3b3f', borderRadius: '12px', padding: '16px' }}>
                  {(() => {
                    const answers = (selectedQuote.answers ?? {}) as ProjectQuoteAnswers;
                    const summary = getProjectQuoteSummary(answers);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {summary.map((s, idx) => (
                          <div key={idx} style={{ color: '#ffffff', fontSize: '13px', lineHeight: 1.5 }}>
                            {s}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Respuestas completas (JSON) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '12px', fontWeight: 600 }}>Datos completos</div>
                <pre
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    background: '#0f1012',
                    border: '1px solid #3a3b3f',
                    borderRadius: '12px',
                    padding: '16px',
                    overflowX: 'auto',
                    fontSize: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  {JSON.stringify(selectedQuote.answers, null, 2)}
                </pre>
              </div>

              {/* Nota administrativa */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>Nota interna</div>
                <textarea
                  className="admin-note"
                  value={draftNotes[selectedQuote.id] ?? selectedQuote.adminNote ?? ''}
                  onChange={(e) => setDraftNotes((p) => ({ ...p, [selectedQuote.id]: e.target.value }))}
                  rows={4}
                  style={{
                    width: '100%',
                    background: '#0f1012',
                    border: '1px solid #3a3b3f',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '13px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Notas internas (no visible al cliente)"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      saveNote(selectedQuote.id);
                    }}
                    disabled={saving.has(selectedQuote.id)}
                    style={{
                      background: saving.has(selectedQuote.id)
                        ? '#2d2e32'
                        : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                      color: saving.has(selectedQuote.id) ? '#666' : '#1a1b1e',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: saving.has(selectedQuote.id) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving.has(selectedQuote.id) ? 'Guardando…' : 'Guardar nota'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </>
  );
}

