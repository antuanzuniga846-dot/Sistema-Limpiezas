// ===== Toast =====
  let toastTimer = null;
  function showToast(type, title, msg){
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toastIcon");
    const t = document.getElementById("toastTitle");
    const m = document.getElementById("toastMsg");
    if(!toast) return;

    toast.classList.remove("success","error","warn");
    toast.classList.add(type);

    icon.textContent = (type === "success") ? "✓" : (type === "warn") ? "!" : "×";
    t.textContent = title;
    m.textContent = msg;

    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove("show"), 2800);
  }
  window.showToast = showToast;

  // ===== Copiar / Limpiar helpers =====
  function copiarTexto(txt){
    return navigator.clipboard.writeText(txt);
  }

  window.copiarResultado = async (mode) => {
    const id = (mode === "acometida") ? "resultado_acometida" : `resultado_${mode}`;
    const el = document.getElementById(id);
    const txt = el?.value || "";
    if(!txt.trim()) return showToast("warn","Nada que copiar","Genera primero.");
    try{
      await copiarTexto(txt);
      showToast("success","Copiado","Listo en portapapeles.");
    }catch{
      showToast("error","No se pudo copiar","Usa https o localhost.");
    }
  };

  // ===== Normalizar monto =====
  function normalizarMonto(str){
    let s = String(str || "").replace(/[₡\s]/g,"").trim();
    if(!s) return "";

    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");

    if(lastComma !== -1 && lastDot !== -1){
      if(lastComma > lastDot){
        s = s.replace(/\./g,"").replace(",",".");
      } else {
        s = s.replace(/,/g,"");
      }
    } else if(lastComma !== -1 && lastDot === -1){
      const dec = s.split(",").pop();
      if(dec.length <= 2) s = s.replace(",",".");
      else s = s.replace(/,/g,"");
    } else {
      s = s.replace(/,/g,"");
    }
    return s.replace(/[^0-9.]/g,"");
  }
  // GLOBAL: usuario actual para "tag"
  function getUsuarioActual(){
    if (window.currentUserTag && String(window.currentUserTag).trim()) {
      return String(window.currentUserTag).trim();
    }
    const ls = localStorage.getItem("userTag");
    if (ls && ls.trim()) return ls.trim();
    return "cm088320"; // fallback
  }