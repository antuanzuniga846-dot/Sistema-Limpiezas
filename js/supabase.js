import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://upxhiylyiebljnpfgmut.supabase.co";
const SUPABASE_KEY = "sb_publishable_ctDXquEkqLpXpuzOoRvtXQ_Vazap6tB";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

window.supabase = supabase;

const USER_DOMAIN = "sistema.local";
const gate = document.getElementById("authGate");
const msg = document.getElementById("authMsg");

function setMsg(t = "") { 
  if (msg) msg.textContent = t; 
}

function setUserTag(tag) {
  const t = String(tag || "").trim();
  if (!t) return;
  window.currentUserTag = t;
  localStorage.setItem("userTag", t);
}

// ==========================================================================
// FILTRO GLOBAL COMPARTIDO
// ==========================================================================
window.fechaSeleccionada = "";

// ==========================================================================
// VALIDAR SESIÓN
// ==========================================================================
async function getSessionOrFail() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    if (typeof showToast === "function") {
      showToast("error", "Sesión expirada", "Vuelve a iniciar sesión");
    }
    await supabase.auth.signOut();
    await refreshGate();
    throw new Error("No session");
  }

  return session;
}
window.getSessionOrFail = getSessionOrFail;

// ==========================================================================
// GUARDAR BATCH
// ==========================================================================
window.guardarLimpiezaBatch = async function(registros) {
  try {
    const session = await getSessionOrFail();

    const payload = registros.map(r => ({
      user_id: session.user.id,
      factura: r.factura,
      billingid: r.billingid,
      monto: r.monto,
      raiz: r.raiz,
      cedula: r.cedula,
      tipo_limpieza: r.tipo_limpieza
    }));

    const { error } = await supabase.from("limpiezas").insert(payload);

    if (error) {
      console.error("🔥 ERROR REAL:", error);
      if (typeof showToast === "function") showToast("error", "Error", error.message);
    }
  } catch (err) {
    console.warn("Guardado cancelado por sesión");
  }
};

// ==========================================================================
// BUSCAR POR CÉDULAS
// ==========================================================================
window.buscarPorCedulasND = async function(valores) {
  const consultas = valores.map(v => `cedula.eq.${v},raiz.eq.${v}`);

  const { data, error } = await supabase
    .from("limpiezas")
    .select("raiz,billingid,monto,factura,cedula")
    .or(consultas.join(","));

  if (error) throw error;

  const facturasVistas = new Set();
  return (data || []).filter(r => {
    if (facturasVistas.has(r.factura)) return false;
    facturasVistas.add(r.factura);
    return true;
  });
};

// ==========================================================================
// AUTH & GATE
// ==========================================================================
async function isAuthorized() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return false;

  const { data } = await supabase
    .from("autorizados")
    .select("user_id, iniciales")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (data) {
    window.currentUserInitials = data.iniciales;
  }

  return !!data;
}

async function refreshGate() {
  const { data: { session } } = await supabase.auth.getSession();
  const logged = !!session?.user;

  if (!logged) {
    if (gate) gate.style.display = "grid";
    return;
  }

  const email = session.user.email || "";
  const username = email.split("@")[0];
  if (username) setUserTag(username);

  const ok = await isAuthorized();

  if (!ok) {
    await supabase.auth.signOut();
    if (gate) gate.style.display = "grid";
    setMsg("❌ Usuario NO autorizado.");
    return;
  }

  if (gate) gate.style.display = "none";
  setMsg("");
}
window.refreshGate = refreshGate;

window.authLogin = async () => {
  setMsg("");
  const user = document.getElementById("authUser").value.trim().toLowerCase();
  const pass = document.getElementById("authPass").value.trim();

  if (!user || !pass) return setMsg("Falta usuario o contraseña.");

  const email = `${user}@${USER_DOMAIN}`;
  const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if (error) return setMsg(error.message);

  setUserTag(user);
  await refreshGate();
  await cargarHistorial(true);
};

window.authLogout = async () => {
  await supabase.auth.signOut();
  await refreshGate();
};

// ==========================================================================
// HISTORIAL CON PAGINACIÓN Y FILTRO
// ==========================================================================
let page = 0;
const limit = 200;
let loading = false;
let noMoreData = false;
let cacheUsuarios = null;

window.cargarHistorial = async (reset = true) => {
  try {
    if (loading) return;
    if (!reset && noMoreData) return;

    await getSessionOrFail();

    const tbody = document.getElementById("tablaHistorial");
    if (!tbody) return;

    if (reset) {
      tbody.innerHTML = "";
      page = 0;
      noMoreData = false;
    }

    loading = true;

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("limpiezas")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    // 🔥 FILTRO DE FECHA LEÍDO DIRECTAMENTE DE window.fechaSeleccionada
    if (window.fechaSeleccionada) {
      query = query
        .gte("created_at", `${window.fechaSeleccionada}T00:00:00`)
        .lte("created_at", `${window.fechaSeleccionada}T23:59:59`);
    }

    const { data, error } = await query;

    

    // Cachear nombres de usuarios autorizados
    if (!cacheUsuarios) {
      const { data: usuarios } = await supabase.from("autorizados").select("user_id, Nombre");
      cacheUsuarios = {};
      (usuarios || []).forEach(u => {
        cacheUsuarios[u.user_id] = u.Nombre;
      });
    }

    if (error) {
      console.error("ERROR SUPABASE:", error);
      loading = false;
      return;
    }

    if (!data || data.length === 0) {
      noMoreData = true;
      loading = false;
      return;
    }

    const facturasVistas = new Set();
    const fragment = document.createDocumentFragment();

    data.forEach(item => {
      const factura = String(item.factura || "").trim();
      if (facturasVistas.has(factura)) return;
      facturasVistas.add(factura);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <input type="checkbox" class="chkHist" data-json="${encodeURIComponent(JSON.stringify(item))}">
        </td>
        <td>${item.factura ?? ""}</td>
        <td>${item.billingid ?? ""}</td>
        <td>${item.monto ?? ""}</td>
        <td>${item.raiz ?? ""}</td>
        <td>${item.tipo_limpieza ?? "-"}</td>
        <td>${item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
        <td>${item.cedula ?? ""}</td>
        <td>${cacheUsuarios[item.user_id] ?? "Usuario desconocido"}</td>
      `;
      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    page++;
    loading = false;
  } catch (e) {
    loading = false;
    console.warn("Historial cancelado por sesión");
  }
};

// ==========================================================================
// SCROLL INFINITO & REALTIME
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#page-historial div[style*='overflow:auto']");
  if (container) {
    container.addEventListener("scroll", () => {
      const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
      if (nearBottom) cargarHistorial(false);
    });
  }
});

supabase
  .channel("realtime-limpiezas")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "limpiezas" }, () => {
    cargarHistorial(true);
  })
  .subscribe();

// Inicialización de Auth y carga inicial
(async () => {
  await refreshGate();
  await cargarHistorial(true);
  // Notificar que supabase está listo
  window.dispatchEvent(new Event("supabase-ready"));
})();