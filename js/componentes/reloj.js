// temporizador de cuenta regresiva para examenes
class AcmeReloj extends HTMLElement {
  constructor() {
    super();
    this.segundos = 0;
    this.intervalo = null;
    this.alTerminar = null;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="reloj">
        <span class="reloj-etiqueta">Tiempo restante</span>
        <strong class="reloj-valor">00:00</strong>
      </div>
    `;
  }

  disconnectedCallback() {
    this.detener();
  }

  iniciar(minutos, callbackFin) {
    this.detener();
    this.segundos = Math.max(1, Math.round(minutos * 60));
    this.alTerminar = callbackFin || null;
    this.actualizarVista();

    const reloj = this;
    this.intervalo = setInterval(function () {
      reloj.segundos = reloj.segundos - 1;
      reloj.actualizarVista();

      if (reloj.segundos <= 0) {
        reloj.detener();
        reloj.dispatchEvent(new CustomEvent("tiempo-agotado", { bubbles: true }));
        if (typeof reloj.alTerminar === "function") {
          reloj.alTerminar();
        }
      }
    }, 1000);
  }

  detener() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  obtenerSegundosRestantes() {
    return this.segundos;
  }

  actualizarVista() {
    const caja = this.querySelector(".reloj");
    const texto = this.querySelector(".reloj-valor");
    if (!caja || !texto) {
      return;
    }

    const minutos = Math.floor(this.segundos / 60);
    const resto = this.segundos % 60;
    const minTexto = String(minutos).padStart(2, "0");
    const segTexto = String(resto).padStart(2, "0");
    texto.textContent = minTexto + ":" + segTexto;

    // resaltar cuando queda un minuto o menos
    if (this.segundos <= 60) {
      caja.classList.add("reloj-alerta");
    } else {
      caja.classList.remove("reloj-alerta");
    }
  }
}

if (!customElements.get("acme-reloj")) {
  customElements.define("acme-reloj", AcmeReloj);
}
