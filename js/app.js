const cfg=window.NUR_CONFIG||{};
let state={products:[],articles:[],category:"kenari",pageContent:{}};
const $=s=>document.querySelector(s), money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
function waUrl(product=""){const msg=product?`Halo NUR BIRDFARM, saya ingin bertanya tentang ${product}. Apakah masih tersedia?`:"Halo NUR BIRDFARM, saya ingin bertanya tentang katalog dan ketersediaan produk.";return `https://wa.me/${(cfg.WHATSAPP_NUMBER||"").replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`}
document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waUrl();a.target="_blank";a.rel="noopener"});
function applyPageContent(pc={}){const get=(k,d)=>pc[k]!==undefined&&pc[k]!==''?pc[k]:d;
  const ann=$('#announcement'); if(ann) ann.innerHTML=get('announcement','Peternakan kenari · Tulungagung <span>Pesan langsung melalui WhatsApp ↗</span>');
  const he=$('#heroEyebrow'); if(he) he.textContent=get('hero_eyebrow','DARI KANDANG KAMI');
  const ht=$('#heroTitle'); if(ht) ht.innerHTML=get('hero_title','Burung baik<br>berawal dari<br><em>perawatan yang tepat.</em>');
  const hd=$('#heroDesc'); if(hd) hd.textContent=get('hero_desc','Kenari pilihan dan perlengkapan harian, dirawat dengan perhatian sebelum sampai ke rumah barunya.');
  const hbc=$('#heroBtnCatalog'); if(hbc) hbc.innerHTML=get('hero_btn_catalog','Jelajahi katalog <span>↘</span>');
  const hbw=$('#heroBtnWa'); if(hbw) { hbw.textContent=get('hero_btn_wa','Bicarakan kebutuhanmu ↗'); hbw.href=waUrl(); hbw.target="_blank"; hbw.rel="noopener"; }
  const hfl=$('#heroFootLeft'); if(hfl) hfl.textContent=get('hero_foot_left','01 / KENARI & PERLENGKAPAN');
  const hfr=$('#heroFootRight'); if(hfr) hfr.textContent=get('hero_foot_right','EST. NUR BIRDFARM');
  const hph=$('#heroPhoto'); if(hph) hph.src=get('hero_photo','https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1100&q=85');
  const hpn=$('#heroPhotoNote'); if(hpn) hpn.innerHTML=get('hero_photo_note','<span>01 — 04</span><b>Ruang tumbuh,<br>suara yang hidup.</b>');
  const hst=$('#heroStamp'); if(hst) hst.innerHTML=get('hero_stamp','NUR<br><b>BF</b><small>SELECTED WITH CARE</small>');
  const ce=$('#catalogEyebrow'); if(ce) ce.textContent=get('catalog_eyebrow','PILIH DARI KATALOG');
  const ct=$('#catalogTitle'); if(ct) ct.innerHTML=get('catalog_title','Temukan yang<br><em>sedang kamu cari.</em>');
  const cas=$('#catalogAside'); if(cas) cas.textContent=get('catalog_aside','Setiap burung punya karakter. Lihat detailnya, lalu tanyakan kondisi terbaru langsung kepada kami.');
  const fe=$('#farmEyebrow'); if(fe) fe.textContent=get('farm_eyebrow','DI BALIK NUR BIRDFARM');
  const ft=$('#farmTitle'); if(ft) ft.innerHTML=get('farm_title','Bukan sekadar<br>memilih burung.<br><em>Memahami kebutuhannya.</em>');
  const fd=$('#farmDesc'); if(fd) fd.textContent=get('farm_desc','Kami percaya proses pemeliharaan yang baik dimulai dari lingkungan yang terjaga, pakan yang sesuai, dan perhatian pada kondisi setiap burung.');
  const fl=$('#farmLink'); if(fl) { fl.textContent=get('farm_link','Kenali peternakan kami ↗'); }
  const fim=$('#farmImage'); if(fim) fim.src=get('farm_image','https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80');
  const je=$('#journalEyebrow'); if(je) je.textContent=get('journal_eyebrow','CATATAN PERAWATAN');
  const jt=$('#journalTitle'); if(jt) jt.innerHTML=get('journal_title','Belajar merawat,<br><em>sedikit demi sedikit.</em>');
  const jas=$('#journalAside'); if(jas) jas.textContent=get('journal_aside','Artikel singkat seputar kenari dan keseharian di peternakan.');
  const coe=$('#contactEyebrow'); if(coe) coe.textContent=get('contact_eyebrow','ADA YANG INGIN DITANYAKAN?');
  const cot=$('#contactTitle'); if(cot) cot.innerHTML=get('contact_title','Mulai dari<br><em>satu percakapan.</em>');
  const cob=$('#contactBtn'); if(cob) { cob.innerHTML=get('contact_btn','Hubungi NUR BIRDFARM <span>↗</span>'); cob.href=waUrl(); cob.target="_blank"; cob.rel="noopener"; }
  const ft2=$('#footerText'); if(ft2) ft2.textContent=get('footer_text','Merawat dengan perhatian. Memilih dengan pengetahuan.');
  document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waUrl();a.target="_blank";a.rel="noopener"});
}
async function loadData(){if(!cfg.API_URL||cfg.API_URL.includes("PASTE_")){state.products=[];applyPageContent({});return;}try{const r=await fetch(`${cfg.API_URL}?action=public&t=${Date.now()}`);if(!r.ok)throw Error("API");const d=await r.json();if(d.ok){state.products=d.products||[];state.articles=d.articles||[];state.pageContent=d.pageContent||{};applyPageContent(state.pageContent);}}catch(e){console.warn("Katalog memakai data demo:",e.message);state.products=[];applyPageContent({})}}
function imageFor(p){if(p.image)return p.image;if(p.photoUrls&&p.photoUrls[0])return p.photoUrls[0];return "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80"}
function renderProducts(){let list=state.products.filter(p=>p.category===state.category);const q=$("#searchInput").value.toLowerCase(),status=$("#statusFilter").value,sort=$("#sortFilter").value;list=list.filter(p=>(`${p.name} ${p.species||""} ${p.type||""}`).toLowerCase().includes(q)&&(!status||p.status===status));if(sort==="price-low")list.sort((a,b)=>a.price-b.price);if(sort==="price-high")list.sort((a,b)=>b.price-a.price);$("#resultCount").textContent=`${list.length} produk ditampilkan`;$("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card" data-id="${esc(p.id)}"><div class="product-image"><img loading="lazy" src="${esc(imageFor(p))}" alt="${esc(p.name)}"><span class="status ${p.status==="Terjual"?"sold":""}">${esc(p.status||"Tersedia")}</span></div><div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc([p.species,p.sex,p.age].filter(x=>x&&x!=="—").join(" · "))}</p></div><span class="card-arrow">↗</span><div class="product-price">${money(p.price)}</div></div></article>`).join(""):`<div class="empty-state">Belum ada produk pada kategori ini.</div>`;$("#productGrid").querySelectorAll(".product-card").forEach(el=>el.addEventListener("click",()=>showDetail(state.products.find(p=>p.id===el.dataset.id))))}
function showDetail(p){if(!p)return;$("#dialogContent").innerHTML=`<div class="detail-layout"><img src="${esc(imageFor(p))}" alt="${esc(p.name)}"><div class="detail-copy"><p class="eyebrow">${esc((p.category||"").replace("-"," ").toUpperCase())} / ${esc(p.status||"Tersedia")}</p><h2>${esc(p.name)}</h2><p>${esc([p.species,p.sex,p.age,p.type].filter(Boolean).join(" · "))}</p><h3>${money(p.price)}</h3><p>${esc(p.description||"Informasi detail dapat ditanyakan langsung kepada peternak.")}</p>${p.parentage?`<p><b>Riwayat indukan:</b> ${esc(p.parentage)}</p>`:""}${p.audioUrl?`<audio controls src="${esc(p.audioUrl)}"></audio>`:""}${p.videoUrl?`<p><a class="text-link" target="_blank" rel="noopener" href="${esc(p.videoUrl)}">Lihat video ↗</a></p>`:""}<a class="button button-dark" target="_blank" rel="noopener" href="${waUrl(p.name)}">Tanyakan produk ini ↗</a></div></div>`;$("#productDialog").showModal()}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderArticles(){if(!state.articles.length)return;$("#articleGrid").innerHTML=state.articles.slice(0,3).map(a=>`<article class="article-card"><small>CATATAN NUR BIRDFARM</small><h3>${esc(a.title)}</h3><p>${esc(a.excerpt||"")}</p></article>`).join("")}
$("#categoryTabs").addEventListener("click",e=>{const b=e.target.closest("button[data-category]");if(!b)return;state.category=b.dataset.category;$("#categoryTabs .active").classList.remove("active");b.classList.add("active");renderProducts()});
["searchInput","statusFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener("input",renderProducts));
$("#dialogClose").onclick=()=>$("#productDialog").close();$("#productDialog").addEventListener("click",e=>{if(e.target.id==="productDialog")e.target.close()});
$("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");$("#mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
(async()=>{await loadData();renderProducts();renderArticles()})();
