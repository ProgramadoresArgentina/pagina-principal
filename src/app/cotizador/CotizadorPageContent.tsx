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
  .it-about-shape-wrap { z-index: 0 !important; }
  .it-about-shape-wrap img { z-index: -1 !important; position: absolute !important; }
  .it-about-shape-1 { z-index: -1 !important; }
  .it-about-shape-2 { z-index: -1 !important; }
  
  @media (max-width: 768px) {
    .quote-wizard-container { padding-top: 140px !important; }
    .quote-wizard-header { flex-direction: column !important; align-items: flex-start !important; }
    .quote-wizard-title { font-size: 24px !important; }
    .quote-estimate-box { width: 100% !important; min-width: auto !important; margin-top: 16px !important; }
    .quote-options-grid { grid-template-columns: 1fr !important; }
    .quote-question-card { padding: 16px !important; }
    .quote-question-title { font-size: 18px !important; }
    .quote-nav-buttons { flex-direction: column !important; }
    .quote-nav-buttons button { width: 100% !important; }
    .quote-video-container { padding-bottom: 56.25% !important; }
    .quote-faq-section .pl-70 { padding-left: 0 !important; }
    .container-1230 { padding-left: 15px !important; padding-right: 15px !important; }
  }
  
  @media (max-width: 480px) {
    .quote-wizard-title { font-size: 20px !important; }
    .quote-wizard-subtitle { font-size: 13px !important; }
    .quote-estimate-box { padding: 8px 12px !important; }
    .quote-estimate-label { font-size: 10px !important; }
    .quote-estimate-value { font-size: 16px !important; }
    .quote-option-card { padding: 14px !important; }
    .quote-option-card > div:first-child { padding-right: 28px !important; }
    .quote-option-label { font-size: 14px !important; }
    .quote-option-desc { font-size: 12px !important; }
    .quote-option-indicator { 
      top: 10px !important; 
      right: 10px !important; 
      width: 20px !important; 
      height: 20px !important; 
    }
    .quote-option-indicator svg { width: 10px !important; height: 10px !important; }
  }
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
      className="quote-question-card"
      style={{
        background: '#1a1b1e',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        zIndex: 4,
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h3 className="quote-question-title" style={{ color: '#ffffff', fontSize: '20px', marginBottom: '8px', fontWeight: 600 }}>{question.title}</h3>
        {question.subtitle && <p className="quote-wizard-subtitle" style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: 0 }}>{question.subtitle}</p>}
      </div>

      <div
        className="quote-options-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {question.options.map((opt) => {
          const isSelected = question.type === 'single' ? selectedSingle === opt.id : selectedMulti.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              className="quote-option-card"
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
                position: 'relative',
                textAlign: 'left',
                width: '100%',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : '#2d2e32',
                border: isSelected ? '2px solid #6366f1' : '1px solid #3a3b3f',
                color: '#ffffff',
                padding: '18px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#4a4b4f';
                  e.currentTarget.style.background = '#35363a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#3a3b3f';
                  e.currentTarget.style.background = '#2d2e32';
                }
              }}
            >
              {/* Círculo indicador en la esquina superior derecha */}
              <div
                className="quote-option-indicator"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '2px solid #6366f1' : '2px solid rgba(255, 255, 255, 0.5)',
                  background: isSelected ? '#6366f1' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Contenido de la card */}
              <div style={{ paddingRight: '32px' }}>
                <div className="quote-option-label" style={{ fontWeight: 600, fontSize: '15px', lineHeight: 1.4, marginBottom: '4px' }}>
                  {opt.label}
                </div>
                {opt.description && (
                  <div className="quote-option-desc" style={{ color: '#a0a0a0', fontSize: '13px', lineHeight: 1.4, marginTop: '6px' }}>
                    {opt.description}
                  </div>
                )}
              </div>

              {/* Precio en la parte inferior */}
              <div
                style={{
                  color: '#818cf8',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginTop: 'auto',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {formatUsdRange(opt.price)}
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
    
    // Para preguntas single: SIEMPRE requiere una selección
    if (currentQuestion.type === 'single') {
      return typeof v === 'string' && v.length > 0;
    }
    
    // Para preguntas multi:
    // - Si allowEmpty es true, puede avanzar sin selección
    // - Si allowEmpty es false o no está definido, requiere al menos 1 selección
    if (currentQuestion.type === 'multi') {
      if (currentQuestion.allowEmpty === true) {
        return true; // Puede avanzar sin selección
      }
      // Requiere al menos una selección
      return Array.isArray(v) && v.length > 0;
    }
    
    return false;
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

      {/* Wizard - Preguntas bien arriba y bien identificadas */}
      <div className="pb-140 p-relative pt-200 quote-wizard-container" ref={wizardRef} style={{ zIndex: 3 }}>
        <div className="it-about-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <img data-speed="1.1" className="it-about-shape-1 d-none d-xxl-block" src="/assets/img/home-11/about/about-shape-1.png" alt="" style={{ position: 'absolute', zIndex: -1 }} />
          <img data-speed=".9" className="it-about-shape-2" src="/assets/img/home-11/about/about-shape-2.png" alt="" style={{ position: 'absolute', zIndex: -1 }} />
        </div>
        <div className="container container-1230" style={{ position: 'relative', zIndex: 3 }}>
          <div className="row">
            <div className="col-xl-12">
              <div className="quote-wizard-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'flex-end' }}>
                <div>
                  <span className="tp-section-subtitle border-bg bg-color">Cotización</span>
                  <h2 className="quote-wizard-title" style={{ color: '#ffffff', marginTop: '10px', marginBottom: '8px', fontSize: '32px', fontWeight: 700 }}>Obtené tu presupuesto en minutos</h2>
                  <p className="quote-wizard-subtitle" style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '4px' }}>
                    Respondé unas preguntas simples sobre tu proyecto y te damos un estimado de costo. Sin compromiso.
                  </p>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '6px' }}>
                    Paso {Math.min(step + 1, questions.length + 1)} de {questions.length + 1}
                  </div>
                </div>
                <div
                  className="quote-estimate-box"
                  style={{
                    background: 'rgba(208, 255, 113, 0.15)',
                    border: '1px solid rgba(208, 255, 113, 0.4)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    minWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div className="quote-estimate-label" style={{ color: '#a0a0a0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimado actual</div>
                  <div className="quote-estimate-value" style={{ color: '#D0FF71', fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>{formatUsdRange(estimate)}</div>
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
                  {!submitted ? (
                    <>
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
                    </>
                  ) : null}

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

                      <div style={{ marginTop: '14px', color: '#666', fontSize: '12px' }}>
                        Te vamos a responder en 24–48 hs.
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
              <div className="quote-nav-buttons" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || (isReviewStep && submitted)}
                  style={{
                    background: step === 0 || (isReviewStep && submitted) ? '#2d2e32' : '#3a3b3f',
                    color: step === 0 || (isReviewStep && submitted) ? '#666' : '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    cursor: step === 0 || (isReviewStep && submitted) ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
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
                      flex: 1,
                    }}
                  >
                    Siguiente →
                  </button>
                ) : submitted ? (
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
                      flex: 1,
                    }}
                  >
                    Reiniciar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !isValidEmail(email)}
                    style={{
                      background: submitting || !isValidEmail(email) ? '#2d2e32' : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                      color: submitting || !isValidEmail(email) ? '#666' : '#1a1b1e',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: submitting || !isValidEmail(email) ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      flex: 1,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting && isValidEmail(email)) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting && isValidEmail(email)) {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {submitting ? 'Enviando...' : 'Quiero que me contacten'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="pb-120" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container container-1230">
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid #3a3b3f',
              background: '#0f1012',
              overflow: 'hidden',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              className="quote-video-container"
              style={{
                position: 'relative',
                paddingBottom: '45%', // Aspect ratio más pequeño
                height: 0,
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src="https://www.youtube.com/embed/AU60q00BcCU"
                title="Proceso de cotización"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ (mismo estilo que /club) */}
      <div className="app-faq-area p-relative pb-120" style={{ zIndex: 2 }}>
        <div className="it-faq-shape-1" style={{ zIndex: 0 }}>
          <img data-speed=".9" src="/assets/img/home-11/faq/faq-1.png" alt="" style={{ zIndex: 0 }} />
        </div>
        <div className="container container-1230" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row">
            <div className="col-lg-4">
              <div className="app-faq-heading p-relative mb-40">
                <span className="tp-section-subtitle border-bg bg-color">FAQ</span>
                <h3 className="tp-section-title-platform platform-text-black fs-84 tp-split-text tp-split-right mb-70">
                  Preguntas <br />
                  frecuentes
                </h3>
                <img data-speed="1.1" className="it-faq-shape-2" src="/assets/img/home-11/faq/faq-2.png" alt="" style={{ zIndex: 0 }} />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="app-faq-wrap pl-70 z-index-1 tp_fade_anim quote-faq-section" data-fade-from="right" style={{ position: 'relative', zIndex: 2 }}>
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
    </>
  );
}

