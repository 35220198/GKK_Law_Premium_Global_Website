
/* =========================================================
   G.K.K LAW — ADVANCED FRONT-END ENGINE
   Works as a static upload. No Formspree, server or API key.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const firm = {
    name: "G.K KIMANI & ASSOCIATES ADVOCATES",
    email: "lawgkk@gmail.com",
    phone1: "+254706048083",
    phone2: "+254715707574",
    address: "Kahawa House, 2nd Floor, Suite 18 and 32, Kiambu Town, Kenya"
  };

  /* ---------- storage + content overrides (managed from admin.html) ---------- */
  const store = {
    get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(_){ return d; } },
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(_){ return false; } }
  };
  const DEF = window.GKK_DEFAULTS || {team:[],services:[],faqs:[]};
  const content = () => store.get("gkkContent", {}) || {};
  const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const getTeam = () => { const c=content(); return Array.isArray(c.team) && c.team.length ? c.team : DEF.team; };
  const getFaqs = () => { const c=content(); return Array.isArray(c.faqs) && c.faqs.length ? c.faqs : DEF.faqs; };
  function h(tag, attrs, kids){
    const el=document.createElement(tag);
    Object.entries(attrs||{}).forEach(([k,v])=>{
      if(v==null||v===false) return;
      if(k==="class") el.className=v; else if(k==="text") el.textContent=v; else el.setAttribute(k,v===true?"":v);
    });
    (kids||[]).forEach(c=>{ if(c==null) return; el.appendChild(typeof c==="string"?document.createTextNode(c):c); });
    return el;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTracking();
    initAnnouncement();
    initServicesOverride();
    initTeam();
    initArticles();
    renderFAQs();
    initBackTop();
    initLoader();
    initScrollProgress();
    initMobileMenu();
    initReveal();
    initCounters();
    initFAQ();
    initPhoneFab();
    initAI();
    initKnowledge();
    initExternalLinks();
    initContact();
    initNewsDesk();
    initServicePopup();
    initKeyboardAccessibility();
  });

  function initLoader(){
    const loader = $("#loader");
    if(!loader) return;
    const hide = () => setTimeout(() => loader.classList.add("is-hidden"), 450);
    if(document.readyState === "complete") hide();
    else window.addEventListener("load", hide, {once:true});
    setTimeout(hide, 2200);
  }

  function initScrollProgress(){
    const bar = $("#scrollbar");
    if(!bar) return;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    window.addEventListener("scroll", update, {passive:true});
    update();
  }

  function initMobileMenu(){
    const btn=$("#menuBtn"), menu=$("#mobileMenu");
    if(!btn || !menu) return;
    btn.addEventListener("click",()=>{
      menu.classList.toggle("open");
      btn.innerHTML = menu.classList.contains("open")
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
    $$("#mobileMenu a").forEach(a=>a.addEventListener("click",()=>{
      menu.classList.remove("open");
      btn.innerHTML='<i class="fa-solid fa-bars"></i>';
    }));
  }

  function initReveal(){
    const items=$$(".reveal,.reveal-left,.reveal-right");
    if(!items.length) return;
    if(!("IntersectionObserver" in window)){
      items.forEach(x=>x.classList.add("in-view")); return;
    }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in-view"); io.unobserve(e.target); }});
    },{threshold:.12,rootMargin:"0px 0px -50px"});
    items.forEach(x=>io.observe(x));
  }

  function initCounters(){
    const counters=$$(".stat-number[data-count]");
    if(!counters.length) return;
    const run=(el)=>{
      if(el.dataset.done==="1") return;
      el.dataset.done="1";
      const target=Number(el.dataset.count)||0, suffix=el.dataset.suffix||"";
      const duration=1800, start=performance.now();
      const tick=(now)=>{
        const p=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-p,4);
        el.textContent=Math.floor(target*eased).toLocaleString()+suffix;
        if(p<1) requestAnimationFrame(tick);
        else el.textContent=target.toLocaleString()+suffix;
      };
      requestAnimationFrame(tick);
    };
    if(!("IntersectionObserver" in window)){counters.forEach(run);return}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)run(e.target)}),{threshold:.45});
    counters.forEach(x=>io.observe(x));
  }

  /* =========================================================
     SITE CONTENT (defaults + admin overrides)
     ========================================================= */
  function initTracking(){
    try{
      if(location.pathname.endsWith("admin.html")) return;
      if(sessionStorage.getItem("gkkCounted")==="1") return;
      sessionStorage.setItem("gkkCounted","1");
      store.set("gkkVisits", Number(store.get("gkkVisits",0))+1);
      const log=store.get("gkkVisitLog",{}); const d=new Date().toISOString().slice(0,10);
      log[d]=(log[d]||0)+1;
      const keys=Object.keys(log).sort().slice(-60); const trimmed={}; keys.forEach(k=>trimmed[k]=log[k]);
      store.set("gkkVisitLog",trimmed);
    }catch(_){}
  }

  function initAnnouncement(){
    const a=content().announcement;
    if(!a || !a.on || !a.text) return;
    const bar=h("div",{class:"announce",role:"status"},[
      h("span",{class:"announce-dot"}),
      h("span",{text:a.text}),
      (a.linkUrl ? h("a",{href:a.linkUrl,text:(a.linkText||"Learn more")+" →"}) : null),
      h("button",{type:"button","aria-label":"Dismiss announcement",text:"×"})
    ]);
    bar.querySelector("button").addEventListener("click",()=>bar.remove());
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function initServicesOverride(){
    const svc=content().services; if(!Array.isArray(svc)||!svc.length) return;
    $$("#practice .practice-card").forEach((card,i)=>{
      const s=svc[i]; if(!s) return;
      const t=$("h3",card), p=$("p",card);
      if(t && s.title) t.textContent=s.title;
      if(p && s.desc) p.textContent=s.desc;
    });
  }

  function initTeam(){
    const grid=$("#teamGrid"); if(!grid) return;
    grid.innerHTML="";
    const team=getTeam();
    team.forEach((m,i)=>{
      const open=()=>openTeamModal(m);
      const photo=h("button",{class:"tc-photo",type:"button","aria-label":"View profile of "+m.name},[
        h("img",{src:m.photo,alt:m.name+", "+(m.short||m.role),loading:"lazy",style:"object-position:"+(m.pos||"50% 12%")}),
        h("span",{class:"tc-view",text:"View profile"})
      ]);
      photo.addEventListener("click",open);
      const more=h("button",{class:"tc-more",type:"button"},["Full profile ",h("i",{class:"fa-solid fa-arrow-right"})]);
      more.addEventListener("click",open);
      const card=h("article",{class:"tc reveal",style:"transition-delay:"+(i*70)+"ms"},[
        photo,
        h("div",{class:"tc-body"},[
          h("h3",{class:"display-font tc-name",text:m.name}),
          h("p",{class:"tc-role",text:m.short||m.role}),
          h("p",{class:"tc-bio",text:(m.bio&&m.bio[0])||""}),
          h("div",{class:"tc-tags"},(m.areas||[]).slice(0,3).map(a=>h("span",{text:a}))),
          more
        ])
      ]);
      grid.appendChild(card);
    });
  }

  function bindExternal(root){
    $$(".external-link,[data-genuine-link='true']", root||document).forEach(link=>{
      if(link.dataset.bound==="1") return;
      link.dataset.bound="1";
      link.addEventListener("click",e=>{
        const href=link.getAttribute("href");
        if(!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) return;
        if(link.dataset.confirmed==="1") return;
        e.preventDefault();
        const label=link.dataset.externalLabel || link.textContent.trim() || "external resource";
        showConfirm({
          title:"Opening an external website",
          text:`You are leaving G.K.K LAW and opening ${label}. The destination is controlled by a third party.`,
          confirm:"Continue",
          onConfirm:()=>{link.dataset.confirmed="1";link.click();setTimeout(()=>delete link.dataset.confirmed,1000)}
        });
      });
    });
  }

  function openTeamModal(m){
    let modal=$("#teamModal");
    if(!modal){
      modal=h("div",{class:"external-modal",id:"teamModal",role:"dialog","aria-modal":"true","aria-labelledby":"tmName"});
      modal.addEventListener("click",e=>{ if(e.target===modal) closeTeamModal(); });
      document.body.appendChild(modal);
    }
    modal.innerHTML="";
    const close=h("button",{class:"tm-close",type:"button","aria-label":"Close profile"},[h("i",{class:"fa-solid fa-xmark"})]);
    close.addEventListener("click",closeTeamModal);
    const side=h("div",{class:"tm-side"},[h("div",{class:"tm-ph"},[
      h("img",{src:m.photo,alt:m.name,style:"object-position:"+(m.pos||"50% 12%")}),
      h("div",{class:"tm-side-cap"},[
        h("div",{class:"tm-kicker",text:"G.K.K LAW"}),
        h("div",{class:"tm-side-role",text:m.role})
      ])
    ])]);
    const body=h("div",{class:"tm-body"},[
      h("div",{class:"section-kicker",text:"Profile"}),
      h("h2",{class:"display-font tm-name",id:"tmName",text:m.name}),
      h("p",{class:"tm-role",text:m.role}),
      h("div",{class:"gold-line my-5"})
    ]);
    if(m.areas && m.areas.length && !(m.sections&&m.sections.length)){
      body.appendChild(h("h4",{class:"tm-h",text:"Areas of practice"}));
      body.appendChild(h("div",{class:"tm-tags"},m.areas.map(a=>h("span",{text:a}))));
    }
    (m.bio||[]).forEach(p=>body.appendChild(h("p",{class:"tm-p",text:p})));
    if(m.sections && m.sections.length){
      body.appendChild(h("h4",{class:"tm-h",text:"Experience"}));
      m.sections.forEach(sec=>{
        body.appendChild(h("div",{class:"tm-job"},[
          h("div",{class:"tm-job-t",text:sec.title}),
          h("div",{class:"tm-job-o",text:sec.org||""}),
          h("ul",{},(sec.items||[]).map(it=>h("li",{text:it})))
        ]));
      });
    }
    if(m.links && m.links.length){
      body.appendChild(h("h4",{class:"tm-h",text:"Links"}));
      body.appendChild(h("div",{class:"tm-links"},m.links.map(l=>{
        const a=h("a",{href:l.url,target:"_blank",rel:"noopener noreferrer","data-genuine-link":"true","data-external-label":l.label+" ("+l.url.replace(/^https?:\/\//,"").replace(/\/$/,"")+")"},[
          h("i",{class:"fa-solid "+(l.icon||"fa-link")}), " "+l.label
        ]);
        return a;
      })));
    }
    body.appendChild(h("div",{class:"tm-cta"},[
      h("a",{class:"btn-gold px-5 py-3 text-xs font-extrabold uppercase tracking-wider",href:"#contact",text:"Request a consultation"})
    ]));
    body.querySelector(".tm-cta a").addEventListener("click",closeTeamModal);
    modal.appendChild(h("div",{class:"tm-box"},[close,side,body]));
    bindExternal(modal);
    modal.classList.add("open");
    document.body.style.overflow="hidden";
    modal.querySelector(".tm-box").scrollTop=0; body.scrollTop=0;
  }
  function closeTeamModal(){
    $("#teamModal")?.classList.remove("open");
    document.body.style.overflow="";
  }

  function renderFAQs(){
    const wrap=$("#faqList"); if(!wrap) return;
    wrap.innerHTML="";
    getFaqs().forEach(f=>{
      const btn=h("button",{class:"faq-btn",type:"button"},[h("span",{text:f.q}),h("i",{class:"fa-solid fa-plus faq-icon"})]);
      const ans=h("div",{class:"faq-answer"},[h("p",{class:"pb-6 text-sm text-neutral-600 leading-7",text:f.a})]);
      wrap.appendChild(h("div",{class:"faq-item"},[btn,ans]));
    });
  }

  function initArticles(){
    const arts=content().articles; const grid=$("#articleGrid");
    if(!grid) return;
    grid.innerHTML="";
    if(!Array.isArray(arts)||!arts.length) return;
    arts.forEach((a,i)=>{
      const thumb=h("div",{class:"blog-thumb"+(a.image?"":" blog-thumb-plain"),style:a.image?`background-image:url('${String(a.image).replace(/'/g,"%27")}')`:null},[
        h("div",{class:"blog-overlay"}),
        h("span",{class:"absolute left-5 bottom-5 z-10 text-[10px] uppercase tracking-widest text-white font-bold",text:a.category||"Insight"})
      ]);
      const btn=h("button",{class:"mt-5 text-xs font-extrabold uppercase tracking-widest text-[#8b611f]",type:"button"},["Read article ",h("i",{class:"fa-solid fa-arrow-right ml-2"})]);
      btn.addEventListener("click",()=>window.openKnowledge("article:"+i));
      grid.appendChild(h("article",{class:"blog-card reveal"},[
        thumb,
        h("div",{class:"p-7"},[
          (a.date?h("div",{class:"text-[10px] uppercase tracking-widest text-neutral-400 mb-2",text:a.date}):null),
          h("h3",{class:"display-font text-3xl",text:a.title}),
          h("p",{class:"text-sm text-neutral-600 leading-7 mt-3",text:a.summary||""}),
          btn
        ])
      ]));
    });
  }

  function initBackTop(){
    const y=$("#yr"); if(y) y.textContent=new Date().getFullYear();
    const b=h("button",{class:"backtop",type:"button","aria-label":"Back to top"},[h("i",{class:"fa-solid fa-arrow-up"})]);
    b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
    document.body.appendChild(b);
    const upd=()=>b.classList.toggle("show",window.scrollY>900);
    window.addEventListener("scroll",upd,{passive:true}); upd();
  }

  function initFAQ(){
    $$(".faq-btn").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const item=btn.closest(".faq-item");
        $$(".faq-item").forEach(other=>{if(other!==item)other.classList.remove("open")});
        item.classList.toggle("open");
      });
    });
  }

  function initPhoneFab(){
    const btn=$("#phoneFab"), choices=$("#phoneChoices");
    if(!btn || !choices) return;
    btn.addEventListener("click",()=>choices.classList.toggle("open"));
    document.addEventListener("click",e=>{
      if(!e.target.closest(".float-contact")) choices.classList.remove("open");
    });
  }

  /* =========================================================
     AI LEGAL CONSULTANT — on-page knowledge engine
     ========================================================= */
  const STOP = new Set("a an the and or of to in on for with is are was were be been it its i me my we our you your do does did can could should would will what which who whom how when where why about this that these those at by from as if so than then there their them they he she his her tell please explain give any some into out up down over under again more most such own same just also very".split(" "));
  const norm = s => " " + String(s||"").toLowerCase().replace(/[^a-z0-9&\s\-']/g," ").replace(/[-']/g," ").replace(/\s+/g," ").trim() + " ";
  const stem = w => w.length>4 ? w.replace(/(ing|ed|es|s)$/,"") : w;
  let lastTopic = null;

  function kbEntries(){
    const custom = (content().aiqa||[]).filter(x=>x && x.q && x.a).map((x,i)=>({
      id:"custom"+i, title:x.q, kw:String(x.q).split(/[,;\n]/).map(t=>t.trim().toLowerCase()).filter(Boolean), a:x.a, f:[], custom:true
    }));
    return custom.concat(window.GKK_KB||[]);
  }

  function scoreEntry(qn, qTokens, e){
    let sc=0;
    (e.kw||[]).forEach(k=>{
      const kn = norm(k);
      const words = kn.trim().split(" ").length;
      if(qn.includes(kn)) sc += 3 + words*3;
      else if(words===1){
        const kk = kn.trim();
        if(kk.length>=4 && qTokens.some(t => stem(t)===stem(kk))) sc += 3;
      } else {
        const kws = kn.trim().split(" ").filter(w=>!STOP.has(w));
        if(kws.length>1 && kws.every(w=>qTokens.some(t=>stem(t)===stem(w)))) sc += 2 + kws.length;
      }
    });
    const tn = norm(e.title);
    tn.trim().split(" ").filter(w=>w.length>3 && !STOP.has(w)).forEach(w=>{ if(qTokens.some(t=>stem(t)===stem(w))) sc += 1; });
    if(e.custom) sc += 2;
    return sc;
  }

  function teamAnswer(){
    const lines = getTeam().map(t => `• **${t.name}** – ${t.short||t.role}`);
    return "**The G.K.K LAW team**\n" + lines.join("\n") + "\n\nOpen any profile in the Our People section for the full biography.";
  }

  function findAnswer(q){
    const qn = norm(q);
    const qTokens = qn.trim().split(" ").filter(w=>w && !STOP.has(w));
    for(const s of (window.GKK_SMALLTALK||[])){
      if(s.re.test(q.trim()) && qTokens.length<=6) return {a:s.a, f:s.f, small:true};
    }
    if(/^(more|tell me more|go on|continue|elaborate|and\??|ok(ay)?|yes|yeah)\b/i.test(q.trim()) && lastTopic){
      return {a:"Here are related questions on **"+lastTopic.title+"** you can explore, or ask me something specific.", f:(lastTopic.f||[]).slice(0,4), topic:lastTopic.title, keep:true};
    }
    const ranked = kbEntries().map(e=>({e, s:scoreEntry(qn,qTokens,e)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
    if(ranked.length && ranked[0].s>=4){
      const e = ranked[0].e; lastTopic = e;
      let a = e.a==="__TEAM__" ? teamAnswer() : e.a;
      const actions = (e.actions||[]).slice();
      if(e.urgent) actions.unshift({label:"Call the firm now", href:"tel:"+firm.phone1});
      let related = ranked.slice(1,3).filter(x=>x.s>=4 && !x.e.custom).map(x=>x.e);
      let f = (e.f||[]).slice();
      return {a, f, actions, topic:e.title, related};
    }
    const sug = ranked.slice(0,3).map(x=>x.e);
    return {a:"I don't have a detailed answer on that yet. I can help with **Kenyan courts and procedure, contracts, land and property, employment, succession and wills, family law, company registration, intellectual property, criminal law and bail, data protection, debt recovery, arbitration and legal fees**.\n\nTry rephrasing with a topic, or speak to the team directly so an advocate can review your specific situation.",
      f:(sug.length?sug.map(e=>"Tell me about: "+e.title):["What areas of law does G.K.K LAW handle?","How do I buy land safely?","What are my employment rights?"]).concat(["How do I speak to an advocate?"]).slice(0,4),
      actions:[{label:"Contact the firm", href:"#contact"}], miss:true};
  }

  function renderRich(el, text){
    const lines = String(text).split("\n");
    let ul=null;
    const inline=(parent,str)=>{
      str.split(/(\*\*[^*]+\*\*)/g).forEach(part=>{
        if(/^\*\*[^*]+\*\*$/.test(part)){ const b=document.createElement("strong"); b.textContent=part.slice(2,-2); parent.appendChild(b); }
        else if(part) parent.appendChild(document.createTextNode(part));
      });
    };
    lines.forEach(line=>{
      if(line.startsWith("• ")){
        if(!ul){ ul=document.createElement("ul"); ul.className="ai-list"; el.appendChild(ul); }
        const li=document.createElement("li"); inline(li,line.slice(2)); ul.appendChild(li);
      } else {
        ul=null;
        if(!line.trim()){ return; }
        const p=document.createElement("p"); p.className="ai-p"; inline(p,line); el.appendChild(p);
      }
    });
  }

  function addMessage(text, type="bot", source="", opts={}){
    const box=$("#aiMessages"); if(!box) return null;
    const el=document.createElement("div");
    el.className=`ai-bubble ${type}`;
    if(type==="bot") renderRich(el,text); else el.textContent=text;
    if(opts.actions && opts.actions.length){
      const row=document.createElement("div"); row.className="ai-actions";
      opts.actions.forEach(a=>{
        const link=document.createElement("a"); link.className="ai-action"; link.textContent=a.label; link.href=a.href;
        if(a.external || /^https?:/.test(a.href)){ link.target="_blank"; link.rel="noopener noreferrer"; }
        else if(a.href.startsWith("#")){ link.addEventListener("click",()=>{ $("#aiPanel")?.classList.remove("open"); }); }
        row.appendChild(link);
      });
      el.appendChild(row);
    }
    if(source){
      const s=document.createElement("div"); s.className="ai-source"; s.textContent=source; el.appendChild(s);
    }
    box.appendChild(el); box.scrollTop=box.scrollHeight;
    return el;
  }

  function setChips(list, ask){
    const wrap=$("#aiFollow"); if(!wrap) return;
    wrap.innerHTML="";
    (list||[]).slice(0,4).forEach(txt=>{
      const b=document.createElement("button"); b.type="button"; b.textContent=txt.replace(/^Tell me about: /,"");
      b.addEventListener("click",()=>ask(txt.replace(/^Tell me about: /,"")));
      wrap.appendChild(b);
    });
    wrap.style.display = (list&&list.length) ? "flex" : "none";
  }

  function setAIStatus(t){
    const s=$("#aiStatus"); if(s) s.textContent=t;
  }

  function logQuestion(q, topic){
    const log=store.get("gkkAIQuestions",[]);
    log.unshift({q:q.slice(0,300), topic:topic||"Unmatched", t:new Date().toISOString()});
    store.set("gkkAIQuestions", log.slice(0,300));
  }

  function initAI(){
    const fab=$("#aiFab"), panel=$("#aiPanel"), close=$("#aiClose"), input=$("#aiInput"), send=$("#aiSend"), clear=$("#aiClear");
    if(!fab || !panel) return;
    const open=()=>{panel.classList.add("open");setTimeout(()=>input?.focus(),100)};
    const shut=()=>panel.classList.remove("open");
    fab.addEventListener("click",()=>panel.classList.contains("open")?shut():open()); close?.addEventListener("click",shut);

    let busy=false;
    const ask=(q)=>{
      q=(q||"").trim(); if(!q || busy) return;
      if(/^ask another question$/i.test(q)){ input?.focus(); return; }
      busy=true;
      addMessage(q,"user");
      if(input){ input.value=""; input.style.height=""; }
      setChips([],ask);
      setAIStatus("Consultant is preparing an answer…");
      const typing=addMessage("…","bot"); typing?.classList.add("typing");
      setTimeout(()=>{
        typing?.remove();
        const r=findAnswer(q);
        logQuestion(q, r.small?"Small talk":(r.miss?null:r.topic));
        const source = r.small ? "" : "General information only. Verify current Kenyan law and obtain professional advice for a specific matter.";
        addMessage(r.a,"bot",source,{actions:r.actions});
        const chips=(r.f||[]).slice();
        setChips(chips,ask);
        setAIStatus("On-page legal information assistant · no external AI API required");
        busy=false;
      },450+Math.min(q.length*6,500));
    };

    $$(".ai-quick button").forEach(b=>b.addEventListener("click",()=>ask(b.dataset.q||b.textContent)));
    send?.addEventListener("click",()=>ask(input?.value));
    input?.addEventListener("keydown",e=>{
      if(e.key==="Enter" && !e.shiftKey){e.preventDefault();ask(input.value);}
    });
    input?.addEventListener("input",()=>{ input.style.height="auto"; input.style.height=Math.min(input.scrollHeight,110)+"px"; });
    clear?.addEventListener("click",()=>{
      const box=$("#aiMessages"); if(!box) return;
      [...box.querySelectorAll(".ai-bubble")].slice(1).forEach(x=>x.remove());
      lastTopic=null; setChips([],ask);
    });
    setChips(["How does the court system work?","How do I buy land safely?","What are my employment rights?","How do I speak to an advocate?"],ask);
  }

  function initKnowledge(){
    const data={
      "Kenyan Court System":`The Kenyan Court System overview is a general educational summary. The Judiciary operates a hierarchy of courts with jurisdiction defined by the Constitution and legislation. For a real matter, confirm the current jurisdiction, filing route, limitation periods and procedural requirements using the official Judiciary and Kenya Law resources linked on this website.`,
      "Contracts":`Contracts commonly require attention to the parties, obligations, payment, termination, dispute resolution, confidentiality and governing law. The appropriate clauses depend on the transaction and applicable law. This page is general information and is not a substitute for review of the actual agreement.`,
      "Property Transactions":`Property transactions may involve due diligence, ownership documents, searches, consents, financing, registration and transaction documentation. The exact checks depend on the property and transaction. Confirm current requirements before proceeding.`,
      "Employment Law":`Employment matters can involve contracts, workplace policies, disciplinary processes, termination issues and dispute pathways. The applicable rules depend on the facts and current Kenyan legislation. Obtain professional advice for a particular employment dispute.`,
      "Cybersecurity":`Digital matters can involve privacy, cybersecurity, digital evidence, preservation of records and technology-related disputes. Rules can depend on the nature of the data, conduct and forum. Important decisions should be based on current primary sources and professional advice.`,
      "Succession":`Succession planning concerns the orderly management and transfer of assets and can involve wills, trusts, administration and disputes. Proper records and current legal documents are important. The applicable process depends on the estate and circumstances.`
    };
    window.openKnowledge=(key)=>{
      const modal=$("#knowledgeModal"), title=$("#knowledgeTitle"), body=$("#knowledgeBody");
      if(!modal||!title||!body)return;
      let text=data[key];
      if(String(key).startsWith("article:")){
        const art=(content().articles||[])[Number(String(key).slice(8))];
        if(art){ text=art.body||art.summary||""; key=art.title; }
      }
      title.textContent=key;
      body.innerHTML="";
      String(text||"General legal information. Please consult the firm for advice on a specific matter.").split(/\n{2,}/).forEach(par=>{
        const p=document.createElement("p"); p.className="mb-4"; p.textContent=par.trim(); body.appendChild(p);
      });
      modal.classList.add("open");
      document.body.style.overflow="hidden";
    };
    window.closeKnowledge=()=>{
      $("#knowledgeModal")?.classList.remove("open");
      document.body.style.overflow="";
    };
    $("#knowledgeModal")?.addEventListener("click",e=>{if(e.target.id==="knowledgeModal")window.closeKnowledge()});
  }

  function initExternalLinks(){ bindExternal(document); }

  function showConfirm({title,text,confirm,onConfirm}){
    let m=$("#gkkConfirm");
    if(!m){
      m=document.createElement("div");
      m.id="gkkConfirm"; m.className="deep-modal";
      m.innerHTML=`<div class="deep-modal-box">
        <div class="deep-door"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
        <div class="section-kicker mt-4">External resource</div>
        <h2 class="display-font text-3xl mt-2" id="gkkConfirmTitle"></h2>
        <p class="text-sm text-neutral-600 leading-7 mt-4" id="gkkConfirmText"></p>
        <div class="flex flex-col sm:flex-row gap-3 mt-6">
          <button class="btn-dark px-5 py-3 font-bold" id="gkkConfirmStay">Stay here</button>
          <button class="btn-gold px-5 py-3 font-extrabold" id="gkkConfirmGo"></button>
        </div></div>`;
      document.body.appendChild(m);
      $("#gkkConfirmStay",m).onclick=()=>m.classList.remove("open");
    }
    $("#gkkConfirmTitle",m).textContent=title;
    $("#gkkConfirmText",m).textContent=text;
    $("#gkkConfirmGo",m).textContent=confirm;
    $("#gkkConfirmGo",m).onclick=()=>{m.classList.remove("open");onConfirm?.()};
    m.classList.add("open");
  }

  function initContact(){
    const form=$("#contactForm"); if(!form)return;
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const data=new FormData(form);
      const name=(data.get("name")||"").trim();
      const email=(data.get("email")||"").trim();
      const phone=(data.get("phone")||"").trim();
      const matter=(data.get("matter")||"").trim();
      const message=(data.get("message")||"").trim();
      if(!name || !email || !message){toast("Please complete your name, email and message.");return}
      const enquiry={id:"q"+Date.now().toString(36),name,email,phone,matter,message,time:new Date().toISOString(),status:"new"};
      const list=store.get("gkkEnquiries",[]); list.unshift(enquiry); store.set("gkkEnquiries",list.slice(0,500));
      const endpoint=(content().settings||{}).endpoint;
      if(endpoint && /^https:\/\//.test(endpoint)){
        try{ fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(enquiry)}).catch(()=>{}); }catch(_){}
      }
      const subject=encodeURIComponent(`Legal Enquiry — ${matter}`);
      const body=encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone||"Not provided"}\nMatter: ${matter}\n\nMessage:\n${message}\n\nSent from the G.K.K LAW website.`
      );
      // No Formspree: use the visitor's own mail client. Add a WhatsApp fallback
      // in the success modal so the enquiry is still actionable on phones.
      const mailto=`mailto:${firm.email}?subject=${subject}&body=${body}`;
      const status=$("#formStatus");
      if(status)status.textContent="Preparing your secure email client…";
      window.location.href=mailto;
      setTimeout(()=>{
        showEnquirySuccess(name,message);
        if(status)status.textContent="If your email app did not open, use WhatsApp or email us directly.";
      },700);
    });
  }

  function showEnquirySuccess(name,message){
    const existing=$("#enquirySuccess"); if(existing)existing.remove();
    const safeName=name.replace(/[<>]/g,"");
    const wa=`https://wa.me/${firm.phone1.replace(/\D/g,"")}?text=${encodeURIComponent(
      `Hello G.K.K LAW, I am ${name}. I would like to make a legal enquiry.\n\n${message}`
    )}`;
    const m=document.createElement("div"); m.id="enquirySuccess";m.className="external-modal open";
    m.innerHTML=`<div class="external-box">
      <div class="section-kicker">Enquiry ready</div>
      <h2 class="display-font text-4xl mt-2">Thank you, ${safeName}.</h2>
      <p class="text-sm text-neutral-600 leading-7 mt-4">Your device has been asked to open an email addressed to ${firm.email}. If no email application opened, use one of the alternatives below.</p>
      <div class="grid sm:grid-cols-2 gap-3 mt-6">
        <a class="btn-gold px-5 py-4 font-extrabold text-center" href="${wa}" target="_blank" rel="noopener">Continue on WhatsApp</a>
        <a class="btn-dark px-5 py-4 font-bold text-center" href="mailto:${firm.email}">Open Email</a>
      </div>
      <button class="w-full mt-3 py-3 border border-neutral-200 font-bold" id="closeEnquiry">Close</button>
    </div>`;
    document.body.appendChild(m);
    $("#closeEnquiry",m).onclick=()=>m.remove();
  }

  function initNewsDesk(){
    const refresh=$("#refreshNews"), desk=$("#newsDesk"); if(!desk)return;
    const load=()=>{
      desk.innerHTML="";
      const sources=[
        ["Kenya legal news","https://news.google.com/search?q=Kenya%20law%20legal%20news&hl=en-KE&gl=KE&ceid=KE%3Aen"],
        ["Global legal news","https://news.google.com/search?q=global%20law%20legal%20news&hl=en&gl=US&ceid=US%3Aen"]
      ];
      sources.forEach(([title,url])=>{
        const card=document.createElement("article");
        card.className="news-loading border border-white/10 p-6";
        card.innerHTML=`<i class="fa-solid fa-newspaper text-[#efd58f] text-xl"></i>
          <h4 class="font-bold mt-3">${title}</h4>
          <p class="text-xs text-white/45 leading-6 mt-2">Open the live Google News results in a separate tab. Verify any important development against the primary legal source.</p>
          <a class="inline-flex mt-4 text-[10px] uppercase tracking-widest text-[#efd58f]" href="${url}" target="_blank" rel="noopener noreferrer">Open live results <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i></a>`;
        desk.appendChild(card);
      });
    };
    refresh?.addEventListener("click",load);
    load();
  }

  function initServicePopup(){
    if(sessionStorage.getItem("gkkServicePopupShown")==="1") return;
    const build=()=>{
      if($("#serviceAd"))return;
      const m=document.createElement("div");m.id="serviceAd";m.className="service-ad";
      m.innerHTML=`<div class="service-ad-card">
        <button class="service-ad-close" id="serviceAdClose" aria-label="Close services message"><i class="fa-solid fa-xmark"></i></button>
        <div class="service-ad-art"></div>
        <div class="service-ad-content">
          <div class="section-kicker text-[#efd58f]">G.K.K LAW · Legal Services</div>
          <h2 class="display-font text-4xl md:text-5xl mt-3">Need legal guidance?</h2>
          <p class="text-white/65 leading-7 mt-4">Our team can discuss corporate, disputes, property, employment, intellectual property, family and succession matters.</p>
          <div class="service-ad-grid">
            <div><i class="fa-solid fa-gavel"></i> Litigation</div>
            <div><i class="fa-solid fa-building"></i> Corporate</div>
            <div><i class="fa-solid fa-house"></i> Real Estate</div>
            <div><i class="fa-solid fa-briefcase"></i> Employment</div>
            <div><i class="fa-solid fa-lightbulb"></i> IP</div>
            <div><i class="fa-solid fa-people-roof"></i> Family</div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <a class="btn-gold px-5 py-4 font-extrabold text-center" href="#contact" id="serviceAdContact">Contact the firm</a>
            <a class="px-5 py-4 font-bold text-center border border-white/15" href="tel:${firm.phone1}">Call ${firm.phone1}</a>
          </div>
        </div>
      </div>`;
      document.body.appendChild(m);
      const close=()=>{m.classList.remove("open");sessionStorage.setItem("gkkServicePopupShown","1")};
      $("#serviceAdClose",m).onclick=close;
      $("#serviceAdContact",m).onclick=()=>{close();setTimeout(()=>$("#contact")?.scrollIntoView({behavior:"smooth"}),150)};
      m.addEventListener("click",e=>{if(e.target===m)close()});
      requestAnimationFrame(()=>m.classList.add("open"));
    };
    setTimeout(build,10000);
  }

  function toast(message){
    let stack=$(".toast-stack");
    if(!stack){stack=document.createElement("div");stack.className="toast-stack";document.body.appendChild(stack)}
    const el=document.createElement("div");el.className="toast";el.textContent=message;stack.appendChild(el);
    setTimeout(()=>el.remove(),4200);
  }

  function initKeyboardAccessibility(){
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"){
        $("#aiPanel")?.classList.remove("open");
        $("#knowledgeModal")?.classList.remove("open");
        $$(".external-modal,.deep-modal").forEach(x=>x.classList.remove("open"));
        $(".service-ad")?.classList.remove("open");
        document.body.style.overflow="";
      }
    });
  }
})();
