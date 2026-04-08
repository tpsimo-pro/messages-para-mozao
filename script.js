// ============================================
//  CONFIGURAÇÃO
//  Quando o backend estiver pronto, troque a
//  URL abaixo pelo endereço do seu servidor.
// ============================================
const API_URL = "http://localhost:8000";

// ============================================
//  TRANSIÇÃO DE TELAS
// ============================================
const btnRevelar = document.getElementById("btnRevelar");
const telaEntrada = document.getElementById("entrada");
const telaPrincipal = document.getElementById("principal");

btnRevelar.addEventListener("click", () => {
  telaEntrada.style.opacity = "0";
  telaEntrada.style.transition = "opacity 0.8s ease";

  setTimeout(() => {
    telaEntrada.classList.remove("ativa");
    telaPrincipal.classList.add("ativa");

    requestAnimationFrame(() => {
      telaPrincipal.classList.add("visivel");
      iniciarContador();
      observarMemorias();
    });
  }, 800);
});

// ============================================
//  CONTADOR DE DIAS JUNTOS
// ============================================
function iniciarContador() {
  const inicio = new Date("2025-09-20");
  const hoje = new Date();
  const diff = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));

  const diasEl = document.getElementById("diasJuntos");
  if (diasEl) {
    if (diff === 0) {
      diasEl.textContent = "hoje começa tudo ♡";
    } else if (diff === 1) {
      diasEl.textContent = "1 dia juntos";
    } else {
      diasEl.textContent = `${diff} dias juntos`;
    }
  }
}

// ============================================
//  ANIMAÇÃO DAS MEMÓRIAS (Intersection Observer)
// ============================================
function observarMemorias() {
  const items = document.querySelectorAll(".memoria-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visivel");
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
}

// ============================================
//  GERADOR DE CARTAS (chama o backend)
// ============================================
const btnCarta = document.getElementById("btnCarta");
const btnCartaTexto = document.getElementById("btnCartaTexto");
const cartaTexto = document.getElementById("cartaTexto");
const cartaPlaceholder = document.getElementById("cartaPlaceholder");
const cartaLoading = document.getElementById("cartaLoading");
const cartaErro = document.getElementById("cartaErro");

btnCarta.addEventListener("click", async () => {
  // Estado: carregando
  btnCarta.disabled = true;
  btnCartaTexto.textContent = "gerando...";
  cartaPlaceholder.style.display = "none";
  cartaTexto.style.display = "none";
  cartaLoading.style.display = "flex";
  cartaLoading.style.flexDirection = "column";
  cartaErro.style.display = "none";

  try {
    const resposta = await fetch(`${API_URL}/gerar-carta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinataria: "Ellen" }),
    });

    if (!resposta.ok) throw new Error("Erro na resposta do servidor");

    const dados = await resposta.json();

    // Estado: carta recebida
    cartaLoading.style.display = "none";
    cartaTexto.style.display = "block";
    cartaTexto.textContent = dados.carta;
  } catch (erro) {
    console.error(erro);
    // Estado: erro
    cartaLoading.style.display = "none";
    cartaPlaceholder.style.display = "block";
    cartaErro.style.display = "block";
  }

  // Reabilita o botão
  btnCarta.disabled = false;
  btnCartaTexto.textContent = "gerar outra carta";
});
