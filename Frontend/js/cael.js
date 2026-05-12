// ═══ DATA ═══
const CASILLAS=[{id:1,sec:'357',tipo:'Básica',are:'ARE D01Z02A031',fase:'VOTACION',done:3},{id:2,sec:'358',tipo:'Especial',are:'ARE D01Z02A032',fase:'PREPARACION',done:1}];
let ci=0,ctx={};

const TL=[
  {k:'instalacion',l:'Instalación',h:'07:48',s:'done'},
  {k:'inicio',l:'Inicio de votación',h:'08:05',s:'done'},
  {k:'incidencia',l:'Incidencia reportada',h:'10:22',s:'done'},
  {k:'cierre',l:'Cierre de votación',h:'(18:00)',s:'curr'},
  {k:'escrutinio',l:'Escrutinio y cómputo',h:'Después del cierre',s:'wait'},
  {k:'integracion',l:'Integración del paquete',h:'Después del escrutinio',s:'wait'},
  {k:'traslado',l:'Traslado',h:'Según indicaciones',s:'wait'},
  {k:'entrega',l:'Entrega al Consejo',h:'Al llegar',s:'wait'}
];

const ACTIONS={
  PREPARACION:[
    {l:'Reportar problema',sub:'Incidencia o anomalía',ic:'err-i',sym:'i-alert',cls:'warn-t',fn:()=>nav('incidencia_1')},
    {l:'Registrar instalación',sub:'Confirmar apertura',ic:'brand-i',sym:'i-clip',cls:'prim-t',fn:()=>nav('instalacion')},
    {l:'Paquete electoral',sub:'No disponible aún',ic:'grey-i',sym:'i-box',cls:'',fn:null,dis:true},
    {l:'Llamar al SEL',sub:'SEL Distrital 05',ic:'blue-i',sym:'i-phone',cls:'blue-t',fn:()=>toast('ok','Llamando...','Conectando con tu SEL')}
  ],
  VOTACION:[
    {l:'Reportar problema',sub:'Incidencia o anomalía',ic:'err-i',sym:'i-alert',cls:'warn-t',fn:()=>nav('incidencia_1')},
    {l:'Registrar avance',sub:'Reporte de votación',ic:'brand-i',sym:'i-clip',cls:'prim-t',fn:()=>nav('reporte_avance')},
    {l:'Paquete electoral',sub:'Disponible al cerrar',ic:'grey-i',sym:'i-box',cls:'',fn:null,dis:true},
    {l:'Llamar al SEL',sub:'SEL Distrital 05',ic:'blue-i',sym:'i-phone',cls:'blue-t',fn:()=>toast('ok','Llamando...','Conectando con tu SEL')}
  ],
  CIERRE:[
    {l:'Reportar problema',sub:'Incidencia o anomalía',ic:'err-i',sym:'i-alert',cls:'warn-t',fn:()=>nav('incidencia_1')},
    {l:'Registrar cierre',sub:'Cerrar votación',ic:'brand-i',sym:'i-lock',cls:'prim-t',fn:()=>nav('cierre')},
    {l:'Paquete electoral',sub:'Disponible pronto',ic:'grey-i',sym:'i-box',cls:'',fn:null,dis:true},
    {l:'Llamar al SEL',sub:'SEL Distrital 05',ic:'blue-i',sym:'i-phone',cls:'blue-t',fn:()=>toast('ok','Llamando...','Conectando con tu SEL')}
  ],
  ESCRUTINIO:[
    {l:'Reportar problema',sub:'Incidencia',ic:'err-i',sym:'i-alert',cls:'warn-t',fn:()=>nav('incidencia_1')},
    {l:'Integrar paquete',sub:'Armar paquete electoral',ic:'brand-i',sym:'i-box',cls:'prim-t',fn:()=>nav('paquete_integracion')},
    {l:'Paquete electoral',sub:'Listo para registrar',ic:'brand-i',sym:'i-box',cls:'prim-t',fn:()=>nav('paquete_integracion')},
    {l:'Llamar al SEL',sub:'SEL Distrital 05',ic:'blue-i',sym:'i-phone',cls:'blue-t',fn:()=>toast('ok','Llamando...','Conectando con tu SEL')}
  ]
};

const PHASES={PREPARACION:'Preparación',VOTACION:'Votación en curso',CIERRE:'Cierre de votación',ESCRUTINIO:'Escrutinio',TRASLADO:'Traslado',ENTREGADO:'Entregado'};

const FUNC=['Presidencia','Secretaría 1','Secretaría 2','Escrutaduría 1','Escrutaduría 2','Escrutaduría 3'];

const INC_GRAVES=[
  {tipo:'VIOLENCIA',label:'Violencia o riesgo de violencia',sub:'Cód. 1100',grave:true},
  {tipo:'ROBO',label:'Robo o daño de material',sub:'Cód. 1000',grave:true},
  {tipo:'SUSPENSION',label:'Suspensión de la votación',sub:'Cód. 203',grave:true},
  {tipo:'PAQUETE',label:'Problema con el paquete',sub:'Cód. 500',grave:true}
];
const INC_OTROS=[
  {tipo:'NO_INSTALACION',label:'Casilla no se pudo instalar',sub:'Cód. 100',grave:false},
  {tipo:'FUNCIONARIADO',label:'Falta de funcionariado o abandono',sub:'Cód. 200',grave:false},
  {tipo:'IMPIDIO_VOTAR',label:'Se impidió votar o acceso',sub:'Cód. 201',grave:false},
  {tipo:'RECEPCION_ILEGAL',label:'Recepción ilegal de votos',sub:'Cód. 202',grave:false},
  {tipo:'CIERRE_TIEMPO',label:'Cierre fuera de tiempo',sub:'Cód. 300',grave:false},
  {tipo:'ESCRUTINIO_P',label:'Problema en escrutinio',sub:'Cód. 400',grave:false},
  {tipo:'PROPAGANDA',label:'Propaganda o información falsa',sub:'Cód. 600',grave:false},
  {tipo:'COMPRA_VOTOS',label:'Compra de votos / sanitario',sub:'Cód. 700',grave:false}
];

const SUBCODES={
  VIOLENCIA:{q:'¿Dónde está pasando?',opts:['Dentro de la casilla','Fuera de la casilla','Persona armada presente']},
  ROBO:{q:'¿Qué fue robado o dañado?',opts:['Material electoral','Equipo de comunicación','Urna o boletas']},
  SUSPENSION:{q:'¿Por qué se suspendió?',opts:['Violencia o amenaza','Fuerza mayor','Orden de autoridad']},
  PAQUETE:{q:'¿Cuál es el problema?',opts:['No llegó el paquete','Material faltante','Material dañado']},
  NO_INSTALACION:{q:'¿Por qué no se instaló?',opts:['No se ubicó el local','Local cerrado','No llegó el funcionariado']},
  FUNCIONARIADO:{q:'¿Cuál es la situación?',opts:['Falta de funcionario(s)','Funcionario abandonó','Funcionario impedido']},
  IMPIDIO_VOTAR:{q:'¿Qué ocurrió?',opts:['Se impidió acceso a la casilla','Se rechazó credencial válida','Acarreo organizado']},
  RECEPCION_ILEGAL:{q:'¿Qué tipo?',opts:['Boleta sin credencial','Persona no en lista nominal','Múltiples votos misma persona']},
  CIERRE_TIEMPO:{q:'¿Cuándo cerró?',opts:['Antes de las 18:00','Mucho después de las 18:00']},
  ESCRUTINIO_P:{q:'¿Qué pasó?',opts:['Error en conteo de boletas','Boletas marcadas irregularmente','Falta de acuerdo entre funcionarios']},
  PROPAGANDA:{q:'¿Tipo de propaganda?',opts:['Dentro o cerca de la casilla','Información falsa difundida']},
  COMPRA_VOTOS:{q:'¿Qué observaste?',opts:['Entrega de dinero o bienes','Coerción de votante','Sanitario (transporte de votos)']},
};

// ═══ NAV ═══
function nav(id,data){
  if(data)ctx={...ctx,...data};
  document.querySelectorAll('.v').forEach(v=>v.classList.remove('on'));
  const el=document.getElementById(id);
  if(!el)return;
  el.classList.add('on');
  const sb=el.querySelector('.scroll');
  if(sb)sb.scrollTop=0;
  if(id==='hub')renderHub();
  if(id==='incidencia_1')renderInc1();
  if(id==='incidencia_2')renderInc2();
  if(id==='incidencia_3')renderInc3();
}

// ═══ HUB ═══
function renderHub(){
  const c=CASILLAS[ci];
  document.getElementById('h_cas').innerHTML=`Sección ${c.sec} ${c.tipo} &#8250;`;
  document.getElementById('h_are').textContent=c.are;
  document.getElementById('pName').textContent=PHASES[c.fase]||c.fase;
  document.getElementById('pCount').textContent=`${c.done} de ${TL.length}`;
  document.getElementById('pFill').style.width=(c.done/TL.length*100)+'%';

  // Timeline
  const tw=document.getElementById('tlWrap');
  tw.innerHTML='';
  TL.forEach(e=>{
    const mark=e.s==='done'?'&#10003;':e.s==='curr'?'&#9671;':'&#8226;';
    tw.innerHTML+=`<div class="tl-r"><div class="tl-ic ${e.s}">${mark}</div><div><div class="tl-name ${e.s}">${e.l}</div><div class="tl-time ${e.s}">${e.h}</div></div></div>`;
  });

  // Actions
  const acts=ACTIONS[c.fase]||ACTIONS.VOTACION;
  const ag=document.getElementById('actGrid');
  ag.innerHTML='';
  acts.forEach(a=>{
    const b=document.createElement('button');
    b.className='act'+(a.cls?' '+a.cls:'');
    if(a.dis)b.setAttribute('disabled','');
    b.innerHTML=`<div class="act-ic ${a.ic}"><svg><use href="#${a.sym}"/></svg></div><div><div class="act-lbl">${a.l}</div><div class="act-sub">${a.sub}</div></div>`;
    if(a.fn)b.onclick=a.fn;
    ag.appendChild(b);
  });
}

// ═══ INIT LISTS ═══
function initLists(){
  // Funcionariado
  const fl=document.getElementById('funcList');
  FUNC.forEach((f,i)=>{
    const on=i<5;
    const d=document.createElement('div');
    d.className='chk'+(on?' on':'');
    d.innerHTML=`<div class="chk-box"><svg><use href="#i-check"/></svg></div><span class="chk-lbl">${f}</span>`;
    d.onclick=()=>{d.classList.toggle('on')};
    fl.appendChild(d);
  });

  // Afluencia
  mkRadio('rl_afluencia',['Muy baja','Baja','Normal','Alta','Muy alta'],2);
  // Cierre
  mkRadio('rl_cierre',['A las 18:00, sin personas formadas','Después de las 18:00 (había gente formada)','Antes de las 18:00 — caso especial (genera incidencia)'],0);
  // Escrutinio problemas
  mkRadio('rl_esc_prob',['No, todo normal','Sí, hubo problemas'],0);
  // Estado paquete
  mkRadio('rl_estado_pkg',['Sin observaciones','Con observaciones'],0);
  // Entrega
  mkRadio('rl_entrega',['En buen estado, sin novedades','Con observaciones'],0);
}

function mkRadio(id,items,def){
  const w=document.getElementById(id);if(!w)return;
  w.innerHTML='';
  items.forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='rad'+(i===def?' on':'');
    d.innerHTML=`<div class="rad-dot"></div><span class="rad-lbl">${t}</span>`;
    d.onclick=()=>{w.querySelectorAll('.rad').forEach(r=>r.classList.remove('on'));d.classList.add('on')};
    w.appendChild(d);
  });
}

// ═══ INCIDENCIAS ═══
function renderInc1(){
  const g=document.getElementById('inc_graves');
  const o=document.getElementById('inc_otros');
  g.innerHTML='';o.innerHTML='';
  INC_GRAVES.forEach(i=>g.appendChild(mkIncBtn(i,true)));
  INC_OTROS.forEach(i=>o.appendChild(mkIncBtn(i,false)));
}
function mkIncBtn(data,grave){
  const b=document.createElement('button');
  b.className='choice'+(grave?' grave':' opt');
  b.style.marginBottom='8px';
  b.innerHTML=`<div class="ch-ic ${grave?'err-i':'grey-i'}"><svg><use href="#i-alert"/></svg></div><div><div class="ch-lbl">${data.label}</div><div class="ch-sub">${data.sub}</div></div><span class="ch-arr"><svg><use href="#i-arrow-r"/></svg></span>`;
  b.onclick=()=>nav('incidencia_2',{tipo:data.tipo,label:data.label,grave:data.grave});
  return b;
}
function renderInc2(){
  const t=ctx.tipo||'VIOLENCIA',sc=SUBCODES[t]||{q:'Especifica',opts:['Opción A','Opción B']};
  document.getElementById('inc2_title').textContent=ctx.label||'Especificar';
  document.getElementById('inc2_badge').innerHTML=`<span class="sev ${ctx.grave?'grave':'other'}">${ctx.grave?'Grave':'Otro problema'}</span>`;
  document.getElementById('inc2_q').textContent=sc.q;
  const w=document.getElementById('inc2_opts');w.innerHTML='';
  sc.opts.forEach(o=>{
    const b=document.createElement('button');
    b.className='choice'+(ctx.grave?' grave':' opt');
    b.innerHTML=`<div><div class="ch-lbl">${o}</div></div><span class="ch-arr"><svg><use href="#i-arrow-r"/></svg></span>`;
    b.onclick=()=>{ctx.subcodigo=o;nav('incidencia_3')};
    w.appendChild(b);
  });
}
function renderInc3(){
  document.getElementById('inc3_badge').innerHTML=`<span class="sev ${ctx.grave?'grave':'other'}">${ctx.grave?'Grave':'Otro problema'}</span>`;
  document.getElementById('inc3_summary').innerHTML=`<strong>${ctx.label||''}</strong><br>${ctx.subcodigo||''}`;
  let notif=`<strong>Al enviar se notificará a:</strong><div class="nr">Tu SEL: Erika Ramos</div><div class="nr">Jefatura CME San Pedro</div>`;
  const btn=document.getElementById('inc3_btn');
  if(ctx.grave){
    notif+=`<div class="nr">Coordinación Central</div><div class="nr">Enlace C5</div>`;
    btn.textContent='Enviar alerta ahora';btn.className='btn-p red';
  }else{
    btn.textContent='Enviar reporte';btn.className='btn-p';
  }
  document.getElementById('inc3_notif').innerHTML=notif;
}

// ═══ ESCRUTINIO ═══
function escIni(){
  const t=nowStr();
  document.getElementById('esc_ini_v').textContent=t;
  document.getElementById('ta_ini').className='time-act done';
  document.getElementById('btn_esc_ini').outerHTML=`<span class="btn-now ok">${t}</span>`;
  const bf=document.getElementById('btn_esc_fin');bf.disabled=false;bf.style.opacity='1';bf.style.cursor='pointer';
}
function escFin(){
  const t=nowStr();
  document.getElementById('esc_fin_v').textContent=t;
  document.getElementById('ta_fin').className='time-act done';
  document.getElementById('btn_esc_fin').outerHTML=`<span class="btn-now ok">${t}</span>`;
  const d=document.getElementById('btn_esc_done');d.disabled=false;d.style.opacity='1';d.style.cursor='pointer';
}

// ═══ SHEET ═══
function openSheet(){
  const sl=document.getElementById('sheetList');sl.innerHTML='';
  CASILLAS.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='sheet-it'+(i===ci?' sel':'');
    b.innerHTML=`<div class="ctx-n"><span class="l">Secc</span><span class="n">${c.sec}</span></div><div><strong style="font-size:.82rem;display:block">${c.sec} ${c.tipo}</strong><span style="font-size:.68rem;color:var(--text-3)">${c.are}</span></div>${i===ci?'<span style="margin-left:auto;color:var(--brand);font-weight:700">&#10003;</span>':''}`;
    b.onclick=()=>{ci=i;document.getElementById('sheetBg').classList.remove('open');renderHub()};
    sl.appendChild(b);
  });
  document.getElementById('sheetBg').classList.add('open');
}
function closeSheet(e){if(e.target===document.getElementById('sheetBg'))document.getElementById('sheetBg').classList.remove('open')}

// ═══ HELPERS ═══
function takePhoto(id){
  const el=document.getElementById(id);
  el.className='photo-btn ok';
  el.innerHTML=`<svg><use href="#i-check"/></svg><span>Foto capturada correctamente</span>`;
}
function nowStr(){const n=new Date();return String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')}
let tT=null;
function toast(type,title,msg){
  document.getElementById('tIc').className='toast-ic '+(type==='err'?'err':'ok');
  document.getElementById('tT').textContent=title;
  document.getElementById('tM').textContent=msg;
  const t=document.getElementById('toastEl');t.classList.add('show');
  clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),3000);
}
function doPost(title,msg,next){
  toast('ok',title,msg);
  setTimeout(()=>nav(next),1600);
}

// ═══ CLOCK ═══
function tick(){const n=new Date();document.getElementById('clk').textContent=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')}
setInterval(tick,1000);tick();

// ═══ INIT ═══
initLists();
renderHub();
