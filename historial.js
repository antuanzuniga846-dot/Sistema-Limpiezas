// ==========================================================================
// META FECHA / HORA / USUARIO
// ==========================================================================
function actualizarMeta() {
  const f = document.getElementById("metaFecha");
  const h = document.getElementById("metaHora");

  if (!f || !h) return;

  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, "0");
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const anio = ahora.getFullYear();

  let hora = ahora.getHours();
  const min = String(ahora.getMinutes()).padStart(2, "0");
  const ampm = hora >= 12 ? "p.m." : "a.m.";

  hora = hora % 12;
  hora = hora ? hora : 12;

  f.textContent = `Fecha: ${dia}/${mes}/${anio}`;
  h.textContent = `Hora: ${hora}:${min} ${ampm} | Usuario: ${typeof getUsuarioActual === "function" ? getUsuarioActual() : ""}`;
}

// Carga del tema del usuario
async function inicializarTemaUsuario() {
  if (!window.supabase) return;

  try {
    const { data: { session } } = await window.supabase.auth.getSession();
    if (session?.user && typeof loadTheme === "function") {
      await loadTheme(session.user.id);
    }
  } catch (err) {
    console.error("Error cargando tema guardado:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarMeta();
  setInterval(actualizarMeta, 8000);

  // Escuchar cuando Supabase esté listo para cargar el tema
  window.addEventListener("supabase-ready", inicializarTemaUsuario);
  if (window.supabase) inicializarTemaUsuario();

  // 1. Vista previa instantánea al cambiar el selector
  const themeSelector = document.getElementById("themeSelector");
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      if (typeof applyThemeByName === "function") {
        applyThemeByName(e.target.value);
      }
    });
  }

  // 2. Guardar tema en base de datos
  const saveBtn = document.getElementById("saveThemeBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      try {
        if (!window.supabase) return;
        const { data: { session } } = await window.supabase.auth.getSession();

        if (!session?.user) {
          if (typeof showToast === "function") {
            showToast("warn", "Atención", "Debes iniciar sesión para guardar tu tema.");
          }
          return;
        }

        const themeName = document.getElementById("themeSelector").value;
        await saveTheme(session.user.id, themeName);

        if (typeof showToast === "function") {
          showToast("success", "Tema guardado", `Preferencia "${themeName}" actualizada.`);
        }
      } catch (err) {
        console.error("Error guardando tema:", err);
        if (typeof showToast === "function") {
          showToast("error", "Error", "No se pudo guardar el tema.");
        }
      }
    });
  }
});