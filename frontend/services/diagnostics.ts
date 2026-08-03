import { api } from "@/services/api";
import type { Diagnostic } from "@/types";

export async function listDiagnostics() {
  const { data } = await api.get<Diagnostic[]>("/diagnostics");
  return data;
}

export async function getDiagnostic(id: number) {
  const { data } = await api.get<Diagnostic>(`/diagnostics/${id}`);
  return data;
}

export async function createDiagnostic(file: File, notes?: string, patient?: Record<string, any>) {
  const form = new FormData();
  form.append("file", file);
  if (notes) form.append("notes", notes);
  if (patient) form.append("patient", JSON.stringify(patient));

  // Do not set Content-Type manually — axios/browser must add the multipart boundary.
  const { data } = await api.post<Diagnostic>("/diagnostics", form, {
    timeout: 180000,
  });
  return data;
}

export async function deleteDiagnostic(id: number) {
  const { data } = await api.delete(`/diagnostics/${id}`);
  return data;
}
