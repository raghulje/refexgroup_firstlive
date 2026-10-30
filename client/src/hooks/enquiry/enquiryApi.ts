export type DuplicateField = 'email' | 'phone' | 'name';

export interface CheckEnquiryResponse {
  exists: boolean;
  field?: DuplicateField;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || `Request failed: ${status}`);
    this.status = status;
  }
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new HttpError(res.status);
  }
  return (await res.json()) as T;
}

export async function checkEnquiry(payload: { name?: string; email: string; phone: string }) {
  const body = await postJson<CheckEnquiryResponse & { data?: CheckEnquiryResponse }>('/api/check-enquiry', payload);
  if (typeof body?.exists === 'boolean') return body;
  if (body?.data && typeof body.data.exists === 'boolean') return body.data;
  return { exists: false };
}

export async function createEnquiry(payload: Record<string, unknown>) {
  return await postJson<{ success?: boolean } | any>('/api/create-enquiry', payload);
}

