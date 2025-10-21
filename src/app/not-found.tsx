'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="nf-container" role="main" aria-labelledby="nf-title">
      <div className="nf-wrap">
        <div className="nf-glow" aria-hidden="true" />

        <div className="nf-header">
          <span className="nf-badge">Error 404</span>
          <h1 id="nf-title" className="nf-title">Página no encontrada</h1>
          <p className="nf-subtitle">La ruta que intentaste visitar no existe o fue movida.</p>
        </div>

        <div className="nf-card">
          <div className="nf-code">
            <pre aria-label="Detalle técnico">
{`GET /ruta-desconocida 404
→ No pudimos encontrar esta página en el servidor.
→ Probá volver al inicio o explorar artículos y el club.`}
            </pre>
          </div>
          <div className="nf-actions">
            <Link href="/" className="nf-btn nf-btn--primary" aria-label="Volver al inicio">
              Volver al inicio
            </Link>
            <Link href="/articulos" className="nf-btn nf-btn--ghost" aria-label="Ver artículos">
              Ver artículos
            </Link>
            <Link href="/club" className="nf-btn nf-btn--ghost" aria-label="Ir al club">
              Ir al club
            </Link>
          </div>
        </div>

        <footer className="nf-footer" aria-label="Sugerencias">
          ¿Buscabas algo en particular? Escribinos a <a href="mailto:programadoresargentina@gmail.com">programadoresargentina@gmail.com</a>
        </footer>
      </div>

      <style>{`
        .nf-container {
          min-height: calc(100dvh - 0px);
          display: grid;
          place-items: center;
          padding: 40px 16px;
          background: radial-gradient(1200px 600px at 20% 0%, #0d1117 0%, #0b0f14 40%, #0a0d12 100%);
        }

        .nf-wrap { position: relative; width: min(960px, 100%); text-align: center; }

        .nf-glow {
          position: absolute; inset: -20vh -10vw auto -10vw; height: 40vh;
          background: radial-gradient(closest-side, rgba(208,255,113,0.18), rgba(208,255,113,0.06), transparent);
          filter: blur(30px); pointer-events: none;
        }

        .nf-header { margin-bottom: 20px; }
        .nf-badge {
          display: inline-block; padding: 6px 10px; font-size: 12px; letter-spacing: .08em;
          color: #0E0F11; background: #D0FF71; border-radius: 999px; font-weight: 700;
          border: 1px solid rgba(14,15,17,0.15);
        }
        .nf-title { margin: 12px 0 6px; font-size: clamp(28px, 4.6vw, 44px); color: #fff; font-weight: 800; }
        .nf-subtitle { color: rgba(255,255,255,0.75); font-size: clamp(14px, 3.6vw, 16px); }

        .nf-card {
          margin: 22px auto 0; padding: 20px; border-radius: 14px;
          background: rgba(14,15,17,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03);
          backdrop-filter: blur(8px);
        }

        .nf-code pre {
          margin: 0; padding: 16px; text-align: left; overflow: auto;
          color: #fff; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(8,12,16,0.8) 0%, rgba(8,12,16,0.6) 100%);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: clamp(12px, 3.4vw, 14px);
        }

        .nf-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 16px; }
        .nf-btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 44px; padding: 0 16px; border-radius: 10px; text-decoration: none;
          font-weight: 600; transition: all .2s ease; border: 1px solid transparent;
        }
        .nf-btn--primary { background: #D0FF71; color: #0E0F11; border-color: #B8E85A; }
        .nf-btn--primary:hover { background: #c6ff5a; transform: translateY(-1px); }
        .nf-btn--ghost { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.1); }
        .nf-btn--ghost:hover { background: rgba(208,255,113,0.1); color: #D0FF71; border-color: rgba(208,255,113,0.25); transform: translateY(-1px); }

        .nf-footer { margin-top: 14px; color: rgba(255,255,255,0.6); font-size: 13px; }
        .nf-footer a { color: #D0FF71; text-decoration: none; border-bottom: 1px solid rgba(208,255,113,0.3); }
        .nf-footer a:hover { color: #fff; border-bottom-color: #D0FF71; }

        @media (max-width: 480px) {
          .nf-card { padding: 16px; border-radius: 12px; }
          .nf-actions { gap: 8px; }
          .nf-btn { height: 42px; padding: 0 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nf-btn:hover { transform: none; }
        }
      `}</style>
    </main>
  )
}



