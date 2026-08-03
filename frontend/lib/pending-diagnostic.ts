import type { Profile } from "@/types";

export type PendingDiagnosticPayload = {
  patient: Partial<Profile> & {
    full_name: string;
    age: number;
    gender: string;
    tobacco_habit: boolean;
    alcohol_habit: boolean;
    clinical_notes?: string;
  };
  notes: string;
};

let pendingFile: File | null = null;
let pendingPayload: PendingDiagnosticPayload | null = null;

export function setPendingDiagnostic(file: File, payload: PendingDiagnosticPayload) {
  pendingFile = file;
  pendingPayload = payload;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("pending_diagnostic", JSON.stringify(payload));
  }
}

export function getPendingDiagnostic(): {
  file: File | null;
  payload: PendingDiagnosticPayload | null;
} {
  let payload = pendingPayload;
  if (!payload && typeof window !== "undefined") {
    const raw = sessionStorage.getItem("pending_diagnostic");
    if (raw) {
      try {
        payload = JSON.parse(raw) as PendingDiagnosticPayload;
      } catch {
        payload = null;
      }
    }
  }
  return { file: pendingFile, payload };
}

export function clearPendingDiagnostic() {
  pendingFile = null;
  pendingPayload = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("pending_diagnostic");
  }
}
