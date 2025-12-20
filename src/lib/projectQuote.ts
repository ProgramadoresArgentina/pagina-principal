export type MoneyRange = {
  minUsd: number;
  maxUsd: number;
};

export type QuoteQuestionType = 'single' | 'multi';

export type QuoteOption = {
  id: string;
  label: string;
  description?: string;
  price: MoneyRange;
};

export type QuoteQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  type: QuoteQuestionType;
  options: QuoteOption[];
  /**
   * Para preguntas multi, si es true se permite "sin selección" como válido.
   * Para preguntas single, se recomienda que el usuario elija una opción antes de avanzar.
   */
  allowEmpty?: boolean;
};

export type ProjectQuoteAnswers = Record<string, string | string[] | undefined>;

export const PROJECT_QUOTE_BASE_PRICE_USD: MoneyRange = {
  // Setup + gestión + kickoff + ambiente + repo + despliegue inicial
  minUsd: 800,
  maxUsd: 1500,
};

export const PROJECT_QUOTE_QUESTIONS: QuoteQuestion[] = [
  {
    id: 'projectStage',
    title: '¿En qué etapa está tu proyecto?',
    subtitle: 'Esto nos ayuda a entender cuánto trabajo inicial necesitamos hacer.',
    type: 'single',
    options: [
      { id: 'new', label: 'Nuevo (desde cero)', price: { minUsd: 500, maxUsd: 1000 } },
      {
        id: 'existing',
        label: 'Ya existe (necesito mejorarlo o actualizarlo)',
        description: 'Incluye revisar lo que ya tenés y entender cómo funciona.',
        price: { minUsd: 200, maxUsd: 800 },
      },
    ],
  },
  {
    id: 'screens',
    title: '¿Cuántas pantallas o páginas diferentes tiene?',
    subtitle: 'Pensá en cada sección o página que el usuario va a ver.',
    type: 'single',
    options: [
      { id: '1-3', label: '1 a 3 pantallas', price: { minUsd: 200, maxUsd: 500 } },
      { id: '4-7', label: '4 a 7 pantallas', price: { minUsd: 500, maxUsd: 1200 } },
      { id: '8-12', label: '8 a 12 pantallas', price: { minUsd: 1200, maxUsd: 2500 } },
      { id: '13+', label: '13 o más pantallas', price: { minUsd: 2500, maxUsd: 5000 } },
    ],
  },
  {
    id: 'platform',
    title: '¿Dónde querés que funcione?',
    type: 'single',
    options: [
      { id: 'web', label: 'Solo sitio web (se adapta a celular y computadora)', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'mobile', label: 'Solo app para celular', price: { minUsd: 1000, maxUsd: 3000 } },
      { id: 'both', label: 'Sitio web + app para celular', price: { minUsd: 1800, maxUsd: 5000 } },
    ],
  },
  {
    id: 'auth',
    title: '¿Necesitás que los usuarios se registren o inicien sesión?',
    subtitle: 'Por ejemplo: login con email y contraseña, registro de nuevos usuarios.',
    type: 'single',
    options: [
      { id: 'no', label: 'No, es público (cualquiera puede verlo sin registrarse)', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí, login y registro básico', price: { minUsd: 300, maxUsd: 800 } },
      { id: 'roles', label: 'Sí, con diferentes tipos de usuarios (admin, cliente, etc.)', price: { minUsd: 600, maxUsd: 1500 } },
    ],
  },
  {
    id: 'adminPanel',
    title: '¿Necesitás un panel para administrar el contenido?',
    subtitle: 'Un lugar donde puedas agregar, editar o eliminar información sin ayuda técnica.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí, un panel básico para gestionar contenido', price: { minUsd: 400, maxUsd: 1000 } },
      { id: 'advanced', label: 'Sí, un panel completo con reportes y control de permisos', price: { minUsd: 800, maxUsd: 2000 } },
    ],
  },
  {
    id: 'payments',
    title: '¿Necesitás cobrar online?',
    subtitle: 'Pagos con tarjeta, transferencia o suscripciones mensuales.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'oneTime', label: 'Sí, pagos de una sola vez', price: { minUsd: 400, maxUsd: 1000 } },
      { id: 'subscriptions', label: 'Sí, suscripciones mensuales o recurrentes', price: { minUsd: 800, maxUsd: 2000 } },
    ],
  },
  {
    id: 'integrations',
    title: '¿Necesitás conectar con otras herramientas?',
    subtitle: 'Por ejemplo: WhatsApp, email marketing, sistemas de gestión (CRM), planillas de cálculo, etc.',
    type: 'single',
    options: [
      { id: '0', label: 'No, no necesito conectar con nada', price: { minUsd: 0, maxUsd: 0 } },
      { id: '1-2', label: 'Sí, 1 a 2 conexiones con otras herramientas', price: { minUsd: 300, maxUsd: 1000 } },
      { id: '3-5', label: 'Sí, 3 a 5 conexiones', price: { minUsd: 800, maxUsd: 2000 } },
      { id: '6+', label: 'Sí, 6 o más conexiones', price: { minUsd: 2000, maxUsd: 4500 } },
    ],
  },
  {
    id: 'ai',
    title: '¿Necesitás inteligencia artificial o automatización?',
    subtitle: 'Por ejemplo: chatbot que responde preguntas, clasificación automática, recomendaciones, etc.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí, automatización simple o chatbot básico', price: { minUsd: 400, maxUsd: 1200 } },
      { id: 'advanced', label: 'Sí, IA avanzada con aprendizaje automático', price: { minUsd: 1200, maxUsd: 4000 } },
    ],
  },
  {
    id: 'extra',
    title: 'Extras (podés seleccionar varios)',
    subtitle: 'Marcá solo lo que necesites. Si algo no aplica, dejalo sin marcar.',
    type: 'multi',
    allowEmpty: true,
    options: [
      { id: 'multilang', label: 'Múltiples idiomas (español e inglés)', price: { minUsd: 150, maxUsd: 400 } },
      { id: 'seo', label: 'Optimización para buscadores (Google)', description: 'Para que tu sitio aparezca mejor en las búsquedas.', price: { minUsd: 150, maxUsd: 500 } },
      { id: 'analytics', label: 'Estadísticas y seguimiento de visitantes', price: { minUsd: 100, maxUsd: 400 } },
      { id: 'cms', label: 'Sistema para que puedas editar contenido fácilmente', price: { minUsd: 400, maxUsd: 1200 } },
      { id: 'migrations', label: 'Pasar información de un sistema viejo al nuevo', price: { minUsd: 300, maxUsd: 1500 } },
      { id: 'support', label: 'Soporte y mantenimiento inicial', description: 'Ayuda para resolver problemas y mantener el sistema funcionando.', price: { minUsd: 200, maxUsd: 600 } },
    ],
  },
];

export function calculateProjectQuoteUsd(answers: ProjectQuoteAnswers): MoneyRange {
  let min = 0;
  let max = 0;

  for (const q of PROJECT_QUOTE_QUESTIONS) {
    const a = answers[q.id];
    if (!a) continue;

    if (q.type === 'single') {
      if (typeof a !== 'string') continue;
      const opt = q.options.find((o) => o.id === a);
      if (!opt) continue;
      min += opt.price.minUsd;
      max += opt.price.maxUsd;
      continue;
    }

    // multi
    const list = Array.isArray(a) ? a : [];
    for (const optionId of list) {
      const opt = q.options.find((o) => o.id === optionId);
      if (!opt) continue;
      min += opt.price.minUsd;
      max += opt.price.maxUsd;
    }
  }

  // Sanidad
  min = Math.max(0, Math.round(min));
  max = Math.max(min, Math.round(max));

  return { minUsd: min, maxUsd: max };
}

export function formatUsdRange(range: MoneyRange): string {
  const fmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
  if (range.minUsd === range.maxUsd) return `USD ${fmt.format(range.minUsd)}`;
  return `USD ${fmt.format(range.minUsd)} – ${fmt.format(range.maxUsd)}`;
}

export function getProjectQuoteSummary(answers: ProjectQuoteAnswers): string[] {
  const parts: string[] = [];
  for (const q of PROJECT_QUOTE_QUESTIONS) {
    const a = answers[q.id];
    if (!a) continue;

    if (q.type === 'single' && typeof a === 'string') {
      const opt = q.options.find((o) => o.id === a);
      if (opt) parts.push(`${q.title}: ${opt.label}`);
      continue;
    }

    if (q.type === 'multi' && Array.isArray(a) && a.length) {
      const labels = a
        .map((id) => q.options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
      if (labels.length) parts.push(`${q.title}: ${labels.join(', ')}`);
      continue;
    }
  }
  return parts;
}

