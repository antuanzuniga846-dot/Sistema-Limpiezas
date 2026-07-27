let graficaUsuarios = null;

async function cargarEstadisticas() {

    if (!window.supabase) return;

    // Obtener todas las limpiezas
    const { data: limpiezas, error: errorL } = await window.supabase
    .from("limpiezas")
    .select("user_id, raiz")
    .range(0, 99999);

    if (errorL) {
        console.error(errorL);
        return;
    }

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