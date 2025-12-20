'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import MobileHeader from '@/app/components/MobileHeader';
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
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
        <Header />
        <MobileHeader />
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
      <Header />
      <MobileHeader />
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
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Fecha
                          </th>
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Email
                          </th>
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Estimado
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Respondida
                          </th>
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Nota interna
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Detalle
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((q) => {
                          const isExpanded = expanded.has(q.id);
                          const isSaving = saving.has(q.id);
                          const answers = (q.answers ?? {}) as ProjectQuoteAnswers;
                          const summary = getProjectQuoteSummary(answers).slice(0, 6);

                          return (
                            <React.Fragment key={q.id}>
                              <tr
                                style={{ borderBottom: '1px solid #3a3b3f', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#2d2e32')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <td style={{ padding: '16px' }}>
                                  <div style={{ color: '#a0a0a0', fontSize: '12px' }}>
                                    {new Date(q.createdAt).toLocaleDateString('es-AR', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                  <div style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>Hace {getTimeAgo(q.createdAt)}</div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                  <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>{q.email}</div>
                                  <div style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>ID: {q.id.slice(0, 8)}…</div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                  <div style={{ color: '#D0FF71', fontWeight: 700, fontSize: '13px' }}>{fmtEstimate(q)}</div>
                                  {summary.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                      {summary.map((s) => (
                                        <span
                                          key={s}
                                          style={{
                                            background: '#2d2e32',
                                            border: '1px solid #3a3b3f',
                                            color: '#a0a0a0',
                                            borderRadius: '999px',
                                            padding: '4px 8px',
                                            fontSize: '11px',
                                          }}
                                        >
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <label
                                    style={{
                                      position: 'relative',
                                      display: 'inline-block',
                                      width: '50px',
                                      height: '26px',
                                      cursor: isSaving ? 'not-allowed' : 'pointer',
                                      opacity: isSaving ? 0.6 : 1,
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={q.responded}
                                      onChange={() => toggleResponded(q.id, !q.responded)}
                                      disabled={isSaving}
                                      style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: q.responded ? '#4CAF50' : '#3a3b3f',
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
                                          transform: q.responded ? 'translateX(24px)' : 'translateX(0)',
                                        }}
                                      />
                                    </span>
                                  </label>
                                  <div style={{ color: '#666', fontSize: '11px', marginTop: '6px' }}>
                                    {q.responded ? 'Respondida' : 'Pendiente'}
                                  </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                  <textarea
                                    className="admin-note"
                                    value={draftNotes[q.id] ?? ''}
                                    onChange={(e) => setDraftNotes((p) => ({ ...p, [q.id]: e.target.value }))}
                                    rows={2}
                                    style={{
                                      width: '100%',
                                      background: '#0f1012',
                                      border: '1px solid #3a3b3f',
                                      color: '#ffffff',
                                      borderRadius: '10px',
                                      padding: '10px 12px',
                                      fontSize: '12px',
                                      resize: 'vertical',
                                      minWidth: '280px',
                                    }}
                                    placeholder="Notas internas (no visible al cliente)"
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <button
                                      onClick={() => saveNote(q.id)}
                                      disabled={isSaving}
                                      style={{
                                        background: isSaving ? '#2d2e32' : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                                        color: isSaving ? '#666' : '#1a1b1e',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        cursor: isSaving ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      {isSaving ? 'Guardando…' : 'Guardar'}
                                    </button>
                                  </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <button
                                    onClick={() =>
                                      setExpanded((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(q.id)) next.delete(q.id);
                                        else next.add(q.id);
                                        return next;
                                      })
                                    }
                                    style={{
                                      background: '#3a3b3f',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '8px',
                                      padding: '8px 12px',
                                      fontSize: '12px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {isExpanded ? 'Ocultar' : 'Ver'}
                                  </button>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr style={{ borderBottom: '1px solid #3a3b3f' }}>
                                  <td colSpan={6} style={{ padding: '16px', background: '#0f1012' }}>
                                    <div style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '10px' }}>
                                      Detalle completo (respuestas)
                                    </div>
                                    <pre
                                      style={{
                                        margin: 0,
                                        color: '#ffffff',
                                        background: '#1a1b1e',
                                        border: '1px solid #3a3b3f',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        overflowX: 'auto',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {JSON.stringify(q.answers, null, 2)}
                                    </pre>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
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
    </>
  );
}

