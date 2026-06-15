export function applyTheme(theme) {
  const root = document.documentElement;

  root.style.setProperty('--accent1', theme.accent1);
  root.style.setProperty('--accent2', theme.accent2);
  root.style.setProperty('--bg1', theme.bg1);
  root.style.setProperty('--bg2', theme.bg2);
}

export async function saveTheme(userId, theme, supabase) {
  await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...theme
    });
}

export async function loadTheme(userId, supabase) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return;

  applyTheme(data);
}