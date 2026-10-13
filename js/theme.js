// ==========================================================================
// THEME.JS - SISTEMA DE PERSONALIZACIÓN Y PALETAS DE COLOR GLASSMORPHIC
// ==========================================================================

// Definición completa de temas con estética Glassmorphic Dark
const THEMES = {
  azul: {
    name: "azul",
    label: "Azul / Cyan",
    accent1: "#00d8f5",
    accent2: "#0072ff",
    accentText: "#040810",
    bg1: "#0b1220",
    bg2: "#0f2230",
    card: "rgba(0, 216, 245, 0.18)",
    card2: "rgba(0, 216, 245, 0.26)",
    stroke: "rgba(0, 216, 245, 0.35)",
    glow: "rgba(0, 216, 245, 0.18)",
    text: "#e8f1ff",
    muted: "rgba(232, 241, 255, 0.72)"
  },

  verde: {
    name: "verde",
    label: "Verde",
    accent1: "#22c55e",
    accent2: "#16a34a",
    accentText: "#040810",
    bg1: "#07130b",
    bg2: "#10241a",
    card: "rgba(34, 197, 94, 0.18)",
    card2: "rgba(34, 197, 94, 0.26)",
    stroke: "rgba(34, 197, 94, 0.35)",
    glow: "rgba(34, 197, 94, 0.18)",
    text: "#ecfdf5",
    muted: "rgba(236, 253, 245, 0.72)"
  },

  morado: {
    name: "morado",
    label: "Morado",
    accent1: "#c084fc",
    accent2: "#7c3aed",
    accentText: "#040810",
    bg1: "#120b20",
    bg2: "#21103a",
    card: "rgba(192, 132, 252, 0.18)",
    card2: "rgba(192, 132, 252, 0.26)",
    stroke: "rgba(192, 132, 252, 0.35)",
    glow: "rgba(192, 132, 252, 0.18)",
    text: "#f5f3ff",
    muted: "rgba(245, 243, 255, 0.72)"
  },

  rojo: {
    name: "rojo",
    label: "Rojo",
    accent1: "#ef4444",
    accent2: "#b91c1c",
    accentText: "#ffffff",
    bg1: "#1a0a0a",
    bg2: "#2b1010",
    card: "rgba(239, 68, 68, 0.20)",
    card2: "rgba(239, 68, 68, 0.28)",
    stroke: "rgba(239, 68, 68, 0.38)",
    glow: "rgba(239, 68, 68, 0.22)",
    text: "#fef2f2",
    muted: "rgba(254, 242, 242, 0.72)"
  },

  rosado: {
    name: "rosado",
    label: "Rosado",
    accent1: "#f472b6",
    accent2: "#ec4899",
    accentText: "#040810",
    bg1: "#2a0b1f",
    bg2: "#3a102b",
    card: "rgba(244, 114, 182, 0.18)",
    card2: "rgba(244, 114, 182, 0.26)",
    stroke: "rgba(244, 114, 182, 0.35)",
    glow: "rgba(244, 114, 182, 0.18)",
    text: "#fdf2f8",
    muted: "rgba(253, 242, 248, 0.72)"
  },

  amarillo: {
    name: "amarillo",
    label: "Amarillo",
    accent1: "#facc15",
    accent2: "#eab308",
    accentText: "#040810",
    bg1: "#2a2206",
    bg2: "#3a300a",
    card: "rgba(250, 204, 21, 0.17)",
    card2: "rgba(250, 204, 21, 0.25)",
    stroke: "rgba(250, 204, 21, 0.35)",
    glow: "rgba(250, 204, 21, 0.18)",
    text: "#fefce8",
    muted: "rgba(254, 252, 232, 0.72)"
  },

  vino: {
    name: "vino",
    label: "Vino",
    accent1: "#922053",
    accent2: "#961d50",
    accentText: "#ffffff",
    bg1: "#2a0f1a",
    bg2: "#1a0a12",
    card: "rgba(146, 32, 83, 0.20)",
    card2: "rgba(146, 32, 83, 0.28)",
    stroke: "rgba(146, 32, 83, 0.38)",
    glow: "rgba(146, 32, 83, 0.22)",
    text: "#fdf2f8",
    muted: "rgba(253, 242, 248, 0.72)"
  },

  naranja: {
    name: "naranja",
    label: "Naranja",
    accent1: "#f97316",
    accent2: "#ea580c",
    accentText: "#040810",
    bg1: "#2a140b",
    bg2: "#3a1f0b",
    card: "rgba(249, 115, 22, 0.18)",
    card2: "rgba(249, 115, 22, 0.26)",
    stroke: "rgba(249, 115, 22, 0.35)",
    glow: "rgba(249, 115, 22, 0.18)",
    text: "#fff7ed",
    muted: "rgba(255, 247, 237, 0.72)"
  },

  cafe: {
    name: "cafe",
    label: "Café / Marrón",
    accent1: "#8b6f4e",
    accent2: "#6d573d",
    accentText: "#ffffff",
    bg1: "#1f1811",
    bg2: "#2a2016",
    card: "rgba(139, 111, 78, 0.18)",
    card2: "rgba(139, 111, 78, 0.26)",
    stroke: "rgba(139, 111, 78, 0.35)",
    glow: "rgba(139, 111, 78, 0.18)",
    text: "#faf6f0",
    muted: "rgba(250, 246, 240, 0.72)"
  },

  beige: {
    name: "beige",
    label: "Beige",
    accent1: "#f5f5dc",
    accent2: "#e0d8c3",
    accentText: "#040810",
    bg1: "#2b2b1f",
    bg2: "#3a3a2b",
    card: "rgba(245, 245, 220, 0.16)",
    card2: "rgba(245, 245, 220, 0.24)",
    stroke: "rgba(245, 245, 220, 0.32)",
    glow: "rgba(245, 245, 220, 0.16)",
    text: "#fdfaf0",
    muted: "rgba(253, 250, 240, 0.72)"
  },

  verde_lima: {
    name: "verde_lima",
    label: "Lima",
    accent1: "#a3e635",
    accent2: "#84cc16",
    accentText: "#040810",
    bg1: "#1a2b0a",
    bg2: "#2b3a0b",
    card: "rgba(163, 230, 53, 0.18)",
    card2: "rgba(163, 230, 53, 0.26)",
    stroke: "rgba(163, 230, 53, 0.35)",
    glow: "rgba(163, 230, 53, 0.18)",
    text: "#f7fee7",
    muted: "rgba(247, 254, 231, 0.72)"
  },

  rgb: {
    name: "rgb",
    label: "Arcoíris RGB",
    rgb: true
  }
};

let rgbInterval = null;
let currentThemeName = "azul";
let currentAccentColor = "#00d8f5";

// ==========================================================================
// UTILIDADES DE COLOR
// ==========================================================================

function hexToRgb(hex) {
  let c = String(hex || "").replace(/^#/, "").trim();
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) return { r: 0, g: 216, b: 245 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustBrightness(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  return rgbToHex(
    r + (factor < 0 ? r * factor : (255 - r) * factor),
    g + (factor < 0 ? g * factor : (255 - g) * factor),
    b + (factor < 0 ? b * factor : (255 - g) * factor)
  );
}

function getContrastTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#040810" : "#ffffff";
}

// ==========================================================================
// APLICACIÓN DE TEMAS Y PALETA DE COLORES
// ==========================================================================

function applyThemeByName(themeName, guardar = true) {
  if (rgbInterval) {
    clearInterval(rgbInterval);
    rgbInterval = null;
  }

  const theme = THEMES[themeName];
  if (!theme) return;

  currentThemeName = themeName;

  if (theme.rgb) {
    iniciarRGB();
    actualizarSincronizacionUI("rgb", "#00d8f5");
    if (guardar) {
      localStorage.setItem("userThemeName", "rgb");
      localStorage.setItem("userAccentColor", "#00d8f5");
    }
    return;
  }

  currentAccentColor = theme.accent1;
  const root = document.documentElement;

  root.style.setProperty("--accent1", theme.accent1);
  root.style.setProperty("--accent2", theme.accent2);
  root.style.setProperty("--accent-text", theme.accentText || getContrastTextColor(theme.accent1));

  root.style.setProperty("--bg1", theme.bg1);
  root.style.setProperty("--bg2", theme.bg2);

  // Colores enriquecidos para tarjetas y KPIs en estilo glassmorphism
  root.style.setProperty("--card", theme.card);
  root.style.setProperty("--card2", theme.card2);
  root.style.setProperty("--stroke", theme.stroke);
  root.style.setProperty("--card-glow", theme.glow || "rgba(0,0,0,0.2)");

  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);

  actualizarSincronizacionUI(themeName, theme.accent1);

  if (guardar) {
    localStorage.setItem("userThemeName", themeName);
    localStorage.setItem("userAccentColor", theme.accent1);
  }
}

function iniciarRGB() {
  if (rgbInterval) clearInterval(rgbInterval);

  let hue = 0;
  const root = document.documentElement;

  rgbInterval = setInterval(() => {
    hue = (hue + 1) % 360;

    root.style.setProperty("--accent1", `hsl(${hue}, 100%, 55%)`);
    root.style.setProperty("--accent2", `hsl(${(hue + 45) % 360}, 100%, 50%)`);
    root.style.setProperty("--accent-text", "#ffffff");

    root.style.setProperty("--bg1", `hsl(${hue}, 35%, 8%)`);
    root.style.setProperty("--bg2", `hsl(${(hue + 25) % 360}, 35%, 12%)`);

    root.style.setProperty("--card", `hsla(${hue}, 100%, 50%, 0.18)`);
    root.style.setProperty("--card2", `hsla(${hue}, 100%, 50%, 0.26)`);
    root.style.setProperty("--stroke", `hsla(${hue}, 100%, 50%, 0.38)`);
    root.style.setProperty("--card-glow", `hsla(${hue}, 100%, 50%, 0.22)`);

    root.style.setProperty("--text", "#ffffff");
    root.style.setProperty("--muted", "rgba(255, 255, 255, 0.72)");
  }, 25);
}

function actualizarColorAcento(hexColor, guardar = true) {
  if (!hexColor) return;
  let hex = String(hexColor).trim();
  if (!hex.startsWith("#")) hex = "#" + hex;
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;

  if (rgbInterval) {
    clearInterval(rgbInterval);
    rgbInterval = null;
  }

  // Verificar si coincide exactamente con un tema predefinido
  const matchedTheme = Object.keys(THEMES).find(key => 
    THEMES[key].accent1 && THEMES[key].accent1.toLowerCase() === hex.toLowerCase()
  );

  if (matchedTheme) {
    applyThemeByName(matchedTheme, guardar);
    return;
  }

  // Si es un color hexadecimal personalizado, generar tema glassmorphic dinámico
  currentAccentColor = hex;
  currentThemeName = "personalizado";

  const { r, g, b } = hexToRgb(hex);
  const companionColor = adjustBrightness(hex, -20);
  const textColor = getContrastTextColor(hex);
  const root = document.documentElement;

  root.style.setProperty("--accent1", hex);
  root.style.setProperty("--accent2", companionColor);
  root.style.setProperty("--accent-text", textColor);

  // Fondos profundos a juego con el tono
  const bg1 = rgbToHex(Math.round(r * 0.10), Math.round(g * 0.10), Math.round(b * 0.10));
  const bg2 = rgbToHex(Math.round(r * 0.16), Math.round(g * 0.16), Math.round(b * 0.16));
  root.style.setProperty("--bg1", bg1);
  root.style.setProperty("--bg2", bg2);

  // Tarjetas y bordes teñidos con el color seleccionado para que las cards tomen el color
  root.style.setProperty("--card", `rgba(${r}, ${g}, ${b}, 0.18)`);
  root.style.setProperty("--card2", `rgba(${r}, ${g}, ${b}, 0.26)`);
  root.style.setProperty("--stroke", `rgba(${r}, ${g}, ${b}, 0.35)`);
  root.style.setProperty("--card-glow", `rgba(${r}, ${g}, ${b}, 0.20)`);

  root.style.setProperty("--text", "#ffffff");
  root.style.setProperty("--muted", "rgba(255, 255, 255, 0.72)");

  actualizarSincronizacionUI("personalizado", hex);

  if (guardar) {
    localStorage.setItem("userThemeName", "personalizado");
    localStorage.setItem("userAccentColor", hex);
  }
}

function actualizarColorDesdeTexto(valor) {
  let val = String(valor || "").trim();
  if (!val.startsWith("#")) val = "#" + val;
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    actualizarColorAcento(val);
  }
}

function seleccionarPresetColor(identificador) {
  if (THEMES[identificador]) {
    applyThemeByName(identificador);
    return;
  }
  actualizarColorAcento(identificador);
}

// Sincroniza selector desplegable, inputs de color y estados activos de los botones
function actualizarSincronizacionUI(themeName, hexColor) {
  const selector = document.getElementById("themeSelector");
  if (selector && themeName && themeName !== "personalizado") {
    selector.value = themeName;
  }

  const picker = document.getElementById("accentColorPicker");
  const textInput = document.getElementById("accentColorInput");
  const swatch = document.getElementById("colorSwatchPreview");

  if (picker && hexColor && picker.value.toLowerCase() !== hexColor.toLowerCase()) {
    picker.value = hexColor;
  }
  if (textInput && hexColor && textInput.value.toUpperCase() !== hexColor.toUpperCase()) {
    textInput.value = hexColor.toUpperCase();
  }
  if (swatch && hexColor) {
    swatch.style.backgroundColor = hexColor;
  }

  // Resaltar botón activo en la paleta circular
  const presetButtons = document.querySelectorAll(".color-preset-btn");
  presetButtons.forEach(btn => {
    const btnTheme = btn.getAttribute("data-theme");
    const btnBg = btn.style.background || btn.style.backgroundColor;

    if (btnTheme && btnTheme === themeName) {
      btn.classList.add("active");
    } else if (hexColor && btnBg && btnBg.toLowerCase().includes(hexColor.toLowerCase())) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// ==========================================================================
// PERSISTENCIA (LOCALSTORAGE + SUPABASE)
// ==========================================================================

async function guardarConfiguracionTema() {
  localStorage.setItem("userThemeName", currentThemeName);
  localStorage.setItem("userAccentColor", currentAccentColor);

  const client = window.supabase || window.supabaseClient;
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        await client
          .from("user_settings")
          .upsert({
            user_id: session.user.id,
            theme_name: currentThemeName,
            updated_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.warn("No se pudo sincronizar tema con Supabase:", err);
    }
  }

  if (typeof showToast === "function") {
    showToast("success", "Tema guardado", `Preferencia "${currentThemeName}" guardada correctamente.`);
  }
}

async function saveTheme(userId, themeData) {
  if (typeof themeData === "string") {
    currentThemeName = themeData;
  }
  return guardarConfiguracionTema();
}

async function loadTheme(userId) {
  const client = window.supabase || window.supabaseClient;
  if (!client || !userId) return;

  try {
    const { data, error } = await client
      .from("user_settings")
      .select("theme_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data || !data.theme_name) return;

    const val = data.theme_name.trim();

    if (THEMES[val]) {
      applyThemeByName(val, true);
    } else if (val.startsWith("#")) {
      actualizarColorAcento(val, true);
    } else if (val.startsWith("{")) {
      try {
        const parsed = JSON.parse(val);
        if (parsed.theme && THEMES[parsed.theme]) {
          applyThemeByName(parsed.theme, true);
        } else if (parsed.accent) {
          actualizarColorAcento(parsed.accent, true);
        }
      } catch (e) {}
    }
  } catch (err) {
    console.error("Error al cargar tema de Supabase:", err);
  }
}

// Carga inicial inmediata
function inicializarTemaLocal() {
  const savedTheme = localStorage.getItem("userThemeName") || "azul";
  const savedAccent = localStorage.getItem("userAccentColor") || "#00d8f5";

  if (THEMES[savedTheme]) {
    applyThemeByName(savedTheme, false);
  } else if (savedAccent) {
    actualizarColorAcento(savedAccent, false);
  }
}

inicializarTemaLocal();

// ==========================================================================
// GESTIÓN DE FONDO DE PANTALLA PERSONALIZADO
// ==========================================================================

function manejarSubidaFondo(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    if (typeof showToast === "function") {
      showToast("error", "Formato no válido", "Por favor selecciona un archivo de imagen (PNG, JPG, WebP).");
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      const MAX_SIZE = 1920;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrlOptimizado = canvas.toDataURL("image/jpeg", 0.85);

      try {
        localStorage.setItem("customBgImage", dataUrlOptimizado);
        const oscuridad = localStorage.getItem("customBgDarkness") || "75";

        aplicarFondoEnDOM(dataUrlOptimizado, oscuridad);

        if (typeof showToast === "function") {
          showToast("success", "Fondo actualizado", "La imagen de fondo se ha guardado correctamente.");
        }
      } catch (err) {
        console.error("Error guardando imagen:", err);
        if (typeof showToast === "function") {
          showToast("warn", "Imagen muy grande", "Intenta con una imagen de menor tamaño.");
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function aplicarFondoEnDOM(dataUrl, oscuridad = "75") {
  const oscuridadDecimal = (parseInt(oscuridad, 10) / 100).toFixed(2);

  document.documentElement.style.setProperty("--custom-bg-url", `url("${dataUrl}")`);
  document.documentElement.style.setProperty("--bg-darkness", oscuridadDecimal);
  document.body.classList.add("has-custom-bg");

  const removeBtn = document.getElementById("removeBgBtn");
  const adjustWrap = document.getElementById("bgAdjustWrap");
  const slider = document.getElementById("bgDarknessSlider");
  const valText = document.getElementById("bgDarknessVal");

  if (removeBtn) removeBtn.style.display = "inline-flex";
  if (adjustWrap) adjustWrap.style.display = "block";
  if (slider) slider.value = oscuridad;
  if (valText) valText.textContent = `${oscuridad}%`;
}

function ajustarOscuridadFondo(valor) {
  const oscuridadDecimal = (parseInt(valor, 10) / 100).toFixed(2);
  document.documentElement.style.setProperty("--bg-darkness", oscuridadDecimal);
  localStorage.setItem("customBgDarkness", valor);

  const valText = document.getElementById("bgDarknessVal");
  if (valText) valText.textContent = `${valor}%`;
}

function quitarFondoPersonalizado() {
  localStorage.removeItem("customBgImage");
  localStorage.removeItem("customBgDarkness");

  document.body.classList.remove("has-custom-bg");
  document.documentElement.style.removeProperty("--custom-bg-url");
  document.documentElement.style.removeProperty("--bg-darkness");

  const removeBtn = document.getElementById("removeBgBtn");
  const adjustWrap = document.getElementById("bgAdjustWrap");

  if (removeBtn) removeBtn.style.display = "none";
  if (adjustWrap) adjustWrap.style.display = "none";

  if (typeof showToast === "function") {
    showToast("success", "Fondo restablecido", "Se ha vuelto al fondo original.");
  }
}

function inicializarFondoPersonalizado() {
  const bgGuardado = localStorage.getItem("customBgImage");
  const oscuridadGuardada = localStorage.getItem("customBgDarkness") || "75";

  if (bgGuardado) {
    aplicarFondoEnDOM(bgGuardado, oscuridadGuardada);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarTemaLocal();
  inicializarFondoPersonalizado();

  const themeSelector = document.getElementById("themeSelector");
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      applyThemeByName(e.target.value);
    });
  }
});

// Exportaciones globales
window.THEMES = THEMES;
window.applyThemeByName = applyThemeByName;
window.iniciarRGB = iniciarRGB;
window.actualizarColorAcento = actualizarColorAcento;
window.actualizarColorDesdeTexto = actualizarColorDesdeTexto;
window.seleccionarPresetColor = seleccionarPresetColor;
window.guardarConfiguracionTema = guardarConfiguracionTema;
window.saveTheme = saveTheme;
window.loadTheme = loadTheme;
window.manejarSubidaFondo = manejarSubidaFondo;
window.aplicarFondoEnDOM = aplicarFondoEnDOM;
window.ajustarOscuridadFondo = ajustarOscuridadFondo;
window.quitarFondoPersonalizado = quitarFondoPersonalizado;