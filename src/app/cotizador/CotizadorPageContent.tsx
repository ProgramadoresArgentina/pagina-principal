'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  PROJECT_QUOTE_QUESTIONS,
  calculateProjectQuoteUsd,
  formatUsdRange,
  getProjectQuoteSummary,
  type ProjectQuoteAnswers,
  type QuoteQuestion,
} from '@/lib/projectQuote';

const placeholderStyles = `
  .quote-email-input::placeholder { color: #a0a0a0 !important; opacity: 1; }
  .quote-email-input::-webkit-input-placeholder { color: #a0a0a0 !important; }
  .quote-email-input::-moz-placeholder { color: #a0a0a0 !important; opacity: 1; }
`;

const faqs = [
  {
    q: '¿Dónde se alojarían los servidores?',
    a: 'En Hostinger (o en el proveedor que prefieras). Te ayudamos con la configuración y el deploy.',
  },
  {
    q: '¿Incluye soporte?',
    a: 'Sí. Podemos armar un plan de soporte y mantenimiento según el tamaño del proyecto y tu operación.',
  },
  {
    q: '¿Por qué el precio puede ser menor al mercado?',
    a: 'Porque trabajamos junto a programadores en formación buscando su primera experiencia, siempre con supervisión y procesos. Además, al contratar, también los estás ayudando a crecer profesionalmente.',
  },
  {
    q: '¿Cuentan con diseñadores, marketing y SEO?',
    a: 'Sí, contamos con profesionales capacitados y con experiencia para diseño UI/UX, marketing y SEO.',
  },
  {
    q: '¿Cuánto demora un proyecto?',
    a: 'Depende del alcance. Como referencia: proyectos chicos 2–4 semanas, medianos 1–3 meses, grandes 3–6+ meses. Te confirmamos un estimado con la cotización final.',
  },
  {
    q: '¿Trabajan con IA y automatización de procesos?',
    a: 'Sí. Podemos integrar IA para automatización, asistentes, clasificación, extracción de datos y más.',
  },
  {
    q: '¿Experiencia?',
    a: 'Contamos con clientes en distintas partes del mundo: Uruguay, Estados Unidos, Canadá, México y Argentina.',
  },
  {
    q: '¿Cuentan con software prearmado para agilizar tiempos y reducir costos?',
    a: 'Contamos con sistemas prearmados. Consultanos y vemos si encaja con tu necesidad.',
  },
  {
    q: '¿Cómo es el proceso?',
    a: 'Primero hacemos una reunión para entender tu idea. Luego presentamos un documento con cotización + tiempos + equipo. Empezamos a trabajar y mostramos demos cada 2 semanas para recibir feedback.',
  },
  {
    q: '¿Medios de pago?',
    a: 'Criptomoneda y tarjeta de débito/crédito (USD o ARS).',
  },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: QuoteQuestion;
  value: string | string[] | undefined;
  onChange: (next: string | string[]) => void;
}) {
  const selectedSingle = typeof value === 'string' ? value : '';
  const selectedMulti = Array.isArray(value) ? value : [];

  return (
    <div
      style={{
        background: '#1a1b1e',
        border: '1px solid #3a3b3f',
        borderRadius: '12px',
        padding: '18px',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '6px' }}>{question.title}</h3>
        {question.subtitle && <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: 0 }}>{question.subtitle}</p>}
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {question.options.map((opt) => {
          const isSelected = question.type === 'single' ? selectedSingle === opt.id : selectedMulti.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if (question.type === 'single') {
                  onChange(opt.id);
                  return;
                }
                const next = new Set(selectedMulti);
                if (next.has(opt.id)) next.delete(opt.id);
                else next.add(opt.id);
                onChange(Array.from(next));
              }}
              style={{
                textAlign: 'left',
                width: '100%',
                background: isSelected ? 'rgba(208, 255, 113, 0.12)' : '#2d2e32',
                border: isSelected ? '1px solid #D0FF71' : '1px solid #3a3b3f',
                color: '#ffffff',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.3 }}>
                    {question.type === 'multi' ? (isSelected ? '✓ ' : '▢ ') : isSelected ? '● ' : '○ '}
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '4px' }}>{opt.description}</div>
                  )}
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '12px', whiteSpace: 'nowrap', paddingTop: '2px' }}>
                  {formatUsdRange(opt.price)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CotizadorPageContent() {
  const wizardRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(0); // 0..questions.length, último = resumen/email
  const [answers, setAnswers] = useState<ProjectQuoteAnswers>({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(() => calculateProjectQuoteUsd(answers), [answers]);
  const questions = PROJECT_QUOTE_QUESTIONS;
  const isReviewStep = step >= questions.length;
  const currentQuestion = !isReviewStep ? questions[step] : null;

  const canGoNext = useMemo(() => {
    if (isReviewStep) return false;
    if (!currentQuestion) return false;
    const v = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') return typeof v === 'string' && v.length > 0;
    // multi: permitido vacío si allowEmpty, si no, requiere al menos 1
    if (currentQuestion.allowEmpty) return true;
    return Array.isArray(v) && v.length > 0;
  }, [answers, currentQuestion, isReviewStep]);

  const summary = useMemo(() => getProjectQuoteSummary(answers), [answers]);

  const handleSubmit = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Ingresá un email válido para que podamos contactarte.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/project-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'No pudimos enviar la solicitud.');
      }

      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: placeholderStyles }} />

      {/* Hero */}
      <div className="it-about-area it-about-ptb pt-200 pb-90 p-relative">
        <div className="it-about-shape-wrap">
          <img data-speed="1.1" className="it-about-shape-1 d-none d-xxl-block" src="/assets/img/home-11/about/about-shape-1.png" alt="" />
          <img data-speed=".9" className="it-about-shape-2" src="/assets/img/home-11/about/about-shape-2.png" alt="" />
        </div>

        <div className="container container-1230">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="it-about-left">
                <span className="tp-section-subtitle border-bg bg-color">Cotizador</span>
                <h1 className="tp-section-title-platform platform-text-black fs-84 tp-split-text tp-split-right mb-20">
                  Cotizá tu proyecto <br /> en minutos
                </h1>
                <p style={{ color: '#a0a0a0', fontSize: '15px', maxWidth: '52ch' }}>
                  Respondé unas preguntas y obtené un estimado orientativo. Al final, dejá tu email y te contactamos en las próximas <strong style={{ color: '#D0FF71' }}>24–48 hs</strong>.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                  <button
                    type="button"
                    className="tp-btn-black btn-green-light-bg"
                    onClick={() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  >
                    Empezar cotización
                  </button>
                  <div
                    style={{
                      background: '#1a1b1e',
                      border: '1px solid #3a3b3f',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#a0a0a0',
                      fontSize: '13px',
                    }}
                  >
                    Estimado actual: <strong style={{ color: '#ffffff' }}>{formatUsdRange(estimate)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%)',
                  border: '1px solid rgba(208, 255, 113, 0.35)',
                  borderRadius: '14px',
                  padding: '18px',
                }}
              >
                <h3 style={{ color: '#D0FF71', fontSize: '16px', marginBottom: '8px' }}>Qué incluye este estimado</h3>
                <ul style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: 0, paddingLeft: '18px' }}>
                  <li>Alcance aproximado según tus respuestas</li>
                  <li>Rango de costo (mín–máx) por complejidad</li>
                  <li>Revisión final en reunión (sin compromiso)</li>
                </ul>
                <div style={{ marginTop: '12px', color: '#666', fontSize: '12px' }}>
                  Nota: es orientativo. La cotización final puede variar según detalles, integraciones y plazos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ (mismo estilo que /club) */}
      <div className="app-faq-area p-relative pb-120">
        <div className="it-faq-shape-1">
          <img data-speed=".9" src="/assets/img/home-11/faq/faq-1.png" alt="" />
        </div>
        <div className="container container-1230">
          <div className="row">
            <div className="col-lg-4">
              <div className="app-faq-heading p-relative mb-40">
                <span className="tp-section-subtitle border-bg bg-color">FAQ</span>
                <h3 className="tp-section-title-platform platform-text-black fs-84 tp-split-text tp-split-right mb-70">
                  Preguntas <br />
                  frecuentes
                </h3>
                <img data-speed="1.1" className="it-faq-shape-2" src="/assets/img/home-11/faq/faq-2.png" alt="" />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="app-faq-wrap pl-70 z-index-1 tp_fade_anim" data-fade-from="right">
                <div className="ai-faq-accordion-wrap">
                  <div className="accordion" id="accordionCotizadorFaq">
                    {faqs.map((item, idx) => {
                      const collapseId = `cotizadorFaqCollapse${idx}`;
                      const headingId = `cotizadorFaqHeading${idx}`;
                      const isFirst = idx === 0;
                      return (
                        <div className="accordion-items" key={collapseId}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-buttons ${isFirst ? '' : 'collapsed'}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${collapseId}`}
                              aria-expanded={isFirst ? 'true' : 'false'}
                              aria-controls={collapseId}
                            >
                              {item.q}
                              <span className="accordion-icon"></span>
                            </button>
                          </h2>
                          <div
                            id={collapseId}
                            className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`}
                            data-bs-parent="#accordionCotizadorFaq"
                          >
                            <div className="accordion-body">
                              <p>{item.a}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video placeholder (entre FAQ y preguntas) */}
      <div className="pb-120">
        <div className="container container-1230">
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid #3a3b3f',
              background: '#0f1012',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 18px 0 18px' }}>
              <span className="tp-section-subtitle border-bg bg-color">Video</span>
              <h3 style={{ color: '#ffffff', marginTop: '10px', marginBottom: '10px' }}>
                Mirá el proceso (YouTube)
              </h3>
              <p style={{ color: '#a0a0a0', marginBottom: '14px' }}>
                Acá va un video mostrando el paso a paso (placeholder listo para embed).
              </p>
            </div>
            <div
              style={{
                aspectRatio: '16 / 9',
                width: '100%',
                background: 'linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a0a0a0',
                fontSize: '14px',
                padding: '18px',
                textAlign: 'center',
              }}
            >
              Embed de YouTube pendiente (espacio reservado)
            </div>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <div className="pb-140" ref={wizardRef}>
        <div className="container container-1230">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div>
                  <span className="tp-section-subtitle border-bg bg-color">Preguntas</span>
                  <h2 style={{ color: '#ffffff', marginTop: '10px', marginBottom: 0 }}>Estimador de proyecto</h2>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '6px' }}>
                    Paso {Math.min(step + 1, questions.length + 1)} de {questions.length + 1}
                  </div>
                </div>
                <div
                  style={{
                    background: '#1a1b1e',
                    border: '1px solid #3a3b3f',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    minWidth: '260px',
                  }}
                >
                  <div style={{ color: '#a0a0a0', fontSize: '12px' }}>Estimado actual</div>
                  <div style={{ color: '#D0FF71', fontWeight: 700, fontSize: '16px' }}>{formatUsdRange(estimate)}</div>
                </div>
              </div>

              {!isReviewStep && currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={(next) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }))}
                />
              )}

              {isReviewStep && (
                <div
                  style={{
                    background: '#1a1b1e',
                    border: '1px solid #3a3b3f',
                    borderRadius: '12px',
                    padding: '18px',
                  }}
                >
                  <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '10px' }}>Tu cotización estimada</h3>
                  <div style={{ color: '#D0FF71', fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>
                    {formatUsdRange(estimate)}
                  </div>

                  {summary.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>Resumen</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {summary.slice(0, 8).map((s) => (
                          <span
                            key={s}
                            style={{
                              background: '#2d2e32',
                              border: '1px solid #3a3b3f',
                              borderRadius: '999px',
                              padding: '6px 10px',
                              color: '#a0a0a0',
                              fontSize: '12px',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!submitted ? (
                    <>
                      <div style={{ marginTop: '12px' }}>
                        <label style={{ color: '#a0a0a0', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                          Dejanos tu email y te contactamos
                        </label>
                        <input
                          className="quote-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tuemail@empresa.com"
                          style={{
                            width: '100%',
                            background: '#0f1012',
                            border: '1px solid #3a3b3f',
                            color: '#ffffff',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      {error && (
                        <div style={{ marginTop: '12px', color: '#ff8a8a', fontSize: '13px' }}>
                          {error}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="tp-btn-black btn-green-light-bg"
                          style={{ opacity: submitting ? 0.7 : 1 }}
                        >
                          {submitting ? 'Enviando...' : 'Que me contacten'}
                        </button>
                        <div style={{ color: '#666', fontSize: '12px', alignSelf: 'center' }}>
                          Te vamos a responder en 24–48 hs.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        marginTop: '14px',
                        background: 'rgba(76, 175, 80, 0.10)',
                        border: '1px solid rgba(76, 175, 80, 0.35)',
                        borderRadius: '12px',
                        padding: '14px',
                        color: '#a0a0a0',
                      }}
                    >
                      <div style={{ color: '#4CAF50', fontWeight: 700, marginBottom: '6px' }}>¡Listo!</div>
                      Te estaremos contactando en las próximas <strong style={{ color: '#ffffff' }}>24–48 hs</strong>.
                    </div>
                  )}
                </div>
              )}

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  style={{
                    background: step === 0 ? '#2d2e32' : '#3a3b3f',
                    color: step === 0 ? '#666' : '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    cursor: step === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Atrás
                </button>

                {!isReviewStep ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(questions.length, s + 1))}
                    disabled={!canGoNext}
                    style={{
                      background: canGoNext ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' : '#2d2e32',
                      color: canGoNext ? '#1a1b1e' : '#666',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: canGoNext ? 'pointer' : 'not-allowed',
                      fontWeight: 700,
                    }}
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setError(null);
                      setStep(0);
                      setAnswers({});
                      setEmail('');
                      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{
                      background: '#3a3b3f',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    Reiniciar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

