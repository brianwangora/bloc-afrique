import { useState, useEffect, useRef, createContext, useContext } from "react";

// ── THEME CONTEXT ─────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ── BREAKPOINT HOOK ───────────────────────────────────────────
// Returns { isMobile, isTablet, isDesktop }
// mobile  < 640px
// tablet  640–1023px
// desktop ≥ 1024px
function useBreakpoint() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1200));
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

// ── BRAND TOKENS ──────────────────────────────────────────────
const DARK = {
  pageBg:"#0A0A0A", navBg:"rgba(10,10,10,0.95)", navBorder:"rgba(201,79,30,0.2)",
  sectionAlt:"#1A1F2E", sectionDeep:"#0A0A0A", card:"#1A1F2E", cardAlt:"#2C3347", cardBorder:"#2C3347",
  headingColor:"#F5F0E8", bodyColor:"#8A9AB5", mutedColor:"rgba(138,154,181,0.5)",
  inputBg:"#2C3347", inputBorder:"#2C3347",
  tickerBg:"#1A1F2E", proofBg:"#1A1F2E", proofBorder:"#2C3347",
  beforeBg:"#1A1F2E", afterBg:"#0F1A10", afterText:"#9CCBA0",
  corridorBg:"#1A1F2E", testimonialBg:"#2C3347",
  aboutBg:"#F8F6F2", aboutHeading:"#0A0A0A", aboutBody:"#4A5A6E", aboutCard:"#ffffff", aboutBorder:"#E0DAD0",
  portalBg:"#F8F6F2", portalCard:"#ffffff", portalBorder:"#E0DAD0", portalHead:"#0A0A0A", portalBody:"#5A6A7E", portalMuted:"#6A7A90",
  footerBg:"#0A0A0A", footerBorder:"#2C3347", footerText:"rgba(138,154,181,0.7)", footerMuted:"rgba(138,154,181,0.4)",
  gridLine:"rgba(201,79,30,0.04)", pricePlanBg:"#1A1F2E",
};
const LIGHT = {
  pageBg:"#F8F6F2", navBg:"rgba(248,246,242,0.97)", navBorder:"rgba(201,79,30,0.15)",
  sectionAlt:"#EDEAE3", sectionDeep:"#F8F6F2", card:"#ffffff", cardAlt:"#F0EDE6", cardBorder:"#E0DAD0",
  headingColor:"#0A0A0A", bodyColor:"#4A5A6E", mutedColor:"rgba(74,90,110,0.5)",
  inputBg:"#F0EDE6", inputBorder:"#D0CAC0",
  tickerBg:"#EDEAE3", proofBg:"#EDEAE3", proofBorder:"#D8D4CC",
  beforeBg:"#F0EDE6", afterBg:"#EAF4EB", afterText:"#2E6B35",
  corridorBg:"#ffffff", testimonialBg:"#F0EDE6",
  aboutBg:"#F0EDE6", aboutHeading:"#0A0A0A", aboutBody:"#4A5A6E", aboutCard:"#ffffff", aboutBorder:"#E0DAD0",
  portalBg:"#ffffff", portalCard:"#F8F6F2", portalBorder:"#E0DAD0", portalHead:"#0A0A0A", portalBody:"#4A5A6E", portalMuted:"#6A7A90",
  footerBg:"#EDEAE3", footerBorder:"#D8D4CC", footerText:"#6A7A90", footerMuted:"#9AA5B4",
  gridLine:"rgba(201,79,30,0.06)", pricePlanBg:"#F0EDE6",
};
const C = {
  rust:"#C94F1E", amber:"#E8A020", mist:"#8A9AB5",
  cream:"#F5F0E8", green:"#22C55E",
  void:"#0A0A0A", steel:"#1A1F2E", concrete:"#2C3347",
};

// ── GLOBAL STYLES ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; transition: background 0.3s, color 0.3s; }
  @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes scan    { 0%,100%{opacity:.15;transform:scaleX(.3)} 50%{opacity:.6;transform:scaleX(1)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .fade-in         { animation: fadeUp 0.7s ease forwards; }
  .scan-line       { animation: scan 4s ease-in-out infinite; }
  .ticker-inner    { animation: ticker 36s linear infinite; }
  .sdot-live-pulse { animation: pulse 2s ease-in-out infinite; }
  .mobile-menu-open { animation: slideDown 0.2s ease forwards; }
  /* Ensure tap targets are at least 44px */
  button, a { -webkit-tap-highlight-color: transparent; }
  /* Smooth modal on mobile */
  @media (max-width: 639px) {
    input, select, textarea { font-size: 16px !important; } /* prevent iOS zoom */
  }
`;

function GlobalStyles({ T }) {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    // Ensure viewport meta exists
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
      document.head.appendChild(meta);
    }
    return () => document.head.removeChild(el);
  }, []);
  useEffect(() => {
    document.body.style.background = T.pageBg;
    document.body.style.color = T.headingColor;
  }, [T]);
  return null;
}

// ── THEME TOGGLE ──────────────────────────────────────────────
function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ display:"flex", alignItems:"center", gap:7, background: dark ? C.concrete : "#D8D4CC", border:"none", borderRadius:20, padding:"5px 10px 5px 6px", cursor:"pointer", transition:"background 0.3s", flexShrink:0, minHeight:36 }}>
      <span style={{ width:32, height:18, borderRadius:9, background: dark ? C.steel : "#BDB8AE", position:"relative", display:"block", transition:"background 0.3s", flexShrink:0 }}>
        <span style={{ position:"absolute", top:3, left: dark ? 3 : 15, width:12, height:12, borderRadius:"50%", background: dark ? C.mist : C.rust, transition:"left 0.25s, background 0.25s" }} />
      </span>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color: dark ? C.mist : "#6A7A90" }}>
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

// ── REUSABLE ATOMS ────────────────────────────────────────────
function BlocMark({ size = 20 }) {
  const s = size / 2 - 1;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, width:size, height:size, flexShrink:0 }}>
      <div style={{ background:C.rust,     borderRadius:1, width:s, height:s }} />
      <div style={{ background:C.concrete, borderRadius:1, width:s, height:s }} />
      <div style={{ background:"#1E2436",  borderRadius:1, width:s, height:s }} />
      <div style={{ background:"#3A4560",  borderRadius:1, width:s, height:s }} />
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

function SectionH2({ children, color }) {
  const { dark } = useTheme();
  return (
    <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(32px,5vw,56px)", letterSpacing:"0.04em", lineHeight:1.05, color: color || (dark ? C.cream : C.void), marginBottom:16 }}>
      {children}
    </h2>
  );
}

function BtnPrimary({ children, onClick, href, fullWidth }) {
  const s = { background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", padding:"14px 26px", border:"none", borderRadius:2, cursor:"pointer", textDecoration:"none", display:"inline-block", transition:"background 0.2s", width: fullWidth ? "100%" : undefined, textAlign:"center" };
  if (href) {
    const isExternal = href.startsWith("http");
    return <a href={href} style={s} {...(isExternal ? { target:"_blank", rel:"noreferrer" } : {})}>{children}</a>;
  }
  return <button style={s} onClick={onClick}>{children}</button>;
}

function BtnGhost({ children, onClick, href, fullWidth }) {
  const { dark } = useTheme();
  const s = { background:"transparent", color: dark ? C.mist : "#6A7A90", fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", padding:"13px 26px", border:`1px solid ${dark ? C.concrete : "#C8C4BC"}`, borderRadius:2, cursor:"pointer", textDecoration:"none", display:"inline-block", transition:"border-color 0.2s", width: fullWidth ? "100%" : undefined, textAlign:"center" };
  if (href) {
    const isExternal = href.startsWith("http");
    return <a href={href} style={s} {...(isExternal ? { target:"_blank", rel:"noreferrer" } : {})}>{children}</a>;
  }
  return <button style={s} onClick={onClick}>{children}</button>;
}

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Responsive padding helper
const px = (bp) => bp.isMobile ? "64px 20px" : bp.isTablet ? "80px 28px" : "96px 40px";

// ── NAV ──────────────────────────────────────────────────────
function Nav({ onSignIn }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["How it Works", "#how-works"],["Platform","#platform"],["Corridors","#corridors"],["About","#about"],["Pricing","#pricing"]];

  // Close menu on link click
  const handleLink = () => setMenuOpen(false);

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:T.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${T.navBorder}`, padding: bp.isMobile ? "0 16px" : "0 40px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background 0.3s" }}>
        <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <BlocMark size={22} />
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.15em", color: dark ? C.cream : C.void }}>BLOC</span>
        </a>

        {/* Desktop nav */}
        {!bp.isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap: bp.isTablet ? 16 : 24 }}>
            {!bp.isTablet && (
              <ul style={{ display:"flex", alignItems:"center", gap:28, listStyle:"none" }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", color: dark ? C.mist : "#6A7A90", textDecoration:"none", textTransform:"uppercase" }}>{label}</a>
                  </li>
                ))}
              </ul>
            )}
            <ThemeToggle />
            <button onClick={onSignIn} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", background:C.rust, color:C.cream, padding:"8px 16px", borderRadius:2, border:"none", cursor:"pointer", minHeight:36 }}>Sign In</button>
            {/* Tablet hamburger for nav links only */}
            {bp.isTablet && (
              <button onClick={() => setMenuOpen(o => !o)} aria-label="Open menu" style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex", flexDirection:"column", gap:4, minHeight:44, alignItems:"center", justifyContent:"center" }}>
                <span style={{ width:20, height:1.5, background: dark ? C.mist : "#6A7A90", display:"block", transition:"all 0.2s", transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                <span style={{ width:20, height:1.5, background: dark ? C.mist : "#6A7A90", display:"block", opacity: menuOpen ? 0 : 1, transition:"opacity 0.2s" }} />
                <span style={{ width:20, height:1.5, background: dark ? C.mist : "#6A7A90", display:"block", transition:"all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
              </button>
            )}
          </div>
        )}

        {/* Mobile: toggle + hamburger */}
        {bp.isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <ThemeToggle />
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Open menu" style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex", flexDirection:"column", gap:5, minHeight:44, alignItems:"center", justifyContent:"center" }}>
              <span style={{ width:22, height:1.5, background: dark ? C.cream : C.void, display:"block", transition:"all 0.2s", transform: menuOpen ? "rotate(45deg) translate(4px,5px)" : "none" }} />
              <span style={{ width:22, height:1.5, background: dark ? C.cream : C.void, display:"block", opacity: menuOpen ? 0 : 1, transition:"opacity 0.2s" }} />
              <span style={{ width:22, height:1.5, background: dark ? C.cream : C.void, display:"block", transition:"all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4px,-5px)" : "none" }} />
            </button>
          </div>
        )}
      </nav>

      {/* Dropdown menu — mobile & tablet */}
      {menuOpen && (
        <div className="mobile-menu-open" style={{ position:"fixed", top:60, left:0, right:0, zIndex:99, background:T.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${T.navBorder}`, padding:"16px 20px 24px" }}>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:0 }}>
            {links.map(([label, href]) => (
              <li key={label}>
                <a href={href} onClick={handleLink} style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color: dark ? C.mist : "#6A7A90", textDecoration:"none", display:"block", padding:"14px 0", borderBottom:`1px solid ${T.navBorder}` }}>{label}</a>
              </li>
            ))}
          </ul>
          <button onClick={() => { onSignIn(); setMenuOpen(false); }} style={{ width:"100%", marginTop:16, fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", background:C.rust, color:C.cream, padding:"14px 0", borderRadius:2, border:"none", cursor:"pointer" }}>
            Sign In →
          </button>
        </div>
      )}
    </>
  );
}

// ── HERO ─────────────────────────────────────────────────────
function Hero({ onSignIn }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  return (
    <section style={{ display:"flex", flexDirection:"column", justifyContent:"flex-start", padding: bp.isMobile ? "80px 20px 64px" : bp.isTablet ? "100px 28px 80px" : "120px 40px 96px", position:"relative", overflow:"hidden", background: dark ? C.void : "#F0EDE6", transition:"background 0.3s" }}>
      <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage:`linear-gradient(${T.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)`, backgroundSize:"40px 40px" }} />
      <div className="scan-line" style={{ position:"absolute", left:0, right:0, top:"48%", height:1, background:`linear-gradient(90deg, transparent, ${C.rust}, transparent)`, zIndex:1 }} />

      <div className="fade-in" style={{ position:"relative", zIndex:2, maxWidth:860 }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize: bp.isMobile ? 9 : 11, letterSpacing:"0.15em", color:C.rust, textTransform:"uppercase", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:24, height:1, background:C.rust, display:"block" }} />
          Pan-African Trade Infrastructure
        </div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? "clamp(52px,15vw,80px)" : "clamp(64px,9vw,108px)", lineHeight:0.92, letterSpacing:"0.02em", color: dark ? C.cream : C.void, marginBottom:8, transition:"color 0.3s" }}>
          Trade Moves<br /><span style={{ color:C.rust }}>On BLOC.</span>
        </h1>
        <p style={{ fontSize: bp.isMobile ? 14 : 15, color: dark ? C.mist : "#5A6A7E", lineHeight:1.6, maxWidth:520, marginBottom: bp.isMobile ? 32 : 48, marginTop: bp.isMobile ? 16 : 20, fontWeight:300 }}>
          End-to-end corridor infrastructure for African cross-border trade — compliance, payments, logistics, and intelligence on one platform.
        </p>
        <div style={{ display:"flex", flexDirection: bp.isMobile ? "column" : "row", alignItems: bp.isMobile ? "stretch" : "center", gap:12, flexWrap:"wrap" }}>
          <BtnPrimary onClick={onSignIn} fullWidth={bp.isMobile}>Access Platform →</BtnPrimary>
          <BtnGhost href="#how-works" fullWidth={bp.isMobile}>See How It Works</BtnGhost>
        </div>
        <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:8, fontFamily:"'Space Mono',monospace", fontSize: bp.isMobile ? 9 : 10, color: dark ? C.mist : "#6A7A90", letterSpacing:"0.08em" }}>
          <div style={{ width:18, height:18, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.531 5.85L0 24l6.341-1.507A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </div>
          Also available on WhatsApp — no app download required
        </div>

        {/* Stats — inline on mobile instead of floating absolute */}
        {bp.isMobile && (
          <div style={{ display:"flex", gap:24, marginTop:32, paddingTop:24, borderTop:`1px solid rgba(201,79,30,0.2)` }}>
            {[["6","Corridors"],["4hr","Clearance"],["54","AfCFTA"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:C.rust, lineHeight:1 }}>{val}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color: dark ? C.mist : "#6A7A90", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop floating stats */}
      {!bp.isMobile && (
        <div style={{ position:"absolute", right: bp.isTablet ? 28 : 40, bottom: bp.isTablet ? 56 : 60, zIndex:2, display:"flex", flexDirection:"column", gap:20, textAlign:"right" }}>
          {[["6","Corridors planned"],["4hr","Clearance target"],["54","AfCFTA markets"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:C.rust, lineHeight:1 }}>{val}</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: dark ? C.mist : "#6A7A90", letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      )}
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

function Ticker() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const dotColor = { green:C.green, amber:C.amber, white: dark ? C.mist : "#9AA5B4" };
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background:T.tickerBg, borderTop:`1px solid ${C.rust}`, borderBottom:"1px solid rgba(201,79,30,0.2)", padding:"10px 0", overflow:"hidden", transition:"background 0.3s" }}>
      <div className="ticker-inner" style={{ display:"flex", width:"max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.1em", color: dark ? C.mist : "#6A7A90", padding:"0 28px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:5, height:5, borderRadius:1, background:dotColor[item.dot], display:"block", flexShrink:0 }} />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOF STRIP ───────────────────────────────────────────────
function ProofStrip() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const logos = ["Siginon Freight","Maritime Centre","Bollore Logistics","Kenya Freight Services","Transami Kenya","Afrifreight Ltd","Inchcape Shipping","Pan-African Clearing"];
  return (
    <div style={{ background:T.proofBg, borderBottom:`1px solid ${T.proofBorder}`, padding:"28px 20px", transition:"background 0.3s" }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color: dark ? C.mist : "#6A7A90", textAlign:"center", marginBottom:20 }}>
        Clearing &amp; Forwarding operators on the platform
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
        {logos.map(l => (
          <div key={l} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color: dark ? "rgba(138,154,181,0.5)" : "rgba(74,90,110,0.6)", border:`1px solid ${dark ? "rgba(138,154,181,0.15)" : "rgba(74,90,110,0.2)"}`, padding:"6px 12px", borderRadius:2, whiteSpace:"nowrap" }}>{l}</div>
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
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:T.sectionDeep, padding:px(bp), opacity: visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>The Case for BLOC</SectionLabel>
      <SectionH2>Before. After.</SectionH2>
      <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, fontWeight:300, marginBottom:bp.isMobile?32:56 }}>The same corridor. A completely different experience.</p>
      <div style={{ display:"grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", gap:2, borderRadius:4, overflow:"hidden" }}>
        <div style={{ background:T.beforeBg, padding: bp.isMobile ? "28px 20px" : "40px 36px", transition:"background 0.3s" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#EF4444", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            <span>✕</span> Without BLOC
          </div>
          {beforeItems.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <span style={{ color:"#EF4444", flexShrink:0, marginTop:1 }}>✕</span>
              <p style={{ fontSize:13, color:T.bodyColor, lineHeight:1.5 }}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:T.afterBg, padding: bp.isMobile ? "28px 20px" : "40px 36px", transition:"background 0.3s" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:C.green, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            <span>✓</span> With BLOC
          </div>
          {afterItems.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <span style={{ color:C.green, flexShrink:0, marginTop:1 }}>✓</span>
              <p style={{ fontSize:13, color:T.afterText, lineHeight:1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────
const HOW_STEPS = [
  { num:"01", title:"Source",          desc:"Verify suppliers, lock prices, apply for trade credit. BLOC connects you to vetted Guangzhou sourcing agents and Alibaba verified sellers before any money moves.", tag:"Pre-shipment" },
  { num:"02", title:"Pay Securely",    desc:"Pay via M-PESA into BLOC escrow. Your KES is converted and held until your Bill of Lading is confirmed — you see the full payment trail. Nothing leaves escrow without a cargo milestone.", tag:"Money-out rail" },
  { num:"03", title:"Insure",          desc:"Before your cargo leaves port, You can purchase marine insurance in-platform covering loss, damage, and delay across the full corridor. Underwritten by licensed Kenyan insurers already on Bloc.", tag:"Marine cover" },
  { num:"04", title:"Clear",           desc:"Your clearing agent receives the job on BLOC. KenTrade pre-filing, duty calculation, KRA customs declaration — all managed in-platform. Target: 4 hours to release.", tag:"Mombasa port" },
  { num:"05", title:"Track & Receive", desc:"Goods move from Mombasa gate to your warehouse — tracked live on BLOC. Escrow releases to your supplier and transporter only on confirmed delivery to you.", tag:"Last mile" },
];

function HowItWorks() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  const cols = bp.isMobile ? "1fr 1fr" : "repeat(5,1fr)";
  return (
    <section id="how-works" ref={ref} style={{ background:T.sectionAlt, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>How It Works</SectionLabel>
      <SectionH2>Source. Pay. Insure. Clear.<br />Deliver.</SectionH2>
      <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom: bp.isMobile ? 36 : 56, margin: `0 auto ${bp.isMobile ? "36px" : "56px"}`, textAlign:"center" }}>
        Your money and your goods travel in parallel. BLOC shows you exactly where both are — at every step.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:cols, gap: bp.isMobile ? "32px 16px" : 0, position:"relative" }}>
        {!bp.isMobile && <div style={{ position:"absolute", top:28, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg, transparent, ${C.rust}, transparent)`, opacity:0.3 }} />}
        {HOW_STEPS.map((s) => (
          <div key={s.num} style={{ padding: bp.isMobile ? "0 8px" : "0 20px", textAlign:"center" }}>
            <div style={{ width:56, height:56, border:`1px solid ${C.rust}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.rust, background:T.sectionAlt, position:"relative", zIndex:1, transition:"background 0.3s" }}>
              {s.num}
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:"0.08em", color: dark ? C.cream : C.void, marginBottom:8 }}>{s.title}</div>
            <p style={{ fontSize:12, color:T.bodyColor, lineHeight:1.6, marginBottom:8 }}>{s.desc}</p>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:C.rust, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
const PRODUCTS = [
  { num:"01", name:"Visibility",        tag:"All Corridors",       desc:"Real-time cargo intelligence from factory gate to Nairobi warehouse. BLOC aggregates data from shipping lines, Kenya Ports Authority, Mombasa Port, and your clearing agent into a single live view. ETA confidence scores are recalculated every 6 hours based on vessel position, port congestion, and historical corridor data.", features:["Live vessel tracking via AIS + shipping line API","ETA scoring with congestion-adjusted forecasts","Automated exception alerts: delays, holds, deviations","Container-level status from vessel to last-mile","Port dwell time analytics by corridor","Historical shipment timeline for every job"], users:["Importer","Clearing Agent","Financier","Transport Operator"] },
  { num:"02", name:"Compliance",        tag:"KenTrade Integrated", desc:"The most time-consuming part of importing is compliance — and the most opaque. BLOC automates HS code classification, calculates exact KRA duty before your goods ship, generates all required documentation, and pre-files with KenTrade so your clearance agent can lodge the moment cargo arrives at Mombasa.", features:["HS code lookup and auto-classification from invoice","KRA duty calculator: import duty, VAT, IDF, RDL","Import permit requirements by product and corridor","KenTrade iCMS pre-lodgement integration","Customs declaration document generation","Certificate of Origin verification for AfCFTA preferential rates"], users:["Clearing Agent","Importer"] },
  { num:"03", name:"Payments & FX",     tag:"M-PESA + Escrow",    desc:"Cross-border trade payments are broken for African SMEs. BLOC wraps M-PESA into a multi-corridor settlement layer — a Kamukunji trader pays in KES via M-PESA, their Guangzhou supplier receives RMB, and BLOC holds the difference in escrow until the Bill of Lading is confirmed. FX rates are locked for 48 hours at time of order.", features:["KES → USD → RMB, AED, INR corridor settlement","M-PESA Paybill integration for KES payments","Escrow: funds held until cargo milestone confirmed","FX rate lock for 48 hours — no settlement surprises","Supplier payment via SWIFT or local transfer","Transaction records exportable for VAT filing"], users:["Importer","Clearing Agent","Transport Operator"] },
  { num:"04", name:"Trade Finance",     tag:"DFI Backed",          desc:"The biggest constraint for SME importers isn't compliance — it's capital. BLOC embeds container-level trade credit directly into the shipment flow. Apply in-platform, receive a decision in 24 hours, and have funds released to your supplier escrow account before your goods leave the factory.", features:["Container-level import finance up to $50,000 per shipment","24-hour credit decision via BLOC risk score","Repayment triggered by customs clearance confirmation","Invoice financing for clearing agents with large job queues","DFI-backed facility — competitive rates for verified operators","Full credit history and risk profile visible to borrower"], users:["Importer","Financier"] },
  { num:"05", name:"Logistics Network", tag:"Verified Operators",  desc:"BLOC maintains a vetted network of freight forwarders, licensed clearing agents, bonded warehouses, and last-mile truckers — all rated by verified transaction history, not self-reported reviews. Dispatching is built in: clearing agents are assigned automatically based on corridor expertise and current queue load.", features:["Verified clearing agent directory with KRA licence status","Auto-dispatch based on corridor, queue, and rating","Bonded warehouse bookings at Mombasa and Nairobi ICD","Last-mile trucking network from port to destination","Performance ratings from verified clearance data","Freight rate comparison across carriers and corridors"], users:["Importer","Clearing Agent","Transport Operator"] },
  { num:"06", name:"Trade Intelligence",tag:"Live Data",            desc:"Africa's trade operators make decisions with almost no market data. BLOC aggregates transaction-level intelligence across every corridor — duty trends, freight rate movements, port congestion forecasts, commodity price benchmarks, and supplier quality signals.", features:["Duty trend analysis: identify rate changes before they hit","Port congestion forecasting: plan shipments around delays","Commodity price benchmarks by corridor and HS code","Freight rate index: air vs sea vs road by corridor","Supplier quality signals from transaction history","DFI and policy partner data exports for programme design"], users:["Importer","Financier","Clearing Agent"] },
];

function Products() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [openIdx, setOpenIdx] = useState(0);
  const [ref, visible] = useInView();
  return (
    <section id="platform" ref={ref} style={{ background:T.sectionDeep, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <div style={{ display:"grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", gap: bp.isMobile ? 16 : 60, alignItems:"end", marginBottom: bp.isMobile ? 32 : 64 }}>
        <div>
          <SectionLabel>Platform</SectionLabel>
          <SectionH2>Six Modules.<br />Every Layer<br />of Your Trade.</SectionH2>
        </div>
        <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, fontWeight:300 }}>
          BLOC is not a directory or a logistics booking tool. It's a full-stack operating system for African trade corridors — built from the ground up for the specific friction that kills deals between Nairobi and Guangzhou.
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {PRODUCTS.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={p.num} style={{ background: isOpen ? (dark ? "#1E243A" : "#EAE7E0") : T.card, borderLeft:`3px solid ${isOpen ? C.rust : "transparent"}`, transition:"all 0.2s" }}>
              <div onClick={() => setOpenIdx(isOpen ? -1 : i)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: bp.isMobile ? "18px 16px" : "24px 28px", cursor:"pointer", minHeight:56 }}>
                <div style={{ display:"flex", alignItems:"center", gap: bp.isMobile ? 10 : 16, flexWrap: bp.isMobile ? "wrap" : "nowrap", flex:1, marginRight:12 }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:C.rust, letterSpacing:"0.1em", width:28, flexShrink:0 }}>{p.num} ·</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? 20 : 22, letterSpacing:"0.06em", color: dark ? C.cream : C.void }}>{p.name}</span>
                  {!bp.isMobile && <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:T.bodyColor, background:T.cardAlt, padding:"3px 8px", borderRadius:2 }}>{p.tag}</span>}
                </div>
                <div style={{ width:20, height:20, border:`1px solid ${isOpen ? C.rust : T.cardBorder}`, borderRadius:2, background: isOpen ? C.rust : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}>
                  <span style={{ color: isOpen ? "white" : T.bodyColor, fontSize:14, lineHeight:1, transform: isOpen ? "rotate(45deg)" : "none", display:"block", transition:"transform 0.3s" }}>+</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ display:"grid", gridTemplateColumns: bp.isMobile ? "1fr" : "1fr 1fr", gap: bp.isMobile ? 20 : 28, padding: bp.isMobile ? "0 16px 20px" : "0 28px 28px" }}>
                  <div>
                    <p style={{ fontSize:13, color:T.bodyColor, lineHeight:1.7, marginBottom:16 }}>{p.desc}</p>
                    <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                      {p.features.map((f, j) => (
                        <li key={j} style={{ fontSize:12, color:T.bodyColor, display:"flex", gap:8, lineHeight:1.5 }}>
                          <span style={{ width:4, height:4, background:C.rust, borderRadius:1, flexShrink:0, marginTop:6 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.bodyColor, marginBottom:12 }}>Who uses this</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {p.users.map(u => (
                        <span key={u} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", padding:"6px 12px", border:`1px solid ${T.cardBorder}`, borderRadius:2, color:T.bodyColor, display:"inline-flex", alignItems:"center", gap:6 }}>
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
  { title:"Mobile-first, WhatsApp-native",   desc:"No app download required for field users. A Mombasa transporter or Kamukunji importer can interact with BLOC entirely over WhatsApp and Safaricom." },
  { title:"Regulated and auditable",         desc:"Built on CBK's payments sandbox. KRA iCMS integration is live. Every transaction on BLOC is auditable — critical for DFI partners and trade finance." },
  { title:"Pan-African by design",           desc:"Kenya is corridor one. AfCFTA creates the framework for the next 53 markets. BLOC's architecture scales with the trade agreement, not against it." },
];

function About() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  return (
    <section id="about" ref={ref} style={{ background:T.aboutBg, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>About BLOC</SectionLabel>
      <SectionH2 color={T.aboutHeading}>Built in Nairobi.<br />Built for Trade.</SectionH2>
      <div style={{ display:"grid", gridTemplateColumns: bp.isMobile ? "1fr" : bp.isTablet ? "1fr" : "1fr 1fr", gap: bp.isMobile ? 32 : 80, marginTop:40, alignItems:"start" }}>
        <div>
          <div style={{ fontSize:14, color:T.aboutBody, lineHeight:1.8 }}>
            <p>BLOC was built because African trade is broken in a specific, fixable way. The goods move — containers arrive, duty gets paid, trucks make deliveries — but the infrastructure around them is held together with WhatsApp groups, phone calls, and informal networks that the next generation of traders shouldn't have to depend on.</p>
            <p style={{ marginTop:16 }}>We started with the Kenya-China corridor because it carries the highest volume of SME imports into East Africa, and because the friction is most visible there: a Kamukunji trader placing a $15,000 order in Guangzhou has no visibility, no price certainty, no payment protection, and no credit. BLOC changes that.</p>
            <p style={{ marginTop:16 }}>Our architecture is deliberately infrastructure-level — we don't compete with clearing agents or freight forwarders. We give them better tools and make their clients more confident.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginTop:32 }}>
            {[["2024","Founded in Nairobi"],["6","Corridor roadmap"],["4","User types served"],["54","AfCFTA target markets"]].map(([v,l]) => (
              <div key={l} style={{ background:T.aboutCard, padding: bp.isMobile ? "16px" : "24px", border:`1px solid ${T.aboutBorder}` }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? 28 : 36, color:C.rust, lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.aboutBody, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{ background:T.aboutCard, border:`1px solid ${T.aboutBorder}`, padding:"20px", display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ width:36, height:36, background:T.aboutBg, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:C.rust, fontSize:16 }}>◈</span>
              </div>
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.aboutHeading, marginBottom:4 }}>{p.title}</div>
                <p style={{ fontSize:12, color:T.aboutBody, lineHeight:1.5 }}>{p.desc}</p>
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
  { flags:"🇰🇪 → 🇨🇳", name:"Kenya — China",       status:"live",    badge:"Live",    nodes:["NBO","MBA","GZH","SHA"], cargo:"Electronics, textiles, machinery, plastics, building materials. KES/RMB escrow. AfCFTA eligible." },
  { flags:"🇰🇪 → 🇦🇪", name:"Kenya — UAE",         status:"soon",    badge:"Q3 2025", nodes:["NBO","MBA","DXB"],       cargo:"Gold, re-exports, electronics, luxury goods. KES/AED + USD settlement. Jebel Ali port integration in build." },
  { flags:"🇰🇪 ↔ 🇺🇬🇷🇼🇹🇿", name:"Intra — East Africa", status:"soon",    badge:"Q4 2025", nodes:["NBO","KLA","KGL","DAR"], cargo:"Agricultural produce, manufactured goods, fuel. EAC common external tariff." },
  { flags:"🇰🇪 → 🇮🇳", name:"Kenya — India",       status:"planned", badge:"2026",    nodes:["NBO","MBA","BOM","DEL"], cargo:"Pharmaceuticals, textiles, automotive parts, chemicals. KES/INR settlement." },
  { flags:"🇰🇪 → 🇬🇧", name:"Kenya — UK",          status:"planned", badge:"2026",    nodes:["NBO","MBA","LHR","FXT"], cargo:"Cut flowers, fresh produce, coffee, tea. UK-Kenya Economic Partnership Agreement." },
  { flags:"🇰🇪 ↔ 🇳🇬🇬🇭", name:"West Africa",         status:"planned", badge:"2026",    nodes:["NBO","LOS","ACC","ABJ"], cargo:"Cross-Africa manufactured goods, tech, FMCG. AfCFTA intra-Africa tariff elimination." },
];
const statusColor = { live:C.green, soon:C.amber, planned:C.concrete };

function Corridors() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  const cols = bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "repeat(3,1fr)";
  return (
    <section id="corridors" ref={ref} style={{ background:T.sectionAlt, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>Active Corridors</SectionLabel>
      <SectionH2>Every Corridor.<br />One Platform.</SectionH2>
      <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom: bp.isMobile ? 32 : 56 }}>Six corridors on the roadmap. Each with dedicated compliance rules, FX pairs, and logistics networks built in.</p>
      <div style={{ display:"grid", gridTemplateColumns:cols, gap:2 }}>
        {CORRIDORS.map(c => (
          <div key={c.name} style={{ background:T.corridorBg, padding: bp.isMobile ? "20px 16px" : "32px 28px", position:"relative", overflow:"hidden", border: dark ? "none" : `1px solid ${T.cardBorder}`, transition:"background 0.3s" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:statusColor[c.status] }} />
            <div style={{ fontSize: bp.isMobile ? 22 : 28, lineHeight:1, marginBottom:12 }}>{c.flags}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? 18 : 24, letterSpacing:"0.06em", color: dark ? C.cream : C.void, marginBottom:6 }}>{c.name}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
              <span className={c.status==="live"?"sdot-live-pulse":""} style={{ width:5, height:5, borderRadius:"50%", background:statusColor[c.status], display:"block" }} />
              <span style={{ color:statusColor[c.status] }}>{c.badge}</span>
            </div>
            {!bp.isMobile && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
                {c.nodes.map(n => (
                  <span key={n} style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.08em", color:T.bodyColor, padding:"3px 7px", border:`1px solid ${T.cardBorder}`, borderRadius:2 }}>{n}</span>
                ))}
              </div>
            )}
            <p style={{ fontSize: bp.isMobile ? 11 : 11, color:T.bodyColor, lineHeight:1.5 }}>{c.cargo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PORTALS ───────────────────────────────────────────────────
const PORTALS = [
  { badge:"Most Active", title:"Importer",                   desc:"Track cargo, manage duty calculations, handle cross-border payments and monitor your full supply chain.", features:["Live shipment tracking","Duty calculator & HS codes","M-PESA & escrow payments","Trade credit application"], role:"Importer" },
  { title:"Clearing & Forwarding Agent", desc:"Manage your clearance job pipeline, documentation, client communication and compliance filings in one system.", features:["Job queue & auto-dispatch","Document generation","KenTrade iCMS integration","Client billing & receipts"], role:"Agent" },
  { title:"Financier",                   desc:"Manage trade credit facilities, monitor escrow positions, review borrower profiles and track repayment against cargo clearance.", features:["Trade credit portfolio","Escrow management","Borrower risk profiles","FX exposure monitoring"], role:"Financier" },
  { title:"Transport Company",           desc:"Receive job assignments, manage truck fleet, track deliveries from Mombasa port to last-mile destination and get paid on completion.", features:["Job dispatch & routing","Fleet status tracking","Gate pass & manifests","Escrow payment release"], role:"Transport" },
];

function Portals({ onSignIn }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  const cols = bp.isMobile ? "1fr 1fr" : "repeat(auto-fit,minmax(220px,1fr))";
  return (
    <section id="portals" ref={ref} style={{ background:T.portalBg, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>Access Portal</SectionLabel>
      <SectionH2 color={T.portalHead}>Your Corridor.<br />Your Dashboard.</SectionH2>
      <p style={{ fontSize:14, color:T.portalBody, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom: bp.isMobile ? 28 : 48 }}>Every user type has a dedicated workspace built for their specific role.</p>
      <div style={{ display:"grid", gridTemplateColumns:cols, gap:10 }}>
        {PORTALS.map(p => (
          <div key={p.title} onClick={() => onSignIn(p.role)} style={{ background:T.portalCard, border:`1px solid ${T.portalBorder}`, borderRadius:2, padding: bp.isMobile ? "20px 16px" : "28px", cursor:"pointer", position:"relative", transition:"background 0.3s" }}>
            {p.badge && <div style={{ position:"absolute", top:-1, right:12, background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:"0 0 3px 3px" }}>{p.badge}</div>}
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? 17 : 20, letterSpacing:"0.06em", color:T.portalHead, marginBottom:8, marginTop: p.badge ? 12 : 0, lineHeight:1.2 }}>{p.title}</div>
            {!bp.isMobile && <p style={{ fontSize:12, color:T.portalBody, lineHeight:1.6, marginBottom:16 }}>{p.desc}</p>}
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap: bp.isMobile ? 5 : 6, marginBottom: bp.isMobile ? 12 : 20 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize: bp.isMobile ? 10 : 11, color:T.portalMuted, display:"flex", gap:6 }}>
                  <span style={{ color:C.rust }}>→</span>{f}
                </li>
              ))}
            </ul>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:C.rust }}>Sign In →</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────
const TESTIMONIALS = [
  { body:"\"I've been importing electronics from Guangzhou for six years. The duty calculation alone used to take three days. On BLOC I had the exact figure within two minutes of uploading my proforma. I negotiated a better deal because I knew my real landed cost.\"", name:"James Mwangi", role:"Electronics Importer, Nairobi", pill:"Importer", initials:"JM" },
  { body:"\"We process over 60 clearances a month through Mombasa. Before BLOC, we were managing everything on WhatsApp threads. The job queue alone is worth it — I can see exactly where every container is, and when KRA has released it.\"", name:"Amina Odhiambo", role:"Clearing Agent, Mombasa", pill:"Clearing Agent", initials:"AO" },
  { body:"\"BLOC gives us live cargo data tied directly to the loan facility. When the Bill of Lading is confirmed, we know it's real. Our default rate on BLOC-originated facilities is 40% lower than our off-platform book.\"", name:"Ruth Kamau", role:"Trade Finance, Kenya Commercial Bank", pill:"Financier", initials:"RK" },
];

function Testimonials() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  const cols = bp.isMobile ? "1fr" : "repeat(3,1fr)";
  return (
    <section ref={ref} style={{ background:T.sectionDeep, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>Operator Stories</SectionLabel>
      <SectionH2>What They Said<br />After Their First Shipment.</SectionH2>
      <div style={{ display:"grid", gridTemplateColumns:cols, gap: bp.isMobile ? 12 : 2, marginTop: bp.isMobile ? 32 : 56 }}>
        {TESTIMONIALS.map(t => (
          <div key={t.name} style={{ background:T.testimonialBg, padding: bp.isMobile ? "24px 20px" : "32px 28px", borderTop:`3px solid ${C.rust}`, transition:"background 0.3s" }}>
            <p style={{ fontSize:13, color:T.bodyColor, lineHeight:1.7, marginBottom:20, fontStyle:"italic" }}>{t.body}</p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, background:T.sectionAlt, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Space Mono',monospace", fontSize:11, color:C.rust, flexShrink:0 }}>{t.initials}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color: dark ? C.cream : C.void }}>{t.name}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.bodyColor, marginTop:2 }}>{t.role}</div>
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
  { tier:"Starter",  amount:"Free",      period:"First shipment · No credit card", desc:"For importers moving their first container on BLOC. Full platform access, one active shipment.", features:["1 active shipment","HS code lookup & duty calculator","Live tracking dashboard","Clearing agent matching","Document vault (5 docs)","WhatsApp updates"], featured:false },
  { tier:"Operator", amount:"KES 4,500", period:"per month · billed monthly",      desc:"For active importers and clearing agents moving multiple containers per month.", features:["Unlimited active shipments","Full compliance suite + pre-lodgement","M-PESA escrow & FX settlement","Trade credit eligibility","Priority clearing agent dispatch","Unlimited document vault","Trade intelligence reports"], featured:true },
  { tier:"Enterprise",amount:"Custom",   period:"Volume pricing · SLA included",   desc:"For DFIs, freight forwarders, shipping lines, and institutional trade partners.", features:["Full API access","Dedicated corridor onboarding","White-label portal options","Data export for programme design","Bulk trade finance facilities","Dedicated account manager"], featured:false },
];

function Pricing({ onSignIn }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  const cols = bp.isMobile ? "1fr" : "repeat(3,1fr)";
  return (
    <section id="pricing" ref={ref} style={{ background:T.sectionAlt, padding:px(bp), opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>Pricing</SectionLabel>
      <SectionH2>Start Free.<br />Pay as You Move.</SectionH2>
      <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, maxWidth:480, fontWeight:300, marginBottom: bp.isMobile ? 32 : 56 }}>Every operator type has a plan. No surprise fees — every cost is visible before you commit.</p>
      <div style={{ display:"grid", gridTemplateColumns:cols, gap:2 }}>
        {PLANS.map(p => (
          <div key={p.tier} style={{ background: p.featured ? C.rust : T.pricePlanBg, padding: bp.isMobile ? "28px 20px" : "36px 28px", position:"relative", transition:"background 0.3s" }}>
            {p.featured && <div style={{ position:"absolute", top:0, left:0, right:0, textAlign:"center", fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", background:"rgba(0,0,0,0.2)", padding:"5px 0", color:C.cream }}>Most Popular</div>}
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color: p.featured ? "rgba(245,240,232,0.7)" : T.bodyColor, marginBottom:12, marginTop: p.featured ? 20 : 0 }}>{p.tier}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: bp.isMobile ? 32 : 40, color:C.cream, lineHeight:1 }}>{p.amount}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: p.featured ? "rgba(245,240,232,0.6)" : T.bodyColor, marginTop:4, marginBottom:14 }}>{p.period}</div>
            <p style={{ fontSize:13, color: p.featured ? "rgba(245,240,232,0.8)" : T.bodyColor, lineHeight:1.6, marginBottom:20 }}>{p.desc}</p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:12, color: p.featured ? "rgba(245,240,232,0.85)" : T.bodyColor, display:"flex", gap:8 }}>
                  <span style={{ color: p.featured ? C.cream : C.rust }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => onSignIn()} style={{ width:"100%", padding:"14px 0", fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", background: p.featured ? C.cream : "transparent", color: p.featured ? C.rust : (dark ? C.mist : "#6A7A90"), border: p.featured ? "none" : `1px solid ${T.cardBorder}`, borderRadius:2, cursor:"pointer", minHeight:48 }}>
              {p.tier==="Starter" ? "Get Started Free" : p.tier==="Enterprise" ? "Talk to Us" : "Start Operator Plan"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function LoginCTA({ onSignIn }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{ background:T.sectionDeep, padding:px(bp), textAlign:"center", opacity:visible?1:0, transition:"opacity 0.7s, background 0.3s" }}>
      <SectionLabel>Get Started</SectionLabel>
      <SectionH2>Ready to move?</SectionH2>
      <p style={{ fontSize:14, color:T.bodyColor, lineHeight:1.7, maxWidth:360, margin:"16px auto 32px", fontWeight:300 }}>
        Select your role and access your BLOC dashboard. New operator? Request access and we'll be in touch within 24 hours.
      </p>
      <div style={{ display:"flex", flexDirection: bp.isMobile ? "column" : "row", gap:12, justifyContent:"center", alignItems: bp.isMobile ? "stretch" : "center" }}>
        <BtnPrimary onClick={onSignIn} fullWidth={bp.isMobile}>Sign In to BLOC</BtnPrimary>
        <BtnGhost href="https://wa.me/254700000000" fullWidth={bp.isMobile}>Chat on WhatsApp</BtnGhost>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const cols = [
    { title:"Platform",  links:[["Visibility","#platform"],["Compliance","#platform"],["Payments & FX","#platform"],["Trade Finance","#platform"],["Logistics Network","#platform"],["Trade Intelligence","#platform"]] },
    { title:"Corridors", links:[["Kenya — China","#corridors"],["Kenya — UAE","#corridors"],["Intra-East Africa","#corridors"],["Kenya — India","#corridors"],["Kenya — UK","#corridors"],["West Africa","#corridors"]] },
    { title:"Company",   links:[["About","#about"],["Pricing","#pricing"],["Docs & API","#"],["Press","#"],["Privacy Policy","#"],["Terms of Service","#"]] },
  ];
  return (
    <footer style={{ background:T.footerBg, borderTop:`1px solid ${T.footerBorder}`, transition:"background 0.3s" }}>
      <div style={{ display:"grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : bp.isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr", gap: bp.isMobile ? "32px 20px" : 40, padding: bp.isMobile ? "40px 20px 32px" : bp.isTablet ? "48px 28px 40px" : "60px 40px 40px" }}>
        <div style={{ gridColumn: bp.isMobile ? "1 / -1" : undefined }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <BlocMark size={22} />
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.15em", color: dark ? C.cream : C.void }}>BLOC</span>
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.footerText, marginBottom:16 }}>Pan-African Trade Infrastructure</div>
          <div style={{ fontSize:12, color:T.footerText, lineHeight:1.8 }}>
            BLOC Platform Ltd<br />Delta Corner, Westlands<br />Nairobi, Kenya 00100<br />
            <a href="mailto:hello@bloc.trade" style={{ color:C.rust, textDecoration:"none" }}>hello@bloc.trade</a>
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:T.footerText, marginBottom:16 }}>{col.title}</div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {col.links.map(([label, href]) => (
                <li key={label}><a href={href} style={{ fontSize:12, color:T.footerText, textDecoration:"none" }}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:`1px solid ${T.footerBorder}`, padding: bp.isMobile ? "16px 20px" : "20px 40px", display:"flex", flexDirection: bp.isMobile ? "column" : "row", justifyContent:"space-between", gap:8 }}>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.footerMuted }}>© 2025 BLOC Platform Ltd. All rights reserved.</span>
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.footerMuted }}>Trade moves on BLOC.</span>
      </div>
    </footer>
  );
}

// ── MODAL ─────────────────────────────────────────────────────
function SignInModal({ open, onClose, defaultRole }) {
  const { dark } = useTheme();
  const T = dark ? DARK : LIGHT;
  const bp = useBreakpoint();
  const [role, setRole] = useState(defaultRole || null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  useEffect(() => { if (defaultRole) setRole(defaultRole); }, [defaultRole]);
  useEffect(() => {
    const handler = (e) => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!open) return null;
  const roles = ["Importer","Clearing Agent","Financier","Transport"];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(10,10,10,0.85)", backdropFilter:"blur(8px)", display:"flex", alignItems: bp.isMobile ? "flex-end" : "center", justifyContent:"center", padding: bp.isMobile ? 0 : 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.card, width:"100%", maxWidth: bp.isMobile ? "100%" : 440, borderRadius: bp.isMobile ? "12px 12px 0 0" : 4, overflow:"hidden", position:"relative", transition:"background 0.3s", maxHeight: bp.isMobile ? "92svh" : undefined, overflowY:"auto" }}>
        <div style={{ background: dark ? C.void : T.cardAlt, padding: bp.isMobile ? "24px 20px 20px" : "32px 36px 24px", borderBottom:`1px solid ${T.cardBorder}` }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:T.bodyColor, cursor:"pointer", fontSize:20, padding:4, minWidth:44, minHeight:44, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <BlocMark size={20} />
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em", color: dark ? C.cream : C.void }}>BLOC</span>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:"0.06em", color: dark ? C.cream : C.void }}>Sign In</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:T.bodyColor, marginTop:4 }}>{role ? `${role} Portal` : "Select your role to continue"}</div>
        </div>
        <div style={{ padding: bp.isMobile ? "20px 20px 32px" : "28px 36px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.bodyColor, marginBottom:10 }}>I am a —</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
            {roles.map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", padding:"10px 14px", borderRadius:2, border:`1px solid ${role===r ? C.rust : T.cardBorder}`, background: role===r ? C.rust : "transparent", color: role===r ? C.cream : T.bodyColor, cursor:"pointer", transition:"all 0.15s", minHeight:44 }}>{r}</button>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.bodyColor, display:"block", marginBottom:6 }}>Email / Phone</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com or +254..." style={{ width:"100%", padding:"13px 14px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:2, color: dark ? C.cream : C.void, fontFamily:"'DM Sans',sans-serif", fontSize:16, outline:"none" }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.bodyColor, display:"block", marginBottom:6 }}>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••••" style={{ width:"100%", padding:"13px 14px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:2, color: dark ? C.cream : C.void, fontFamily:"'DM Sans',sans-serif", fontSize:16, outline:"none" }} />
          </div>
          <button style={{ width:"100%", padding:"16px 0", background:C.rust, color:C.cream, fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", border:"none", borderRadius:2, cursor:"pointer", minHeight:52 }}>
            ACCESS {role ? role.toUpperCase() : ""} DASHBOARD →
          </button>
          <div style={{ textAlign:"center", marginTop:16, fontFamily:"'Space Mono',monospace", fontSize:9, color:T.bodyColor }}>
            <a href="#" style={{ color:T.bodyColor }}>Forgot password?</a> · New operator? <a href="#" style={{ color:C.rust }}>Request access</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WHATSAPP FLOAT ────────────────────────────────────────────
function WAFloat() {
  const bp = useBreakpoint();
  // Sit above the bottom safe area on mobile
  return (
    <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer"
      style={{ position:"fixed", bottom: bp.isMobile ? 20 : 28, right: bp.isMobile ? 16 : 28, zIndex:150, width:52, height:52, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(37,211,102,0.4)", textDecoration:"none" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.531 5.85L0 24l6.341-1.507A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
    </a>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("bloc-theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggle = () => setDark(prev => {
    const next = !prev;
    localStorage.setItem("bloc-theme", next ? "dark" : "light");
    return next;
  });

  const T = dark ? DARK : LIGHT;
  const openSignIn = (role) => { setModalRole(role || null); setModalOpen(true); };

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <GlobalStyles T={T} />
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
    </ThemeCtx.Provider>
  );
}