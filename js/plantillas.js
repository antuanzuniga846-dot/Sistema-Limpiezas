window.mostrarPlantilla = function(tipo){

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
};