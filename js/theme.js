const THEMES = {

  azul: {
    accent1: "#00d8f5",
    accent2: "#0072ff",
    bg1: "#0b1220",
    bg2: "#0f2230"
  },

  verde: {
    accent1: "#22c55e",
    accent2: "#16a34a",
    bg1: "#07130b",
    bg2: "#10241a"
  },

  morado: {
    accent1: "#c084fc",
    accent2: "#7c3aed",
    bg1: "#120b20",
    bg2: "#21103a"
  },

  rojo: {
    accent1: "#ef4444",
    accent2: "#b91c1c",
    bg1: "#1a0a0a",
    bg2: "#2b1010"
  },
  blanco: {
    accent1: "#c084fc",
    accent2: "#7c3aed",
    bg1: "#e6d8d8",
    bg2: "#f9fafb"
  }
};

function applyThemeByName(themeName) {

  const theme = THEMES[themeName];

  if (!theme) return;

  const root = document.documentElement;

  root.style.setProperty("--accent1", theme.accent1);
  root.style.setProperty("--accent2", theme.accent2);
  root.style.setProperty("--bg1", theme.bg1);
  root.style.setProperty("--bg2", theme.bg2);
}

async function saveTheme(userId, themeName) {

  const { error } = await window.supabase
    .from("user_settings")
    .upsert({
      user_id: userId,
      theme_name: themeName,
      updated_at: new Date().toISOString()
    });

  console.log("saveTheme:", error);
}

async function loadTheme(userId) {

  const { data, error } = await window.supabase
    .from("user_settings")
    .select("theme_name")
    .eq("user_id", userId)
    .single();

  if (error || !data) return;

  applyThemeByName(data.theme_name);

  const selector =
    document.getElementById("themeSelector");

  if (selector) {
    selector.value = data.theme_name;
  }
}

window.saveTheme = saveTheme;
window.loadTheme = loadTheme;
window.applyThemeByName = applyThemeByName;