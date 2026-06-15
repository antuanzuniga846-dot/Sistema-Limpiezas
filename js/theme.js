function applyTheme(theme) {
  const root = document.documentElement;

  root.style.setProperty('--accent1', theme.accent1);
  root.style.setProperty('--accent2', theme.accent2);
  root.style.setProperty('--bg1', theme.bg1);
  root.style.setProperty('--bg2', theme.bg2);
}

async function saveTheme(userId, theme) {
  await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...theme
    });
}

window.applyTheme = applyTheme;
window.saveTheme = saveTheme;