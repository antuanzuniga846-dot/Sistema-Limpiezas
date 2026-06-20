// ===== Meta fecha/hora + usuario =====
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
  h.textContent = `Hora: ${hora}:${min} ${ampm} | Usuario: ${getUsuarioActual()}`;
}

document.addEventListener("DOMContentLoaded", async () => {

  actualizarMeta();
  setInterval(actualizarMeta, 8000);

  // Cargar tema guardado
  try {

    const {
      data: { user }
    } = await window.supabase.auth.getUser();

    if (user) {
      await loadTheme(user.id);
    }

  } catch (err) {
    console.error("Error cargando tema:", err);
  }

  // Guardar tema
  const saveBtn = document.getElementById("saveThemeBtn");

  if (saveBtn) {

    saveBtn.addEventListener("click", async () => {

      try {

        const {
          data: { user }
        } = await window.supabase.auth.getUser();

        if (!user) {
          alert("Debes iniciar sesión.");
          return;
        }

        const themeName =
          document.getElementById("themeSelector").value;

        applyThemeByName(themeName);

        await saveTheme(
          user.id,
          themeName
        );

        console.log("Tema guardado");

      } catch (err) {
        console.error("Error guardando tema:", err);
      }

    });

  }

});

  const plantillas = {

    nc: `
      <h3>Plantilla Nota de Crédito</h3>
      <textarea style="width:100%;height:300px;">
200_Recuperacion de Clientes Proyecto de Ventas Móvil

200_ Se aplica limpieza de saldos por el monto de
VB Operaciones Comerciales

200_Se aplico reversión por proyecto de Venta Servicio Móvil Limpieza de Saldos

Se procede para la reversión de nota de crédito.
      </textarea>
    `,

    autorizacion: `
      <h3>Plantilla Autorización</h3>
      <textarea style="width:100%;height:300px;">
Se procede con la autorización, por favor validar, cualquier consulta adicional quedamos a su disposición.

Se solicita prioridad, cualquier consulta adicional quedamos a su disposición.

Compañeros su apoyo dando prioridad y autorización a la orden en CRM.
      </textarea>
    `
  };

  const contenedor = document.getElementById("contenidoPlantilla");

  if (!contenedor) {
    console.error("No existe #contenidoPlantilla");
    return;
  }

  contenedor.innerHTML =
    plantillas[tipo] || "Plantilla no encontrada";

    window.mostrarPlantilla = function(tipo){
  alert("Plantilla: " + tipo);
};
