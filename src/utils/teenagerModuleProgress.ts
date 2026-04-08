import type { TeenagerModuleProgressItem } from '@/components/types';

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
