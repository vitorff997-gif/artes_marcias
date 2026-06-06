// ================================
//  ARTES MARCIAIS — APP.JS
// ================================

let filtroAtivo = 'todos';
let termoBusca = '';

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderCards();

  document.getElementById('search-input').addEventListener('input', e => {
    termoBusca = e.target.value.toLowerCase();
    renderCards();
  });

  document.getElementById('search-mobile').addEventListener('input', e => {
    termoBusca = e.target.value.toLowerCase();
    renderCards();
  });

  // scroll para cards ao clicar no CTA
  document.getElementById('btn-ver-artes').addEventListener('click', () => {
    document.getElementById('home-page').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('cards-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
});

// ---- FILTROS ----
function setFiltro(tipo) {
  filtroAtivo = tipo;
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.tipo === tipo);
  });
  renderCards();
}

// ---- RENDER CARDS ----
function renderCards() {
  const grid = document.getElementById('cards-grid');
  const count = document.getElementById('cards-count');

  let lista = ARTES.filter(a => {
    const matchFiltro = filtroAtivo === 'todos' || a.tipo === filtroAtivo;
    const matchBusca  = !termoBusca ||
      a.nome.toLowerCase().includes(termoBusca) ||
      a.apelido.toLowerCase().includes(termoBusca) ||
      a.origem.toLowerCase().includes(termoBusca) ||
      a.tags.some(t => t.toLowerCase().includes(termoBusca)) ||
      a.resumo.toLowerCase().includes(termoBusca);
    return matchFiltro && matchBusca;
  });

  count.textContent = `${lista.length} arte${lista.length !== 1 ? 's' : ''} encontrada${lista.length !== 1 ? 's' : ''}`;

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>NENHUM RESULTADO</h3>
        <p>Tente outro termo de busca ou remova os filtros</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map((arte, i) => buildCard(arte, i)).join('');
}

function buildCard(arte, i) {
  const delay = (i % 12) * 60;
  const estilosBadge = arte.estilos
    ? `<div class="estilos-badge">✦ ${arte.estilos.length} Estilos</div>`
    : '';

  return `
  <div class="arte-card card-anim"
       style="--card-color:${arte.cor}; animation-delay:${delay}ms"
       onclick="abrirDetalhe('${arte.id}')">
    <div class="card-img-wrap">
      <img class="card-img" src="${arte.imagem}" alt="${arte.nome}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80'"/>
      <div class="card-img-overlay"></div>
      <span class="card-tipo-badge">${labelTipo(arte.tipo)}</span>
    </div>
    <div class="card-body">
      <div>
        <div class="card-nome">${arte.nome}</div>
        <div class="card-apelido">${arte.apelido}</div>
        ${estilosBadge}
      </div>
      <div class="card-origem">
        <span class="origem-dot"></span>
        ${arte.origem} · ${arte.seculo}
      </div>
      <p class="card-resumo">${arte.resumo}</p>
      <div class="card-tags">
        ${arte.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
    <div class="card-footer">
      <span class="card-seculo">${arte.seculo}</span>
      <div class="card-arrow">→</div>
    </div>
  </div>`;
}

function labelTipo(tipo) {
  const map = {
    striking: 'Striking',
    grappling: 'Grappling',
    misto: 'Misto',
    'defesa pessoal': 'Defesa Pessoal'
  };
  return map[tipo] || tipo;
}

// ---- DETALHE ----
function abrirDetalhe(id) {
  const arte = ARTES.find(a => a.id === id);
  if (!arte) return;

  document.getElementById('home-page').style.display = 'none';
  const page = document.getElementById('detalhe-page');
  page.style.display = 'block';
  page.style.cssText = `display:block; --arte-cor:${arte.cor}`;
  page.innerHTML = buildDetalhe(arte);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarHome() {
  document.getElementById('detalhe-page').style.display = 'none';
  document.getElementById('home-page').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildDetalhe(arte) {
  const estilosHTML = arte.estilos ? `
    <div class="detalhe-section full">
      <h3>🥋 Estilos do ${arte.nome}</h3>
      <div class="estilos-grid">
        ${arte.estilos.map(e => `
          <div class="estilo-card" style="--estilo-cor:${e.cor}">
            <div class="estilo-header" style="background:${e.cor}">
              <div>
                <div class="estilo-nome">${e.nome}</div>
                <div class="estilo-fundador">Fundador: ${e.fundador}</div>
              </div>
            </div>
            <div class="estilo-body">
              <div class="estilo-origem">${e.origem}</div>
              <p>${e.caracteristicas}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  return `
  <div class="detalhe-hero">
    <img class="detalhe-hero-img" src="${arte.imagemDetalhe || arte.imagem}" alt="${arte.nome}"
         onerror="this.src='${arte.imagem}'"/>
    <div class="detalhe-hero-overlay"></div>
    <div class="detalhe-hero-content">
      <div class="detalhe-breadcrumb" onclick="voltarHome()">
        ← Todas as Artes Marciais
      </div>
      <div class="detalhe-tipo-badge">${labelTipo(arte.tipo)}</div>
      <div class="detalhe-titulo">${arte.nome}</div>
      <div class="detalhe-apelido">"${arte.apelido}"</div>
    </div>
  </div>

  <div class="detalhe-body" style="--arte-cor:${arte.cor}">
    <div class="detalhe-meta">
      <div class="meta-item">
        <div class="meta-label">Origem</div>
        <div class="meta-value">${arte.origem}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Período</div>
        <div class="meta-value">${arte.seculo}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Tipo</div>
        <div class="meta-value">${labelTipo(arte.tipo)}</div>
      </div>
      ${arte.estilos ? `<div class="meta-item">
        <div class="meta-label">Estilos</div>
        <div class="meta-value">${arte.estilos.length} Estilos</div>
      </div>` : ''}
    </div>

    <div class="detalhe-grid">

      <div class="detalhe-section full">
        <h3>📜 História</h3>
        <p>${arte.historia}</p>
      </div>

      <div class="detalhe-section">
        <h3>❓ Por que surgiu</h3>
        <p>${arte.porque}</p>
      </div>

      <div class="detalhe-section">
        <h3>⚔️ Como funciona</h3>
        <p>${arte.comoFunciona}</p>
      </div>

      <div class="detalhe-section">
        <h3>🎯 Graduação</h3>
        <p>${arte.graduacao}</p>
      </div>

      <div class="detalhe-section">
        <h3>🏆 Campeonatos</h3>
        <p>${arte.campeonatos}</p>
      </div>

      ${estilosHTML}

      <div class="detalhe-section full">
        <h3>👤 Para qual perfil de pessoa</h3>
        <div class="perfil-grid">
          ${arte.perfilIdeal.map(p => `
            <div class="perfil-card">
              <p>${p}</p>
            </div>`).join('')}
        </div>
      </div>

      <div class="detalhe-section full">
        <h3>💡 Curiosidades</h3>
        <div class="curiosidades-grid">
          ${arte.curiosidades.map(c => `
            <div class="curiosidade-item">${c}</div>`).join('')}
        </div>
      </div>

    </div>

    <button class="btn-voltar" onclick="voltarHome()">← Voltar para todas as artes marciais</button>
  </div>`;
}

// ---- NAV ----
function navHome() {
  voltarHome();
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
}

function navArtes() {
  if (document.getElementById('detalhe-page').style.display === 'block') voltarHome();
  setTimeout(() => {
    document.getElementById('cards-section').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}
