const THEMES = {

  azul: {
    accent1: "#00d8f5",
    accent2: "#0072ff",
    bg1: "#0b1220",
    bg2: "#0f2230",
    card: "rgba(255,255,255,.06)",
    card2: "rgba(255,255,255,.08)",
    stroke: "rgba(255,255,255,.12)",
    text: "#e8f1ff",
    muted: "rgba(232,241,255,.72)"
  },

  verde: {
    accent1: "#22c55e",
    accent2: "#16a34a",
    bg1: "#07130b",
    bg2: "#10241a",
    card: "rgba(34,197,94,.08)",
    card2: "rgba(34,197,94,.12)",
    stroke: "rgba(34,197,94,.20)",
    text: "#ecfdf5",
    muted: "rgba(236,253,245,.72)"
  },

  morado: {
    accent1: "#c084fc",
    accent2: "#7c3aed",
    bg1: "#120b20",
    bg2: "#21103a",
    card: "rgba(192,132,252,.08)",
    card2: "rgba(192,132,252,.12)",
    stroke: "rgba(192,132,252,.20)",
    text: "#f5f3ff",
    muted: "rgba(245,243,255,.72)"
  },

  rojo: {
    accent1: "#ef4444",
    accent2: "#b91c1c",
    bg1: "#1a0a0a",
    bg2: "#2b1010",
    card: "rgba(239,68,68,.08)",
    card2: "rgba(239,68,68,.12)",
    stroke: "rgba(239,68,68,.20)",
    text: "#fef2f2",
    muted: "rgba(254,242,242,.72)"
  },

  rosado: {
    accent1: "#f472b6",
    accent2: "#ec4899",
    bg1: "#491249",
    bg2: "#2b102b",
    card: "rgba(244,114,182,.08)",
    card2: "rgba(244,114,182,.12)",
    stroke: "rgba(244,114,182,.20)",
    text: "#fdf2f8",
    muted: "rgba(253,242,248,.72)"
  },

  amarillo: {
    accent1: "#facc15",
    accent2: "#eab308",
    bg1: "#4a3c0b",
    bg2: "#2b1f0b",
    card: "rgba(250,204,21,.08)",
    card2: "rgba(250,204,21,.12)",
    stroke: "rgba(250,204,21,.20)",
    text: "#fefce8",
    muted: "rgba(254,252,232,.72)"
  },

  vino: {
    accent1: "#922053",
    accent2: "#961d50",
    bg1: "#2a0f1a",
    bg2: "#1a0a12",
    card: "rgba(146,32,83,.10)",
    card2: "rgba(146,32,83,.14)",
    stroke: "rgba(146,32,83,.25)",
    text: "#fdf2f8",
    muted: "rgba(253,242,248,.72)"
  },

  naranja: {
    accent1: "#f97316",
    accent2: "#ea580c",
    bg1: "#2a140b",
    bg2: "#3a1f0b",
    card: "rgba(249,115,22,.08)",
    card2: "rgba(249,115,22,.12)",
    stroke: "rgba(249,115,22,.20)",
    text: "#fff7ed",
    muted: "rgba(255,247,237,.72)"
  },

  beige: { 
    accent1: "#f5f5dc",
    accent2: "#e0d8c3",
    bg1: "#2b2b1f",
    bg2: "#3a3a2b",
    card: "rgba(245,245,220,.08)",
    card2: "rgba(245,245,220,.12)",
    stroke: "rgba(245,245,220,.20)",
    text: "#fdfaf0",
    muted: "rgba(253,250,240,.72)"
  },

  verde_lima: {
    accent1: "#a3e635",
    accent2: "#84cc16",
    bg1: "#1a2b0a",
    bg2: "#2b3a0b",
    card: "rgba(163,230,53,.08)",
    card2: "rgba(163,230,53,.12)",
    stroke: "rgba(163,230,53,.20)",
    text: "#f7fee7",
    muted: "rgba(247,254,231,.72)"
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

  root.style.setProperty("--card", theme.card);
  root.style.setProperty("--card2", theme.card2);

  root.style.setProperty("--stroke", theme.stroke);

  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);
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