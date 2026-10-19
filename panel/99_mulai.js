/* ---------- mulai ---------- */
(async function boot() {
  const { data } = await sb.auth.getSession();
  if (data && data.session) await enter(); else showLogin();
})();

