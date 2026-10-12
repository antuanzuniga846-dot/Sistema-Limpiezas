// ==========================================================================
// THEME.JS - SISTEMA DE PERSONALIZACIÓN MANUAL DE COLOR Y MODO
// ==========================================================================

// Estado actual del tema
let currentThemeMode = "oscuro";
let currentAccentColor = "#00d8f5";

// Paletas base para modo claro y oscuro
const BASE_MODES = {
  oscuro: {
    bg1: "#0b1220",
    bg2: "#0f172a",
    card: "rgba(255, 255, 255, 0.06)",
    card2: "rgba(255, 255, 255, 0.08)",
    stroke: "rgba(255, 255, 255, 0.12)",
    text: "#e8f1ff",
    muted: "rgba(232, 241, 255, 0.72)"
  },
  claro: {
    bg1: "#f1f5f9",
    bg2: "#e2e8f0",
    card: "rgba(255, 255, 255, 0.82)",
    card2: "rgba(255, 255, 255, 0.94)",
    stroke: "rgba(15, 23, 42, 0.12)",
    text: "#0f172a",
    muted: "rgba(15, 23, 42, 0.65)"
  }
};

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

// Ajusta el brillo para generar automáticamente el segundo tono de degradado
function adjustBrightness(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  return rgbToHex(
    r + (factor < 0 ? r * factor : (255 - r) * factor),
    g + (factor < 0 ? g * factor : (255 - g) * factor),
    b + (factor < 0 ? b * factor : (255 - b) * factor)
  );
}

// Calcula contraste para texto de botones principales (blanco si es oscuro, negro si es claro)
function getContrastTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#040810" : "#ffffff";
}

// ==========================================================================
// APLICAR MODO (CLARO / OSCURO)
// ==========================================================================

function cambiarModoTema(modo, guardar = true) {
  const modoFinal = (modo === "claro") ? "claro" : "oscuro";
  currentThemeMode = modoFinal;

  const root = document.documentElement;
  const palette = BASE_MODES[modoFinal];

  root.style.setProperty("--bg1", palette.bg1);
  root.style.setProperty("--bg2", palette.bg2);
  root.style.setProperty("--card", palette.card);
  root.style.setProperty("--card2", palette.card2);
  root.style.setProperty("--stroke", palette.stroke);
  root.style.setProperty("--text", palette.text);
  root.style.setProperty("--muted", palette.muted);

  root.setAttribute("data-theme", modoFinal === "claro" ? "light" : "dark");

  // Sincronizar radio buttons en el DOM
  const radioClaro = document.getElementById("themeModeClaro");
  const radioOscuro = document.getElementById("themeModeOscuro");
  if (radioClaro && radioOscuro) {
    radioClaro.checked = (modoFinal === "claro");
    radioOscuro.checked = (modoFinal === "oscuro");
  }

  if (guardar) {
    localStorage.setItem("userThemeMode", modoFinal);
  }
}

// ==========================================================================
// APLICAR COLOR DE ACENTO
// ==========================================================================

function actualizarColorAcento(hexColor, guardar = true) {
  if (!hexColor) return;
  let hex = String(hexColor).trim();
  if (!hex.startsWith("#")) hex = "#" + hex;
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;

  currentAccentColor = hex;

  const root = document.documentElement;
  const companionColor = adjustBrightness(hex, -20);
  const textColor = getContrastTextColor(hex);

  root.style.setProperty("--accent1", hex);
  root.style.setProperty("--accent2", companionColor);
  root.style.setProperty("--accent-text", textColor);

  // Sincronizar UI de selección de color
  const picker = document.getElementById("accentColorPicker");
  const textInput = document.getElementById("accentColorInput");
  const swatch = document.getElementById("colorSwatchPreview");

  if (picker && picker.value.toLowerCase() !== hex.toLowerCase()) {
    picker.value = hex;
  }
  if (textInput && textInput.value.toUpperCase() !== hex.toUpperCase()) {
    textInput.value = hex.toUpperCase();
  }
  if (swatch) {
    swatch.style.backgroundColor = hex;
  }

  if (guardar) {
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

function seleccionarPresetColor(hex) {
  actualizarColorAcento(hex);
}

// ==========================================================================
// GUARDAR Y CARGAR TEMA (LOCALSTORAGE + SUPABASE)
// ==========================================================================

async function guardarConfiguracionTema() {
  localStorage.setItem("userThemeMode", currentThemeMode);
  localStorage.setItem("userAccentColor", currentAccentColor);

  const client = window.supabase || window.supabaseClient;
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        const themeConfig = JSON.stringify({
          mode: currentThemeMode,
          accent: currentAccentColor
        });

        await client
          .from("user_settings")
          .upsert({
            user_id: session.user.id,
            theme_name: themeConfig,
            updated_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.warn("No se pudo sincronizar tema con Supabase:", err);
    }
  }

  if (typeof showToast === "function") {
    showToast("success", "Tema guardado", `Modo ${currentThemeMode} y color ${currentAccentColor} guardados.`);
  }
}

async function saveTheme(userId, themeData) {
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

    // Si viene como JSON con modo y acento
    if (val.startsWith("{")) {
      try {
        const parsed = JSON.parse(val);
        if (parsed.mode) cambiarModoTema(parsed.mode, true);
        if (parsed.accent) actualizarColorAcento(parsed.accent, true);
        return;
      } catch (e) {}
    }

    // Si es un código hexadecimal directamente
    if (val.startsWith("#")) {
      actualizarColorAcento(val, true);
      return;
    }

    // Fallback a temas por nombre antiguo
    const legacyPresets = {
      azul: "#00d8f5",
      verde: "#22c55e",
      morado: "#c084fc",
      rojo: "#ef4444",
      rosado: "#f472b6",
      amarillo: "#facc15",
      vino: "#922053",
      naranja: "#f97316",
      beige: "#f5f5dc",
      verde_lima: "#a3e635"
    };

    if (legacyPresets[val]) {
      actualizarColorAcento(legacyPresets[val], true);
    }
  } catch (err) {
    console.error("Error al cargar tema de Supabase:", err);
  }
}

function applyThemeByName(themeName) {
  const legacyPresets = {
    azul: "#00d8f5",
    verde: "#22c55e",
    morado: "#c084fc",
    rojo: "#ef4444",
    rosado: "#f472b6",
    amarillo: "#facc15",
    vino: "#922053",
    naranja: "#f97316",
    beige: "#f5f5dc",
    verde_lima: "#a3e635"
  };

  if (legacyPresets[themeName]) {
    actualizarColorAcento(legacyPresets[themeName]);
  }
}

// Inicialización instantánea desde localStorage
function inicializarTemaLocal() {
  const savedMode = localStorage.getItem("userThemeMode") || "oscuro";
  const savedAccent = localStorage.getItem("userAccentColor") || "#00d8f5";

  cambiarModoTema(savedMode, false);
  actualizarColorAcento(savedAccent, false);
}

// Ejecutar inmediatamente para evitar parpadeos visuales
inicializarTemaLocal();

window.cambiarModoTema = cambiarModoTema;
window.actualizarColorAcento = actualizarColorAcento;
window.actualizarColorDesdeTexto = actualizarColorDesdeTexto;
window.seleccionarPresetColor = seleccionarPresetColor;
window.guardarConfiguracionTema = guardarConfiguracionTema;
window.saveTheme = saveTheme;
window.loadTheme = loadTheme;
window.applyThemeByName = applyThemeByName;

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
});