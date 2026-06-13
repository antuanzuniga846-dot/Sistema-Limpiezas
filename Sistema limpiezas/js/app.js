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
  document.addEventListener("DOMContentLoaded", () => {
    actualizarMeta();
    setInterval(actualizarMeta, 8000);
  });