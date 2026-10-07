# ⚡ Sistema de Limpiezas

Aplicación web integral para la automatización, generación, procesamiento y control de registros de limpiezas de facturación (**Notas de Crédito**, **Notas de Débito** y **Acometidas**), con historial sincronizado en la nube, métricas en tiempo real y plantillas operativas.

---

## 🚀 Características Principales

### 🧾 1. Generador de Notas de Crédito (NC)
- Procesamiento inteligente de tablas copiadas directamente desde hojas de cálculo o sistemas de facturación con columnas: `Factura`, `Billing Account` y `Monto a Pagar`.
- Asignación de **Raíz principal** y **Cédula**.
- Soporte para múltiples **Raíces extras**, cada una con su propia tabla de datos.
- Generación automática de registros formateados (formato `CM,908,...`) listos para el portapapeles.
- Guardado y actualización automática en base de datos (**Supabase**) sin duplicar facturas.

### 📄 2. Generador de Notas de Débito (ND)
- Procesamiento estructurado por columnas (`Raíz`, `Billing`, `Monto`, `Factura`, `Cédula`).
- Clasificación por comentario de operación:
  - *Reversión Proyecto Venta Servicio Móvil*
  - *Reversiones Híbridos, Incubadora, etc.*
  - *Limpieza NC 200*
- Detección automática de raíces ND y adición dinámica de reglas y raíces extras.
- Generación y copiado directo en formato `IN,911,...`.

### 🔌 3. Generador de Acometidas
- Procesamiento ultra rápido de datos de acometida completa.
- Normalización de montos y conteo en tiempo real de registros procesados.

### 📂 4. Historial de Limpiezas
- **Sincronización en tiempo real** con la base de datos de Supabase.
- **Filtros avanzados:**
  - 📅 **Por fecha:** selector visual con Flatpickr.
  - 🏷️ **Por tipo:** filtro por `NC200`, `ND200`, `ND300` o todos.
  - 🔍 **Por Cédula(s):** permite buscar por una cédula o ingresar múltiples cédulas separadas por comas o espacios.
- **Interacción intuitiva:**
  - Clic en una fila para seleccionar automáticamente todos los registros asociados a la misma raíz.
  - Casilla en el encabezado para marcar o desmarcar todos los registros visibles.
  - Botón **➡️ Usar en ND** para trasladar los registros seleccionados directamente al generador de ND.
- **Eliminación segura con alerta de confirmación:**
  - Botón general **🗑️ Borrar limpiezas** para eliminar los registros marcados.
  - Botón individual **🗑️** en cada fila para borrar registros puntuales.
  - **Alerta modal de confirmación** previa a la eliminación que detalla la cantidad de registros o número de factura a borrar, evitando eliminaciones accidentales.

### 📊 5. Estadísticas & Ranking
- Conexión a la vista/procedimiento de ranking en Supabase.
- Indicadores clave (**KPIs**): Agente líder, cantidad de agentes activos y total de cédulas únicas procesadas.
- **Podio Top 3** de agentes.
- **Gráfica comparativa interactiva** (Chart.js) comparando cédulas únicas vs. total de registros.
- Tabla detallada con posiciones y desglose por usuario.

### 📁 6. Plantillas Operativas (OneMarketer)
- Acceso con un solo clic a plantillas estandarizadas para agilizar la gestión de casos:
  - *Notas de Crédito*
  - *Autorización*
  - *Cancelación*
  - *Despacho*
  - *Error de Aprovisionamiento*
  - *Cambio de SIM*
  - *Casos Q-flow*
  - *Rechazos*

### 🎨 7. Personalización Visual & Temas
- 11 temas de color disponibles: *Azul, Verde, Morado, Rojo, Rosado, Amarillo, Vino, Naranja, Beige, Lima y RGB*.
- Soporte para **imagen de fondo personalizada** cargada desde tu equipo.
- Control deslizante para regular la **oscuridad/contraste** del fondo y garantizar legibilidad.
- Guardado de preferencias de tema asociadas a la cuenta del usuario en Supabase.

### 🔐 8. Seguridad y Control de Acceso
- Pantalla de inicio de sesión (*Auth Gate*) integrada con **Supabase Auth**.
- Verificación de permisos en la lista de usuarios autorizados (`autorizados`).

---

## 📁 Estructura del Proyecto

```text
Sistema-Limpiezas-main/
│
├── index.html              # Interfaz principal de la aplicación y modales
├── README.md               # Documentación general del sistema
│
├── css/
│   └── styles.css          # Estilos globales, diseño responsive y temas visuales
│
├── img/
│   └── favicon.png         # Icono y logotipo de la aplicación
│
└── js/
    ├── app.js              # Inicialización general, reloj/fecha en vivo y eventos del tema
    ├── generators.js       # Lógica de procesamiento y algoritmos de generación (NC, ND, Acometida)
    ├── historial.js        # Gestión de filtros, selección masiva, traslados a ND y modales de borrado
    ├── supabase.js         # Cliente de Supabase, autenticación, queries, realtime y CRUD de limpiezas
    ├── estadisticas.js     # Métricas, podio y renderizado de gráficos con Chart.js
    ├── navigation.js       # Sistema de navegación entre páginas del panel lateral
    ├── plantillas.js       # Plantillas predefinidas para OneMarketer
    ├── theme.js            # Lógica de cambio y almacenamiento de paletas de color y fondos
    └── helpers.js          # Utilidades (toasts, formateo de montos, portapapeles)
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, Grid, Glassmorphism).
- **JavaScript:** Vanilla ES6+ modular (`type="module"` para servicios Supabase).
- **Base de Datos & Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Realtime Postgres Changes).
- **Librerías externas:**
  - [Chart.js](https://www.chartjs.org/) (Gráficos interactivos de estadísticas).
  - [Flatpickr](https://flatpickr.js.org/) (Selector de fecha y calendario).

---

## 💻 Guía de Inicio Rápido

1. **Abrir la aplicación:**
   - Puedes abrir directamente el archivo `index.html` en un navegador moderno (Chrome, Edge, Firefox, Safari).
   - Para un rendimiento óptimo de las funciones de portapapeles y módulos ES6, se recomienda servirlo mediante un servidor local (por ejemplo la extensión **Live Server** de VS Code o ejecutando `npx serve .`).

2. **Acceso:**
   - Ingresa tu usuario y contraseña en el cuadro de inicio de sesión.
   - El sistema validará tus credenciales contra la lista de usuarios autorizados.

3. **Uso de Generadores:**
   - Pega tu tabla o datos brutos en el área correspondiente.
   - Haz clic en **⚡ Generar y Copiar**. El resultado quedará listo en tu portapapeles y se almacenará en el historial.

4. **Filtrar y Gestionar el Historial:**
   - Ve a la sección **Historial**.
   - Usa los campos superiores para filtrar por fecha, tipo o una/múltiples cédulas.
   - Para transferir datos a ND, marca los registros deseados y pulsa **➡️ Usar en ND**.
   - Para eliminar registros, márcalos con las casillas y pulsa **🗑️ Borrar limpiezas**, o usa el botón individual **🗑️** en la columna de acción. Confirma en la alerta modal para completar la eliminación.

---

## 👤 Autor

**Antuan Mora Zuñiga**  
© 2026 Sistema de Limpiezas. Todos los derechos reservados.
