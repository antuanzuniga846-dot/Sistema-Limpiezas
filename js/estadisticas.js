let graficaUsuarios = null;

let filtroFecha = {
    tipo: "todo",
    fecha: null
};

async function cargarEstadisticas() {

    if (!window.supabase) return;

    // Obtener todas las limpiezas
let query = window.supabase
    .from("limpiezas")
    .select("user_id, raiz, created_at");


// FILTRO POR FECHA
const tipo = document.getElementById("tipoFiltroFecha")?.value;


if(tipo === "dia"){

    const fecha = document.getElementById("fechaFiltroDia").value;

    if(fecha){

        query = query
        .gte("created_at", fecha + "T00:00:00")
        .lte("created_at", fecha + "T23:59:59");

    }

}



if(tipo === "mes"){

    const mes = document.getElementById("fechaFiltroMes").value;

    if(mes){

        const inicio = mes + "-01";

        const siguiente = new Date(
            new Date(inicio).setMonth(
                new Date(inicio).getMonth()+1
            )
        )
        .toISOString()
        .split("T")[0];


        query = query
        .gte("created_at", inicio+"T00:00:00")
        .lt("created_at", siguiente+"T00:00:00");

    }

}


query = query.range(0,99999);


const { data: limpiezas, error: errorL } = await query;

    // Obtener usuarios autorizados
    const { data: usuarios, error: errorU } = await window.supabase
        .from("autorizados")
        .select("user_id, Nombre");

    if (errorU) {
        console.error(errorU);
        return;
    }

    // Diccionario user_id -> nombre
    const nombres = {};

    usuarios.forEach(u => {
        nombres[u.user_id] = u.Nombre;
    });

    // Contar raíces únicas
        const conteo = {};

        // Crear todos los usuarios aunque tengan 0
        usuarios.forEach(u => {
            conteo[u.Nombre] = new Set();
        });


        limpiezas.forEach(r => {

            if(!nombres[r.user_id]){
                console.warn("Usuario sin nombre:", r.user_id);
            }

            const nombre = nombres[r.user_id] || "Sin nombre";

            if (!conteo[nombre]) {
                conteo[nombre] = new Set();
            }

            conteo[nombre].add(r.raiz);

        });

    const labels = Object.keys(conteo);
    const valores = labels.map(n => conteo[n].size);

    const ctx = document.getElementById("graficaUsuarios");

    if (!ctx) return;

    if (graficaUsuarios) {
        graficaUsuarios.destroy();
    }

    graficaUsuarios = new Chart(ctx, {

        type: "bar",

        data: {

            labels,

            datasets: [{

                label: "Raíces únicas",

                data: valores,

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        precision: 0

                    }

                }

            }

        }

    });

}

document.addEventListener("DOMContentLoaded", ()=>{

    const tipo = document.getElementById("tipoFiltroFecha");
    const dia = document.getElementById("fechaFiltroDia");
    const mes = document.getElementById("fechaFiltroMes");


    tipo.addEventListener("change", ()=>{

        dia.style.display = "none";
        mes.style.display = "none";


        if(tipo.value === "dia"){
            dia.style.display = "block";
        }

        if(tipo.value === "mes"){
            mes.style.display = "block";
        }

    });

});