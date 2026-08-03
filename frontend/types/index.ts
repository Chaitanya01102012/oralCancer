export type ApiMessage<T = Record<string, unknown>> = {
  success: boolean;
  message: string;
  data: T | null;
};

export type TokenData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthUser = {
  id: number;
  email: string;
  full_name: string;
};

export type Profile = {
  id: number;
  full_name?: string | null;
  age?: number | null;
  gender?: string | null;
  phone_number?: string | null;
  email?: string | null;
  tobacco_habit?: boolean | null;
  alcohol_habit?: boolean | null;
  clinical_notes?: string | null;
};

export type DiseaseInformation = {
  title?: string;
  description?: string;
  severity?: string;
  recommendation?: string;
  [key: string]: string | undefined;
};

export type Diagnostic = {
  id: number;
  prediction: string;
  confidence: number;
  image_path: string;
  notes?: string | null;
  created_at: string;
  probabilities?: Record<string, number> | null;
  disease_information?: DiseaseInformation | null;
  model_version?: string | null;
  engine_version?: string | null;
  inference_time?: number | null;
  metadata?: Record<string, unknown> | null;
  report_url?: string | null;
  has_report?: boolean;
};

export type DashboardSummary = {
  total_diagnostics: number;
  recent_diagnostics: number;
  latest_prediction?: string | null;
};
