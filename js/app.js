
  // ===== Meta fecha/hora + usuario =====
  function actualizarMeta(){
    const f = document.getElementById("metaFecha");
    const h = document.getElementById("metaHora");
    if(!f || !h) return;

    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2,'0');
    const mes = String(ahora.getMonth()+1).padStart(2,'0');
    const anio = ahora.getFullYear();

    let hora = ahora.getHours();
    const min = String(ahora.getMinutes()).padStart(2,'0');
    const ampm = hora >= 12 ? "p.m." : "a.m.";
    hora = hora % 12; hora = hora ? hora : 12;

    f.textContent = `Fecha: ${dia}/${mes}/${anio}`;
    h.textContent = `Hora: ${hora}:${min} ${ampm} | Usuario: ${getUsuarioActual()}`;
  }

  document.addEventListener("DOMContentLoaded", async () => {

  actualizarMeta();
  setInterval(actualizarMeta, 8000);

  const saveBtn = document.getElementById("saveThemeBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

      const theme = {
        accent1: document.getElementById("accent1Picker").value,
        accent2: document.getElementById("accent2Picker").value,
        bg1: "#0b1220",
        bg2: "#0f2230"
      };

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      applyTheme(theme);
      await saveTheme(user.id, theme, supabase);
    });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await loadTheme(user.id, supabase);
  }

});

window.applyTheme = applyTheme;
window.saveTheme = saveTheme;
window.loadTheme = loadTheme;