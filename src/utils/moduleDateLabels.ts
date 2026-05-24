import type { Module } from '@/components/types';

export function daysUntil(dateStr: string | undefined): number | null {
  if (!dateStr || dateStr.length < 10) return null;
  const target = new Date(dateStr.slice(0, 10));
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

/** Before start → "Starts in N days"; during → "Ends in N days". */
export function moduleCountdownLabel(
  startDateStr: string | undefined,
  endDateStr: string | undefined
): string | null {
  const daysToStart = startDateStr ? daysUntil(startDateStr) : null;
  const daysToEnd = endDateStr ? daysUntil(endDateStr) : null;

  if (daysToStart != null && daysToStart > 0) {
    return daysToStart === 1 ? 'Starts in 1 day' : `Starts in ${daysToStart} days`;
  }

  if (daysToStart === 0 && daysToEnd != null && daysToEnd > 0) {
    return daysToEnd === 1 ? 'Ends in 1 day' : `Ends in ${daysToEnd} days`;
  }

  if (daysToStart === 0) {
    return 'Starts today';
  }

  if (daysToEnd != null && daysToEnd > 0) {
    return daysToEnd === 1 ? 'Ends in 1 day' : `Ends in ${daysToEnd} days`;
  }

  if (daysToEnd === 0) {
    return 'Ends today';
  }

  if (daysToEnd != null && daysToEnd < 0) {
    const ago = Math.abs(daysToEnd);
    return ago === 1 ? 'Ended 1 day ago' : `Ended ${ago} days ago`;
  }

  return null;
}

export function formatModuleDate(s: string | undefined): string {
  if (!s || s.length < 10) return '';
  const d = new Date(s.slice(0, 10));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function pickDateField(raw: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === 'string' && v.length >= 10) return v.slice(0, 10);
  }
  return undefined;
}

/** Normalize module period dates from API (camelCase or snake_case). */
export function normalizeModuleDates(module: Module): Module {
  const raw = module as Module & Record<string, unknown>;
  const startDate =
    module.startDate ??
    pickDateField(raw, ['start_date', 'moduleStartDate', 'periodStartDate']);
  const endDate =
    module.endDate ??
    pickDateField(raw, ['end_date', 'moduleEndDate', 'periodEndDate']);
  if (startDate === module.startDate && endDate === module.endDate) {
    return module;
  }
  return { ...module, ...(startDate && { startDate }), ...(endDate && { endDate }) };
}

export function normalizeModulesList(modules: Module[]): Module[] {
  return modules.map(normalizeModuleDates);
}

export function localTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function compareDateStrings(a: string, b: string): number {
  return a.slice(0, 10).localeCompare(b.slice(0, 10));
}

/** True when today is on or after the program start date (YYYY-MM-DD). */
export function isProgramStarted(
  programStartDate: string | undefined,
  today = localTodayISO()
): boolean {
  const start = programStartDate?.slice(0, 10);
  if (!start) return true;
  return compareDateStrings(today, start) >= 0;
}

export type CurrentModulePhase = 'active' | 'upcoming' | 'between' | 'program-ended' | 'no-dates';

export type CurrentProgramModule = {
  module: Module;
  phase: CurrentModulePhase;
};

/** Which module the teen should focus on today (by schedule dates). */
export function getCurrentProgramModule(modules: Module[]): CurrentProgramModule | null {
  if (!modules.length) return null;

  const withDates = normalizeModulesList(modules)
    .filter((m) => m.startDate && m.endDate)
    .sort((a, b) => a.moduleNumber - b.moduleNumber);

  if (!withDates.length) {
    const fallback = [...modules].sort((a, b) => a.moduleNumber - b.moduleNumber)[0];
    return fallback ? { module: fallback, phase: 'no-dates' } : null;
  }

  const today = localTodayISO();

  const active = withDates.find((m) => {
    const start = m.startDate!.slice(0, 10);
    const end = m.endDate!.slice(0, 10);
    return compareDateStrings(start, today) <= 0 && compareDateStrings(today, end) <= 0;
  });
  if (active) return { module: active, phase: 'active' };

  const first = withDates[0];
  if (compareDateStrings(today, first.startDate!.slice(0, 10)) < 0) {
    return { module: first, phase: 'upcoming' };
  }

  const last = withDates[withDates.length - 1];
  if (compareDateStrings(today, last.endDate!.slice(0, 10)) > 0) {
    return { module: last, phase: 'program-ended' };
  }

  const next = withDates.find(
    (m) => compareDateStrings(today, m.startDate!.slice(0, 10)) < 0
  );
  if (next) return { module: next, phase: 'upcoming' };

  const previous = [...withDates]
    .filter((m) => compareDateStrings(today, m.endDate!.slice(0, 10)) > 0)
    .sort((a, b) => b.moduleNumber - a.moduleNumber)[0];
  if (previous) return { module: previous, phase: 'between' };

  return { module: first, phase: 'active' };
}

export type TeenCurrentModuleSummary = {
  eyebrow: string;
  /** Explains that this is the program module the teen should be on (by schedule). */
  title: string;
  moduleLabel: string;
  dateRange: string | null;
  countdown: string | null;
  /** Optional second line under dates (e.g. program start before modules). */
  dateNote: string | null;
};

/** Copy for teen dashboard “current module” card. */
export function describeCurrentModuleForTeen(
  current: CurrentProgramModule | null,
  programStart?: string,
  programEnd?: string
): TeenCurrentModuleSummary | null {
  if (!current) return null;

  const { module, phase } = current;
  const moduleLabel = `Module ${module.moduleNumber}: ${module.title}`;
  const start = module.startDate?.slice(0, 10);
  const end = module.endDate?.slice(0, 10);
  const dateRange =
    start && end
      ? `${formatModuleDate(start)} – ${formatModuleDate(end)}`
      : null;
  const moduleCountdown = moduleCountdownLabel(start, end);

  if (phase === 'active') {
    return {
      eyebrow: 'Current program module',
      title: 'You should be on this module now. It is your active module in the program.',
      moduleLabel,
      dateRange,
      countdown: moduleCountdown,
      dateNote: null,
    };
  }

  if (phase === 'upcoming') {
    const programNotStarted =
      programStart &&
      compareDateStrings(localTodayISO(), programStart.slice(0, 10)) < 0;
    return {
      eyebrow: programNotStarted
        ? 'First program module (upcoming)'
        : 'Your next program module',
      title: programNotStarted
        ? ''
        : 'This is the next module in your program schedule.',
      moduleLabel,
      dateRange: null,
      countdown: moduleCountdown,
      dateNote: null,
    };
  }

  if (phase === 'between') {
    return {
      eyebrow: 'Between modules',
      title: 'You have finished your last scheduled module. Open Modules to see what’s next.',
      moduleLabel,
      dateRange,
      countdown: null,
      dateNote: null,
    };
  }

  if (phase === 'program-ended') {
    return {
      eyebrow: 'Program complete',
      title: programEnd
        ? `All scheduled modules have ended (program ended ${formatModuleDate(programEnd)}).`
        : 'You have finished all scheduled modules in your program.',
      moduleLabel,
      dateRange,
      countdown: null,
      dateNote: null,
    };
  }

  return {
    eyebrow: 'Your program module',
    title: 'Open Modules to see what to work on.',
    moduleLabel,
    dateRange: null,
    countdown: null,
    dateNote: null,
  };
}
