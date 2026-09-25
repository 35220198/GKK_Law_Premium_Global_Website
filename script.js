
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

  document.addEventListener("DOMContentLoaded", () => {
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

  function addMessage(text, type="bot", source=""){
    const box=$("#aiMessages"); if(!box) return;
    const el=document.createElement("div");
    el.className=`ai-bubble ${type}`;
    el.textContent=text;
    if(source){
      const s=document.createElement("div"); s.className="ai-source"; s.textContent=source; el.appendChild(s);
    }
    box.appendChild(el); box.scrollTop=box.scrollHeight;
  }

  function setAIStatus(t){
    const s=$("#aiStatus"); if(s) s.textContent=t;
  }

  function initAI(){
    const fab=$("#aiFab"), panel=$("#aiPanel"), close=$("#aiClose"), input=$("#aiInput"), send=$("#aiSend");
    if(!fab || !panel) return;
    const open=()=>{panel.classList.add("open");setTimeout(()=>input?.focus(),100)};
    const shut=()=>panel.classList.remove("open");
    fab.addEventListener("click",open); close?.addEventListener("click",shut);

    $$(".ai-quick button").forEach(b=>b.addEventListener("click",()=>{
      if(input){input.value=b.dataset.q||""; input.focus();}
    }));

    const submit=()=>{
      const q=(input?.value||"").trim();
      if(!q) return;
      addMessage(q,"user");
      input.value="";
      setAIStatus("Consultant is preparing an answer…");
      setTimeout(()=>respondAI(q),350);
    };
    send?.addEventListener("click",submit);
    input?.addEventListener("keydown",e=>{
      if(e.key==="Enter" && !e.shiftKey){e.preventDefault();submit();}
    });
  }

  function respondAI(q){
    const x=q.toLowerCase();
    let answer="";
    let source="General information only. Verify current Kenyan law and obtain professional advice for a specific matter.";
    if(/practice|areas|services/.test(x)){
      answer="G.K.K LAW's supplied website content identifies Corporate & Commercial Law, Litigation & Dispute Resolution, Real Estate Law, Employment Law, Intellectual Property Law, Family Law and Succession Law as its core areas.";
    }else if(/due diligence/.test(x)){
      answer="Legal due diligence is a structured review of documents, ownership, obligations, risks, compliance and other relevant facts before a transaction or decision. The exact checks depend on the matter—for example, a property transaction may require title, searches, consents, encumbrances and transaction documents to be reviewed.";
    }else if(/kenya.*update|kenya.*news|latest.*kenya/.test(x)){
      answer="For current Kenya legal developments, use the Legal Knowledge news desk and confirm important developments against primary sources such as legislation, court decisions, regulator notices and official Judiciary resources. This static consultant does not claim live legal verification.";
      source="Use the Court & Legal Tools section for official Judiciary and Kenya Law resources.";
    }else if(/global|international|world/.test(x)){
      answer="For global legal developments, treat news results as leads rather than legal authority. Identify the relevant jurisdiction, date, primary legislation or decision, and regulator/court before relying on a development.";
    }else if(/court system|judiciary|court/.test(x)){
      answer="The website provides links to Kenya's Judiciary, Supreme Court, e-Filing and Kenya Law. Court jurisdiction and procedure depend on the nature of the dispute and applicable law, so the current official court materials should be checked for a specific matter.";
    }else if(/contact|consult|enquir/.test(x)){
      answer=`You can contact ${firm.name} at ${firm.email}, ${firm.phone1} or ${firm.phone2}. The office listed on this website is ${firm.address}.`;
    }else{
      answer="I can explain general legal concepts, help identify the questions that need professional review, and point you toward official Kenyan legal resources. Try asking about a practice area, due diligence, the court system, a contract, property, employment, succession, or current legal resources.";
    }
    addMessage(answer,"bot",source);
    setAIStatus("On-page legal information assistant · no external AI API required");
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
      title.textContent=key;
      body.textContent=data[key]||"General legal information. Please consult the firm for advice on a specific matter.";
      modal.classList.add("open");
      document.body.style.overflow="hidden";
    };
    window.closeKnowledge=()=>{
      $("#knowledgeModal")?.classList.remove("open");
      document.body.style.overflow="";
    };
    $("#knowledgeModal")?.addEventListener("click",e=>{if(e.target.id==="knowledgeModal")window.closeKnowledge()});
  }

  function initExternalLinks(){
    // The user asked that official tools work. We preserve the supplied destination
    // and add a clear confirmation before opening an external service.
    $$(".external-link,[data-genuine-link='true']").forEach(link=>{
      link.addEventListener("click",e=>{
        const href=link.getAttribute("href");
        if(!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) return;
        if(link.dataset.confirmed==="1") return;
        e.preventDefault();
        const label=link.dataset.externalLabel || link.textContent.trim() || "external resource";
        showConfirm({
          title:"Opening official external resource",
          text:`You are leaving G.K.K LAW and opening ${label}. The destination is controlled by the external institution.`,
          confirm:"Continue",
          onConfirm:()=>{link.dataset.confirmed="1";link.click();setTimeout(()=>delete link.dataset.confirmed,1000)}
        });
      });
    });
  }

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
