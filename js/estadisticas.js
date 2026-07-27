let graficaUsuarios = null;

async function cargarEstadisticas() {

    if (!window.supabase) return;

    const { data, error } = await window.supabase
        .from("limpiezas")
        .select(`
            user_id,
            raiz,
            autorizados (
                iniciales
            )
        `);

    if (error) {
        console.error(error);
        return;
    }

    const usuarios = {};

    data.forEach(registro => {

        const nombre =
            registro.autorizados?.iniciales ||
            registro.user_id;

        if (!usuarios[nombre]) {
            usuarios[nombre] = new Set();
        }

        usuarios[nombre].add(registro.raiz);

    });

    const labels = Object.keys(usuarios);

    const valores = labels.map(nombre => usuarios[nombre].size);

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
                data: valores
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

}