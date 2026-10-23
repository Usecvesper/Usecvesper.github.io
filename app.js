'use strict';
const isEnglish=document.documentElement.lang.toLowerCase().startsWith('en');
const t=(pt,en)=>isEnglish?en:pt;
const data=structuredClone(window.VESPER);
const $=s=>document.querySelector(s);
const text=(selector,value)=>{const target=$(selector);if(target)target.textContent=value??'';};
function safeURL(value){try{const u=new URL(value,location.href);return ['http:','https:','file:'].includes(u.protocol)?u.href:'';}catch{return '';}}
function node(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el;}
const params=new URLSearchParams(location.search);
if(params.has('preview')){try{const preview=JSON.parse(sessionStorage.getItem('vesper-preview'));if(preview)Object.assign(data,preview);}catch{}}
// Apply translations to a private copy, preserving editor source data and draft previews.
if(isEnglish){
 for(const key of ['tagline','intro','about','play','spirit','loreTitle','loreIntro','loreText','motto','location'])if(typeof data[key+'En']==='string'&&data[key+'En'])data[key]=data[key+'En'];
 for(const member of data.members||[])if(/^OPERADOR \d+$/.test(member.name))member.name=member.name.replace('OPERADOR','OPERATOR');
 for(const [list,keys] of [['members',['title','role','bio','origin']],['faq',['question','answer']],['gallery',['title','caption']],['chapters',['date','title','text']],['formerMembers',['status','text']],['dispatches',['code','title','text','status','summary']],['capabilities',['code','title','text']]])for(const item of data[list]||[])for(const key of keys)if(typeof item[key+'En']==='string'&&item[key+'En'])item[key]=item[key+'En'];
}
const languageSwitch=$('.language-switch');
if(languageSwitch){const target=new URL(languageSwitch.getAttribute('href'),location.href);target.search=location.search;target.hash=location.hash;languageSwitch.href=target.href;}
document.title=(document.body.dataset.page==='index.html'?t('Início','Home'):document.title.split(' — ')[0])+' — '+data.name;
const names=data.name.trim().split(/\s+/);const first=names.shift()||'USEC';const rest=names.join(' ')||'VESPER';
const heading=$('.hero h1');if(heading)heading.replaceChildren(document.createTextNode(first),node('br'),node('span','',rest),node('em','',t('OPERAÇÕES EXTERNAS / PORTUGAL','EXTERNAL OPERATIONS / PORTUGAL')));
const brand=$('header .brand>span');brand.replaceChildren(document.createTextNode(first+' '),node('b','',rest),node('small','','COIMBRA / EST. '+data.founded));
for(const key of ['tagline','intro','about','play','spirit','location','founded'])text('#'+key,data[key]);
if($('#hero-image'))$('#hero-image').src=safeURL(data.hero);if($('#logo'))$('#logo').src=safeURL(data.logo);
if($('#instagram'))$('#instagram').href=safeURL(data.instagram);if($('#facebook'))$('#facebook').href=safeURL(data.facebook);
text('#year',new Date().getFullYear());text('#recruitment',data.recruiting?t('RECRUTAMENTO ABERTO / FREQUÊNCIA ATIVA','RECRUITMENT OPEN / FREQUENCY ACTIVE'):t('ROSTER FECHADO / CANAL DE CONTACTO ABERTO','ROSTER CLOSED / CONTACT CHANNEL OPEN'));
for(const [selector,key] of [['#lore-title','loreTitle'],['#lore-intro','loreIntro'],['#lore-text','loreText'],['#motto','motto'],['#home-lore-title','loreTitle'],['#home-lore-intro','loreIntro']])text(selector,data[key]);
text('#stat-members',(data.members||[]).length);text('#stat-albums',(data.gallery||[]).length);text('#stat-photos',(data.gallery||[]).reduce((sum,g)=>sum+(g.photoCount||0),0));
function memberImage(img,path){if(isEnglish&&(!path||path==='assets/member-placeholder.svg'))path='assets/member-placeholder.en.svg';img.src=safeURL(path||'assets/member-placeholder.svg');img.addEventListener('error',()=>{img.src=isEnglish?'assets/member-placeholder.en.svg':'assets/member-placeholder.svg';},{once:true});}
const toggle=$('#menu-toggle'),nav=$('#navigation');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const dialog=$('#detail-dialog'),dialogContent=$('#dialog-content');
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function openDialog(content,label){dialogContent.replaceChildren(content);dialog.setAttribute('aria-label',label);if(!dialog.open)dialog.showModal();}
if($('#members'))(data.members||[]).forEach((m,i)=>{const b=node('button','member');b.type='button';b.setAttribute('aria-label',t('Consultar dossier de ','View dossier for ')+m.name);const wrap=node('div','member-image'),img=node('img');memberImage(img,m.image);img.alt=m.name;img.loading='lazy';wrap.append(img);b.append(wrap,node('small','',`${t('OPERADOR','OPERATOR')} / ${String(i+1).padStart(2,'0')}`),node('h3','',m.name),node('p','',m.title),node('span','arrow','↗'));b.addEventListener('click',()=>{const profile=node('article','profile'),photo=node('img'),info=node('div','profile-text');memberImage(photo,m.image);photo.alt=m.name;info.append(node('span','dossier-label',t('DOSSIER DE OPERADOR / USEC VESPER','OPERATOR DOSSIER / USEC VESPER')),node('span','tag',m.origin),node('h2','',m.name),node('p','lead',m.title),node('p','tag',m.role),node('p','bio',m.bio));profile.append(photo,info);openDialog(profile,m.name);});$('#members').append(b);});
if($('#faq'))(data.faq||[]).forEach(f=>{const d=node('details'),s=node('summary','',f.question);d.append(s,node('p','',f.answer));$('#faq').append(d);});
// Keep draft previews when moving between the site's pages.
function pageURL(path){const u=new URL(path,location.href);if(isEnglish&&!u.pathname.endsWith('.en.html'))u.pathname=u.pathname.replace(/\.html$/,'.en.html');if(params.has('preview'))u.searchParams.set('preview','1');return u.href;}
if(params.has('preview'))document.querySelectorAll('a[href]').forEach(a=>{if(a===languageSwitch)return;const path=a.getAttribute('href');if(path&&!path.includes(':')&&path.includes('.html'))a.href=pageURL(path);});
let selectedYear='Todos',visible=6,currentPhoto=0,albumImages=[];
const yearOf=p=>(p.caption.match(/(?:19|20)\d{2}/)||['Outros'])[0];
if($('#filters')){
const years=['Todos',...new Set((data.gallery||[]).map(yearOf).sort().reverse())];
years.forEach(y=>{const b=node('button','',y==='Todos'?t('Todos','All'):y);b.type='button';b.setAttribute('aria-pressed',String(y==='Todos'));b.addEventListener('click',()=>{selectedYear=y;visible=6;$('#filters').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderGallery();});$('#filters').append(b);});
$('#show-more').addEventListener('click',()=>{visible+=6;renderGallery();});renderGallery();
}

function photoVariant(path,size){return typeof path==='string'&&path.startsWith('assets/albums/')?'assets/optimized/'+path.slice(7)+'.'+size+'.webp':path;}
function galleryImage(img,path){img.decoding='async';img.loading='lazy';img.onerror=()=>{img.onerror=null;img.src=safeURL(path);};img.src=safeURL(photoVariant(path,'thumb'));}

function renderGallery(){const filtered=(data.gallery||[]).filter(p=>selectedYear==='Todos'||yearOf(p)===selectedYear);$('#gallery').replaceChildren();filtered.slice(0,visible).forEach(p=>{const a=node('a','photo');a.href=pageURL('album.html?id='+encodeURIComponent(p.album));a.setAttribute('aria-label',t('Ver álbum ','View album ')+p.title+' — '+p.caption);const figure=node('figure'),img=node('img'),caption=node('figcaption'),info=node('div');galleryImage(img,p.image);img.alt=p.title+' — '+p.caption;info.append(node('strong','',p.title),node('small','',p.caption),node('small','album-tally',(p.photoCount||0)+' '+t('fotografias','photographs')));caption.append(info,node('span','arrow','↗'));figure.append(img,caption);a.append(figure);$('#gallery').append(a);});text('#photo-count',`${filtered.length} ${t('álbuns','albums')}`);$('#show-more').hidden=visible>=filtered.length;}
function openPhoto(index){
 currentPhoto=index;const p=albumImages[index],box=node('article','lightbox'),img=node('img'),caption=node('div','lightbox-text');
 galleryImage(img,p.image);img.loading='eager';img.alt=p.title+' — '+p.caption;
 caption.append(node('h3','',p.title),node('p','',p.caption));const controls=node('div','lightbox-nav');
 for(const[label,offset]of[[t('← Anterior','← Previous'),-1],[t('Seguinte →','Next →'),1]]){const b=node('button','',label);b.type='button';b.disabled=index+offset<0||index+offset>=albumImages.length;b.addEventListener('click',()=>openPhoto(index+offset));controls.append(b);}
 controls.append(node('span','',`${index+1} / ${albumImages.length}`));caption.append(controls);box.append(img,caption);openDialog(box,p.title);
 const full=new Image();full.decoding='async';full.fetchPriority='high';full.onload=()=>{if(img.isConnected){img.onerror=null;img.src=full.src;}};full.onerror=()=>{full.onerror=null;full.src=safeURL(p.image);};full.src=safeURL(photoVariant(p.image,'view'));
 for(const offset of[-1,1]){const next=albumImages[index+offset];if(next){const preload=new Image();preload.decoding='async';preload.fetchPriority='low';preload.src=safeURL(photoVariant(next.image,'view'));}}
}
dialog.addEventListener('keydown',e=>{if(!dialogContent.querySelector('.lightbox'))return;if(e.key==='ArrowRight'&&currentPhoto<albumImages.length-1)openPhoto(currentPhoto+1);if(e.key==='ArrowLeft'&&currentPhoto>0)openPhoto(currentPhoto-1);});
async function loadAlbum(){const album=(data.gallery||[]).find(a=>a.album===params.get('id'));if(!album){text('#album-title',t('Álbum não encontrado','Album not found'));text('#album-error',t('Volta à lista de álbuns para escolher um registo.','Return to the album list to choose a record.'));return;}
text('#album-title',album.title);text('#album-caption',album.caption);document.title=album.title+' — '+data.name;
let images=Array.isArray(album.images)?album.images.filter(x=>typeof x==='string'&&x.startsWith('assets/albums/')):[];if(!images.length)try{const response=await fetch('albums.json?v=20261019-v16',{cache:'no-store'});if(response.ok){const manifest=await response.json();if(Array.isArray(manifest[album.album])&&manifest[album.album].length)images=manifest[album.album].filter(x=>typeof x==='string'&&x.startsWith('assets/albums/'));}}catch{}
if(!images.length)images=[album.image];albumImages=images.map(image=>({image,title:album.title,caption:album.caption}));text('#album-count',`${images.length} ${images.length===1?t('fotografia','photograph'):t('fotografias','photographs')}`);
let limit=24;function renderPhotos(){const grid=$('#album-photos');grid.replaceChildren();albumImages.slice(0,limit).forEach((p,index)=>{const b=node('button','photo'),img=node('img');b.type='button';b.setAttribute('aria-label',t('Ampliar fotografia ','Enlarge photograph ')+(index+1));galleryImage(img,p.image);img.alt=album.title+t(' — fotografia ',' — photograph ')+(index+1);b.append(img);b.addEventListener('click',()=>openPhoto(index));grid.append(b);});$('#album-more').hidden=limit>=albumImages.length;}
$('#album-more').addEventListener('click',()=>{limit+=24;renderPhotos();});renderPhotos();}
if($('#album-photos'))loadAlbum();

// Refresh counters from the current publication, including newly uploaded images.
if(($('#stat-photos')||$('#gallery'))&&(data.gallery||[]).some(a=>!Array.isArray(a.images)||!a.images.length))fetch('albums.json?v=20261019-v16',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(manifest=>{let total=0;for(const album of data.gallery||[]){const images=manifest[album.album];if(Array.isArray(images)){album.photoCount=images.length;total+=images.length;}}if(total)text('#stat-photos',total);if($('#gallery'))renderGallery();}).catch(()=>{});

// Unit archive: history, former members and recovered transmissions.
if($('#archive-chapters'))(data.chapters||[]).forEach((chapter,index)=>{
 const article=node('article','history-chapter'),image=node('img'),copy=node('div','chapter-copy');
 image.src=safeURL(chapter.image);image.alt=chapter.title;image.loading='lazy';
 copy.append(node('span','eyebrow',chapter.date),node('h2','',chapter.title),node('p','story-copy',chapter.text));
 article.append(node('span','chapter-number',String(index+1).padStart(2,'0')),image,copy);$('#archive-chapters').append(article);
});
if($('#former-members'))(data.formerMembers||[]).forEach(member=>{const article=node('article','legacy-card');article.append(node('span','eyebrow',member.status),node('h3','',member.name),node('p','story-copy',member.text));$('#former-members').append(article);});
function contractID(contract){return 'contrato-'+String(contract.code).toLowerCase().replace(/[^a-z0-9-]/g,'');}
function contractImage(contract){if(contract.image===false)return null;const img=node('img');img.src=safeURL(contract.image||data.hero);img.alt=contract.title;img.loading='lazy';return img;}
if($('#pc-screen')){
 const screen=$('#pc-screen'),workspace=$('#pc-workspace'),auth=$('#mission-gate'),explorer=$('#pc-explorer'),reader=$('#pc-reader'),signal=$('#pc-signal'),files=$('#pc-files'),preview=$('#pc-preview');
 const taskFiles=$('#pc-task-files'),taskDocument=$('#pc-task-document');
 let unlocked=false,selected=-1,current=-1,requested=(data.dispatches||[]).findIndex(c=>'#'+contractID(c)===location.hash),layer=30,transmission=0,signalTimers=[];
 const fileName=c=>c.code+'.rep';
 function setHash(hash){const url=new URL(location.href);url.hash=hash;history.replaceState(null,'',url.href);if(languageSwitch){const translated=new URL(languageSwitch.href,location.href);translated.hash=url.hash;languageSwitch.href=translated.href;}}
 function show(win,task){win.hidden=false;win.style.zIndex=String(++layer);win.tabIndex=-1;if(task){task.hidden=false;task.setAttribute('aria-pressed','true');}win.focus({preventScroll:true});}
 function minimise(win,task){win.hidden=true;if(task)task.setAttribute('aria-pressed','false');}
 function closeDocument(){reader.hidden=true;taskDocument.hidden=true;current=-1;setHash('contratos');}
 function cancelSignal(){transmission++;for(const timer of signalTimers)clearTimeout(timer);signalTimers=[];signal.hidden=true;screen.classList.remove('is-transmitting');workspace.inert=false;workspace.removeAttribute('aria-busy');$('#unlock-missions').disabled=false;}
 function transmit(done,duration=900){
  cancelSignal();const token=transmission;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){done();return;}
  for(const target of [$('#pc-echo-red'),$('#pc-echo-blue')]){const copy=workspace.cloneNode(true);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');copy.inert=true;for(const el of copy.querySelectorAll('[id]'))el.removeAttribute('id');target.replaceChildren(copy);}
  text('#pc-signal-code','VSP://LINK\nCHANNEL_SYNC / 04\nWAIT FOR CARRIER');signal.hidden=false;workspace.inert=true;workspace.setAttribute('aria-busy','true');screen.classList.add('is-transmitting');
  signalTimers.push(setTimeout(()=>{if(token===transmission)text('#pc-signal-code','VSP://LINK\nPACKET REASSEMBLY\nINDEX / RESYNC');},Math.round(duration*.35)));
  signalTimers.push(setTimeout(()=>{if(token===transmission)text('#pc-signal-code','VSP://LINK\nCARRIER RESTORED\nLOCAL COPY / READY');},Math.round(duration*.7)));
  signalTimers.push(setTimeout(()=>{if(token!==transmission)return;signal.hidden=true;screen.classList.remove('is-transmitting');workspace.inert=false;workspace.removeAttribute('aria-busy');signalTimers=[];done();},duration));
 }
 function presentDocument(filename,title,content){
  text('#pc-reader-title',filename);const doc=$('#pc-document');doc.replaceChildren();const heading=node('h2','pc-document-heading',title);heading.tabIndex=-1;doc.append(node('p','pc-document-path','VSP://ARCHIVE/'+filename),heading,content);taskDocument.textContent=filename;show(reader,taskDocument);doc.focus({preventScroll:true});doc.scrollTo({top:0,left:0,behavior:'instant'});requestAnimationFrame(()=>{if(!reader.hidden&&doc.contains(heading))doc.scrollTo({top:0,left:0,behavior:'instant'});});
 }
 function drawContract(index){
  const c=(data.dispatches||[])[index];if(!c)return;current=index;const body=node('article','pc-report');
  const meta=node('div','pc-document-meta');meta.append(node('span','',c.code),node('span','',c.status||''));body.append(meta,node('p','pc-document-summary',c.summary||''));
  const image=contractImage(c);if(image){image.className='pc-document-photo';body.append(image);}
  const prose=node('div','pc-report-prose');for(const paragraph of(c.text||'').split(/\n\s*\n/))if(paragraph.trim())prose.append(node('p','',paragraph));body.append(prose);
  const nav=node('div','pc-document-nav');for(const[label,offset]of[[t('← Anterior','← Previous'),-1],[t('Seguinte →','Next →'),1]]){const b=node('button','',label);b.type='button';b.disabled=index+offset<0||index+offset>=(data.dispatches||[]).length;b.addEventListener('click',()=>openContract(index+offset));nav.append(b);}body.append(nav);presentDocument(fileName(c),c.title,body);setHash(contractID(c));
 }
 function openContract(index){if(!(data.dispatches||[])[index])return;if(!unlocked){requested=index;showAuth();return;}selectFile(index);transmit(()=>drawContract(index),780);}
 function selectFile(index){
  const c=(data.dispatches||[])[index];if(!c)return;selected=index;for(const[which,item]of[...files.children].entries()){item.classList.toggle('is-selected',which===index);item.setAttribute('aria-pressed',String(which===index));}
  const image=contractImage(c);preview.replaceChildren(...[node('span','pc-preview-label',t('PRÉ-VISUALIZAÇÃO','PREVIEW')),image,node('h3','',c.title),node('span','pc-preview-status',c.status||''),node('p','',c.summary||''),node('code','',fileName(c))].filter(Boolean));text('#pc-file-count',(data.dispatches||[]).length+' '+t('ficheiros','files')+' / '+fileName(c));
 }
 function populateFiles(){
  files.replaceChildren();for(const[c,index]of(data.dispatches||[]).map((c,i)=>[c,i])){
   const button=node('button','pc-file');button.type='button';button.setAttribute('aria-label',fileName(c)+' — '+c.title);button.setAttribute('aria-pressed','false');
   const icon=node('span','pc-file-symbol');icon.setAttribute('aria-hidden','true');icon.append(node('b','','REP'));button.append(icon,node('span','pc-file-name',fileName(c)),node('span','pc-file-caption',c.title));
   button.addEventListener('click',event=>{selectFile(index);if(event.detail===0||event.pointerType==='touch'||matchMedia('(hover: none)').matches)openContract(index);});button.addEventListener('dblclick',()=>openContract(index));files.append(button);
  }
  const count=(data.dispatches||[]).length;$('#pc-open-selected').disabled=!count;
  if(count)selectFile(0);else{selected=-1;preview.replaceChildren(node('span','pc-preview-label',t('DIRETÓRIO VAZIO','EMPTY DIRECTORY')),node('p','',t('Ainda não existem relatórios de missão neste arquivo.','There are no mission reports in this archive yet.')));files.append(node('p','pc-empty',t('Esta pasta está vazia.','This folder is empty.')));text('#pc-file-count',t('0 ficheiros','0 files'));}

 }
 function showAuth(){if(unlocked){show(explorer,taskFiles);return;}show(auth);text('#mission-gate-status',t('AGUARDA LIGAÇÃO','AWAITING CONNECTION'));$('#unlock-missions').focus({preventScroll:true});}
 function mount(){
  $('#unlock-missions').disabled=true;text('#mission-gate-status',t('A MONTAR DIRETÓRIO…','MOUNTING DIRECTORY…'));
  transmit(()=>{unlocked=true;auth.hidden=true;$('#unlock-missions').disabled=false;$('#unlock-missions').setAttribute('aria-expanded','true');populateFiles();text('#pc-link-state',t('CANAL ESTABELECIDO','CHANNEL ESTABLISHED'));text('#pc-folder-state',t('DISPONÍVEL','AVAILABLE'));show(explorer,taskFiles);if(requested>=0){const index=requested;requested=-1;openContract(index);}},1200);if(!signal.hidden)$('#unlock-missions').disabled=true;
 }
 function logout(){cancelSignal();unlocked=false;selected=-1;requested=-1;auth.hidden=true;explorer.hidden=true;reader.hidden=true;taskFiles.hidden=true;taskDocument.hidden=true;files.replaceChildren();preview.replaceChildren();$('#unlock-missions').setAttribute('aria-expanded','false');text('#pc-link-state',t('CANAL LOCAL','LOCAL CHANNEL'));text('#pc-folder-state',t('RESERVADO','RESTRICTED'));setHash('contratos');$('#pc-missions').focus({preventScroll:true});}
 function historyFile(){
  const body=node('article','pc-report-prose');for(const chapter of data.chapters||[]){body.append(node('p','pc-history-date',chapter.date),node('h3','',chapter.title),node('p','',chapter.text));}current=-1;transmit(()=>{presentDocument('HISTORY.log',t('Histórico do destacamento','Detachment history'),body);setHash('historico');},650);
 }
 function unitFile(){const body=node('article','pc-report-prose');body.append(node('p','pc-document-summary',data.loreIntro||''));for(const paragraph of(data.loreText||'').split(/\n\s*\n/))body.append(node('p','',paragraph));body.append(node('blockquote','',data.motto||''));current=-1;transmit(()=>{presentDocument('VESPER.txt',t('Dossier de constituição','Formation dossier'),body);setHash('unidade');},650);}
 $('#pc-missions').addEventListener('click',showAuth);$('#unlock-missions').addEventListener('click',mount);$('#pc-auth-close').addEventListener('click',()=>{cancelSignal();auth.hidden=true;});
 $('#pc-history').addEventListener('click',historyFile);$('#pc-history-link').addEventListener('click',historyFile);$('#pc-unit').addEventListener('click',unitFile);$('#pc-unit-link').addEventListener('click',unitFile);
 $('#pc-explorer-min').addEventListener('click',()=>minimise(explorer,taskFiles));$('#pc-reader-min').addEventListener('click',()=>minimise(reader,taskDocument));
 $('#pc-explorer-max').addEventListener('click',()=>explorer.classList.toggle('pc-maximized'));$('#pc-reader-max').addEventListener('click',()=>reader.classList.toggle('pc-maximized'));
 $('#pc-explorer-close').addEventListener('click',()=>{explorer.hidden=true;taskFiles.hidden=true;});$('#pc-reader-close').addEventListener('click',closeDocument);
 taskFiles.addEventListener('click',()=>show(explorer,taskFiles));taskDocument.addEventListener('click',()=>show(reader,taskDocument));
 $('#pc-open-selected').addEventListener('click',()=>{if(selected>=0)openContract(selected);});$('#pc-refresh').addEventListener('click',()=>{if(unlocked)transmit(populateFiles,500);});$('#pc-lock').addEventListener('click',logout);$('#pc-logout').addEventListener('click',logout);
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;cancelSignal();if(!reader.hidden)closeDocument();else if(!auth.hidden)auth.hidden=true;else if(!explorer.hidden){explorer.hidden=true;taskFiles.hidden=true;}});
 for(const win of[auth,explorer,reader])win.addEventListener('pointerdown',()=>{win.style.zIndex=String(++layer);});
 if(requested>=0){showAuth();screen.scrollIntoView({block:'center'});}else if(location.hash==='#historico')historyFile();else if(location.hash==='#unidade')unitFile();
}

if($('#capabilities'))(data.capabilities||[]).forEach(capability=>{const article=node('article','doctrine-card');article.append(node('span','eyebrow',capability.code),node('h2','',capability.title),node('p','story-copy',capability.text));$('#capabilities').append(article);});
if($('#home-roster')){
 const track=$('#home-roster'),previous=$('#roster-prev'),next=$('#roster-next'),members=data.members||[],total=members.length,buffer=Math.min(3,total),motion=matchMedia('(prefers-reduced-motion: reduce)');let logical=0,resetting=false,settleTimer=null,dragging=false;
 function card(member,clone){const a=node('a','roster-preview');a.href=pageURL('membros.html');a.setAttribute('aria-label',member.name+' — '+member.role);if(clone){a.setAttribute('aria-hidden','true');a.tabIndex=-1;a.dataset.carouselClone='true';}const img=node('img');memberImage(img,member.image);img.alt=clone?'':member.name;img.loading=clone?'eager':'lazy';const label=node('div','roster-preview-copy');label.append(node('span','eyebrow',t('DOSSIER DE OPERADOR','OPERATOR DOSSIER')),node('h3','',member.name),node('p','',member.role),node('span','roster-arrow','↗'));a.append(img,label);return a;}
 for(const member of members.slice(-buffer))track.append(card(member,true));for(const member of members)track.append(card(member,false));for(const member of members.slice(0,buffer))track.append(card(member,true));
 const mod=n=>((n%total)+total)%total;
 function stride(){return(track.firstElementChild?.getBoundingClientRect().width||track.clientWidth/3||1)+(parseFloat(getComputedStyle(track).columnGap)||0);}
 function counter(){text('#roster-position',total?(logical+1)+' / '+total:'0 / 0');if(previous)previous.disabled=total<2;if(next)next.disabled=total<2;}
 function jump(left){resetting=true;track.classList.add('carousel-resetting');track.scrollTo({left,behavior:'auto'});requestAnimationFrame(()=>{track.classList.remove('carousel-resetting');resetting=false;});}
 function settle(){if(!total||resetting)return;const physical=Math.round(track.scrollLeft/stride());logical=mod(physical-buffer);if(physical<buffer||physical>=buffer+total)jump((buffer+logical)*stride());counter();}
 function advance(direction){if(total<2||resetting)return;clearTimeout(settleTimer);const physical=Math.round(track.scrollLeft/stride());settleTimer=setTimeout(settle,650);track.scrollTo({left:(physical+direction)*stride(),behavior:motion.matches?'auto':'smooth'});}
 track.addEventListener('scroll',()=>{if(resetting||!total)return;logical=mod(Math.round(track.scrollLeft/stride())-buffer);counter();clearTimeout(settleTimer);settleTimer=setTimeout(settle,100);},{passive:true});
 if(previous)previous.addEventListener('click',()=>advance(-1));if(next)next.addEventListener('click',()=>advance(1));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();advance(event.key==='ArrowRight'?1:-1);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();logical=event.key==='Home'?0:Math.max(0,total-1);jump((buffer+logical)*stride());counter();}});
 track.addEventListener('pointerdown',()=>{dragging=true;},{passive:true});window.addEventListener('pointerup',()=>{dragging=false;},{passive:true});window.addEventListener('pointercancel',()=>{dragging=false;},{passive:true});
 window.addEventListener('resize',()=>{jump((buffer+logical)*stride());counter();});$('#roster-position')?.setAttribute('aria-live','off');
 if(total){jump(buffer*stride());counter();}const timer=setInterval(()=>{if(document.hidden||dragging)return;advance(1);},2000);
 window.addEventListener('pagehide',()=>{clearInterval(timer);clearTimeout(settleTimer);});
}

/* Metrics: owner exclusion is checked before any analytics request. */
(async function initialiseMetrics(){
 const endpoint='https://usecvesper.goatcounter.com/count'; // Set to the verified GoatCounter https://YOURCODE.goatcounter.com/count endpoint.
 const ownerDigest='0343004f1021abb67a594bbd4adf8e59d63f6bef409bcd4b56a3d149dceb9132';
 const key='vesper.metrics.excluded.v1';
 const ownerToken=new URLSearchParams(location.hash.slice(1)).get('admin');
 let excluded=false;
 try{excluded=localStorage.getItem(key)==='1';}catch{}
 if(ownerToken){
  let valid=false;
  try{const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ownerToken));valid=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')===ownerDigest;}catch{}
  if(valid){
   let saved=false;try{localStorage.setItem(key,'1');saved=localStorage.getItem(key)==='1';}catch{}
   history.replaceState(null,'',location.pathname+location.search);
   const en=document.documentElement.lang.startsWith('en');
   const notice=document.createElement('p');notice.setAttribute('role','status');
   notice.textContent=saved?(en?'Your visits are excluded in this browser.':'As tuas visitas estão excluídas neste navegador.'):(en?'Exclusion could not be saved. Allow browser storage and reopen your private link.':'Não foi possível guardar a exclusão. Permite o armazenamento e volta a abrir o teu link privado.');
   notice.style.cssText='position:fixed;bottom:18px;left:5%;right:5%;z-index:200000;background:#181818;border:1px solid #e6ff00;color:#f5f5f0;padding:18px;font:14px Arial,sans-serif;box-shadow:0 6px 30px #0008';
   document.body.appendChild(notice);setTimeout(()=>notice.remove(),12000);return;
  }
  return; // Never count visits carrying an owner-link fragment.
 }
 if(excluded||!endpoint||new URLSearchParams(location.search).has('preview')||/\/(editor|ajuda)(\.en)?\.html$/.test(location.pathname)||!/^https?:$/.test(location.protocol))return;
 if(!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(endpoint))return;
 const page=location.pathname+(new URLSearchParams(location.search).has('id')?'?id='+encodeURIComponent(new URLSearchParams(location.search).get('id')):'');
 window.goatcounter={path:page};
 const script=document.createElement('script');script.async=true;script.src='https://gc.zgo.at/count.js';script.setAttribute('data-goatcounter',endpoint);document.head.appendChild(script);
})();
