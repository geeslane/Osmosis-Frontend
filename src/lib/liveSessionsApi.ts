
import axiosInstance from '@/lib/axiosInstance';

export type LiveSessionStatus = 'scheduled' | 'completed' | 'cancelled';

/** API response shape for one live session (uses datetime) */
export type ApiLiveSession = {
  id: string;
  topic: string;
  datetime: string; // ISO 8601
  url: string;
  speakerName: string;
  bio: string;
  linkedinUrl: string | null;
  pictureUrl: string | null;
  status: LiveSessionStatus;
  cancellationReason: string | null;
  sessionNotes: string | null;
  recordingUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/** List response */
export type LiveSessionsListResponse = {
  data: ApiLiveSession[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/** Create body */
export type CreateLiveSessionBody = {
  topic: string;
  datetime: string; // ISO 8601
  url: string;
  speakerName: string;
  bio: string;
  linkedinUrl?: string;
};

/** Update body (partial) */
export type UpdateLiveSessionBody = Partial<{
  topic: string;
  datetime: string;
  url: string;
  speakerName: string;
  bio: string;
  linkedinUrl: string;
  pictureUrl: string;
  status: LiveSessionStatus;
  cancellationReason: string;
  sessionNotes: string;
  recordingUrl: string;
}>;

/** Cancel body */
export type CancelLiveSessionBody = {
  cancellationReason: string; // min 5 chars
};

/** Notes body */
export type SessionNotesBody = {
  sessionNotes: string; // min 5 chars
  recordingUrl?: string;
};

/** Comment from API (with optional replies) */
export type ApiComment = {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorPictureUrl: string | null;
  text: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: ApiCommentReply[];
};

export type ApiCommentReply = {
  id: string;
  authorId?: string;
  authorName: string;
  authorPictureUrl?: string | null;
  text: string;
  createdAt: string;
  [key: string]: unknown;
};

export type CommentsListResponse = {
  data: ApiComment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const BASE = '/api/live-sessions';

/** Backend wraps responses as { success, data: payload }. Unwrap to get payload. */
function unwrap<T>(r: { data: T | { success?: boolean; data?: T } }): T {
  const body = r.data as { success?: boolean; data?: T };
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data as T;
  }
  return r.data as T;
}

export const liveSessionsApi = {
  list(params?: {
    search?: string;
    page?: number;
    limit?: number;
    orderBy?: 'asc' | 'desc';
  }) {
    return axiosInstance.get(BASE, { params }).then((r) => unwrap<LiveSessionsListResponse>(r));
  },

  getById(id: string) {
    return axiosInstance.get(`${BASE}/${id}`).then((r) => unwrap<ApiLiveSession>(r));
  },

  create(body: CreateLiveSessionBody, picture?: File | null) {
    if (picture) {
      const form = new FormData();
      form.append('topic', body.topic);
      form.append('datetime', body.datetime);
      form.append('url', body.url);
      form.append('speakerName', body.speakerName);
      form.append('bio', body.bio);
      if (body.linkedinUrl) form.append('linkedinUrl', body.linkedinUrl);
      form.append('picture', picture);
      return axiosInstance
        .post(BASE, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap<ApiLiveSession>(r));
    }
    return axiosInstance.post(BASE, body).then((r) => unwrap<ApiLiveSession>(r));
  },

  update(id: string, body: UpdateLiveSessionBody, picture?: File | null) {
    if (picture) {
      const form = new FormData();
      Object.entries(body).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== 'pictureUrl') form.append(k, String(v));
      });
      form.append('picture', picture);
      return axiosInstance
        .put(`${BASE}/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap<ApiLiveSession>(r));
    }
    return axiosInstance.put(`${BASE}/${id}`, body).then((r) => unwrap<ApiLiveSession>(r));
  },

  cancel(id: string, body: CancelLiveSessionBody) {
    return axiosInstance
      .patch(`${BASE}/${id}/cancel`, body)
      .then((r) => unwrap<ApiLiveSession>(r));
  },

  postNotes(id: string, body: SessionNotesBody) {
    return axiosInstance
      .post(`${BASE}/${id}/notes`, body)
      .then((r) => unwrap<ApiLiveSession>(r));
  },

  getComments(id: string, params?: { page?: number; limit?: number }) {
    return axiosInstance
      .get(`${BASE}/${id}/comments`, { params })
      .then((r) => unwrap<CommentsListResponse>(r));
  },

  addComment(id: string, body: { text: string }) {
    return axiosInstance
      .post(`${BASE}/${id}/comments`, body)
      .then((r) => unwrap<ApiComment>(r));
  },

  addReply(id: string, commentId: string, body: { text: string }) {
    return axiosInstance
      .post(`${BASE}/${id}/comments/${commentId}/replies`, body)
      .then((r) => unwrap<ApiComment>(r));
  },

  deleteComment(id: string, commentId: string) {
    return axiosInstance.delete(`${BASE}/${id}/comments/${commentId}`).then(() => undefined);
  },
};
