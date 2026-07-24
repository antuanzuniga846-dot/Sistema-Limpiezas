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

function setMsg(t=""){ if(msg) msg.textContent = t; }

function setUserTag(tag){
  const t = String(tag || "").trim();
  if(!t) return;
  window.currentUserTag = t;
  localStorage.setItem("userTag", t);
}

// ============================
// FILTROS
// ============================
let fechaSeleccionada = "";

// ============================
// VALIDAR SESIÓN
// ============================
async function getSessionOrFail(){
  const { data: { session } } = await supabase.auth.getSession();

  if(!session?.user){
    showToast("error","Sesión expirada","Vuelve a iniciar sesión");
    await supabase.auth.signOut();
    await refreshGate();
    throw new Error("No session");
  }

  return session;
}

// ============================
// GUARDAR
// ============================
window.guardarLimpiezaBatch = async function(registros){
  try{
    const session = await getSessionOrFail();
    const cedula = document.getElementById("cedula").value.trim();

      if (!cedula) {
          showToast("error", "Falta la cédula", "Debes ingresar una cédula antes de generar.");
          return;
      }

    const payload = registros.map(r => ({
      user_id: session.user.id,
      factura: r.factura,
      billingid: r.billingid,
      monto: r.monto,
      raiz: r.raiz,
      cedula: cedula
    }));

    const { error } = await supabase
      .from("limpiezas")
      .insert(payload);

    if(error){
      console.error("🔥 ERROR REAL:", error);
      showToast("error","Error", error.message);
    }

  } catch(err){
    console.warn("Guardado cancelado por sesión");
  }
};

// ============================
// BUSCAR RAICES ND
// ============================

window.buscarPorRaizND = async function(raiz){

  const { data, error } = await supabase
    .from("limpiezas")
    .select("raiz,billingid,monto,factura,cedula")
    .eq("raiz", raiz);

  if(error) throw error;

  return data || [];
};

window.buscarPorRaicesND = async function(raices){

  const { data, error } = await supabase
    .from("limpiezas")
    .select("raiz,billingid,monto,factura")
    .in("raiz", raices);

  if(error) throw error;

  const facturasVistas = new Set();

  return (data || []).filter(r => {

    if(facturasVistas.has(r.factura)){
      return false;
    }

    facturasVistas.add(r.factura);
    return true;
  });
};
// ============================
// AUTH
// ============================
async function isAuthorized(){
  const { data: { session } } = await supabase.auth.getSession();
  if(!session?.user) return false;

  const { data } = await supabase
    .from("autorizados")
    .select("user_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  return !!data;
}

async function refreshGate(){
  const { data: { session } } = await supabase.auth.getSession();
  const logged = !!session?.user;

  if(!logged){
    gate.style.display = "grid";
    return;
  }

  const email = session.user.email || "";
  const username = email.split("@")[0];
  if(username) setUserTag(username);

  const ok = await isAuthorized();

  if(!ok){
    await supabase.auth.signOut();
    gate.style.display = "grid";
    setMsg("❌ Usuario NO autorizado.");
    return;
  }

  gate.style.display = "none";
  setMsg("");
}

// ============================
// LOGIN
// ============================
window.authLogin = async () => {
  setMsg("");

  const user = document.getElementById("authUser").value.trim().toLowerCase();
  const pass = document.getElementById("authPass").value.trim();

  if(!user || !pass) return setMsg("Falta usuario o contraseña.");

  const email = `${user}@${USER_DOMAIN}`;

  const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if(error) return setMsg(error.message);

  setUserTag(user);
  await refreshGate();
};

window.authLogout = async () => {
  await supabase.auth.signOut();
  await refreshGate();
};

// ============================
// SCROLL CONFIG
// ============================
let page = 0;
const limit = 200;
let loading = false;
let noMoreData = false;

// ============================
// HISTORIAL CON FILTRO
// ============================
window.cargarHistorial = async (reset = true) => {
  try{
    if(loading || noMoreData) return;

    await getSessionOrFail();

    const tbody = document.getElementById("tablaHistorial");

    if(reset){
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

    // 🔥 APLICAR FILTRO DE FECHA AQUÍ (CORRECTO)
    if (fechaSeleccionada) {
      query = query
        .gte("created_at", fechaSeleccionada + "T00:00:00")
        .lte("created_at", fechaSeleccionada + "T23:59:59");
    }

    const { data, error } = await query;

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

data.forEach(item => {

  const factura = String(item.factura || "").trim();

  if(facturasVistas.has(factura)){
    return;
  }

  facturasVistas.add(factura);

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="checkbox" class="chkHist"
      data-json="${encodeURIComponent(JSON.stringify(item))}"></td>
    <td>${item.factura ?? ""}</td>
    <td>${item.billingid ?? ""}</td>
    <td>${item.monto ?? ""}</td>
    <td>${item.raiz ?? ""}</td>
    <td>${item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
  `;

  tbody.appendChild(tr);
});

    page++;
    loading = false;

  } catch(e){
    console.warn("Historial cancelado por sesión");
  }
};


// ============================
// SCROLL INFINITO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#page-historial div[style*='overflow:auto']");

  if(!container) return;

  container.addEventListener("scroll", () => {
    const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

    if(nearBottom){
      cargarHistorial(false);
    }
  });
});

// ============================
// REALTIME
// ============================
supabase
  .channel('realtime-limpiezas')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'limpiezas'
  }, () => {
    cargarHistorial(true);
  })
  .subscribe();

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  await refreshGate();
  cargarHistorial(true);
});

