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

    const payload = registros.map(r => ({
      user_id: session.user.id,
      factura: r.factura,
      billingid: r.billingid,
      monto: r.monto,
      raiz: r.raiz
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

