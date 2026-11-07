/* =========================================================
   G.K.K AI Legal Consultant — knowledge base
   General Kenyan legal information (educational, not advice).
   Each topic: id, title, keywords (weighted by length/phrase), answer, follow-ups.
   Answers use **bold** and lines beginning with "• " for lists.
   ========================================================= */
window.GKK_KB = [
  {
    id: "courts", title: "Kenya's court system",
    kw: ["court system","courts","court hierarchy","supreme court","court of appeal","high court","magistrate","magistrates","jurisdiction","kadhi","tribunal","tribunals","elc","elrc","environment and land court","where to file","which court"],
    a: "**Kenya's court structure (Constitution of Kenya, 2010)**\n• **Supreme Court** – final appellate court; also gives advisory opinions and hears presidential election petitions.\n• **Court of Appeal** – hears appeals from the High Court and the specialised courts.\n• **High Court** – unlimited original jurisdiction in civil and criminal matters, constitutional questions and supervisory jurisdiction over subordinate courts and tribunals.\n• **Specialised courts (same status as the High Court)** – the Environment and Land Court (land and environment disputes) and the Employment and Labour Relations Court (employment and labour disputes).\n• **Subordinate courts** – Magistrates' Courts (civil value limits depend on the magistrate's grade), Kadhis' Courts (Muslim personal law where parties submit to it), Small Claims Court (claims up to KSh 1,000,000) and the Court Martial.\n• **Tribunals** – for example the Business Premises Rent Tribunal, Tax Appeals Tribunal and the Competition Tribunal.\n\nWhere a matter belongs depends on its subject-matter, value and the governing statute, so confirm jurisdiction before filing.",
    f: ["How do I file a case online?", "What is the Small Claims Court?", "What is the limitation period?"]
  },
  {
    id: "efiling", title: "e-Filing and court tools",
    kw: ["efiling","e-filing","file online","online filing","cause list","kenya law","law reports","case search","judgment","judgments","legislation","find a law","find a case"],
    a: "**Official digital tools**\n• **Judiciary e-Filing** (efiling.court.go.ke) lets advocates and parties file and pay court fees online in supported courts.\n• **Cause lists** are published on the Judiciary and Supreme Court portals so you can check hearing dates.\n• **Kenya Law** (kenyalaw.org) hosts legislation, case law and law reports for free research.\n\nAll of these are linked in the **Court & Legal Tools** section of this website. Procedures and supported courts change, so check the e-Filing support pages for the latest requirements.",
    f: ["How does the Kenyan court system work?", "How do I speak to an advocate?"],
    actions: [{ label: "Open Court Tools", href: "#tools" }]
  },
  {
    id: "limitation", title: "Limitation periods",
    kw: ["limitation","time limit","time barred","statute barred","how long to sue","deadline to sue","limitation of actions","prescribed period","out of time"],
    a: "**Limitation of time to sue (general guide)**\nThe Limitation of Actions Act (Cap. 22) sets the usual periods:\n• **Contract** – generally 6 years from when the cause of action arose.\n• **Tort** (for example negligence) – generally 3 years.\n• **Defamation** – 1 year.\n• **Recovery of land** – generally 12 years.\n• **Employment claims** in the ELRC – generally 3 years (12 months after cessation for continuing injuries) under the Employment Act.\n\nExceptions exist (for example minority, disability, fraud or mistake), and special statutes can set different periods. Because a missed deadline can end a claim, speak to an advocate early.",
    f: ["How do I speak to an advocate?", "What is the Small Claims Court?"]
  },
  {
    id: "smallclaims", title: "Small Claims Court",
    kw: ["small claims","small claim","small claims court","claim under","cheap court","quick court","debt small","1 million claim","kes 1,000,000"],
    a: "**Small Claims Court (Small Claims Court Act, 2016)**\n• Handles civil claims up to **KSh 1,000,000** – for example unpaid goods or services, rent arrears, contractual and some employment-related money claims.\n• Designed to be quick, informal and affordable; parties generally represent themselves and advocates do not ordinarily appear.\n• A claim is started with a Statement of Claim and supporting documents, and judgments are generally delivered within a short period of the hearing.\n\nLarger or more complex disputes belong in the Magistrates' Courts or the High Court.",
    f: ["How does the Kenyan court system work?", "How do I recover a debt?"]
  },
  {
    id: "debt", title: "Debt recovery",
    kw: ["debt","recover","recovery","owe me","owes me","unpaid","demand letter","collect money","debtor","creditor","asset recovery","judgment debtor","execution","attach","garnishee","unpaid invoice","bounced cheque","cheque"],
    a: "**Recovering a debt – typical route**\n• **1. Gather proof** – contract, invoices, delivery notes, statements, messages acknowledging the debt.\n• **2. Demand letter** – a formal written demand with a clear deadline, usually sent through an advocate.\n• **3. Negotiate or mediate** – structured payment plans can be documented in a written settlement.\n• **4. Sue** – small claims (up to KSh 1M), the Magistrates' Court or the High Court, depending on value; limitation periods apply.\n• **5. Enforce the judgment** – attachment and sale of assets, garnishee orders, or (in suitable cases) insolvency steps.\n\nIf the debt is secured by a charge, mortgage or guarantee, there are additional statutory remedies, so documents should be reviewed first.",
    f: ["What is the limitation period?", "What is the Small Claims Court?", "How do I speak to an advocate?"]
  },
  {
    id: "contracts", title: "Contracts",
    kw: ["contract","contracts","agreement","agreements","clause","clauses","breach","terms and conditions","sign a contract","draft a contract","review a contract","non-disclosure","nda","service agreement","memorandum of understanding","mou","enforceable"],
    a: "**Contracts – what to check**\nA binding contract generally needs an offer, acceptance, consideration, intention to create legal relations and capacity. Under the Law of Contract Act, a contract for the disposition of an interest in land must be in writing and properly executed.\n\nKey clauses worth understanding:\n• **Parties and capacity** – correct legal names and authority to sign.\n• **Scope, price and payment** – deliverables, deadlines, interest on late payment.\n• **Term and termination** – notice periods and exit rights.\n• **Liability, indemnity and warranties** – who bears which risk.\n• **Confidentiality and IP** – ownership of work and information.\n• **Governing law and dispute resolution** – courts or arbitration, seat and language.\n\nHave an advocate review any agreement before you sign; it is far cheaper than fixing a dispute later.",
    f: ["What is due diligence?", "How do I handle a breach of contract?", "How does arbitration work?"]
  },
  {
    id: "breach", title: "Breach of contract",
    kw: ["breach of contract","broke the contract","broken contract","remedies","damages","specific performance","injunction","repudiation","terminate contract"],
    a: "**If the other party breaches a contract**\n• Re-read the contract: notice, cure periods and dispute clauses often control the next step.\n• Keep evidence and put your position in writing.\n• Remedies can include **damages**, **specific performance**, **injunctions**, termination and recovery of money paid.\n• Many contracts require **negotiation, mediation or arbitration** before court.\n• Act within the limitation period (generally 6 years for contract claims).",
    f: ["How does arbitration work?", "What is the limitation period?"]
  },
  {
    id: "duediligence", title: "Legal due diligence",
    kw: ["due diligence","diligence","vet","vetting","acquisition review","buy a company","buying a business","investment review"],
    a: "**Legal due diligence** is a structured review of documents, ownership, obligations, risks and compliance before a transaction or investment.\n\nTypical checks:\n• **Companies** – incorporation records, shareholders and directors, beneficial ownership, licences, contracts, litigation, tax and employment compliance.\n• **Property** – title and ownership history, official search, encumbrances and caveats, rates and rent clearance, consents and approvals, planning and zoning.\n• **Intellectual property** – registrations, licences and chain of title.\n\nThe findings shape price, warranties, conditions precedent and whether to proceed at all.",
    f: ["How do I buy land safely?", "How do I register a company?"]
  },
  {
    id: "company", title: "Registering a company or business",
    kw: ["register a company","company registration","incorporate","incorporation","start a company","start a business","limited company","private company","business name","brs","business registration service","ecitizen","shareholder","directors","annual returns","beneficial owner","companies act","ngo","society","partnership","llp"],
    a: "**Registering a business in Kenya (overview)**\n• **Options** – sole proprietor/business name, partnership, limited liability partnership, private or public company (Companies Act, 2015), or a non-profit vehicle such as a society, trust or NGO.\n• **Private company** – registered with the Business Registration Service (BRS) through eCitizen. You need a unique name, at least one director and one shareholder, a registered office and beneficial ownership information.\n• **After registration** – KRA PIN, bank account, relevant licences and county permits, statutory registers and **annual returns**.\n• **Shareholders' agreements** and articles should reflect how decisions, share transfers and exits will actually work.\n\nCorporate structuring affects tax, liability and investment, so it is worth taking advice at the start.",
    f: ["What is due diligence?", "How do I register a trademark?", "How do I speak to an advocate?"]
  },
  {
    id: "arbitration", title: "Arbitration, mediation and ADR",
    kw: ["arbitration","arbitrate","mediation","mediate","adr","alternative dispute","negotiation","ncia","nairobi centre for international arbitration","settle out of court","conciliation"],
    a: "**Alternative dispute resolution (ADR)**\n• **Negotiation** – direct, fastest and cheapest.\n• **Mediation / conciliation** – a neutral helps the parties reach their own settlement; encouraged by Article 159 of the Constitution.\n• **Arbitration** – a binding decision by an arbitrator under the Arbitration Act, 1995, if the contract has an arbitration clause or the parties agree. Awards are generally final and enforceable through the courts. The Nairobi Centre for International Arbitration (NCIA) is a local institution.\n• **Court-annexed mediation** – available in many courts.\n\nCross-border contracts frequently choose arbitration because awards can be enforced under the New York Convention.",
    f: ["What are the key clauses in a contract?", "How do I recover a debt?"]
  },
  {
    id: "land_buy", title: "Buying land or property",
    kw: ["buy land","buying land","buy a plot","buy property","buying property","buy a house","purchase land","land purchase","sale agreement","title deed","title search","official search","land search","ardhi","conveyancing","transfer of land","stamp duty","land control board","leasehold","freehold","lease","caveat","charge","mortgage","plot","property transaction","land transaction","land fraud","fake title"],
    a: "**Buying land or property safely (general steps)**\n• **1. Official search** – confirm the registered owner, type of title (freehold or leasehold, lease term remaining), encumbrances, caveats and charges at the Land Registry / Ardhi Sasa.\n• **2. Verify the seller and the land** – identity, authority to sell, physical visit, survey/beacons, planning and zoning, rates and land rent clearance.\n• **3. Consents** – Land Control Board consent for agricultural land; spousal consent where required; other statutory approvals.\n• **4. Sale agreement** – drafted or reviewed by an advocate; deposit paid into an advocate's client account rather than directly to the seller.\n• **5. Transfer** – stamp duty (commonly 4% in urban areas and 2% in rural areas of the value; confirm current rates), transfer documents, registration and a new title in your name.\n\nProperty fraud is common, so do not pay money before the searches are done.",
    f: ["What is due diligence?", "How do I speak to an advocate?", "What are my rights as a tenant?"]
  },
  {
    id: "tenancy", title: "Landlords, tenants and leases",
    kw: ["tenant","tenancy","landlord","rent","eviction","evict","lease agreement","rent increase","business premises","distress for rent","deposit","vacate","notice to vacate","rent tribunal","residential tenancy"],
    a: "**Tenancy basics**\n• Always have a **written tenancy or lease agreement** stating rent, deposit, term, notice, repairs and use.\n• A landlord generally cannot lawfully evict by force, lock-outs or removing belongings; proper **notice** and the right legal process apply.\n• **Business premises** disputes (controlled tenancies) go to the **Business Premises Rent Tribunal**; residential disputes can follow the Rent Restriction regime, the tribunal or the courts, depending on the facts.\n• Keep receipts and notices; document the condition of the premises at the start and end of the tenancy.\n\nThe forum and process depend on the type of premises and rent level, so get advice on the specific facts.",
    f: ["How do I buy land safely?", "How do I recover a debt?"]
  },
  {
    id: "employment", title: "Employment law",
    kw: ["employment","employee","employer","employed","job","fired","dismissed","dismissal","terminated","termination","unfair termination","redundancy","retrench","retrenchment","notice period","salary","wages","leave","maternity","paternity","probation","contract of employment","workplace","labour","labor","sack","sacked","disciplinary","show cause","unfair dismissal","severance","service pay","nssf","nhif","sha","harassment"],
    a: "**Employment law in Kenya (Employment Act, 2007)**\n• **Contract** – employers must provide written particulars of employment; probation is generally up to 6 months (extendable once by agreement).\n• **Termination** – needs a **valid reason** and **fair procedure**: the employee must be told the reason and given a hearing, with a colleague or union representative present (sections 41 and 43–45). Notice depends on the contract and pay period (for monthly-paid staff, generally 28 days).\n• **Leave** – at least 21 working days of annual leave after 12 consecutive months, sick leave, 3 months' maternity leave and 2 weeks' paternity leave.\n• **Redundancy** – requires notice to the employee, the union and the labour officer, with severance pay of generally not less than 15 days' pay per completed year of service.\n• **Disputes** – the Employment and Labour Relations Court generally hears claims; the usual time limit is 3 years.\n\nRemedies for unfair termination can include compensation of up to 12 months' gross pay, reinstatement and other relief.",
    f: ["How do I challenge an unfair dismissal?", "What is the limitation period?", "How do I speak to an advocate?"]
  },
  {
    id: "dismissal", title: "Challenging an unfair dismissal",
    kw: ["challenge dismissal","unfair dismissal","wrongful dismissal","wrongfully terminated","sue my employer","sue employer","claim against employer","demand letter to employer","terminated without notice","fired without notice"],
    a: "**If you think you were dismissed unfairly**\n• Keep your contract, letters, payslips, warnings and any messages about the termination.\n• Ask for the **reason in writing** and note whether you were given a hearing and notice.\n• Consider a **demand letter** to the employer and, where relevant, the Labour Office or conciliation.\n• A claim is filed in the **Employment and Labour Relations Court**, generally within 3 years of the termination.\n\nAn advocate can assess your prospects and the likely remedies once the documents have been reviewed.",
    f: ["How do I speak to an advocate?", "What is the limitation period?"]
  },
  {
    id: "succession", title: "Succession, wills and estates",
    kw: ["succession","will","wills","probate","letters of administration","estate","inheritance","inherit","intestate","testate","deceased","died","death of","beneficiary","beneficiaries","executor","administrator","confirmation of grant","grant of probate","succession cause","pa80","p&a","next of kin","distribution of estate","dies without a will","writing a will","make a will"],
    a: "**Succession in Kenya (Law of Succession Act, Cap. 160)**\n• **With a will (testate)** – the executor applies for a **grant of probate**.\n• **Without a will (intestate)** – a family member applies for **letters of administration**, and the estate is distributed under the Act's rules, which depend on the family situation (spouse(s), children, and so on).\n• **Process** – petition in the High Court or a Magistrates' Court with jurisdiction → notice published in the Kenya Gazette → grant issued → **confirmation of grant** (generally not before 6 months from the grant) → distribution and transmission of assets.\n• **Documents** – death certificate, chief's letter, list of assets and liabilities, family details and consents.\n• **Making a will** – needs capacity, writing, signature and at least two witnesses; clear wills greatly reduce disputes.\n\nDisputes over estates can become lengthy, so early advice and good records are valuable.",
    f: ["How do I make a will?", "How do I speak to an advocate?", "What are the rights of a spouse in an estate?"]
  },
  {
    id: "family", title: "Family law",
    kw: ["family","divorce","separation","marriage","marry","custody","child custody","maintenance","child support","spousal support","alimony","adoption","matrimonial","matrimonial property","customary marriage","cohabitation","come we stay","guardianship","children act","marriage act","annulment","paternity"],
    a: "**Family law (overview)**\n• **Marriage Act, 2014** – recognises civil, Christian, customary, Hindu and Islamic marriages. Divorce petitions generally cannot be filed within the first 3 years of marriage unless there is exceptional hardship or depravity.\n• **Matrimonial Property Act, 2013** – property is divided according to each spouse's contribution and the type of ownership; the court decides where the parties cannot agree.\n• **Children Act, 2022** – the **best interests of the child** is the guiding principle in custody, access and maintenance; both parents have a duty to maintain.\n• **Adoption** – regulated by the Children Act and handled in the courts.\n\nFamily disputes are sensitive; mediation and carefully drafted agreements often protect relationships and children's interests better than prolonged litigation.",
    f: ["How do I speak to an advocate?", "How does succession work?"]
  },
  {
    id: "ip", title: "Intellectual property",
    kw: ["intellectual property","ip","trademark","trade mark","trademarks","patent","patents","copyright","trade secret","brand","logo","kipi","kecobo","industrial design","licence","licensing","infringement","counterfeit","register a trademark","protect my brand","protect my idea","protect my invention","protect my music"],
    a: "**Intellectual property in Kenya**\n• **Trademarks** (Trade Marks Act) – registered with the Kenya Industrial Property Institute (**KIPI**). Registration generally lasts 10 years and is renewable. Search the register first and register in the correct class(es).\n• **Patents and industrial designs** (Industrial Property Act, 2001) – for inventions and designs, also through KIPI; novelty is key, so avoid public disclosure before filing.\n• **Copyright** (Copyright Act, 2001) – arises automatically on creating an original work; registration and recordation with the Kenya Copyright Board (**KECOBO**) can help prove ownership.\n• **Trade secrets** – protected through confidentiality agreements and good internal controls.\n• **Enforcement** – demand letters, injunctions, damages and customs/anti-counterfeit action.\n\nContracts should always say who owns the IP in work created by employees and contractors.",
    f: ["How do I register a company?", "How do I speak to an advocate?"]
  },
  {
    id: "criminal", title: "Criminal law and your rights",
    kw: ["criminal","arrest","arrested","police","bail","bond","charge","charged","remand","detained","detention","custody","bail application","released","murder","theft","fraud","assault","traffic offence","interrogation","statement to police","rights of an arrested person","article 49","ocs","dci","appeal conviction","criminal appeal"],
    a: "**Rights of an arrested person (Article 49, Constitution)**\n• To be told promptly, in a language you understand, **why** you are being arrested.\n• To **remain silent** and to be told the consequences of not remaining silent.\n• To **communicate with an advocate** and other persons.\n• Not to be compelled to make any confession or admission.\n• To be **brought before a court within 24 hours** (or the next court day).\n• To be **released on bail or bond** on reasonable conditions pending trial, unless there are compelling reasons.\n\nIf you or someone you know has been arrested: stay calm, avoid signing statements without advice, and contact an advocate immediately. Bail, plea, trial and appeal steps depend on the offence and the court.",
    f: ["How do I speak to an advocate?", "How does the Kenyan court system work?"],
    urgent: true
  },
  {
    id: "dataprotection", title: "Data protection and cyber law",
    kw: ["data protection","privacy","personal data","odpc","data controller","data processor","gdpr","cyber","cybersecurity","cybercrime","computer misuse","digital evidence","electronic evidence","hacking","online fraud","data breach","consent","cookies"],
    a: "**Data protection and cyber law**\n• The **Data Protection Act, 2019** regulates how personal data is collected, used and shared. Organisations processing personal data generally need to **register with the Office of the Data Protection Commissioner (ODPC)**, follow the data-protection principles (lawfulness, purpose limitation, minimisation, security) and respect data-subject rights such as access and correction.\n• **Breaches** may need to be notified to the ODPC and affected individuals within the statutory timeframe.\n• The **Computer Misuse and Cybercrimes Act, 2018** criminalises offences such as unauthorised access and online fraud.\n• **Electronic evidence** is admissible under the Evidence Act if the statutory conditions are met, so preserve original data and logs carefully.\n\nBusinesses with international customers may also need to consider foreign laws such as the GDPR.",
    f: ["How do I register a company?", "How do I speak to an advocate?"]
  },
  {
    id: "legalfees", title: "Legal fees and engaging an advocate",
    kw: ["legal fees","fees","cost","how much","charge for","pricing","advocate fees","remuneration","retainer","instruction fee","quote","afford","pay an advocate","legal aid","pro bono","free legal"],
    a: "**Legal fees – how they generally work**\n• Fees are governed by the **Advocates Remuneration Order** and can be agreed in writing with your advocate (fixed fee, hourly rate, retainer or a scale fee for court work).\n• Advocates should explain the likely costs at the start; costs awarded by a court are separate from what you pay your own advocate.\n• For matters of limited means, **legal aid** may be available through the National Legal Aid Service or institutions that offer pro bono help.\n\nFor a fee estimate for your matter, contact the firm with a short description and we will advise on the next step.",
    f: ["How do I speak to an advocate?"]
  },
  {
    id: "confidential", title: "Confidentiality and privilege",
    kw: ["confidential","privileged","privilege","advocate client","client confidentiality","is this private","secret","safe to share"],
    a: "**Confidentiality**\nAdvocates owe a duty of confidentiality and benefit from **advocate-client privilege**, which generally protects communications made for the purpose of legal advice. This website's chat tool, however, is an information assistant; **please do not enter sensitive personal details, passwords or confidential case facts here**. Share those directly with the firm through a consultation.",
    f: ["How do I speak to an advocate?"]
  },
  {
    id: "will", title: "Making a will",
    kw: ["make a will","making a will","write a will","draft a will","valid will","witness","witnesses","revoke a will"],
    a: "**Making a valid will in Kenya**\n• You must be an adult of **sound mind**, acting voluntarily.\n• The will should be **in writing**, signed by you (or by someone at your direction in your presence) and **witnessed by at least two witnesses** who are present at the same time and who also sign. Beneficiaries (or their spouses) should not be witnesses.\n• Name **executors**, describe assets clearly, and provide for dependants (the court can make provision for dependants who were left out).\n• Keep the original safe and tell the executor where it is; update it after major life events.",
    f: ["How does succession work?", "How do I speak to an advocate?"]
  },
  {
    id: "spouserights", title: "Spouses and dependants in an estate",
    kw: ["rights of a spouse","widow","widower","spouse","dependant","dependants","disinherit","children inherit","polygamous","second wife","daughters inherit"],
    a: "**Spouses and dependants in succession**\nUnder the Law of Succession Act, a surviving spouse and children are the primary dependants and are entitled to provision from the estate; in an intestate estate the Act sets out the shares (for example, the surviving spouse generally holds a life interest in the net estate where there are children, and polygamous households share according to the number of children). Courts treat sons and daughters equally. Where a will leaves out a dependant, they can apply for reasonable provision.\n\nThe exact distribution depends on the facts, so have a succession advocate review the family tree and assets.",
    f: ["How does succession work?", "How do I speak to an advocate?"]
  },
  {
    id: "firm", title: "About G.K.K LAW",
    kw: ["who are you","about the firm","about gkk","about g.k.k","about your firm","what do you do","practice areas","areas of practice","services","what areas","what does gkk","gkk law","g.k.k law","gkk","kimani advocates","kimani and associates","your firm","your services","areas of law"],
    a: "**G.K KIMANI & ASSOCIATES ADVOCATES (G.K.K LAW)** is a Kiambu-based law firm offering strategic counsel and advocacy across:\n• Corporate & Commercial Law\n• Litigation & Dispute Resolution\n• Real Estate Law\n• Employment Law\n• Intellectual Property Law\n• Family Law\n• Succession Law\n\nThe wider team also supports criminal law, conveyancing, and asset recovery and debt collection. The firm combines professional independence, confidentiality, a global perspective and a client-focused, technology-enabled approach.",
    f: ["Who is on the team?", "Where is the office?", "How do I speak to an advocate?"],
    actions: [{ label: "Practice areas", href: "#practice" }]
  },
  {
    id: "contact", title: "Contact and consultation",
    kw: ["contact","speak to an advocate","talk to an advocate","book a consultation","consultation","appointment","phone","call","email","whatsapp","reach you","reach the firm","get in touch","hire","instruct","engage","meet a lawyer","see a lawyer","speak to a lawyer","talk to a lawyer","need a lawyer","need an advocate"],
    a: "**Speak to the firm**\n• **Phone:** +254 706 048 083 or +254 715 707 574\n• **Email:** lawgkk@gmail.com\n• **Office:** Kahawa House, 2nd Floor, Suite 18 and 32, Kiambu Town, Kenya\n\nYou can also use the consultation form on this page, or message us on WhatsApp. A short description of your matter and any key documents will help the team respond quickly.",
    f: ["Where is the office?", "What areas of law do you handle?"],
    actions: [
      { label: "Open contact form", href: "#contact" },
      { label: "WhatsApp the firm", href: "https://wa.me/254706048083?text=Hello%20G.K.K%20LAW%2C%20I%20would%20like%20to%20make%20a%20legal%20enquiry." }
    ]
  },
  {
    id: "location", title: "Office location",
    kw: ["where is the office","location","address","office","directions","kiambu","kahawa house","map","where are you","where is the firm","find you","visit"],
    a: "**Office:** Kahawa House, 2nd Floor, Suite 18 and 32, Kiambu Town, Kenya.\nThe Location section of this page has a live map and a route link to Google Maps.",
    f: ["How do I speak to an advocate?"],
    actions: [{ label: "View map", href: "#location" }]
  },
  {
    id: "team", title: "The team",
    kw: ["team","who is on the team","lawyers","advocates","partners","geoffrey","kimani","george","ayuku","brian","namasaka","simon","ndichu","staff","people","who works"],
    a: "__TEAM__",
    f: ["How do I speak to an advocate?", "What areas of law does G.K.K LAW handle?"],
    actions: [{ label: "Meet the team", href: "#people" }]
  },
  {
    id: "news", title: "Legal news",
    kw: ["news","latest","update","updates","recent","new law","new laws","amendment","bill","finance act","current","trending","developments","global law","international law"],
    a: "I can't read live news feeds from inside this page, but the **Legal News Desk** and the buttons below open live Google News results for Kenyan and global legal developments. For anything important, confirm the position against the primary source (the Kenya Gazette, the Act itself, a court decision or regulator notice) on **Kenya Law** or the Judiciary website.",
    f: ["How does e-Filing work?"],
    actions: [
      { label: "Kenya legal news", href: "https://news.google.com/search?q=Kenya%20law%20legal%20news&hl=en-KE&gl=KE&ceid=KE%3Aen", external: true },
      { label: "Global legal news", href: "https://news.google.com/search?q=global%20law%20legal%20news&hl=en&gl=US&ceid=US%3Aen", external: true },
      { label: "Kenya Law", href: "https://new.kenyalaw.org/", external: true }
    ]
  },
  {
    id: "blog", title: "Blog and knowledge",
    kw: ["blog","articles","insights","read more","journal","knowledge","publications","news letter","newsletter"],
    a: "The firm's **Legal Knowledge Journal** is in the Knowledge section of this page, and the full blog is available at gkkimaniassociatesadvocates.blogspot.com.",
    f: ["What are the latest legal updates?"],
    actions: [
      { label: "Open the blog", href: "https://gkkimaniassociatesadvocates.blogspot.com/", external: true },
      { label: "Knowledge section", href: "#knowledge" }
    ]
  },
  {
    id: "international", title: "Cross-border and international matters",
    kw: ["international","cross-border","cross border","foreign","foreigner","non-resident","diaspora","abroad","overseas","investor","foreign investment","global","outside kenya","from abroad"],
    a: "**Cross-border and diaspora matters**\nThe firm supports clients in Kenya and abroad with cross-border contracts, foreign investment structuring, diaspora property purchases, international family and succession issues, and enforcement of foreign judgments or awards. Key issues usually include which country's law applies, where disputes will be heard, local registration and tax requirements, and verifying documents through proper channels (for example powers of attorney executed abroad usually need notarisation and legalisation/apostille).\n\nDiaspora clients buying land should be especially careful: use an advocate, complete official searches and avoid paying funds to individuals.",
    f: ["How do I buy land safely?", "How do I speak to an advocate?"]
  },
  {
    id: "poa", title: "Powers of attorney and documents",
    kw: ["power of attorney","poa","affidavit","notary","notarise","commissioner for oaths","statutory declaration","deed poll","change of name","witness a document","legalise","apostille","certify","certified copy"],
    a: "**Common legal documents**\n• **Power of attorney** – authorises someone to act for you; it should state the scope clearly and, for land dealings, must be properly executed and registered where required.\n• **Affidavit / statutory declaration** – a sworn statement, sworn before a **Commissioner for Oaths** or **Notary Public**.\n• **Deed poll (change of name)** – executed and often gazetted; other institutions then update records.\n• **Documents used abroad** – may need notarisation and an **apostille** or legalisation.\n\nAn advocate can prepare and witness these so that they are accepted by banks, registries and courts.",
    f: ["How do I speak to an advocate?"]
  }
];

/* Greetings, thanks and other conversational helpers */
window.GKK_SMALLTALK = [
  { re: /^(hi|hello|hey|good (morning|afternoon|evening)|jambo|habari|hallo|greetings)\b/i,
    a: "Hello, and welcome to **G.K.K LAW**. I can explain Kenyan legal concepts in plain language and point you to the right next step. Ask about a topic such as contracts, land, employment, succession, family, company registration or the court system, or pick one of the suggestions below.",
    f: ["How does the court system work?", "How do I buy land safely?", "What are my employment rights?", "How do I speak to an advocate?"] },
  { re: /\b(thanks|thank you|asante|cheers|great|perfect|awesome)\b/i,
    a: "You're welcome. If you would like personal advice on your situation, the team is happy to speak with you.",
    f: ["How do I speak to an advocate?", "Ask another question"] },
  { re: /\b(bye|goodbye|see you|later)\b/i,
    a: "Goodbye, and thank you for visiting G.K.K LAW. You can come back to this chat any time.", f: [] },
  { re: /\b(are you (a )?(human|real|robot|bot|ai)|who made you|are you chatgpt|what are you)\b/i,
    a: "I'm the **G.K.K AI Legal Consultant**, an on-page information assistant. I run in your browser using the firm's knowledge base, so I'm not a person or a substitute for an advocate. I give general information about Kenyan law and can connect you with the firm.",
    f: ["What areas of law does G.K.K LAW handle?", "How do I speak to an advocate?"] },
  { re: /\b(can you (give|provide) (me )?legal advice|should i sue|will i win|what are my chances|is it legal|do i have a case)\b/i,
    a: "I can explain how the law generally works and what questions matter, but I can't tell you whether you will win or give advice on your specific facts. Those answers depend on documents, evidence and current law that an advocate must review. Tell me the topic and I'll give you the general framework, then you can book a consultation.",
    f: ["How do I speak to an advocate?", "What is the limitation period?"] }
];
