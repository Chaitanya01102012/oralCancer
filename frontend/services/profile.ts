import { api } from "@/services/api";
import type { Profile } from "@/types";

export async function getProfile() {
  const { data } = await api.get<Profile>("/profile");
  return data;
}

export async function updateProfile(payload: Partial<Profile>) {
  const { data } = await api.put<Profile>("/profile", payload);
  return data;
}
