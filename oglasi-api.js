const API_BASE = "https://amea-oglasi-api.belmins1617.workers.dev";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"': "&quot;", "'":"&#39;"
  }[m]));
}

async function ucitajOglase(kategorija) {
  const res = await fetch(`${API_BASE}/api/oglasi?kategorija=${encodeURIComponent(kategorija)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ne mogu učitati oglase");
  const data = await res.json();
  return data.items || [];
}

function renderPager(container, page, totalPages, onPrev, onNext){
  const pager = document.createElement("div");
  pager.style.display = "flex";
  pager.style.gap = "10px";
  pager.style.alignItems = "center";
  pager.style.justifyContent = "center";
  pager.style.margin = "18px 0";

  const btnPrev = document.createElement("button");
  btnPrev.textContent = "← Prethodna";
  btnPrev.disabled = page <= 1;
  btnPrev.style.padding = "10px 14px";
  btnPrev.style.borderRadius = "12px";
  btnPrev.style.border = "1px solid rgba(255,255,255,.15)";
  btnPrev.style.background = "rgba(255,255,255,.08)";
  btnPrev.style.color = "#fff";
  btnPrev.style.cursor = "pointer";
  btnPrev.onclick = onPrev;

  const info = document.createElement("div");
  info.style.opacity = ".8";
  info.textContent = `Stranica ${page} / ${totalPages}`;

  const btnNext = document.createElement("button");
  btnNext.textContent = "Sljedeća →";
  btnNext.disabled = page >= totalPages;
  btnNext.style.padding = "10px 14px";
  btnNext.style.borderRadius = "12px";
  btnNext.style.border = "1px solid rgba(255,255,255,.15)";
  btnNext.style.background = "rgba(255,255,255,.08)";
  btnNext.style.color = "#fff";
  btnNext.style.cursor = "pointer";
  btnNext.onclick = onNext;

  pager.appendChild(btnPrev);
  pager.appendChild(info);
  pager.appendChild(btnNext);
  container.appendChild(pager);
}

function renderOglasiPaged(items, mount, pageSize){
  let page = 1;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  function draw(){
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    mount.innerHTML = "";

    if (!items.length) {
      mount.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
      return;
    }

    // wrapper grid ostaje tvoj .product-list
    const grid = document.createElement("div");
    grid.className = "product-list";
    grid.id = "oglasiGrid";

    grid.innerHTML = slice.map(o => {
      const href = `oglas.html?id=${encodeURIComponent(o.id)}`;
      const thumb = (Array.isArray(o.slike) && o.slike.length) ? o.slike[0] : "";

      return `
        <a href="${href}" style="text-decoration:none;color:inherit;display:block">
          <article class="ad-card">
            ${thumb ? `<img class="ad-img" src="${esc(thumb)}" alt="">` : ``}
            <div class="ad-body">
              <div class="ad-top">
                <h3 class="ad-title">${esc(o.naziv || "")}</h3>
                <div class="ad-price">${esc(o.cijena || "")}</div>
              </div>
              <div class="ad-meta">
                ${o.stanje ? `<span class="ad-badge">${esc(o.stanje)}</span>` : ""}
              </div>
              ${o.opis ? `<p class="ad-desc">${esc(o.opis)}</p>` : ""}
              ${(o.spec || []).length ? `<ul class="ad-spec">${o.spec.slice(0,4).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>` : ""}
            </div>
          </article>
        </a>
      `;
    }).join("");

    mount.appendChild(grid);

    renderPager(
      mount,
      page,
      totalPages,
      () => { page = Math.max(1, page-1); draw(); window.scrollTo({top:0, behavior:"smooth"}); },
      () => { page = Math.min(totalPages, page+1); draw(); window.scrollTo({top:0, behavior:"smooth"}); }
    );
  }

  draw();
}

async function initOglasi(kategorija, opts = {}) {
  const mount = document.getElementById("oglasiMount");
  if (!mount) return;

  const pageSize = opts.pageSize || 6;
  mount.innerHTML = "Učitavam...";

  try {
    const items = await ucitajOglase(kategorija);
    renderOglasiPaged(items, mount, pageSize);
  } catch (e) {
    mount.innerHTML = `<p style="color:#ff4d4d;">Greška: ${esc(e.message)}</p>`;
  }
}

window.initOglasi = initOglasi;
