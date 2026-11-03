const SPREADSHEET_ID = '1eoX6gAknlfJXvJ90VLjaKmb-ExUzWNnEfkxnG6cHWNw';
const ADMIN_PIN = '083835';
const SHEETS = {
  Products: ['id','category','name','species','sex','age','type','price','status','featured','description','parentage','photoIds','videoUrl','audioUrl','createdAt','updatedAt'],
  Articles: ['id','title','excerpt','content','coverId','published','createdAt','updatedAt'],
  Gallery: ['id','title','mediaType','fileId','url','createdAt'],
  Testimonials: ['id','customer','quote','published','createdAt'],
  Settings: ['key','value'],
  Admins: ['email','pinHash','active'],
  PageContent: ['key','value','type','label']
};

function setupProject() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(SHEETS[name]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,SHEETS[name].length).setFontWeight('bold').setBackground('#191b16').setFontColor('#e9c83d');
  });
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty('MEDIA_FOLDER_ID');
  if (!folderId) {
    const folder = DriveApp.createFolder('NUR BIRDFARM Media');
    folderId = folder.getId();
    props.setProperty('MEDIA_FOLDER_ID', folderId);
  }
  const settings = readRows_('Settings');
  if (!settings.length) {
    const defaults = [
      ['farmName','NUR BIRDFARM'],['whatsapp','6280000000000'],['address','Tulungagung, Jawa Timur'],
      ['openingHours','Hubungi kami untuk jam operasional'],['instagram',''],['facebook',''],
      ['bannerText','Burung baik berawal dari perawatan yang tepat.']
    ];
    const sh = ss.getSheetByName('Settings');
    defaults.forEach(r => sh.appendRow(r));
  }

  let pageSh = ss.getSheetByName('PageContent');
  if (!pageSh) pageSh = ss.insertSheet('PageContent');
  if (pageSh.getLastRow() === 0) {
    pageSh.appendRow(SHEETS['PageContent']);
    const defaults = [
      ['announcement','Peternakan kenari · Tulungagung <span>Pesan langsung melalui WhatsApp ↗</span>','html','Teks pengumuman'],
      ['hero_eyebrow','DARI KANDANG KAMI','text','Hero - Eyebrow'],
      ['hero_title','Burung baik<br>berawal dari<br><em>perawatan yang tepat.</em>','html','Hero - Judul'],
      ['hero_desc','Kenari pilihan dan perlengkapan harian, dirawat dengan perhatian sebelum sampai ke rumah barunya.','text','Hero - Deskripsi'],
      ['hero_btn_catalog','Jelajahi katalog <span>↘</span>','html','Hero - Tombol Katalog'],
      ['hero_btn_wa','Bicarakan kebutuhanmu ↗','text','Hero - Tombol WhatsApp'],
      ['hero_foot_left','01 / KENARI & PERLENGKAPAN','text','Hero - Kaki kiri'],
      ['hero_foot_right','EST. NUR BIRDFARM','text','Hero - Kaki kanan'],
      ['hero_photo','https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1100&q=85','text','Hero - URL Foto'],
      ['hero_photo_note','<span>01 — 04</span><b>Ruang tumbuh,<br>suara yang hidup.</b>','html','Hero - Catatan Foto'],
      ['hero_stamp','NUR<br><b>BF</b><small>SELECTED WITH CARE</small>','html','Hero - Stempel'],
      ['catalog_eyebrow','PILIH DARI KATALOG','text','Katalog - Eyebrow'],
      ['catalog_title','Temukan yang<br><em>sedang kamu cari.</em>','html','Katalog - Judul'],
      ['catalog_aside','Setiap burung punya karakter. Lihat detailnya, lalu tanyakan kondisi terbaru langsung kepada kami.','text','Katalog - Teks samping'],
      ['farm_eyebrow','DI BALIK NUR BIRDFARM','text','Tentang - Eyebrow'],
      ['farm_title','Bukan sekadar<br>memilih burung.<br><em>Memahami kebutuhannya.</em>','html','Tentang - Judul'],
      ['farm_desc','Kami percaya proses pemeliharaan yang baik dimulai dari lingkungan yang terjaga, pakan yang sesuai, dan perhatian pada kondisi setiap burung.','text','Tentang - Deskripsi'],
      ['farm_link','Kenali peternakan kami ↗','text','Tentang - Tautan'],
      ['farm_image','https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80','text','Tentang - URL Foto'],
      ['journal_eyebrow','CATATAN PERAWATAN','text','Jurnal - Eyebrow'],
      ['journal_title','Belajar merawat,<br><em>sedikit demi sedikit.</em>','html','Jurnal - Judul'],
      ['journal_aside','Artikel singkat seputar kenari dan keseharian di peternakan.','text','Jurnal - Teks samping'],
      ['contact_eyebrow','ADA YANG INGIN DITANYAKAN?','text','Kontak - Eyebrow'],
      ['contact_title','Mulai dari<br><em>satu percakapan.</em>','html','Kontak - Judul'],
      ['contact_btn','Hubungi NUR BIRDFARM <span>↗</span>','html','Kontak - Tombol'],
      ['footer_text','Merawat dengan perhatian. Memilih dengan pengetahuan.','text','Footer - Teks']
    ];
    defaults.forEach(r => pageSh.appendRow(r));
  }
  pageSh.setFrozenRows(1);
  pageSh.getRange(1,1,1,SHEETS['PageContent'].length).setFontWeight('bold').setBackground('#191b16').setFontColor('#e9c83d');
  const email = Session.getActiveUser().getEmail();
  if (email && !readRows_('Admins').some(r => r.email === email)) {
    appendObject_('Admins', {email, pinHash: hash_(ADMIN_PIN), active: true});
  }
  Logger.log('Setup selesai. Media folder: ' + folderId);
}

function doGet(e) {
  if (e && e.parameter && e.parameter.admin === '1') {
    return HtmlService.createTemplateFromFile('Admin').evaluate()
      .setTitle('NUR BIRDFARM — Admin').addMetaTag('viewport','width=device-width, initial-scale=1');
  }
  const action = e && e.parameter && e.parameter.action;
  if (action === 'public') return json_(publicData_());
  return HtmlService.createHtmlOutput('NUR BIRDFARM API is running.');
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (!verifyPin_(body.pin)) return json_({ok:false,error:'PIN tidak valid.'});
    const result = handleAdminAction_(body);
    return json_({ok:true,data:result});
  } catch (err) {
    return json_({ok:false,error:String(err.message || err)});
  }
}

function include(filename) { return HtmlService.createHtmlOutputFromFile(filename).getContent(); }

function adminLogin(pin) {
  if (!verifyPin_(pin)) throw new Error('PIN tidak valid.');
  return {ok:true,summary:dashboard_()};
}
function adminData(pin) {
  requirePin_(pin);
  const products = readRows_('Products');
  const articles = readRows_('Articles');
  const gallery = readRows_('Gallery');
  const testimonials = readRows_('Testimonials');
  const settings = settingsObject_();
  const pageContent = pageContentObject_();
  const summary = dashboard_();
  return {products:products,articles:articles,gallery:gallery,testimonials:testimonials,settings:settings,pageContent:pageContent,summary:summary};
}
function adminSave(pin, sheet, record) {
  requirePin_(pin);
  if (!SHEETS[sheet] || ['Admins','Settings','PageContent'].includes(sheet)) throw new Error('Modul tidak diizinkan.');
  const allowed = SHEETS[sheet];
  const obj = {};
  allowed.forEach(k => { if (record[k] !== undefined && record[k] !== null) obj[k] = record[k]; });
  if (!obj.id || String(obj.id).trim() === '') {
    obj.id = Utilities.getUuid();
    obj.createdAt = new Date().toISOString();
  } else {
    // preserve existing createdAt if not provided
    try {
      const sh = sheet_(sheet);
      const rows = sh.getDataRange().getValues();
      const h = rows[0];
      const idIdx = h.indexOf('id');
      const cIdx = h.indexOf('createdAt');
      if (cIdx >= 0) {
        for (let i=1; i<rows.length; i++) {
          if (String(rows[i][idIdx]) === String(obj.id) && rows[i][cIdx]) {
            if (!obj.createdAt) obj.createdAt = rows[i][cIdx] instanceof Date ? rows[i][cIdx].toISOString() : rows[i][cIdx];
            break;
          }
        }
      }
    } catch(e) {}
    if (!obj.createdAt) obj.createdAt = new Date().toISOString();
  }
  obj.updatedAt = new Date().toISOString();
  upsertObject_(sheet,obj);
  return {ok:true,id:obj.id};
}
function adminDelete(pin,sheet,id) {
  requirePin_(pin);
  if (!SHEETS[sheet] || ['Admins','Settings','PageContent'].includes(sheet)) throw new Error('Modul tidak diizinkan.');
  const sh=sheet_(sheet), rows=sh.getDataRange().getValues(), headers=rows[0];
  const idx=headers.indexOf('id');
  for(let i=rows.length-1;i>=1;i--) if(String(rows[i][idx])===String(id)){sh.deleteRow(i+1);return {ok:true};}
  throw new Error('Data tidak ditemukan.');
}
function adminUpload(pin,name,mime,data64) {
  requirePin_(pin);
  const bytes=Utilities.base64Decode(data64);
  if(bytes.length>8*1024*1024) throw new Error('Ukuran file maksimal 8 MB.');
  const folder=DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('MEDIA_FOLDER_ID'));
  const blob=Utilities.newBlob(bytes,mime,name);
  const file=folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
  return {id:file.getId(),url:'https://drive.google.com/uc?export=view&id='+file.getId(),name:file.getName()};
}
function adminSaveSettings(pin,obj) {
  requirePin_(pin);
  const sh=sheet_('Settings'), rows=sh.getDataRange().getValues();
  Object.keys(obj).forEach(k=>{
    let found=false;
    for(let i=1;i<rows.length;i++) if(rows[i][0]===k){sh.getRange(i+1,2).setValue(String(obj[k]));found=true;break;}
    if(!found) sh.appendRow([k,String(obj[k])]);
  });
  return {ok:true};
}
function adminSavePageContent(pin,obj) {
  requirePin_(pin);
  const sh=sheet_('PageContent');
  if(!sh) return {ok:true};
  const rows=sh.getDataRange().getValues();
  Object.keys(obj).forEach(k=>{
    let found=false;
    for(let i=1;i<rows.length;i++) if(rows[i][0]===k){sh.getRange(i+1,2).setValue(String(obj[k]));found=true;break;}
    if(!found) sh.appendRow([k,String(obj[k]),'text','']);
  });
  return {ok:true};
}
function adminGetPageContent() {
  return pageContentObject_();
}
function pageContentObject_(){
  const o={};
  try {
    readRows_('PageContent').forEach(r=>o[r.key]=r.value);
  } catch(e){}
  return o;
}
function adminSavePageContent(pin,obj) {
  requirePin_(pin);
  const sh=sheet_('PageContent');
  if(!sh) return {ok:true};
  const rows=sh.getDataRange().getValues();
  Object.keys(obj).forEach(k=>{
    let found=false;
    for(let i=1;i<rows.length;i++) if(rows[i][0]===k){sh.getRange(i+1,2).setValue(String(obj[k]));found=true;break;}
    if(!found) sh.appendRow([k,String(obj[k]),'text','']);
  });
  return {ok:true};
}
function adminGetPageContent() {
  return pageContentObject_();
}
function pageContentObject_(){
  const o={};
  try {
    readRows_('PageContent').forEach(r=>o[r.key]=r.value);
  } catch(e){}
  return o;
}
function handleAdminAction_(b) {
  if(b.action==='save') return adminSave(b.pin,b.sheet,b.record);
  if(b.action==='delete') return adminDelete(b.pin,b.sheet,b.id);
  if(b.action==='upload') return adminUpload(b.pin,b.name,b.mime,b.data);
  if(b.action==='settings') return adminSaveSettings(b.pin,b.settings);
  if(b.action==='pageContent') return adminSavePageContent(b.pin,b.pageContent);
  throw new Error('Aksi tidak dikenal.');
}
function publicData_() {
  const products=readRows_('Products').filter(p=>String(p.status||'').trim()).map(p=>{
    p.price=Number(p.price)||0;
    p.photoUrls=String(p.photoIds||'').split(',').filter(Boolean).map(id=>'https://drive.google.com/uc?export=view&id='+id.trim());
    return p;
  });
  const articles=readRows_('Articles').filter(a=>String(a.published)==='true'||String(a.published)==='TRUE');
  return {ok:true,products,articles,settings:settingsObject_(),pageContent:pageContentObject_(),generatedAt:new Date().toISOString()};
}
function dashboard_() {
  const p=readRows_('Products');
  return {products:p.length,available:p.filter(x=>x.status==='Tersedia').length,sold:p.filter(x=>x.status==='Terjual').length,articles:readRows_('Articles').length};
}
function settingsObject_(){const o={};readRows_('Settings').forEach(r=>o[r.key]=r.value);return o;}
function verifyPin_(pin) {
  const target=hash_(String(pin||''));
  return readRows_('Admins').some(r=>String(r.active).toLowerCase()!=='false' && r.pinHash===target) || target===hash_(ADMIN_PIN);
}
function requirePin_(pin){if(!verifyPin_(pin))throw new Error('Sesi tidak valid. Masuk kembali.');}
function hash_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8).map(b=>(b+256).toString(16).slice(-2)).join('');}
function sheet_(name){return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);}
function readRows_(name){
  const sh=sheet_(name);if(!sh||sh.getLastRow()<2)return [];
  const v=sh.getDataRange().getValues(), h=v.shift();
  return v.filter(r=>r.some(x=>x!==''&&x!==null)).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i] instanceof Date?r[i].toISOString():r[i]);return o;});
}
function appendObject_(name,obj){const h=SHEETS[name];sheet_(name).appendRow(h.map(k=>obj[k]===undefined?'':obj[k]));}
function upsertObject_(name,obj){
  const sh=sheet_(name),rows=sh.getDataRange().getValues(),h=rows[0],idIndex=h.indexOf('id');
  for(let i=1;i<rows.length;i++) if(String(rows[i][idIndex])===String(obj.id)){sh.getRange(i+1,1,1,h.length).setValues([h.map(k=>obj[k]===undefined?rows[i][h.indexOf(k)]:obj[k])]);return;}
  appendObject_(name,obj);
}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
