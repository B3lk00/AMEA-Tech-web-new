async function ucitajOglaseIndex() {
  const url = `./oglasi/index.json?ts=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Ne mogu ucitati oglasi/index.json");
  const data = await res.json();
  return data.items || [];
}

function esc(s){ return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function renderOglasi(items, container) {
  if (!items.length) {
    container.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
    return;
  }

  container.innerHTML = items.map(o => `
    <div class="product-card" style="background:#fff;color:#111;border:1px solid #e1e7f2;border-radius:12px;padding:16px;margin:12px 0;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <h3 style="margin:0;font-size:18px;">${esc(o.naziv)}</h3>
        <div style="font-weight:700;">${esc(o.cijena)}</div>
      </div>

      <div style="margin-top:8px;opacity:.85;">
        ${o.stanje ? `<span style="display:inline-block;padding:4px 8px;border-radius:999px;border:1px solid #cfd7ea;font-size:12px;">${esc(o.stanje)}</span>` : ""}
      </div>

      ${o.opis ? `<p style="margin:10px 0 0;opacity:.9;">${esc(o.opis)}</p>` : ""}

      ${(o.spec || []).length ? `
        <ul style="margin:10px 0 0 18px;opacity:.9;">
          ${(o.spec || []).slice(0,4).map(s => `<li>${esc(s)}</li>`).join("")}
        </ul>` : ""
      }

      <div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap;">
        ${o.kontakt?.telefon ? `<a style="color:inherit;text-decoration:underline" href="tel:${esc(o.kontakt.telefon)}">📞 ${esc(o.kontakt.telefon)}</a>` : ""}
        ${o.kontakt?.email ? `<a style="color:inherit;text-decoration:underline" href="mailto:${esc(o.kontakt.email)}">✉️ ${esc(o.kontakt.email)}</a>` : ""}
      </div>
    </div>
  `).join("");
}

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi");
  if (!container) return;

  container.innerHTML = `<p style="opacity:.8;">Učitavam oglase...</p>`;

  try {
    const items = await ucitajOglaseIndex();
    const filtrirano = items.filter(o => o.kategorija === kategorija);
    renderOglasi(filtrirano, container);
  } catch (e) {
    container.innerHTML = `<p style="color:#b00;">Greška: ${e.message}</p>`;
  }
}
