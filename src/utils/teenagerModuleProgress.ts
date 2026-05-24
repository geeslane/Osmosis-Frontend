import type { Module, TeenagerModuleProgressItem } from '@/components/types';
import {
  formatModuleDate,
  isProgramStarted,
  localTodayISO,
} from '@/utils/moduleDateLabels';

export type TeenagerModuleAccess = {
  canView: boolean;
  disabledReason: string | null;
};

export function sortModulesByNumber(modules: Module[]): Module[] {
  return [...modules].sort((a, b) => a.moduleNumber - b.moduleNumber);
}

/**
 * Per-module view rules for teenagers: module 1 when program starts; later modules after previous is completed.
 */
export function buildTeenagerModuleAccessMap(
  modulesInOrder: Module[],
  programStartDate: string | undefined,
  today = localTodayISO()
): Map<string, TeenagerModuleAccess> {
  const map = new Map<string, TeenagerModuleAccess>();
  const programStarted = isProgramStarted(programStartDate, today);
  const programStartLabel = formatModuleDate(programStartDate?.slice(0, 10));

  modulesInOrder.forEach((module, index) => {
    if (index === 0) {
      if (!programStarted) {
        map.set(module.id, {
          canView: false,
          disabledReason: programStartLabel
            ? `Opens when the program starts on ${programStartLabel}.`
            : 'Opens when the program starts.',
        });
        return;
      }
      map.set(module.id, { canView: true, disabledReason: null });
      return;
    }

    const previous = modulesInOrder[index - 1];
    if (!previous.markedCompleted) {
      map.set(module.id, {
        canView: false,
        disabledReason: `Complete Module ${previous.moduleNumber} first.`,
      });
      return;
    }

    map.set(module.id, { canView: true, disabledReason: null });
  });

  return map;
}

/** Normalize one progress row from GET /teenager/.../modules/progress (flexible field names). */
export function normalizeProgressItem(raw: unknown): TeenagerModuleProgressItem {
  if (!raw || typeof raw !== 'object') {
    return { moduleId: '', progress: 0 };
  }
  const r = raw as Record<string, unknown>;
  const moduleId = String(r.moduleId ?? r.module_id ?? r.id ?? '').trim();
  const progressRaw = r.progress ?? r.percentComplete ?? r.percentage;
  const progress =
    typeof progressRaw === 'number'
      ? Math.min(100, Math.max(0, progressRaw))
      : Number(progressRaw) || 0;
  const completed = Boolean(r.completed ?? r.markedCompleted ?? r.isCompleted);
  const deliverableSubmitted = Boolean(
    r.deliverableSubmitted ?? r.submissionSubmitted ?? r.assignmentSubmitted
  );
  const submissionAnswer =
    typeof r.submissionAnswer === 'string'
      ? r.submissionAnswer
      : typeof r.answer === 'string'
        ? r.answer
        : typeof r.content === 'string'
          ? r.content
          : typeof r.submission === 'string'
            ? r.submission
            : null;
  return {
    moduleId,
    progress,
    completed,
    deliverableSubmitted,
    submissionAnswer: submissionAnswer ?? undefined,
  };
}

/** Unwrap array from typical `{ data: [...] }` or `{ data: { data: [...] } }` envelopes. */
export function unwrapProgressList(payload: unknown): TeenagerModuleProgressItem[] {
  if (!payload || typeof payload !== 'object') return [];
  const o = payload as Record<string, unknown>;
  const inner = o.data;
  if (Array.isArray(inner)) {
    return inner.map(normalizeProgressItem).filter((x) => x.moduleId.length > 0);
  }
  if (inner && typeof inner === 'object') {
    const d = (inner as Record<string, unknown>).data;
    if (Array.isArray(d)) {
      return d.map(normalizeProgressItem).filter((x) => x.moduleId.length > 0);
    }
  }
  return [];
}

export function progressByModuleId(
  items: TeenagerModuleProgressItem[]
): Map<string, TeenagerModuleProgressItem> {
  const m = new Map<string, TeenagerModuleProgressItem>();
  for (const it of items) {
    if (it.moduleId) m.set(it.moduleId, it);
  }
  return m;
}

/**
 * Merge `GET /teenager/:id/modules/progress` into module rows so `markedCompleted`
 * reflects the server when the catalog `GET /module` list omits per-teen completion.
 */
export function mergeModulesWithTeenagerProgress(
  modules: Module[],
  progressRows: TeenagerModuleProgressItem[]
): Module[] {
  if (!progressRows.length) return modules;
  const map = progressByModuleId(progressRows);
  return modules.map((m) => {
    const p = map.get(m.id);
    const completed = Boolean(p?.completed) || Boolean(m.markedCompleted);
    return { ...m, markedCompleted: completed };
  });
}

/** Unwrap deliverable GET body: `{ answer }` or nested `data.answer`. */
export function unwrapDeliverableAnswer(payload: unknown): string | undefined {
  if (payload == null) return undefined;
  if (typeof payload === 'string') return payload.trim() || undefined;
  if (typeof payload !== 'object') return undefined;
  const o = payload as Record<string, unknown>;
  const d = o.data;
  if (typeof d === 'string') return d.trim() || undefined;
  if (d && typeof d === 'object') {
    const inner = d as Record<string, unknown>;
    const a =
      inner.answer ?? inner.content ?? inner.submission ?? inner.text;
    if (typeof a === 'string') return a.trim() || undefined;
  }
  const top = o.answer ?? o.content ?? o.submission;
  if (typeof top === 'string') return top.trim() || undefined;
  return undefined;
}
