import { useState, useEffect, useRef } from "react";

// ── BRAND TOKENS ──────────────────────────────────────────────
const C = {
  void: "#0A0A0A", steel: "#1A1F2E", concrete: "#2C3347",
  rust: "#C94F1E", amber: "#E8A020", mist: "#8A9AB5",
  cream: "#F5F0E8", light: "#F8F6F2", rule: "#E0DAD0",
  green: "#22C55E", white: "#ffffff",
};

// ── GLOBAL STYLES (injected once) ─────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0A0A0A; color: #F5F0E8; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes scan { 0%,100%{opacity:.15;transform:scaleX(.3)} 50%{opacity:.6;transform:scaleX(1)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .fade-in { animation: fadeUp 0.7s ease forwards; }
  .scan-line { animation: scan 4s ease-in-out infinite; }
  .ticker-inner { animation: ticker 36s linear infinite; }
  .sdot-live-pulse { animation: pulse 2s ease-in-out infinite; }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── REUSABLE ATOMS ────────────────────────────────────────────
function BlocMark({ size = 20 }) {
  const s = size / 2 - 1;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, width:size, height:size, flexShrink:0 }}>
      <div style={{ background:C.rust, borderRadius:1, width:s, height:s }} />
      <div style={{ background:C.concrete, borderRadius:1, width:s, height:s }} />
      <div style={{ background:"#1E2436", borderRadius:1, width:s, height:s }} />
      <div style={{ background:"#3A4560", borderRadius:1, width:s, height:s }} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.rust, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ width:16, height:1, background:C.rust, display:"block", flexShrink:0 }} />
      {children}
    </div>
  );
}

function SectionH2({ children, light }) {
  return (
    <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,56px)", letterSpacing:"0.04em", lineHeight:1, color: light ? C.void : C.cream, marginBottom:16 }}>
      {children}
    </h2>
  );
}

function BtnPrimary({ children, onClick, href }) {
  const s = { background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", padding:"13px 26px", border:"none", borderRadius:2, cursor:"pointer", textDecoration:"none", display:"inline-block", transition:"background 0.2s" };
  if (href) return <a href={href} style={s} target="_blank" rel="noreferrer">{children}</a>;
  return <button style={s} onClick={onClick}>{children}</button>;
}

function BtnGhost({ children, onClick, href }) {
  const s = { background:"transparent", color:C.mist, fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", padding:"12px 26px", border:`1px solid ${C.concrete}`, borderRadius:2, cursor:"pointer", textDecoration:"none", display:"inline-block", transition:"border-color 0.2s" };
  if (href) return <a href={href} style={s} target="_blank" rel="noreferrer">{children}</a>;
  return <button style={s} onClick={onClick}>{children}</button>;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── NAV ──────────────────────────────────────────────────────
function Nav({ onSignIn }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [["Platform","#platform"],["Corridors","#corridors"],["About","#about"],["Pricing","#pricing"]];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(10,10,10,0.95)", backdropFilter:"blur(12px)", borderBottom:`1px solid rgba(201,79,30,0.2)`, padding:"0 40px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <BlocMark size={22} />
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.15em", color:C.cream }}>BLOC</span>
      </a>
      <ul style={{ display:"flex", alignItems:"center", gap:28, listStyle:"none" }}>
        {links.map(([label, href]) => (
          <li key={label} style={{ display: mobileOpen ? "block" : undefined }}>
            <a href={href} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", color:C.mist, textDecoration:"none", textTransform:"uppercase" }}>{label}</a>
          </li>
        ))}
        <li>
          <button onClick={onSignIn} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", background:C.rust, color:C.cream, padding:"8px 16px", borderRadius:2, border:"none", cursor:"pointer" }}>Sign In</button>
        </li>
      </ul>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────
function Hero({ onSignIn }) {
  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 40px 60px", position:"relative", overflow:"hidden" }}>
      {/* Grid background */}
      <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage:`linear-gradient(rgba(201,79,30,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,79,30,0.04) 1px, transparent 1px)`, backgroundSize:"40px 40px" }} />
      {/* Scan line */}
      <div className="scan-line" style={{ position:"absolute", left:0, right:0, top:"48%", height:1, background:`linear-gradient(90deg, transparent, ${C.rust}, transparent)`, zIndex:1 }} />

      <div className="fade-in" style={{ position:"relative", zIndex:2, maxWidth:860 }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.15em", color:C.rust, textTransform:"uppercase", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:24, height:1, background:C.rust, display:"block" }} />
          Pan-African Trade Infrastructure
        </div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,9vw,108px)", lineHeight:0.92, letterSpacing:"0.02em", color:C.cream, marginBottom:8 }}>
          Trade Moves<br /><span style={{ color:C.rust }}>On BLOC.</span>
        </h1>
        <p style={{ fontSize:15, color:C.mist, lineHeight:1.6, maxWidth:520, marginBottom:48, marginTop:20, fontWeight:300 }}>
          End-to-end corridor infrastructure for African cross-border trade — compliance, payments, logistics, and intelligence on one platform.
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <BtnPrimary onClick={onSignIn}>Access Platform →</BtnPrimary>
          <BtnGhost href="#platform">See How It Works</BtnGhost>
        </div>
        <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:8, fontFamily:"'Space Mono',monospace", fontSize:10, color:C.mist, letterSpacing:"0.08em" }}>
          <div style={{ width:18, height:18, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.531 5.85L0 24l6.341-1.507A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </div>
          Also available on WhatsApp — no app download required
        </div>
      </div>

      {/* Hero stats */}
      <div style={{ position:"absolute", right:40, bottom:60, zIndex:2, display:"flex", flexDirection:"column", gap:20, textAlign:"right" }}>
        {[["6","Corridors planned"],["4hr","Clearance target"],["54","AfCFTA markets"]].map(([val, lbl]) => (
          <div key={lbl}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:C.rust, lineHeight:1 }}>{val}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:C.mist, letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>{lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── TICKER ────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { dot:"green", text:"NBO → GZH · CORRIDOR ACTIVE · ETD 14 JUN" },
  { dot:"white", text:"BL/NBO/2025/00441 · CUSTOMS: CLEARED · KES 2.4M" },
  { dot:"amber", text:"MBA PORT · CONGESTION ALERT · +18 HRS DELAY" },
  { dot:"green", text:"NBO → DXB · PAYMENT CONFIRMED · ESCROW RELEASED" },
  { dot:"green", text:"DUTY CALC · HS 8471.30 · KES 47,200 · CONFIRMED" },
  { dot:"white", text:"NBO → ADD · CORRIDOR OPENING · AFCFTA PHASE 2" },
  { dot:"green", text:"AGENT RATED 4.8 · 94 CLEARANCES THIS MONTH" },
  { dot:"amber", text:"KES/USD FX · 129.40 · RATE LOCKED FOR 48 HRS" },
  { dot:"green", text:"KLA → NBO · EAC DOCS VERIFIED · IN TRANSIT" },
  { dot:"white", text:"TRADE FINANCE · KES 8.2M · FACILITY APPROVED" },
];
const dotColor = { green: C.green, amber: C.amber, white: C.mist };

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background:C.steel, borderTop:`1px solid ${C.rust}`, borderBottom:`1px solid rgba(201,79,30,0.2)`, padding:"10px 0", overflow:"hidden" }}>
      <div className="ticker-inner" style={{ display:"flex", width:"max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", color:C.mist, padding:"0 32px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:5, height:5, borderRadius:1, background: dotColor[item.dot], display:"block", flexShrink:0 }} />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOF STRIP ───────────────────────────────────────────────
function ProofStrip() {
  const logos = ["Siginon Freight","Maritime Centre","Bollore Logistics","Kenya Freight Services","Transami Kenya","Afrifreight Ltd","Inchcape Shipping","Pan-African Clearing"];
  return (
    <div style={{ background:C.steel, borderBottom:`1px solid ${C.concrete}`, padding:"32px 40px" }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:C.mist, textAlign:"center", marginBottom:24 }}>
        Clearing &amp; Forwarding operators on the platform
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
        {logos.map(l => (
          <div key={l} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(138,154,181,0.5)", border:"1px solid rgba(138,154,181,0.15)", padding:"7px 14px", borderRadius:2 }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ── BEFORE / AFTER ────────────────────────────────────────────
const beforeItems = [
  "Cargo tracking via WhatsApp calls to a clearing agent who may not respond until Monday",
  "Duty calculations done manually — you pay what you're told, with no way to verify",
  "Cross-border payments via informal remittance — 3-5 day settlement, opaque FX rates",
  "KRA customs queries take 48-72 hours to resolve, holding your container at the port",
  "Trade finance requires a bank relationship and 2-3 weeks of paperwork per shipment",
  "Documents in different formats, stored on phones and email — impossible to audit",
];
const afterItems = [
  "Live cargo tracking from origin warehouse to your Nairobi door, with automated exception alerts",
  "Instant KRA duty calculator — HS code lookup, confirmed figures before your goods ship",
  "M-PESA escrow: pay in KES, supplier receives USD or RMB, settled same day",
  "4-hour clearance target — BLOC's KenTrade integration flags issues before cargo arrives",
  "Embedded trade credit against your cargo — apply in-platform, funds available before departure",
  "Single document vault — Bill of Lading, permits, receipts — fully auditable, always accessible",
];

function BeforeAfter() {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:C.void, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>The Case for BLOC</SectionLabel>
      <SectionH2>Before. After.</SectionH2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, fontWeight:300, marginBottom:56 }}>The same corridor. A completely different experience.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, borderRadius:4, overflow:"hidden" }}>
        <div style={{ background:C.steel, padding:"40px 36px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#EF4444", marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
            <span>✕</span> Without BLOC
          </div>
          {beforeItems.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <span style={{ color:"#EF4444", flexShrink:0, marginTop:1 }}>✕</span>
              <p style={{ fontSize:13, color:C.mist, lineHeight:1.5 }}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:"#0F1A10", padding:"40px 36px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:C.green, marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
            <span>✓</span> With BLOC
          </div>
          {afterItems.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <span style={{ color:C.green, flexShrink:0, marginTop:1 }}>✓</span>
              <p style={{ fontSize:13, color:"#9CCBA0", lineHeight:1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────
const HOW_STEPS = [
  { num:"01", title:"Source", desc:"Verify suppliers, lock prices, apply for trade credit. BLOC connects you to vetted Guangzhou sourcing agents and Alibaba verified sellers before any money moves.", tag:"Pre-shipment" },
  { num:"02", title:"Pay Securely", desc:"Pay via M-PESA into BLOC escrow. Your KES is converted and held until your Bill of Lading is confirmed — you see the full payment trail: sent, received, held, released. Nothing leaves escrow without a cargo milestone.", tag:"Money-out rail" },
  { num:"03", title:"Clear", desc:"Your clearing agent receives the job on BLOC. KenTrade pre-filing, duty calculation, KRA customs declaration — all managed in-platform. Target: 4 hours to release.", tag:"Mombasa port" },
  { num:"04", title:"Track & Receive", desc:"Goods move from Mombasa gate to your warehouse — tracked live on BLOC. Escrow releases to your supplier and transporter only on confirmed delivery to you.", tag:"Last mile" },
];

function HowItWorks() {
  const [ref, visible] = useInView();
  return (
    <section id="platform" ref={ref} style={{ background:C.steel, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>How It Works</SectionLabel>
      <SectionH2>Source. Pay. Clear.<br />Delivered.</SectionH2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom:56 }}>
        Your money and your goods travel in parallel. BLOC shows you exactly where both are — at every step.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, position:"relative" }}>
        <div style={{ position:"absolute", top:28, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg, transparent, ${C.rust}, transparent)`, opacity:0.3 }} />
        {HOW_STEPS.map((s) => (
          <div key={s.num} style={{ padding:"0 20px", textAlign:"center" }}>
            <div style={{ width:56, height:56, border:`1px solid ${C.rust}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.rust, background:C.steel, position:"relative", zIndex:1 }}>
              {s.num}
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.08em", color:C.cream, marginBottom:8 }}>{s.title}</div>
            <p style={{ fontSize:12, color:C.mist, lineHeight:1.6, marginBottom:10 }}>{s.desc}</p>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:C.rust, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    num:"01", name:"Visibility", tag:"All Corridors",
    desc:"Real-time cargo intelligence from factory gate to Nairobi warehouse. BLOC aggregates data from shipping lines, Kenya Ports Authority, Mombasa Port, and your clearing agent into a single live view. ETA confidence scores are recalculated every 6 hours based on vessel position, port congestion, and historical corridor data.",
    features:["Live vessel tracking via AIS + shipping line API","ETA scoring with congestion-adjusted forecasts","Automated exception alerts: delays, holds, deviations","Container-level status from vessel to last-mile","Port dwell time analytics by corridor","Historical shipment timeline for every job"],
    users:["Importer","Clearing Agent","Financier","Transport Operator"],
  },
  {
    num:"02", name:"Compliance", tag:"KenTrade Integrated",
    desc:"The most time-consuming part of importing is compliance — and the most opaque. BLOC automates HS code classification, calculates exact KRA duty before your goods ship, generates all required documentation, and pre-files with KenTrade so your clearance agent can lodge the moment cargo arrives at Mombasa.",
    features:["HS code lookup and auto-classification from invoice","KRA duty calculator: import duty, VAT, IDF, RDL","Import permit requirements by product and corridor","KenTrade iCMS pre-lodgement integration","Customs declaration document generation","Certificate of Origin verification for AfCFTA preferential rates"],
    users:["Clearing Agent","Importer"],
  },
  {
    num:"03", name:"Payments & FX", tag:"M-PESA + Escrow",
    desc:"Cross-border trade payments are broken for African SMEs. BLOC wraps M-PESA into a multi-corridor settlement layer — a Kamukunji trader pays in KES via M-PESA, their Guangzhou supplier receives RMB, and BLOC holds the difference in escrow until the Bill of Lading is confirmed. FX rates are locked for 48 hours at time of order.",
    features:["KES → USD → RMB, AED, INR corridor settlement","M-PESA Paybill integration for KES payments","Escrow: funds held until cargo milestone confirmed","FX rate lock for 48 hours — no settlement surprises","Supplier payment via SWIFT or local transfer","Transaction records exportable for VAT filing"],
    users:["Importer","Clearing Agent","Transport Operator"],
  },
  {
    num:"04", name:"Trade Finance", tag:"DFI Backed",
    desc:"The biggest constraint for SME importers isn't compliance — it's capital. BLOC embeds container-level trade credit directly into the shipment flow. Apply in-platform, receive a decision in 24 hours, and have funds released to your supplier escrow account before your goods leave the factory.",
    features:["Container-level import finance up to $50,000 per shipment","24-hour credit decision via BLOC risk score","Repayment triggered by customs clearance confirmation","Invoice financing for clearing agents with large job queues","DFI-backed facility — competitive rates for verified operators","Full credit history and risk profile visible to borrower"],
    users:["Importer","Financier"],
  },
  {
    num:"05", name:"Logistics Network", tag:"Verified Operators",
    desc:"BLOC maintains a vetted network of freight forwarders, licensed clearing agents, bonded warehouses, and last-mile truckers — all rated by verified transaction history, not self-reported reviews. Dispatching is built in: clearing agents are assigned automatically based on corridor expertise and current queue load.",
    features:["Verified clearing agent directory with KRA licence status","Auto-dispatch based on corridor, queue, and rating","Bonded warehouse bookings at Mombasa and Nairobi ICD","Last-mile trucking network from port to destination","Performance ratings from verified clearance data","Freight rate comparison across carriers and corridors"],
    users:["Importer","Clearing Agent","Transport Operator"],
  },
  {
    num:"06", name:"Trade Intelligence", tag:"Live Data",
    desc:"Africa's trade operators make decisions with almost no market data. BLOC aggregates transaction-level intelligence across every corridor — duty trends, freight rate movements, port congestion forecasts, commodity price benchmarks, and supplier quality signals.",
    features:["Duty trend analysis: identify rate changes before they hit","Port congestion forecasting: plan shipments around delays","Commodity price benchmarks by corridor and HS code","Freight rate index: air vs sea vs road by corridor","Supplier quality signals from transaction history","DFI and policy partner data exports for programme design"],
    users:["Importer","Financier","Clearing Agent"],
  },
];

function Products() {
  const [openIdx, setOpenIdx] = useState(0);
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:C.void, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"end", marginBottom:64 }}>
        <div>
          <SectionLabel>Platform</SectionLabel>
          <SectionH2>Six Modules.<br />Every Layer<br />of Your Trade.</SectionH2>
        </div>
        <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, fontWeight:300 }}>
          BLOC is not a directory or a logistics booking tool. It's a full-stack operating system for African trade corridors — built from the ground up for the specific friction that kills deals between Nairobi and Guangzhou.
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {PRODUCTS.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={p.num} style={{ background: isOpen ? "#1E243A" : C.steel, borderLeft: `3px solid ${isOpen ? C.rust : "transparent"}`, transition:"all 0.2s" }}>
              <div onClick={() => setOpenIdx(isOpen ? -1 : i)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 28px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:C.rust, letterSpacing:"0.1em", width:28 }}>{p.num} ·</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.06em", color:C.cream }}>{p.name}</span>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, background:C.concrete, padding:"3px 8px", borderRadius:2 }}>{p.tag}</span>
                </div>
                <div style={{ width:20, height:20, border:`1px solid ${isOpen ? C.rust : C.concrete}`, borderRadius:2, background: isOpen ? C.rust : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                  <span style={{ color: isOpen ? "white" : C.mist, fontSize:14, lineHeight:1, transform: isOpen ? "rotate(45deg)" : "none", display:"block", transition:"transform 0.3s" }}>+</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, padding:"0 28px 28px" }}>
                  <div>
                    <p style={{ fontSize:13, color:C.mist, lineHeight:1.7, marginBottom:16 }}>{p.desc}</p>
                    <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                      {p.features.map((f, j) => (
                        <li key={j} style={{ fontSize:12, color:C.mist, display:"flex", gap:8, lineHeight:1.5 }}>
                          <span style={{ width:4, height:4, background:C.rust, borderRadius:1, flexShrink:0, marginTop:6 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, marginBottom:12 }}>Who uses this</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {p.users.map(u => (
                        <span key={u} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", padding:"6px 12px", border:`1px solid ${C.concrete}`, borderRadius:2, color:C.mist, display:"inline-flex", alignItems:"center", gap:6, width:"fit-content" }}>
                          <span style={{ width:5, height:5, background:C.rust, borderRadius:1 }} />{u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────
const PILLARS = [
  { title:"Infrastructure, not a middleman", desc:"BLOC connects existing operators — clearing agents, transporters, financiers — onto a shared platform. We improve what's there, not replace it." },
  { title:"Mobile-first, WhatsApp-native", desc:"No app download required for field users. A Mombasa transporter or Kamukunji importer can interact with BLOC entirely over WhatsApp and Safaricom." },
  { title:"Regulated and auditable", desc:"Built on CBK's payments sandbox. KRA iCMS integration is live. Every transaction on BLOC is auditable — critical for DFI partners and trade finance." },
  { title:"Pan-African by design", desc:"Kenya is corridor one. AfCFTA creates the framework for the next 53 markets. BLOC's architecture scales with the trade agreement, not against it." },
];

function About() {
  const [ref, visible] = useInView();
  return (
    <section id="about" ref={ref} style={{ background:C.light, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>About BLOC</SectionLabel>
      <SectionH2 light>Built in Nairobi.<br />Built for Trade.</SectionH2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, marginTop:56, alignItems:"start" }}>
        <div>
          <div style={{ fontSize:14, color:"#4A5A6E", lineHeight:1.8 }}>
            <p>BLOC was built because African trade is broken in a specific, fixable way. The goods move — containers arrive, duty gets paid, trucks make deliveries — but the infrastructure around them is held together with WhatsApp groups, phone calls, and informal networks that the next generation of traders shouldn't have to depend on.</p>
            <p style={{ marginTop:16 }}>We started with the Kenya-China corridor because it carries the highest volume of SME imports into East Africa, and because the friction is most visible there: a Kamukunji trader placing a $15,000 order in Guangzhou has no visibility, no price certainty, no payment protection, and no credit. BLOC changes that.</p>
            <p style={{ marginTop:16 }}>Our architecture is deliberately infrastructure-level — we don't compete with clearing agents or freight forwarders. We give them better tools and make their clients more confident.</p>
            <p style={{ marginTop:16 }}>BLOC is built on top of M-PESA, KenTrade, and the CBK payments sandbox. We are a Nairobi-headquartered company building for African corridors first, with a roadmap that follows trade flows across the continent under AfCFTA.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginTop:40 }}>
            {[["2024","Founded in Nairobi"],["6","Corridor roadmap"],["4","User types served"],["54","AfCFTA target markets"]].map(([v,l]) => (
              <div key={l} style={{ background:C.white, padding:24, border:`1px solid ${C.rule}` }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:C.rust, lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6A7A90", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{ background:C.white, border:`1px solid ${C.rule}`, padding:"24px 20px", display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:36, height:36, background:C.light, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:C.rust, fontSize:16 }}>◈</span>
              </div>
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.void, marginBottom:4 }}>{p.title}</div>
                <p style={{ fontSize:12, color:"#6A7A90", lineHeight:1.5 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CORRIDORS ─────────────────────────────────────────────────
const CORRIDORS = [
  { flags:"🇰🇪 → 🇨🇳", name:"Kenya — China", status:"live", badge:"Live", nodes:["NBO","MBA","GZH","SHA"], cargo:"Electronics, textiles, machinery, plastics, building materials. KES/RMB escrow. AfCFTA eligible." },
  { flags:"🇰🇪 → 🇦🇪", name:"Kenya — UAE", status:"soon", badge:"Q3 2025", nodes:["NBO","MBA","DXB"], cargo:"Gold, re-exports, electronics, luxury goods. KES/AED + USD settlement. Jebel Ali port integration in build." },
  { flags:"🇰🇪 ↔ 🇺🇬🇷🇼🇹🇿", name:"Intra — East Africa", status:"soon", badge:"Q4 2025", nodes:["NBO","KLA","KGL","DAR"], cargo:"Agricultural produce, manufactured goods, fuel. EAC common external tariff." },
  { flags:"🇰🇪 → 🇮🇳", name:"Kenya — India", status:"planned", badge:"2026", nodes:["NBO","MBA","BOM","DEL"], cargo:"Pharmaceuticals, textiles, automotive parts, chemicals. KES/INR settlement." },
  { flags:"🇰🇪 → 🇬🇧", name:"Kenya — UK", status:"planned", badge:"2026", nodes:["NBO","MBA","LHR","FXT"], cargo:"Cut flowers, fresh produce, coffee, tea. UK-Kenya Economic Partnership Agreement." },
  { flags:"🇰🇪 ↔ 🇳🇬🇬🇭", name:"West Africa", status:"planned", badge:"2026", nodes:["NBO","LOS","ACC","ABJ"], cargo:"Cross-Africa manufactured goods, tech, FMCG. AfCFTA intra-Africa tariff elimination." },
];
const statusColor = { live: C.green, soon: C.amber, planned: C.concrete };

function Corridors() {
  const [ref, visible] = useInView();
  return (
    <section id="corridors" ref={ref} style={{ background:C.void, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>Active Corridors</SectionLabel>
      <SectionH2>Every Corridor.<br />One Platform.</SectionH2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom:56 }}>Six corridors on the roadmap. Each with dedicated compliance rules, FX pairs, and logistics networks built in.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {CORRIDORS.map(c => (
          <div key={c.name} style={{ background:C.steel, padding:"32px 28px", position:"relative", overflow:"hidden", transition:"background 0.2s" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background: statusColor[c.status] }} />
            <div style={{ fontSize:28, lineHeight:1, marginBottom:16 }}>{c.flags}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:"0.06em", color:C.cream, marginBottom:6 }}>{c.name}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
              <span className={c.status === "live" ? "sdot-live-pulse" : ""} style={{ width:5, height:5, borderRadius:"50%", background: statusColor[c.status], display:"block" }} />
              <span style={{ color: statusColor[c.status] }}>{c.badge}</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:16 }}>
              {c.nodes.map(n => (
                <span key={n} style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.08em", color:C.mist, padding:"3px 7px", border:`1px solid ${C.concrete}`, borderRadius:2 }}>{n}</span>
              ))}
            </div>
            <p style={{ fontSize:11, color:C.mist, lineHeight:1.6 }}>{c.cargo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PORTALS ───────────────────────────────────────────────────
const PORTALS = [
  { badge:"Most Active", title:"Importer", desc:"Track cargo, manage duty calculations, handle cross-border payments and monitor your full supply chain.", features:["Live shipment tracking","Duty calculator & HS codes","M-PESA & escrow payments","Trade credit application"], role:"Importer" },
  { title:"Clearing & Forwarding Agent", desc:"Manage your clearance job pipeline, documentation, client communication and compliance filings in one system.", features:["Job queue & auto-dispatch","Document generation","KenTrade iCMS integration","Client billing & receipts"], role:"Agent" },
  { title:"Financier", desc:"Manage trade credit facilities, monitor escrow positions, review borrower profiles and track repayment against cargo clearance.", features:["Trade credit portfolio","Escrow management","Borrower risk profiles","FX exposure monitoring"], role:"Financier" },
  { title:"Transport Company", desc:"Receive job assignments, manage truck fleet, track deliveries from Mombasa port to last-mile destination and get paid on completion.", features:["Job dispatch & routing","Fleet status tracking","Gate pass & manifests","Escrow payment release"], role:"Transport" },
];

function Portals({ onSignIn }) {
  const [ref, visible] = useInView();
  return (
    <section id="portals" ref={ref} style={{ background:C.light, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>Access Portal</SectionLabel>
      <SectionH2 light>Your Corridor.<br />Your Dashboard.</SectionH2>
      <p style={{ fontSize:14, color:"#5A6A7E", lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom:48 }}>Every user type has a dedicated workspace built for their specific role.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
        {PORTALS.map(p => (
          <div key={p.title} onClick={() => onSignIn(p.role)} style={{ background:C.white, border:`1px solid ${C.rule}`, borderRadius:2, padding:28, cursor:"pointer", transition:"border-color 0.2s, box-shadow 0.2s", position:"relative" }}>
            {p.badge && <div style={{ position:"absolute", top:-1, right:16, background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:"0 0 3px 3px" }}>{p.badge}</div>}
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.06em", color:C.void, marginBottom:8, marginTop:12 }}>{p.title}</div>
            <p style={{ fontSize:12, color:"#5A6A7E", lineHeight:1.6, marginBottom:16 }}>{p.desc}</p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:11, color:"#6A7A90", display:"flex", gap:8 }}>
                  <span style={{ color:C.rust }}>→</span>{f}
                </li>
              ))}
            </ul>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:C.rust, display:"flex", alignItems:"center", gap:6 }}>
              Sign In →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────
const TESTIMONIALS = [
  { body:"\"I've been importing electronics from Guangzhou for six years. The duty calculation alone used to take three days — my clearing agent would just give me a number. On BLOC I had the exact figure within two minutes of uploading my proforma. I negotiated a better deal with my supplier because I knew my real landed cost.\"", name:"James Mwangi", role:"Electronics Importer, Nairobi", pill:"Importer", initials:"JM" },
  { body:"\"We process over 60 clearances a month through Mombasa. Before BLOC, we were managing everything on WhatsApp threads and spreadsheets. The job queue alone is worth it — I can see exactly where every container is, which agent it's assigned to, and when KRA has released it.\"", name:"Amina Odhiambo", role:"Clearing Agent, Mombasa", pill:"Clearing Agent", initials:"AO" },
  { body:"\"As a trade finance provider, our biggest problem is verifying that the underlying goods actually exist. BLOC gives us live cargo data tied directly to the loan facility. Our default rate on BLOC-originated facilities is 40% lower than our off-platform book.\"", name:"Ruth Kamau", role:"Trade Finance, Kenya Commercial Bank", pill:"Financier", initials:"RK" },
];

function Testimonials() {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:C.steel, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>Operator Stories</SectionLabel>
      <SectionH2>What They Said<br />After Their First Shipment.</SectionH2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginTop:56 }}>
        {TESTIMONIALS.map(t => (
          <div key={t.name} style={{ background:C.concrete, padding:"32px 28px", borderTop:`3px solid ${C.rust}` }}>
            <p style={{ fontSize:13, color:C.mist, lineHeight:1.7, marginBottom:24, fontStyle:"italic" }}>{t.body}</p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, background:C.steel, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Space Mono',monospace", fontSize:11, color:C.rust, flexShrink:0 }}>{t.initials}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:C.cream }}>{t.name}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:C.mist, marginTop:2 }}>{t.role}</div>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", padding:"2px 7px", border:`1px solid ${C.rust}`, borderRadius:2, color:C.rust, display:"inline-block", marginTop:6 }}>{t.pill}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRICING ───────────────────────────────────────────────────
const PLANS = [
  { tier:"Starter", amount:"Free", period:"First shipment · No credit card", desc:"For importers moving their first container on BLOC. Full platform access, one active shipment.", features:["1 active shipment","HS code lookup & duty calculator","Live tracking dashboard","Clearing agent matching","Document vault (5 docs)","WhatsApp updates"], featured: false },
  { tier:"Operator", amount:"KES 4,500", period:"per month · billed monthly", desc:"For active importers and clearing agents moving multiple containers per month.", features:["Unlimited active shipments","Full compliance suite + pre-lodgement","M-PESA escrow & FX settlement","Trade credit eligibility","Priority clearing agent dispatch","Unlimited document vault","Trade intelligence reports"], featured: true },
  { tier:"Enterprise", amount:"Custom", period:"Volume pricing · SLA included", desc:"For DFIs, freight forwarders, shipping lines, and institutional trade partners.", features:["Full API access","Dedicated corridor onboarding","White-label portal options","Data export for programme design","Bulk trade finance facilities","Dedicated account manager"], featured: false },
];

function Pricing({ onSignIn }) {
  const [ref, visible] = useInView();
  return (
    <section id="pricing" ref={ref} style={{ background:C.void, padding:"96px 40px", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>Pricing</SectionLabel>
      <SectionH2>Start Free.<br />Pay as You Move.</SectionH2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom:56 }}>Every operator type has a plan. No surprise fees — every cost is visible before you commit.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
        {PLANS.map(p => (
          <div key={p.tier} style={{ background: p.featured ? C.rust : C.steel, padding:"36px 28px", position:"relative" }}>
            {p.featured && <div style={{ position:"absolute", top:0, left:0, right:0, textAlign:"center", fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(0,0,0,0.2)", padding:"5px 0", color:C.cream }}>Most Popular</div>}
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color: p.featured ? "rgba(245,240,232,0.7)" : C.mist, marginBottom:12, marginTop: p.featured ? 20 : 0 }}>{p.tier}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, color: p.featured ? C.cream : C.cream, lineHeight:1 }}>{p.amount}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: p.featured ? "rgba(245,240,232,0.6)" : C.mist, marginTop:4, marginBottom:16 }}>{p.period}</div>
            <p style={{ fontSize:13, color: p.featured ? "rgba(245,240,232,0.8)" : C.mist, lineHeight:1.6, marginBottom:24 }}>{p.desc}</p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:12, color: p.featured ? "rgba(245,240,232,0.85)" : C.mist, display:"flex", gap:8 }}>
                  <span style={{ color: p.featured ? C.cream : C.rust }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => onSignIn()} style={{ width:"100%", padding:"13px 0", fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", background: p.featured ? C.cream : "transparent", color: p.featured ? C.rust : C.mist, border: p.featured ? "none" : `1px solid ${C.concrete}`, borderRadius:2, cursor:"pointer" }}>
              {p.tier === "Starter" ? "Get Started Free" : p.tier === "Enterprise" ? "Talk to Us" : "Start Operator Plan"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function LoginCTA({ onSignIn }) {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:C.steel, padding:"96px 40px", textAlign:"center", opacity: visible ? 1 : 0, transition:"opacity 0.7s" }}>
      <SectionLabel>Get Started</SectionLabel>
      <SectionH2>Ready to move?</SectionH2>
      <p style={{ fontSize:14, color:C.mist, lineHeight:1.7, maxWidth:380, margin:"16px auto 36px", fontWeight:300 }}>
        Select your role and access your dedicated BLOC dashboard. New operator? Request access and we'll be in touch within 24 hours.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <BtnPrimary onClick={onSignIn}>Sign In to BLOC</BtnPrimary>
        <BtnGhost href="https://wa.me/254700000000">Chat on WhatsApp</BtnGhost>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title:"Platform", links:[["Visibility","#platform"],["Compliance","#platform"],["Payments & FX","#platform"],["Trade Finance","#platform"],["Logistics Network","#platform"],["Trade Intelligence","#platform"]] },
    { title:"Corridors", links:[["Kenya — China","#corridors"],["Kenya — UAE","#corridors"],["Intra-East Africa","#corridors"],["Kenya — India","#corridors"],["Kenya — UK","#corridors"],["West Africa","#corridors"]] },
    { title:"Company", links:[["About","#about"],["Pricing","#pricing"],["Docs & API","#"],["Press","#"],["Privacy Policy","#"],["Terms of Service","#"]] },
  ];
  return (
    <footer style={{ background:C.void, borderTop:`1px solid ${C.concrete}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, padding:"60px 40px 40px" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <BlocMark size={22} />
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.15em", color:C.cream }}>BLOC</span>
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, marginBottom:20 }}>Pan-African Trade Infrastructure</div>
          <div style={{ fontSize:12, color:C.mist, lineHeight:1.8 }}>
            BLOC Platform Ltd<br />Delta Corner, Westlands<br />Nairobi, Kenya 00100<br />
            <a href="mailto:hello@bloc.trade" style={{ color:C.rust, textDecoration:"none" }}>hello@bloc.trade</a>
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.mist, marginBottom:20 }}>{col.title}</div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {col.links.map(([label, href]) => (
                <li key={label}><a href={href} style={{ fontSize:12, color:"rgba(138,154,181,0.7)", textDecoration:"none" }}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:`1px solid ${C.concrete}`, padding:"20px 40px", display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:"rgba(138,154,181,0.4)" }}>© 2025 BLOC Platform Ltd. All rights reserved.</span>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:"rgba(138,154,181,0.4)" }}>Trade moves on BLOC.</span>
      </div>
    </footer>
  );
}

// ── MODAL ─────────────────────────────────────────────────────
function SignInModal({ open, onClose, defaultRole }) {
  const [role, setRole] = useState(defaultRole || null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  useEffect(() => { if (defaultRole) setRole(defaultRole); }, [defaultRole]);
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!open) return null;
  const roles = ["Importer","Clearing Agent","Financier","Transport"];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(10,10,10,0.85)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.steel, width:"100%", maxWidth:440, borderRadius:4, overflow:"hidden", position:"relative" }}>
        <div style={{ background:C.void, padding:"32px 36px 24px", borderBottom:`1px solid ${C.concrete}` }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:C.mist, cursor:"pointer", fontSize:18 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <BlocMark size={20} />
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", color:C.cream }}>BLOC</span>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:"0.06em", color:C.cream }}>Sign In</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:C.mist, marginTop:4 }}>{role ? `${role} Portal` : "Select your role to continue"}</div>
        </div>
        <div style={{ padding:"28px 36px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, marginBottom:10 }}>I am a —</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
            {roles.map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", padding:"7px 14px", borderRadius:2, border:`1px solid ${role === r ? C.rust : C.concrete}`, background: role === r ? C.rust : "transparent", color: role === r ? C.cream : C.mist, cursor:"pointer", transition:"all 0.15s" }}>{r}</button>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, display:"block", marginBottom:6 }}>Email / Phone</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com or +254..." style={{ width:"100%", padding:"11px 14px", background:C.concrete, border:`1px solid ${C.concrete}`, borderRadius:2, color:C.cream, fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.mist, display:"block", marginBottom:6 }}>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••••" style={{ width:"100%", padding:"11px 14px", background:C.concrete, border:`1px solid ${C.concrete}`, borderRadius:2, color:C.cream, fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }} />
          </div>
          <button style={{ width:"100%", padding:"14px 0", background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", border:"none", borderRadius:2, cursor:"pointer" }}>
            ACCESS {role ? role.toUpperCase() : ""} DASHBOARD →
          </button>
          <div style={{ textAlign:"center", marginTop:16, fontFamily:"'Space Mono',monospace", fontSize:9, color:C.mist }}>
            <a href="#" style={{ color:C.mist }}>Forgot password?</a> · New operator? <a href="#" style={{ color:C.rust }}>Request access</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WHATSAPP FLOAT ────────────────────────────────────────────
function WAFloat() {
  return (
    <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" style={{ position:"fixed", bottom:28, right:28, zIndex:150, width:52, height:52, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(37,211,102,0.4)", textDecoration:"none" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.531 5.85L0 24l6.341-1.507A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
    </a>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState(null);

  const openSignIn = (role) => { setModalRole(role || null); setModalOpen(true); };

  return (
    <>
      <GlobalStyles />
      <Nav onSignIn={() => openSignIn()} />
      <main style={{ paddingTop:60 }}>
        <Hero onSignIn={() => openSignIn()} />
        <Ticker />
        <ProofStrip />
        <BeforeAfter />
        <HowItWorks />
        <Products />
        <About />
        <Corridors />
        <Portals onSignIn={openSignIn} />
        <Testimonials />
        <Pricing onSignIn={() => openSignIn()} />
        <LoginCTA onSignIn={() => openSignIn()} />
      </main>
      <Footer />
      <WAFloat />
      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} defaultRole={modalRole} />
    </>
  );
}