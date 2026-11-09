/* =========================================================
   G.K.K LAW — Admin Console logic
   Static, browser-side admin. Sign-in is a front-end gate (password is
   stored only as a salted SHA-256 hash); it does not replace server security.
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const DEF = window.GKK_DEFAULTS;
  const DEFAULT_HASH = "c39889dabf2a604f47828353cf6da1a8514db686799771148a237dc2204773f6"; // salted sha-256
  const SALT = "gkk-admin|";
  const SESSION_MS = 2 * 60 * 60 * 1000;

  /* ---------- helpers ---------- */
  const store = {
    get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(_){ return d; } },
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(_){ toast("Storage is full or blocked in this browser.", true); return false; } },
    del(k){ try{ localStorage.removeItem(k); }catch(_){} }
  };
  const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  function h(tag, attrs, kids){
    const el=document.createElement(tag);
    Object.entries(attrs||{}).forEach(([k,v])=>{
      if(v==null||v===false) return;
      if(k==="class") el.className=v; else if(k==="text") el.textContent=v; else if(k==="html") el.innerHTML=v;
      else if(k.startsWith("on")) el.addEventListener(k.slice(2),v); else el.setAttribute(k,v===true?"":v);
    });
    (kids||[]).forEach(c=>{ if(c==null) return; el.appendChild(typeof c==="string"?document.createTextNode(c):c); });
    return el;
  }
  function toast(msg, err){
    const t=h("div",{class:"toast"+(err?" err":""),text:msg}); $("#toasts").appendChild(t);
    setTimeout(()=>t.remove(),3600);
  }
  function fmtDate(iso){ try{ return new Date(iso).toLocaleString("en-KE",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); }catch(_){ return iso||""; } }

  /* ---------- SHA-256 (with fallback for non-secure contexts) ---------- */
  function sha256js(str){
    const rrot=(n,x)=>(x>>>n)|(x<<(32-n));
    const K=[],H=[];const isP=n=>{for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
    const frac=x=>((x-Math.floor(x))*4294967296)|0;
    for(let c=2,n=0;n<64;c++)if(isP(c)){K[n]=frac(Math.cbrt(c));if(n<8)H[n]=frac(Math.sqrt(c));n++}
    const bytes=new TextEncoder().encode(str); const l=bytes.length*8;
    const words=[]; for(let i=0;i<bytes.length;i++) words[i>>2]|=bytes[i]<<(24-(i%4)*8);
    words[l>>5]|=0x80<<(24-l%32); words[(((l+64)>>9)<<4)+15]=l;
    for(let j=0;j<words.length;j+=16){
      const w=words.slice(j,j+16).map(x=>x|0); const a=H.slice(0);
      for(let i=0;i<64;i++){
        if(i>=16){const s0=rrot(7,w[i-15])^rrot(18,w[i-15])^(w[i-15]>>>3);const s1=rrot(17,w[i-2])^rrot(19,w[i-2])^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0}
        const [A,B,C,D,E,F,G,Hh]=a;
        const S1=rrot(6,E)^rrot(11,E)^rrot(25,E), ch=(E&F)^(~E&G), t1=(Hh+S1+ch+K[i]+w[i])|0;
        const S0=rrot(2,A)^rrot(13,A)^rrot(22,A), mj=(A&B)^(A&C)^(B&C), t2=(S0+mj)|0;
        a[7]=G;a[6]=F;a[5]=E;a[4]=(D+t1)|0;a[3]=C;a[2]=B;a[1]=A;a[0]=(t1+t2)|0;
      }
      for(let i=0;i<8;i++)H[i]=(H[i]+a[i])|0;
    }
    return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");
  }
  async function hash(pw){
    const s=SALT+pw;
    try{
      if(window.crypto && crypto.subtle){
        const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
        return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
      }
    }catch(_){}
    return sha256js(s);
  }
  const currentHash = () => store.get("gkkAdminHash", null) || DEFAULT_HASH;

  /* ---------- state ---------- */
  let content = {};
  const loadContent = () => { content = store.get("gkkContent", {}) || {}; };
  const saveContent = (silent) => {
    if(store.set("gkkContent", content)){ markSaved(); if(!silent) toast("Saved. The website will use these changes in this browser."); return true; }
    return false;
  };
  function markSaved(){ const p=$("#saveState"); p.className="pill"; p.innerHTML='<i class="fa-solid fa-circle-check"></i> All changes saved'; }
  function markDirty(){ const p=$("#saveState"); p.className="pill dirty"; p.innerHTML='<i class="fa-solid fa-pen"></i> Unsaved changes'; }
  const enquiries = () => store.get("gkkEnquiries", []);
  const saveEnquiries = x => store.set("gkkEnquiries", x);

  /* ---------- auth ---------- */
  const sessionOK = () => { try{ const t=Number(sessionStorage.getItem("gkkAdminSession")||0); return t && Date.now()<t; }catch(_){ return false; } };
  const startSession = () => { try{ sessionStorage.setItem("gkkAdminSession", String(Date.now()+SESSION_MS)); }catch(_){} };
  const endSession = () => { try{ sessionStorage.removeItem("gkkAdminSession"); }catch(_){} };

  function showApp(){
    $("#login").hidden=true; $("#app").hidden=false;
    loadContent(); renderAll(); go("dashboard");
  }
  function showLogin(){ $("#app").hidden=true; $("#login").hidden=false; $("#pw").value=""; }

  $("#pwToggle").addEventListener("click",()=>{
    const i=$("#pw"); i.type = i.type==="password" ? "text" : "password";
    $("#pwToggle").innerHTML = i.type==="password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
  });
  $("#loginForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const err=$("#loginErr"); err.textContent="";
    const lock=store.get("gkkAdminLock",{n:0,until:0});
    if(Date.now()<lock.until){ err.textContent=`Too many attempts. Try again in ${Math.ceil((lock.until-Date.now())/1000)}s.`; return; }
    const ok = (await hash($("#pw").value)) === currentHash();
    if(ok){ store.set("gkkAdminLock",{n:0,until:0}); startSession(); showApp(); }
    else{
      lock.n=(lock.n||0)+1;
      if(lock.n>=5){ lock.until=Date.now()+60000; lock.n=0; err.textContent="Too many attempts. Locked for 60 seconds."; }
      else err.textContent=`Incorrect password. ${5-lock.n} attempt(s) left.`;
      store.set("gkkAdminLock",lock); $("#pw").select();
    }
  });
  $("#logout").addEventListener("click",()=>{ endSession(); showLogin(); });

  /* ---------- navigation ---------- */
  const TITLES={dashboard:"Dashboard",enquiries:"Enquiries",team:"Team",services:"Practice areas",faqs:"FAQs",articles:"Articles",ai:"AI Consultant",site:"Site settings",security:"Security & backup"};
  function go(tab){
    $$("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
    $$(".tab").forEach(t=>t.classList.toggle("active",t.id==="tab-"+tab));
    $("#pageTitle").textContent=TITLES[tab]||tab;
    $("#side").classList.remove("open");
    if(tab==="dashboard") renderDashboard();
    if(tab==="enquiries") renderEnquiries();
    if(tab==="ai") renderAI();
    window.scrollTo({top:0});
  }
  $("#nav").addEventListener("click",e=>{ const b=e.target.closest("button[data-tab]"); if(b) go(b.dataset.tab); });
  $("#menuBtn").addEventListener("click",()=>$("#side").classList.toggle("open"));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });

  function openModal(node){ const b=$("#modalBox"); b.innerHTML=""; b.appendChild(node); $("#modal").hidden=false; }
  function closeModal(){ $("#modal").hidden=true; }
  $("#modal").addEventListener("click",e=>{ if(e.target.id==="modal") closeModal(); });

  function renderAll(){ renderDashboard(); renderEnquiries(); renderTeam(); renderServices(); renderFaqs(); renderArticles(); renderAI(); renderSite(); renderSecurity(); updateBadge(); }
  function updateBadge(){ const n=enquiries().filter(x=>x.status==="new").length; const b=$("#navEnq"); b.hidden=!n; b.textContent=n; }

  /* ======================= DASHBOARD ======================= */
  function renderDashboard(){
    const root=$("#tab-dashboard"); root.innerHTML="";
    const enq=enquiries(), log=store.get("gkkAIQuestions",[]), visits=Number(store.get("gkkVisits",0)), vlog=store.get("gkkVisitLog",{});
    const newN=enq.filter(x=>x.status==="new").length;
    root.appendChild(h("div",{class:"kpis"},[
      kpi("Visits (this browser)",visits.toLocaleString(),"unique sessions"),
      kpi("Enquiries",enq.length,newN+" new"),
      kpi("AI questions",log.length,log.filter(l=>l.topic==="Unmatched").length+" unanswered"),
      kpi("Team members",(Array.isArray(content.team)&&content.team.length?content.team:DEF.team).length,"on the website")
    ]));
    // visits chart (14 days)
    const days=[]; for(let i=13;i>=0;i--){ const d=new Date(Date.now()-i*864e5); days.push(d.toISOString().slice(0,10)); }
    const max=Math.max(1,...days.map(d=>vlog[d]||0));
    const bars=h("div",{class:"bars"},days.map(d=>h("div",{class:"bar",title:d+": "+(vlog[d]||0)},[h("i",{style:"height:"+Math.round(((vlog[d]||0)/max)*100)+"%"}),h("span",{text:d.slice(8)})])));
    const chart=h("div",{class:"card"},[h("h2",{text:"Visits · last 14 days"}),h("p",{class:"muted",text:"Counted once per browsing session on this browser."}),h("div",{class:"bars-wrap"},[bars])]);
    // matters breakdown
    const by={}; enq.forEach(e=>by[e.matter||"Other"]=(by[e.matter||"Other"]||0)+1);
    const mx=Math.max(1,...Object.values(by));
    const matters=h("div",{class:"card"},[h("h2",{text:"Enquiries by matter"}),
      h("div",{class:"list",style:"margin-top:12px"}, Object.keys(by).length ? Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([k,v])=>h("div",{},[h("div",{class:"li"},[h("span",{text:k}),h("b",{text:v})]),h("div",{class:"meter"},[h("i",{style:"width:"+(v/mx*100)+"%"})])])) : [h("div",{class:"empty",text:"No enquiries yet."})])]);
    root.appendChild(h("div",{class:"grid2"},[chart,matters]));
    // recent enquiries + top topics
    const recent=h("div",{class:"card"},[h("div",{class:"card-head"},[h("h2",{text:"Latest enquiries"}),h("button",{class:"btn sm",text:"View all",onclick:()=>go("enquiries")})]),
      h("div",{class:"list"}, enq.slice(0,5).length ? enq.slice(0,5).map(e=>h("div",{class:"li"},[h("span",{},[h("b",{text:e.name}),h("br"),h("small",{text:(e.matter||"")+" · "+fmtDate(e.time)})]),h("span",{class:"tag "+(e.status==="in-progress"?"progress":e.status||"new"),text:statusLabel(e.status)})])) : [h("div",{class:"empty",text:"Enquiries submitted through the website form will appear here."})])]);
    const topics={}; log.forEach(l=>topics[l.topic||"Unmatched"]=(topics[l.topic||"Unmatched"]||0)+1);
    const top=h("div",{class:"card"},[h("div",{class:"card-head"},[h("h2",{text:"AI Consultant · top topics"}),h("button",{class:"btn sm",text:"Manage",onclick:()=>go("ai")})]),
      h("div",{class:"list"}, Object.keys(topics).length ? Object.entries(topics).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>h("div",{class:"li"},[h("span",{text:k}),h("b",{text:v})])) : [h("div",{class:"empty",text:"No chatbot questions recorded yet."})])]);
    root.appendChild(h("div",{class:"grid2"},[recent,top]));
    // status
    const status=h("div",{class:"card"},[h("h2",{text:"System status"}),
      h("div",{class:"list",style:"margin-top:12px"},[
        li("Website front-end","Operational"),
        li("AI Legal Consultant", "Operational · "+(window.GKK_KB?"built-in knowledge base":"")+((content.aiqa||[]).length?" + "+content.aiqa.length+" custom answers":"")),
        li("Enquiry form","Email client + WhatsApp"+(((content.settings||{}).endpoint)?" + endpoint":"")),
        li("Announcement bar",(content.announcement&&content.announcement.on)?"Live":"Off"),
        li("Content overrides",Object.keys(content).length?"Active ("+Object.keys(content).join(", ")+")":"None (website defaults)")
      ])]);
    root.appendChild(status);
  }
  const kpi=(l,v,s)=>h("div",{class:"kpi"},[h("span",{text:l}),h("strong",{text:String(v)}),h("small",{text:s})]);
  const li=(a,b)=>h("div",{class:"li"},[h("span",{text:a}),h("b",{text:b})]);
  const statusLabel=s=>({new:"New","in-progress":"In progress",done:"Done",archived:"Archived"}[s||"new"]||"New");

  /* ======================= ENQUIRIES ======================= */
  let enqFilter={q:"",status:""};
  function renderEnquiries(){
    const root=$("#tab-enquiries"); root.innerHTML="";
    const all=enquiries();
    const search=h("input",{type:"search",placeholder:"Search name, email, phone or message…",value:enqFilter.q});
    const sel=h("select",{},[["","All statuses"],["new","New"],["in-progress","In progress"],["done","Done"],["archived","Archived"]].map(([v,t])=>h("option",{value:v,text:t,selected:enqFilter.status===v})));
    const bar=h("div",{class:"toolbar"},[search,sel,
      h("button",{class:"btn",html:'<i class="fa-solid fa-plus"></i> Add manually',onclick:()=>enquiryForm()}),
      h("button",{class:"btn",html:'<i class="fa-solid fa-file-csv"></i> Export CSV',onclick:exportCSV})]);
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Enquiry inbox"}),h("p",{text:"Enquiries sent through this browser's website form, plus any you record manually (for example phone calls)."})])]),bar]));
    const tbody=h("tbody");
    const draw=()=>{
      tbody.innerHTML=""; enqFilter.q=search.value; enqFilter.status=sel.value;
      const q=enqFilter.q.toLowerCase();
      const rows=all.filter(e=>(!enqFilter.status||(e.status||"new")===enqFilter.status)&&(!q||[e.name,e.email,e.phone,e.message,e.matter].join(" ").toLowerCase().includes(q)));
      if(!rows.length){ tbody.appendChild(h("tr",{},[h("td",{colspan:"6",class:"empty",text:all.length?"No enquiries match your filters.":"No enquiries yet."})])); return; }
      rows.forEach(e=>{
        tbody.appendChild(h("tr",{},[
          h("td",{},[h("b",{text:e.name}),h("br"),h("small",{text:e.email||""})]),
          h("td",{text:e.phone||"—"}),h("td",{text:e.matter||"—"}),
          h("td",{text:(e.message||"").slice(0,70)+((e.message||"").length>70?"…":"")}),
          h("td",{},[h("small",{text:fmtDate(e.time)}),h("br"),h("span",{class:"tag "+(e.status==="in-progress"?"progress":e.status||"new"),text:statusLabel(e.status)})]),
          h("td",{},[h("button",{class:"btn sm",text:"Open",onclick:()=>viewEnquiry(e.id)})])
        ]));
      });
    };
    search.addEventListener("input",draw); sel.addEventListener("change",draw);
    root.appendChild(h("div",{class:"tbl"},[h("table",{},[h("thead",{},[h("tr",{},["Client","Phone","Matter","Message","Received / Status",""].map(t=>h("th",{text:t})))]),tbody])]));
    draw(); updateBadge();
  }
  function viewEnquiry(id){
    const list=enquiries(); const e=list.find(x=>x.id===id); if(!e) return;
    const waNum=(e.phone||"").replace(/\D/g,"");
    const st=h("select",{},["new","in-progress","done","archived"].map(v=>h("option",{value:v,text:statusLabel(v),selected:(e.status||"new")===v})));
    const note=h("textarea",{placeholder:"Internal notes (visible only here)…"}); note.value=e.note||"";
    const box=h("div",{},[
      h("h3",{text:e.name}),
      h("dl",{class:"kv"},[h("dt",{text:"Email"}),h("dd",{text:e.email||"—"}),h("dt",{text:"Phone"}),h("dd",{text:e.phone||"—"}),h("dt",{text:"Matter"}),h("dd",{text:e.matter||"—"}),h("dt",{text:"Received"}),h("dd",{text:fmtDate(e.time)})]),
      h("div",{class:"msg",text:e.message||""}),
      h("label",{text:"Status"}),st,h("label",{text:"Notes"}),note,
      h("div",{class:"actions",style:"margin-top:16px"},[
        h("button",{class:"btn primary",text:"Save",onclick:()=>{ e.status=st.value; e.note=note.value; saveEnquiries(list); closeModal(); renderEnquiries(); toast("Enquiry updated."); }}),
        e.email?h("a",{class:"btn",href:"mailto:"+e.email+"?subject="+encodeURIComponent("Re: Your enquiry to G.K.K LAW"),html:'<i class="fa-solid fa-envelope"></i> Reply'}):null,
        waNum?h("a",{class:"btn",href:"https://wa.me/"+waNum,target:"_blank",rel:"noopener",html:'<i class="fa-brands fa-whatsapp"></i> WhatsApp'}):null,
        h("button",{class:"btn danger",html:'<i class="fa-solid fa-trash"></i> Delete',onclick:()=>{ if(confirm("Delete this enquiry permanently?")){ saveEnquiries(list.filter(x=>x.id!==id)); closeModal(); renderEnquiries(); toast("Enquiry deleted."); } }})
      ])
    ]);
    openModal(box);
  }
  function enquiryForm(){
    const f={name:h("input",{placeholder:"Full name"}),email:h("input",{type:"email",placeholder:"Email"}),phone:h("input",{placeholder:"Phone"}),
      matter:h("select",{},["Corporate & Commercial","Litigation & Dispute Resolution","Real Estate","Employment","Intellectual Property","Family","Succession","Other"].map(x=>h("option",{text:x}))),
      message:h("textarea",{placeholder:"Summary of the enquiry"})};
    openModal(h("div",{},[h("h3",{text:"Record an enquiry"}),
      h("label",{text:"Name"}),f.name,h("div",{class:"row"},[h("div",{},[h("label",{text:"Email"}),f.email]),h("div",{},[h("label",{text:"Phone"}),f.phone])]),
      h("label",{text:"Matter"}),f.matter,h("label",{text:"Message"}),f.message,
      h("div",{class:"actions",style:"margin-top:16px"},[h("button",{class:"btn primary",text:"Add enquiry",onclick:()=>{
        if(!f.name.value.trim()){ toast("Please enter a name.",true); return; }
        const list=enquiries(); list.unshift({id:"q"+Date.now().toString(36),name:f.name.value.trim(),email:f.email.value.trim(),phone:f.phone.value.trim(),matter:f.matter.value,message:f.message.value.trim(),time:new Date().toISOString(),status:"new",manual:true});
        saveEnquiries(list); closeModal(); renderEnquiries(); toast("Enquiry added.");
      }}),h("button",{class:"btn ghost",text:"Cancel",onclick:closeModal})])]));
  }
  function exportCSV(){
    const rows=[["Received","Name","Email","Phone","Matter","Status","Message","Notes"]].concat(enquiries().map(e=>[e.time,e.name,e.email,e.phone,e.matter,statusLabel(e.status),e.message,e.note||""]));
    const csv=rows.map(r=>r.map(c=>'"'+String(c==null?"":c).replace(/"/g,'""')+'"').join(",")).join("\r\n");
    download("gkk-enquiries-"+new Date().toISOString().slice(0,10)+".csv","﻿"+csv,"text/csv");
  }
  function download(name,text,type){
    const a=h("a",{href:URL.createObjectURL(new Blob([text],{type:type+";charset=utf-8"})),download:name}); document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  }

  /* ======================= TEAM ======================= */
  let teamDraft=null;
  const sectionsToText=secs=>(secs||[]).map(s=>`${s.title} | ${s.org||""}\n`+(s.items||[]).map(i=>"- "+i).join("\n")).join("\n\n");
  function textToSections(t){
    return String(t||"").split(/\n\s*\n/).map(b=>b.trim()).filter(Boolean).map(b=>{
      const lines=b.split("\n").map(l=>l.trim()).filter(Boolean); const [title,org]=lines[0].split("|").map(x=>x.trim());
      return {title:title||"",org:org||"",items:lines.slice(1).map(l=>l.replace(/^[-•]\s*/,"")).filter(Boolean)};
    });
  }
  const linksToText=l=>(l||[]).map(x=>x.label+" | "+x.url).join("\n");
  const textToLinks=t=>String(t||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const [label,url]=l.split("|").map(x=>x.trim());return {label:label||url,url:url||"",icon:"fa-link"}}).filter(x=>/^https?:\/\//.test(x.url));
  function renderTeam(){
    const root=$("#tab-team"); root.innerHTML="";
    if(!teamDraft) teamDraft=clone(Array.isArray(content.team)&&content.team.length?content.team:DEF.team);
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Team members"}),h("p",{text:"Edit names, titles, biographies, photos and links. Order here is the order on the website."})]),
      h("div",{class:"actions"},[h("button",{class:"btn",html:'<i class="fa-solid fa-user-plus"></i> Add member',onclick:()=>{teamDraft.push({id:"m"+Date.now().toString(36),name:"New team member",role:"Role",short:"Role",photo:"images/geoffrey.jpg",pos:"50% 12%",areas:[],bio:[""],sections:[],links:[]});markDirty();renderTeam();}}),
        h("button",{class:"btn ghost",text:"Reset to defaults",onclick:()=>{ if(confirm("Discard all team edits and restore the original team?")){ delete content.team; teamDraft=null; saveContent(); renderTeam(); } }})])])]));
    teamDraft.forEach((m,i)=>{
      const nm=h("input",{value:m.name}), role=h("input",{value:m.role}), short=h("input",{value:m.short||m.role});
      const areas=h("textarea",{style:"min-height:80px"}); areas.value=(m.areas||[]).join("\n");
      const bio=h("textarea",{style:"min-height:170px"}); bio.value=(m.bio||[]).join("\n\n");
      const secs=h("textarea",{style:"min-height:150px",placeholder:"Role title | Organisation\n- Responsibility\n- Responsibility"}); secs.value=sectionsToText(m.sections);
      const links=h("textarea",{style:"min-height:70px",placeholder:"Label | https://…"}); links.value=linksToText(m.links);
      const pos=h("select",{},[["50% 5%","Top"],["50% 12%","Upper (default)"],["50% 30%","Middle"],["50% 50%","Centre"]].map(([v,t])=>h("option",{value:v,text:t,selected:(m.pos||"50% 12%")===v})));
      const img=h("img",{src:m.photo,alt:m.name,style:"object-position:"+(m.pos||"50% 12%")});
      const file=h("input",{type:"file",accept:"image/*"});
      file.addEventListener("change",async()=>{ const f=file.files[0]; if(!f) return; try{ m.photo=await resizeImage(f,800,1000); img.src=m.photo; markDirty(); toast("Photo ready. Click Save team to apply."); }catch(_){ toast("Could not read that image.",true); } });
      pos.addEventListener("change",()=>{ m.pos=pos.value; img.style.objectPosition=m.pos; markDirty(); });
      const sync=()=>{ m.name=nm.value.trim(); m.role=role.value.trim(); m.short=short.value.trim()||m.role; m.areas=areas.value.split("\n").map(x=>x.trim()).filter(Boolean); m.bio=bio.value.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean); m.sections=textToSections(secs.value); m.links=textToLinks(links.value); markDirty(); };
      [nm,role,short,areas,bio,secs,links].forEach(x=>x.addEventListener("input",sync));
      root.appendChild(h("div",{class:"item"},[
        h("div",{class:"item-head"},[h("h3",{text:(i+1)+". "+m.name}),
          h("button",{class:"btn sm",title:"Move up",html:'<i class="fa-solid fa-arrow-up"></i>',onclick:()=>{ if(i>0){ [teamDraft[i-1],teamDraft[i]]=[teamDraft[i],teamDraft[i-1]]; markDirty(); renderTeam(); } }}),
          h("button",{class:"btn sm",title:"Move down",html:'<i class="fa-solid fa-arrow-down"></i>',onclick:()=>{ if(i<teamDraft.length-1){ [teamDraft[i+1],teamDraft[i]]=[teamDraft[i],teamDraft[i+1]]; markDirty(); renderTeam(); } }}),
          h("button",{class:"btn sm danger",title:"Remove",html:'<i class="fa-solid fa-trash"></i>',onclick:()=>{ if(confirm("Remove "+m.name+" from the website?")){ teamDraft.splice(i,1); markDirty(); renderTeam(); } }})]),
        h("div",{class:"photo-edit"},[img,h("div",{},[h("label",{text:"Photo (auto-cropped to portrait)"}),file,h("label",{text:"Focus"}),pos])]),
        h("div",{class:"row"},[h("div",{},[h("label",{text:"Full name"}),nm]),h("div",{},[h("label",{text:"Card title (short)"}),short])]),
        h("label",{text:"Full title (shown in profile)"}),role,
        h("label",{text:"Areas of practice / skills (one per line)"}),areas,
        h("label",{text:"Biography (separate paragraphs with a blank line)"}),bio,
        h("label",{text:"Experience (optional)"}),secs,h("div",{class:"hint",text:"Format: “Title | Organisation”, then one “- bullet” per line. Separate roles with a blank line."}),
        h("label",{text:"Links (optional, one per line)"}),links
      ]));
    });
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn ghost",text:"Discard changes",onclick:()=>{teamDraft=null;markSaved();renderTeam();}}),h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Save team',onclick:()=>{
      if(teamDraft.some(m=>!m.name)){ toast("Every member needs a name.",true); return; }
      content.team=clone(teamDraft); if(saveContent()) renderTeam();
    }})]));
  }
  function resizeImage(file,w,hgt){
    return new Promise((res,rej)=>{
      const r=new FileReader(); r.onerror=rej;
      r.onload=()=>{ const im=new Image(); im.onerror=rej; im.onload=()=>{
        const c=document.createElement("canvas"); c.width=w; c.height=hgt; const ctx=c.getContext("2d");
        const ar=w/hgt; let sw=im.width, sh=im.width/ar; if(sh>im.height){ sh=im.height; sw=im.height*ar; }
        const sx=(im.width-sw)/2, sy=Math.max(0,(im.height-sh)*0.1);
        ctx.fillStyle="#0b1828"; ctx.fillRect(0,0,w,hgt); ctx.drawImage(im,sx,sy,sw,sh,0,0,w,hgt);
        res(c.toDataURL("image/jpeg",0.82)); }; im.src=r.result; };
      r.readAsDataURL(file);
    });
  }

  /* ======================= SERVICES ======================= */
  function renderServices(){
    const root=$("#tab-services"); root.innerHTML="";
    const cur=clone(Array.isArray(content.services)&&content.services.length?content.services:DEF.services);
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Practice areas"}),h("p",{class:"muted",text:"Edit the title and description shown on each practice card (cards keep their icons and order)."})]));
    const fields=cur.map((s,i)=>{
      const t=h("input",{value:s.title}), d=h("textarea",{style:"min-height:90px"}); d.value=s.desc;
      [t,d].forEach(x=>x.addEventListener("input",()=>{s.title=t.value;s.desc=d.value;markDirty();}));
      root.appendChild(h("div",{class:"item"},[h("h3",{text:String(i+1).padStart(2,"0")+" · "+(DEF.services[i]?DEF.services[i].title:"Practice area")}),h("label",{text:"Title"}),t,h("label",{text:"Description"}),d]));
    });
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn ghost",text:"Restore defaults",onclick:()=>{ if(confirm("Restore original practice area text?")){ delete content.services; saveContent(); renderServices(); } }}),h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Save practice areas',onclick:()=>{ content.services=cur; saveContent(); }})]));
  }

  /* ======================= FAQS ======================= */
  let faqDraft=null;
  function renderFaqs(){
    const root=$("#tab-faqs"); root.innerHTML="";
    if(!faqDraft) faqDraft=clone(Array.isArray(content.faqs)&&content.faqs.length?content.faqs:DEF.faqs);
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Frequently asked questions"}),h("p",{text:"Add, edit, reorder or remove the questions shown on the website."})]),h("button",{class:"btn",html:'<i class="fa-solid fa-plus"></i> Add FAQ',onclick:()=>{faqDraft.push({q:"New question?",a:"Answer…"});markDirty();renderFaqs();}})])]));
    faqDraft.forEach((f,i)=>{
      const q=h("input",{value:f.q}), a=h("textarea",{style:"min-height:90px"}); a.value=f.a;
      [q,a].forEach(x=>x.addEventListener("input",()=>{f.q=q.value;f.a=a.value;markDirty();}));
      root.appendChild(h("div",{class:"item"},[h("div",{class:"item-head"},[h("h3",{text:(i+1)+". "+f.q}),
        h("button",{class:"btn sm",html:'<i class="fa-solid fa-arrow-up"></i>',onclick:()=>{ if(i>0){[faqDraft[i-1],faqDraft[i]]=[faqDraft[i],faqDraft[i-1]];markDirty();renderFaqs();} }}),
        h("button",{class:"btn sm",html:'<i class="fa-solid fa-arrow-down"></i>',onclick:()=>{ if(i<faqDraft.length-1){[faqDraft[i+1],faqDraft[i]]=[faqDraft[i],faqDraft[i+1]];markDirty();renderFaqs();} }}),
        h("button",{class:"btn sm danger",html:'<i class="fa-solid fa-trash"></i>',onclick:()=>{faqDraft.splice(i,1);markDirty();renderFaqs();}})]),
        h("label",{text:"Question"}),q,h("label",{text:"Answer"}),a]));
    });
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn ghost",text:"Restore defaults",onclick:()=>{ if(confirm("Restore the original FAQs?")){ delete content.faqs; faqDraft=null; saveContent(); renderFaqs(); } }}),h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Save FAQs',onclick:()=>{ content.faqs=faqDraft.filter(f=>f.q.trim()&&f.a.trim()); saveContent(); faqDraft=null; renderFaqs(); }})]));
  }

  /* ======================= ARTICLES ======================= */
  let artDraft=null;
  function renderArticles(){
    const root=$("#tab-articles"); root.innerHTML="";
    if(!artDraft) artDraft=clone(content.articles||[]);
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Legal knowledge articles"}),h("p",{text:"Articles you publish here appear as extra cards in the Legal Knowledge Journal section."})]),
      h("button",{class:"btn",html:'<i class="fa-solid fa-plus"></i> New article',onclick:()=>{artDraft.unshift({title:"New article",category:"Insight",date:new Date().toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"}),image:"",summary:"",body:""});markDirty();renderArticles();}})])]));
    if(!artDraft.length) root.appendChild(h("div",{class:"card empty",text:"No articles yet. Click “New article” to publish your first."}));
    artDraft.forEach((a,i)=>{
      const t=h("input",{value:a.title}),c=h("input",{value:a.category||""}),d=h("input",{value:a.date||""}),im=h("input",{value:a.image||"",placeholder:"https://… (optional)"});
      const s=h("textarea",{style:"min-height:70px"}),b=h("textarea",{style:"min-height:200px"}); s.value=a.summary||""; b.value=a.body||"";
      const sync=()=>{a.title=t.value;a.category=c.value;a.date=d.value;a.image=im.value.trim();a.summary=s.value;a.body=b.value;markDirty();};
      [t,c,d,im,s,b].forEach(x=>x.addEventListener("input",sync));
      root.appendChild(h("div",{class:"item"},[h("div",{class:"item-head"},[h("h3",{text:a.title||"Untitled"}),h("button",{class:"btn sm danger",html:'<i class="fa-solid fa-trash"></i>',onclick:()=>{ if(confirm("Delete this article?")){artDraft.splice(i,1);markDirty();renderArticles();} }})]),
        h("label",{text:"Title"}),t,h("div",{class:"row3"},[h("div",{},[h("label",{text:"Category"}),c]),h("div",{},[h("label",{text:"Date"}),d]),h("div",{},[h("label",{text:"Cover image URL"}),im])]),
        h("label",{text:"Summary (card text)"}),s,h("label",{text:"Article body (blank line = new paragraph)"}),b]));
    });
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Publish articles',onclick:()=>{ content.articles=artDraft.filter(a=>a.title.trim()); saveContent(); }})]));
  }

  /* ======================= AI CONSULTANT ======================= */
  let aiDraft=null;
  function renderAI(){
    const root=$("#tab-ai"); root.innerHTML="";
    if(!aiDraft) aiDraft=clone(content.aiqa||[]);
    const log=store.get("gkkAIQuestions",[]);
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Custom answers"}),h("p",{text:"Teach the AI Legal Consultant firm-specific answers. When a visitor's question contains one of your keywords, your answer is used first. Built-in knowledge covers courts, contracts, land, employment, succession, family, IP, criminal rights, data protection, fees and more."})]),
      h("button",{class:"btn",html:'<i class="fa-solid fa-plus"></i> Add answer',onclick:()=>{aiDraft.unshift({q:"",a:""});markDirty();renderAI();}})])]));
    aiDraft.forEach((x,i)=>{
      const q=h("textarea",{style:"min-height:60px",placeholder:"Keywords or phrases, separated by commas — e.g. opening hours, office hours, when are you open"}); q.value=x.q;
      const a=h("textarea",{style:"min-height:110px",placeholder:"The answer visitors will see. Use **bold** and lines starting with “• ” for lists."}); a.value=x.a;
      [q,a].forEach(el=>el.addEventListener("input",()=>{x.q=q.value;x.a=a.value;markDirty();}));
      root.appendChild(h("div",{class:"item"},[h("div",{class:"item-head"},[h("h3",{text:x.q?x.q.slice(0,60):"New answer"}),h("button",{class:"btn sm danger",html:'<i class="fa-solid fa-trash"></i>',onclick:()=>{aiDraft.splice(i,1);markDirty();renderAI();}})]),h("label",{text:"When the question contains…"}),q,h("label",{text:"Answer"}),a]));
    });
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Save custom answers',onclick:()=>{ content.aiqa=aiDraft.filter(x=>x.q.trim()&&x.a.trim()); saveContent(); aiDraft=null; renderAI(); }})]));

    const un=log.filter(l=>l.topic==="Unmatched");
    root.appendChild(h("div",{class:"card"},[h("div",{class:"card-head"},[h("div",{},[h("h2",{text:"Questions visitors asked"}),h("p",{text:log.length+" recorded in this browser · "+un.length+" unanswered. Use unanswered ones to write new custom answers."})]),
      h("div",{class:"actions"},[h("button",{class:"btn ghost",text:"Clear log",onclick:()=>{ if(confirm("Clear the question log?")){ store.del("gkkAIQuestions"); renderAI(); } }})])]),
      h("div",{class:"list"}, log.slice(0,25).length ? log.slice(0,25).map(l=>h("div",{class:"li"},[h("span",{},[h("b",{text:l.q}),h("br"),h("small",{text:(l.topic||"Unmatched")+" · "+fmtDate(l.t)})]),
        l.topic==="Unmatched"?h("button",{class:"btn sm",text:"Write answer",onclick:()=>{ aiDraft=aiDraft||clone(content.aiqa||[]); aiDraft.unshift({q:l.q,a:""}); markDirty(); renderAI(); window.scrollTo({top:0,behavior:"smooth"}); }}):null])) : [h("div",{class:"empty",text:"No questions yet."})])]));
  }

  /* ======================= SITE SETTINGS ======================= */
  function renderSite(){
    const root=$("#tab-site"); root.innerHTML="";
    const an=Object.assign({on:false,text:"",linkText:"",linkUrl:""},content.announcement||{});
    const on=h("input",{type:"checkbox"}); on.checked=!!an.on;
    const tx=h("input",{value:an.text,placeholder:"e.g. We are open for consultations Monday to Friday."}), lt=h("input",{value:an.linkText,placeholder:"Link text (optional)"}), lu=h("input",{value:an.linkUrl,placeholder:"https://… or #contact (optional)"});
    const st=Object.assign({endpoint:""},content.settings||{});
    const ep=h("input",{value:st.endpoint,placeholder:"https://script.google.com/macros/s/…/exec or a Formspree URL"});
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Announcement bar"}),h("p",{class:"muted",text:"A slim banner shown at the very top of the website."}),
      h("label",{class:"switch"},[on,"Show announcement"]),h("label",{text:"Message"}),tx,h("div",{class:"row"},[h("div",{},[h("label",{text:"Link text"}),lt]),h("div",{},[h("label",{text:"Link URL"}),lu])])]));
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Enquiry delivery"}),h("p",{class:"muted",text:"By default the website form opens the visitor's email app and offers WhatsApp. To also receive every enquiry automatically for all visitors, paste an HTTPS endpoint (for example a Google Apps Script web app or a Formspree form URL). The form will POST each enquiry to it as JSON."}),h("label",{text:"Enquiry endpoint (optional)"}),ep]));
    root.appendChild(h("div",{class:"savebar"},[h("button",{class:"btn primary",html:'<i class="fa-solid fa-floppy-disk"></i> Save settings',onclick:()=>{
      if(ep.value.trim() && !/^https:\/\//.test(ep.value.trim())){ toast("The endpoint must start with https://",true); return; }
      content.announcement={on:on.checked,text:tx.value.trim(),linkText:lt.value.trim(),linkUrl:lu.value.trim()};
      content.settings={endpoint:ep.value.trim()}; saveContent();
    }})]));
  }

  /* ======================= SECURITY & BACKUP ======================= */
  function renderSecurity(){
    const root=$("#tab-security"); root.innerHTML="";
    const cur=h("input",{type:"password",autocomplete:"current-password"}), n1=h("input",{type:"password",autocomplete:"new-password"}), n2=h("input",{type:"password",autocomplete:"new-password"});
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Change password"}),h("p",{class:"muted",text:"Stored in this browser as a salted SHA-256 hash, never as plain text."}),
      h("label",{text:"Current password"}),cur,h("div",{class:"row"},[h("div",{},[h("label",{text:"New password (min. 8 characters)"}),n1]),h("div",{},[h("label",{text:"Confirm new password"}),n2])]),
      h("div",{class:"actions",style:"margin-top:16px"},[h("button",{class:"btn primary",text:"Update password",onclick:async()=>{
        if((await hash(cur.value))!==currentHash()){ toast("Current password is incorrect.",true); return; }
        if(n1.value.length<8){ toast("Use at least 8 characters.",true); return; }
        if(n1.value!==n2.value){ toast("New passwords do not match.",true); return; }
        store.set("gkkAdminHash",await hash(n1.value)); cur.value=n1.value=n2.value=""; toast("Password updated.");
      }}),h("button",{class:"btn ghost",text:"Restore default password",onclick:async()=>{ if(!confirm("Restore the original admin password?")) return; store.del("gkkAdminHash"); toast("Default password restored."); }})])]));
    const file=h("input",{type:"file",accept:"application/json,.json"});
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Backup & restore"}),h("p",{class:"muted",text:"Export everything managed here (content edits, enquiries, AI answers and logs) as one JSON file. Import it on another browser or computer to continue there."}),
      h("div",{class:"actions",style:"margin-top:12px"},[h("button",{class:"btn primary",html:'<i class="fa-solid fa-download"></i> Export backup',onclick:()=>{
        const data={app:"gkk-admin",version:1,exported:new Date().toISOString(),content:store.get("gkkContent",{}),enquiries:enquiries(),aiQuestions:store.get("gkkAIQuestions",[]),visits:store.get("gkkVisits",0),visitLog:store.get("gkkVisitLog",{})};
        download("gkk-backup-"+new Date().toISOString().slice(0,10)+".json",JSON.stringify(data,null,2),"application/json"); }})]),
      h("label",{text:"Import backup"}),file,
      h("div",{class:"actions",style:"margin-top:12px"},[h("button",{class:"btn",html:'<i class="fa-solid fa-upload"></i> Import',onclick:()=>{
        const f=file.files[0]; if(!f){ toast("Choose a backup file first.",true); return; }
        const r=new FileReader(); r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.app!=="gkk-admin") throw 0;
          if(!confirm("Replace the current content, enquiries and logs with this backup?")) return;
          store.set("gkkContent",d.content||{}); store.set("gkkEnquiries",d.enquiries||[]); store.set("gkkAIQuestions",d.aiQuestions||[]); store.set("gkkVisits",d.visits||0); store.set("gkkVisitLog",d.visitLog||{});
          teamDraft=faqDraft=artDraft=aiDraft=null; loadContent(); renderAll(); toast("Backup imported."); }catch(_){ toast("That file is not a valid G.K.K backup.",true); } }; r.readAsText(f); }})])]));
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Reset"}),h("p",{class:"muted",text:"Remove all edits made here and return the website to its original content. Enquiries are kept unless you tick the box."}),
      h("label",{class:"switch"},[h("input",{type:"checkbox",id:"resetEnq"}),"Also delete enquiries, logs and visit counts"]),
      h("div",{class:"actions",style:"margin-top:14px"},[h("button",{class:"btn danger",text:"Reset website content",onclick:()=>{
        if(!confirm("Reset all website content edits?")) return; store.del("gkkContent");
        if($("#resetEnq").checked){ ["gkkEnquiries","gkkAIQuestions","gkkVisits","gkkVisitLog"].forEach(store.del); }
        teamDraft=faqDraft=artDraft=aiDraft=null; loadContent(); renderAll(); toast("Reset complete."); }})])]));
    root.appendChild(h("div",{class:"card"},[h("h2",{text:"Security note"}),h("p",{class:"muted",text:"This console runs entirely in the browser, so its sign-in is a convenience gate, not server-grade protection. Anyone with access to this browser profile or the site files can read local data. Do not store sensitive client documents here. For multi-user access and real protection, add a server-side login (for example via your hosting provider's password protection) in front of admin.html. Sessions expire after 2 hours and five wrong attempts lock sign-in for 60 seconds."})]));
  }

  /* ---------- boot ---------- */
  window.addEventListener("beforeunload",e=>{ if($("#saveState").classList.contains("dirty")){ e.preventDefault(); e.returnValue=""; } });
  if(sessionOK()) showApp(); else showLogin();
})();
