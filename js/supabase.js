// File: js/supabase.js - FINAL CONFIG FOR TEMPERA
// Ganti PASTE_ANON_KEY_DI_SINI dengan key yang kamu copy dari dashboard

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://wjmotidelqgcyyujacud.supabase.co";

// INI YANG HARUS KAMU PASTE - ambil dari Dashboard > API Keys
// Kalau pakai Publishable key baru: paste yang sb_publishable_...
// Kalau pakai Legacy: paste yang eyJhbGciOi...
const SUPABASE_ANON_KEY = "sb_publishable_w9OGGJHKIYg6QiKl5cI15A_hY0Ha-ir";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper login
export async function loginDriver(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function getDriverProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("drivers")
    .select("*")
    .eq("email", user.email)
    .single();
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
}
