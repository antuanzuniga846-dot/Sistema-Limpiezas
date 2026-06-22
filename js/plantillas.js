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
    `,

    cancelacion: `
<h3>Plantilla Cancelación</h3>
<textarea style="width:100%;height:300px;">
Compañeros no podemos cancelar orden debido a que directriz de claro no podemos cancelar ordenes si tienen orden pendiente a instalación en ETA.

AM // C300 // Se cancela orden por solicitud del Agente Autorizado.

Se procede con la cancelación, por favor validar, cualquier consulta adicional quedamos a su disposición.

En este momento no se puede realizar la cancelación, ya que fue creada por otro Agente autorizado hace menos de 24 horas.

En este momento no se puede realizar la cancelación, ya que fue creada por otro Agente autorizado hace menos de 72 horas.

No procede para la cancelación ya que la orden está en aprovisionamiento.
</textarea>
    `,

    despacho: `
<h3>Plantilla Despacho</h3>
<textarea style="width:100%;height:300px;">
Buen día, por favor su ayuda con la prioridad de la ordenes:

Orden se encuentra en despacho a la espera de asignación  

Se solicita prioridad con el área encargada
</textarea>
    `,

        errordeaprovisionamiento: `
<h3>Plantilla Error de Aprovisionamiento</h3>
<textarea style="width:100%;height:300px;">

Nombre: 
Número de teléfono: 
Cédula: 
ID Cliente: 
Orden CRM: 
Orden EOM: 
Versión CRM: 9.
Error: [SYNCERR?] Error
Detalle: Error de aprovisionamiento
</textarea>
    `,

        cambiodesim: `
<h3>Plantilla Cambio de SIM</h3>
<textarea style="width:100%;height:300px;">

Nombre: 
Cedula: 
Numero: 
Solicitud(eSim/Sim):
Sim Nuevo: 

Compañeros ya su solicitud fue realizada, por favor validar, cualquier consulta adicional quedamos a su disposición

Buen día, le atiende Antuan Mora del equipo Soporte Comercial. Compañeros el documento de solicitud de cambio de SIM debe estar indexado y este cliente no lo tiene en OnBase.
</textarea>
    `,

        qflow: `
<h3>Plantilla Qflow</h3>
<textarea style="width:100%;height:300px;">
Bo Fijo: multimediacr@claro.cr 

Bo Móvil: backofficemasivo@claro.cr

Sistemas:   operaciones_sistemascr@claro.cr 
</textarea>
    `,

  };

  const contenedor = document.getElementById("contenidoPlantilla");

  if (!contenedor) {
    console.error("No existe #contenidoPlantilla");
    return;
  }

  contenedor.innerHTML =
    plantillas[tipo] || "Plantilla no encontrada";
};

