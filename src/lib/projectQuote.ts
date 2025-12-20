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
    subtitle: 'Esto nos ayuda a estimar el trabajo de discovery y puesta a punto.',
    type: 'single',
    options: [
      { id: 'new', label: 'Nuevo (desde cero)', price: { minUsd: 0, maxUsd: 0 } },
      {
        id: 'existing',
        label: 'Ya existe (mejoras / migración / mantenimiento)',
        description: 'Incluye auditoría inicial y entendimiento del código actual.',
        price: { minUsd: 400, maxUsd: 1400 },
      },
    ],
  },
  {
    id: 'screens',
    title: '¿Cuántas pantallas / secciones tiene?',
    subtitle: 'Un “estimador rápido” para UX + frontend + QA.',
    type: 'single',
    options: [
      { id: '1-3', label: '1 a 3', price: { minUsd: 300, maxUsd: 800 } },
      { id: '4-7', label: '4 a 7', price: { minUsd: 900, maxUsd: 2200 } },
      { id: '8-12', label: '8 a 12', price: { minUsd: 2300, maxUsd: 4200 } },
      { id: '13+', label: '13 o más', price: { minUsd: 4300, maxUsd: 8500 } },
    ],
  },
  {
    id: 'platform',
    title: '¿En qué plataforma lo necesitás?',
    type: 'single',
    options: [
      { id: 'web', label: 'Web (responsive)', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'mobile', label: 'App mobile', price: { minUsd: 1800, maxUsd: 5200 } },
      { id: 'both', label: 'Web + App mobile', price: { minUsd: 3200, maxUsd: 9200 } },
    ],
  },
  {
    id: 'auth',
    title: 'Usuarios y acceso',
    subtitle: 'Login, registro, roles y seguridad.',
    type: 'single',
    options: [
      { id: 'no', label: 'No (público / sin login)', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí (login + registro)', price: { minUsd: 500, maxUsd: 1400 } },
      { id: 'roles', label: 'Sí (roles y permisos)', price: { minUsd: 1000, maxUsd: 2400 } },
    ],
  },
  {
    id: 'adminPanel',
    title: 'Panel de administración',
    subtitle: 'Para gestionar contenido, usuarios, ventas, etc.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí (básico)', price: { minUsd: 600, maxUsd: 1600 } },
      { id: 'advanced', label: 'Sí (avanzado: reportes, permisos, auditoría)', price: { minUsd: 1400, maxUsd: 3600 } },
    ],
  },
  {
    id: 'payments',
    title: 'Pasarela de pagos',
    subtitle: 'Cobros con tarjeta / links / suscripciones.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'oneTime', label: 'Sí (pagos únicos)', price: { minUsd: 600, maxUsd: 1600 } },
      { id: 'subscriptions', label: 'Sí (suscripciones recurrentes)', price: { minUsd: 1200, maxUsd: 3200 } },
    ],
  },
  {
    id: 'integrations',
    title: 'Integraciones con herramientas externas',
    subtitle: 'CRM, ERP, WhatsApp, email marketing, APIs de terceros, etc.',
    type: 'single',
    options: [
      { id: '0', label: 'Ninguna', price: { minUsd: 0, maxUsd: 0 } },
      { id: '1-2', label: '1 a 2 integraciones', price: { minUsd: 500, maxUsd: 1800 } },
      { id: '3-5', label: '3 a 5 integraciones', price: { minUsd: 1600, maxUsd: 3800 } },
      { id: '6+', label: '6 o más integraciones', price: { minUsd: 3600, maxUsd: 8200 } },
    ],
  },
  {
    id: 'ai',
    title: 'IA y automatización',
    subtitle: 'Chatbot, clasificación, extracción de datos, recomendaciones, etc.',
    type: 'single',
    options: [
      { id: 'no', label: 'No', price: { minUsd: 0, maxUsd: 0 } },
      { id: 'basic', label: 'Sí (IA básica / automatización simple)', price: { minUsd: 700, maxUsd: 2200 } },
      { id: 'advanced', label: 'Sí (IA avanzada: pipelines, RAG, fine-tuning)', price: { minUsd: 2200, maxUsd: 7500 } },
    ],
  },
  {
    id: 'extra',
    title: 'Extras (podés seleccionar varios)',
    subtitle: 'Sumamos sólo lo que aplique. Si algo no aplica, dejalo sin marcar.',
    type: 'multi',
    allowEmpty: true,
    options: [
      { id: 'multilang', label: 'Multilenguaje (ES/EN)', price: { minUsd: 250, maxUsd: 700 } },
      { id: 'seo', label: 'SEO técnico (base)', description: 'Metadatos, sitemap, performance, estructura.', price: { minUsd: 250, maxUsd: 900 } },
      { id: 'analytics', label: 'Analítica (GA4 / eventos)', price: { minUsd: 200, maxUsd: 700 } },
      { id: 'cms', label: 'CMS / contenido administrable', price: { minUsd: 700, maxUsd: 2200 } },
      { id: 'migrations', label: 'Migración de datos', price: { minUsd: 600, maxUsd: 2800 } },
      { id: 'support', label: 'Soporte y mantenimiento (setup)', description: 'Proceso de soporte + monitoreo básico.', price: { minUsd: 300, maxUsd: 1000 } },
    ],
  },
];

export function calculateProjectQuoteUsd(answers: ProjectQuoteAnswers): MoneyRange {
  let min = PROJECT_QUOTE_BASE_PRICE_USD.minUsd;
  let max = PROJECT_QUOTE_BASE_PRICE_USD.maxUsd;

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

