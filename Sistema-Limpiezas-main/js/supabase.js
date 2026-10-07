(function() {
  try {
    // ==========================================================================
    // INICIALIZACIÓN CLIENTE SUPABASE (Compatible con UMD y Navegador)
    // ==========================================================================
    const createClientFn = (window.supabase && typeof window.supabase.createClient === "function")
      ? window.supabase.createClient
      : (window.supabaseLib?.createClient || null);

    const SUPABASE_URL = "https://upxhiylyiebljnpfgmut.supabase.co";
    const SUPABASE_KEY = "sb_publishable_ctDXquEkqLpXpuzOoRvtXQ_Vazap6tB";

    const supabaseClient = createClientFn ? createClientFn(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }) : null;

    window.supabase = supabaseClient;
    window.supabaseClient = supabaseClient;

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
      if (!supabaseClient) throw new Error("Supabase no inicializado");
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        if (typeof showToast === "function") {
          showToast("error", "Sesión expirada", "Vuelve a iniciar sesión");
        }
        await supabaseClient.auth.signOut();
        await refreshGate();
        throw new Error("No session");
      }

      return session;
    }
    window.getSessionOrFail = getSessionOrFail;

    // ==========================================================================
    // GUARDAR / ACTUALIZAR LIMPIEZAS (UPSERT SIN DUPLICADOS)
    // ==========================================================================
    window.guardarLimpiezaBatch = async function(registros) {
      if (!Array.isArray(registros) || registros.length === 0) return;

      const client = window.supabase || supabaseClient;
      if (!client) {
        console.error("Cliente Supabase no disponible para guardar.");
        return;
      }

      try {
        const { data: { session } } = await client.auth.getSession();
        const userId = session?.user?.id || null;

        const registrosLimpios = registros.map(r => ({
          factura: String(r.factura).trim(),
          billingid: String(r.billingid).trim(),
          monto: Number(r.monto) || 0,
          raiz: String(r.raiz).trim(),
          cedula: String(r.cedula || "").trim(),
          tipo_limpieza: r.tipo_limpieza || "NC200",
          user_id: userId,
          created_at: new Date().toISOString()
        }));

        const { data, error } = await client
          .from("limpiezas")
          .upsert(registrosLimpios, {
            onConflict: "factura"
          });

        if (error) {
          console.error("Error al guardar/actualizar en Supabase:", error);
        } else {
          console.log(`✅ ${registrosLimpios.length} registros guardados/actualizados.`);
        }

      } catch (err) {
        console.error("Excepción en guardarLimpiezaBatch:", err);
      }
    };

    // ==========================================================================
    // BUSCAR POR CÉDULAS
    // ==========================================================================
    window.buscarPorCedulasND = async function(valores) {
      if (!supabaseClient) return [];
      const consultas = valores.map(v => `cedula.eq.${v},raiz.eq.${v}`);

      const { data, error } = await supabaseClient
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
      if (!supabaseClient) return false;
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session?.user) return false;

      const { data } = await supabaseClient
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
      if (!supabaseClient) return;
      const { data: { session } } = await supabaseClient.auth.getSession();
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
        await supabaseClient.auth.signOut();
        if (gate) gate.style.display = "grid";
        setMsg("❌ Usuario NO autorizado.");
        return;
      }

      if (gate) gate.style.display = "none";
      setMsg("");
    }
    window.refreshGate = refreshGate;

    window.authLogin = async () => {
      if (!supabaseClient) return setMsg("Error al conectar con el servidor.");
      setMsg("");
      const user = document.getElementById("authUser").value.trim().toLowerCase();
      const pass = document.getElementById("authPass").value.trim();

      if (!user || !pass) return setMsg("Falta usuario o contraseña.");

      const email = `${user}@${USER_DOMAIN}`;
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });

      if (error) return setMsg(error.message);

      setUserTag(user);
      await refreshGate();
      await window.cargarHistorial(true);
    };

    window.authLogout = async () => {
      if (supabaseClient) await supabaseClient.auth.signOut();
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

    // ==========================================================================
    // HISTORIAL CON FILTROS DIRECTOS DEL DOM
    // ==========================================================================
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
          const chkAll = document.getElementById("chkSelectAllHist");
          if (chkAll) chkAll.checked = false;
        }

        loading = true;

        const from = page * limit;
        const to = from + limit - 1;

        let query = supabaseClient
          .from("limpiezas")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);

        // 1. LEER VALORES DIRECTAMENTE DEL DOM
        const inputFecha = document.getElementById("fechaFiltro");
        const selectTipo = document.getElementById("tipoFiltro");
        const inputCedula = document.getElementById("cedulaFiltro");

        const fechaVal = inputFecha ? inputFecha.value.trim() : "";
        const tipoVal = selectTipo ? selectTipo.value.trim() : "";
        const cedulaVal = inputCedula ? inputCedula.value.trim() : "";

        // 2. APLICAR FILTRO DE FECHA
        if (fechaVal) {
          query = query
            .gte("created_at", `${fechaVal}T00:00:00`)
            .lte("created_at", `${fechaVal}T23:59:59`);
        }

        // 3. APLICAR FILTRO DE TIPO
        if (tipoVal) {
          query = query.ilike("tipo_limpieza", `%${tipoVal}%`);
        }

        // 4. APLICAR FILTRO DE CÉDULA(S)
        if (cedulaVal) {
          const tokens = cedulaVal.split(/[,;\s]+/).map(t => t.trim().replace(/[%_(),]/g, "")).filter(Boolean);
          if (tokens.length === 1) {
            query = query.ilike("cedula", `%${tokens[0]}%`);
          } else if (tokens.length > 1) {
            const orExpr = tokens.map(t => `cedula.ilike.%${t}%`).join(",");
            query = query.or(orExpr);
          }
        }

        const { data, error } = await query;

        // Cachear nombres de usuarios autorizados
        if (!cacheUsuarios) {
          const { data: usuarios } = await supabaseClient.from("autorizados").select("user_id, Nombre");
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
            <td style="text-align:center;">
              <input type="checkbox" class="chkHist" data-json="${encodeURIComponent(JSON.stringify(item))}">
            </td>
            <td>${item.factura ?? ""}</td>
            <td>${item.billingid ?? ""}</td>
            <td>${item.monto ?? ""}</td>
            <td>${item.raiz ?? ""}</td>
            <td><span class="pill" style="font-size:11px;">${item.tipo_limpieza ?? "-"}</span></td>
            <td>${item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
            <td>${item.cedula ?? ""}</td>
            <td>${cacheUsuarios[item.user_id] ?? "Usuario desconocido"}</td>
            <td style="text-align:center;">
              <button type="button" class="btn-del-row" title="Borrar esta limpieza" onclick="confirmarBorrarUna('${item.id || ''}', '${item.factura || ''}')">🗑️</button>
            </td>
          `;
          fragment.appendChild(tr);
        });

        tbody.appendChild(fragment);
        page++;
        loading = false;
      } catch (e) {
        loading = false;
        console.warn("Historial cancelado por sesión:", e);
      }
    };

    // ==========================================================================
    // BORRAR REGISTROS DE LIMPIEZAS
    // ==========================================================================
    window.ejecutarBorradoLimpiezas = async function(items) {
      if (!Array.isArray(items) || items.length === 0) return;

      const client = window.supabase || supabaseClient;
      if (!client) {
        alert("❌ Error: No se pudo conectar con la base de datos de Supabase. Revisa tu conexión a internet.");
        return;
      }

      try {
        if (typeof getSessionOrFail === "function") {
          await getSessionOrFail();
        }

        const ids = items.map(it => it.id).filter(Boolean);
        const facturas = items.map(it => it.factura).filter(Boolean);

        let resError = null;

        if (ids.length > 0) {
          const { error } = await client.from("limpiezas").delete().in("id", ids);
          resError = error;
        } else if (facturas.length > 0) {
          const { error } = await client.from("limpiezas").delete().in("factura", facturas);
          resError = error;
        }

        if (resError) {
          console.error("Error al borrar limpiezas en Supabase:", resError);
          alert("❌ No se pudo eliminar de la base de datos: " + (resError.message || "Error de permisos"));
          if (typeof showToast === "function") {
            showToast("error", "Error al borrar", resError.message || "No se pudo eliminar los registros.");
          }
          return;
        }

        const msj = items.length === 1 ? "1 limpieza eliminada con éxito." : `${items.length} limpiezas eliminadas con éxito.`;
        if (typeof showToast === "function") {
          showToast("success", "Eliminado", msj);
        }

        // Recargar tabla de historial
        if (typeof window.cargarHistorial === "function") {
          await window.cargarHistorial(true);
        }

        // Actualizar ranking si está disponible
        if (typeof cargarEstadisticas === "function") {
          cargarEstadisticas(true);
        }
      } catch (err) {
        console.error("Excepción al ejecutar borrado:", err);
        alert("❌ Ocurrió un error al intentar eliminar: " + (err.message || err));
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
          if (nearBottom) window.cargarHistorial(false);
        });
      }
    });

    if (supabaseClient) {
      supabaseClient
        .channel("realtime-limpiezas")
        .on("postgres_changes", { event: "*", schema: "public", table: "limpiezas" }, () => {
          if (typeof window.cargarHistorial === "function") window.cargarHistorial(true);
        })
        .subscribe();
    }

    // Inicialización de Auth y carga inicial
    (async () => {
      await refreshGate();
      await window.cargarHistorial(true);
      window.dispatchEvent(new Event("supabase-ready"));
    })();
  } catch(err) {
    console.error("FATAL ERROR IN SUPABASE.JS:", err);
    window.__supabaseError = (err && (err.stack || err.toString())) || "Unknown error";
  }
})();