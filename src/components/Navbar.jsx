import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

const links = [
  { to: "/", label: "Home", sub: "Start here" },
  { to: "/about", label: "About", sub: "Our story" },
  { to: "/services", label: "Services", sub: "What we do" },
  { to: "/ai-enablement", label: "AI Enablement", sub: "The future" },
  { to: "/careers", label: "Careers", sub: "Join us" },
  { to: "/contact", label: "Contact", sub: "Let's talk" },
];

const themes = [
  {
    id: "coral", label: "Coral Accent", color: "#ff6b6b", rootColors: {
      "--accent": "#ff6b6b", "--accent-2": "#ffa07a", "--accent-d": "#e05353",
      "--accent-glow": "rgba(255, 107, 107, 0.18)",
      "--grad-brand-soft": "linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(255, 107, 107, 0.10))"
    }
  },
  {
    id: "gold", label: "Gold Accent", color: "#d4af37", rootColors: {
      "--accent": "#d4af37", "--accent-2": "#f39c12", "--accent-d": "#b5901a",
      "--accent-glow": "rgba(212, 175, 55, 0.18)",
      "--grad-brand-soft": "linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(212, 175, 55, 0.10))"
    }
  },
  {
    id: "sage", label: "Sage Accent", color: "#8eb897", rootColors: {
      "--accent": "#8eb897", "--accent-2": "#a3cfa8", "--accent-d": "#6e9c78",
      "--accent-glow": "rgba(142, 184, 151, 0.18)",
      "--grad-brand-soft": "linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(142, 184, 151, 0.10))"
    }
  },
  {
    id: "orange", label: "Orange Accent", color: "#f97316", rootColors: {
      "--accent": "#f97316", "--accent-2": "#ff9f43", "--accent-d": "#ea580c",
      "--accent-glow": "rgba(249, 115, 22, 0.18)",
      "--grad-brand-soft": "linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(249, 115, 22, 0.10))"
    }
  }
];

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 200;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .nav--scrolled {
    background: rgba(7,16,14,0.88);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.05);
  }
  .nav__inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
    padding: 0 clamp(16px, 5vw, 60px);
    max-width: 1400px; margin: 0 auto;
  }

  .brand {
    display: flex; align-items: center; flex-shrink: 0;
    text-decoration: none; transition: opacity 0.2s ease;
  }
  .brand:hover { opacity: 0.8; }
  .brand__logo { height: 34px; width: auto; display: block; }

  .nav__links {
    display: flex; align-items: center; gap: 4px;
    flex: 1; justify-content: center;
  }
  .navlink {
    position: relative; padding: 6px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,0.72);
    text-decoration: none; border-radius: 6px; white-space: nowrap;
    transition: color 0.2s, background 0.2s;
  }
  .navlink:hover { color: #fff; background: rgba(255,255,255,0.07); }
  .navlink::after {
    content: ''; position: absolute; bottom: 2px; left: 50%;
    width: 0; height: 2px; background: #2dd4bf; border-radius: 2px;
    transform: translateX(-50%);
    transition: width 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .navlink:hover::after, .navlink--active::after { width: 55%; }
  .navlink--active { color: #fff; }

  .btn--cta {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 9px 20px; border-radius: 6px;
    background: #085041; color: #9FE1CB;
    border: 1.5px solid #085041; box-shadow: 4px 4px 0 #1D9E75;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    text-decoration: none; white-space: nowrap; cursor: pointer;
    transition: box-shadow 0.18s ease, transform 0.18s ease;
  }
  .btn--cta:hover  { box-shadow: 2px 2px 0 #1D9E75; transform: translate(2px,2px); }
  .btn--cta:active { box-shadow: none; transform: translate(4px,4px); }

  /* Desktop layout */
  .nav__actions-desktop {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .nav__actions-mobile {
    display: none; align-items: center; gap: 10px; flex-shrink: 0;
  }

  /* Hamburger — hidden on desktop */
  .nav__toggle {
    display: none;
    flex-direction: column; align-items: center; justify-content: center;
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 10px; cursor: pointer; gap: 5px;
    flex-shrink: 0; z-index: 300;
    transition: background 0.2s, border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .nav__toggle::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at center, rgba(20,184,166,0.2), transparent 70%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  .nav__toggle:hover::before { opacity: 1; }
  .nav__toggle:hover { border-color: rgba(20,184,166,0.35); }
  .ham-line {
    width: 20px; height: 1.5px; background: rgba(255,255,255,0.85);
    border-radius: 2px;
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease, width 0.3s ease;
    transform-origin: center; position: relative; z-index: 1;
  }
  .nav__toggle.is-open .ham-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 22px; }
  .nav__toggle.is-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav__toggle.is-open .ham-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 22px; }

  /* ─── MOBILE BREAKPOINT ─── */
  @media (max-width: 1024px) {
    .nav__toggle          { display: flex !important; }
    .nav__links           { display: none !important; }
    .nav__actions-desktop { display: none !important; }
    .nav__actions-mobile  { display: flex !important; }
    .nav__mobile-right    { display: flex !important; }
    .nav__inner           { height: 60px; padding: 0 20px; }
    .brand__logo          { height: 28px; }
  }
  @media (min-width: 1025px) {
    .nav__mobile-right    { display: none !important; }
  }

  /* ── THEME SWITCHER (desktop dot pills) ── */
  .theme-switcher {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 99px; padding: 4px 8px; margin-right: 12px;
  }
  .theme-switcher__btn {
    width: 13px; height: 13px; border-radius: 50%;
    border: 2px solid transparent; cursor: pointer; padding: 0;
    transition: transform 0.2s, border-color 0.2s;
  }
  .theme-switcher__btn:hover { transform: scale(1.2); }
  .theme-switcher__btn.active { border-color: #fff; transform: scale(1.15); }

  /* ── ACCENT SELECT (mobile + inside menu) ── */
  .accent-select {
    appearance: none;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(20,184,166,0.25);
    border-radius: 8px; padding: 6px 28px 6px 12px;
    color: #2dd4bf;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%232dd4bf' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color 0.2s, background 0.2s;
  }
  .accent-select:hover, .accent-select:focus {
    border-color: rgba(20,184,166,0.55); background-color: rgba(20,184,166,0.08); outline: none;
  }
  .accent-select option { background: #07100e; color: #fff; font-size: 14px; padding: 8px; }

  /* ══════════════════════════════════════════
     FULL-SCREEN MOBILE MENU
  ══════════════════════════════════════════ */
  .mob-menu {
    position: fixed; inset: 0; z-index: 250;
    display: flex; flex-direction: column; overflow: hidden;
    clip-path: circle(0% at calc(100% - 38px) 29px);
    transition: clip-path 0.65s cubic-bezier(0.76,0,0.24,1);
    pointer-events: none; visibility: hidden;
  }
  .mob-menu.is-open {
    clip-path: circle(150% at calc(100% - 38px) 29px);
    pointer-events: auto; visibility: visible;
  }
  .mob-bg { position: absolute; inset: 0; background: #040d0b; z-index: 0; }
  .mob-blob {
    position: absolute; border-radius: 50%; filter: blur(80px);
    opacity: 0; transition: opacity 0.8s ease;
  }
  .mob-menu.is-open .mob-blob { opacity: 1; }
  .mob-blob-1 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    top: -80px; right: -100px;
    animation: blobFloat1 8s ease-in-out infinite alternate;
  }
  .mob-blob-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%);
    bottom: 80px; left: -60px;
    animation: blobFloat2 10s ease-in-out infinite alternate;
  }
  .mob-blob-3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
    top: 50%; left: 40%;
    animation: blobFloat3 7s ease-in-out infinite alternate;
  }
  @keyframes blobFloat1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-30px,40px) scale(1.15)} }
  @keyframes blobFloat2 { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,-30px) scale(1.1)} }
  @keyframes blobFloat3 { from{transform:translate(0,0) scale(1)} to{transform:translate(-20px,20px) scale(1.2)} }

  .mob-noise {
    position: absolute; inset: 0; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
    pointer-events: none; opacity: 0.6;
  }
  .mob-grid-lines { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
  .mob-grid-lines::before {
    content: ''; position: absolute; top: 0; left: -200px; right: 0; bottom: 0;
    background: repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px);
  }
  .mob-inner { position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; }

  .mob-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .mob-topbar-logo {
    height: 26px; width: auto; opacity: 0.6;
    transform: translateX(-16px);
    transition: opacity 0.5s ease 0.3s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s;
  }
  .mob-menu.is-open .mob-topbar-logo { opacity: 0.6; transform: translateX(0); }

  .mob-close {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);
    border-radius: 10px; cursor: pointer; color: rgba(255,255,255,0.7);
    flex-shrink: 0; transform: translateX(16px); opacity: 0;
    transition: background 0.2s, border-color 0.2s, color 0.2s,
                transform 0.45s cubic-bezier(0.22,1,0.36,1) 0.25s,
                opacity 0.4s ease 0.25s;
  }
  .mob-menu.is-open .mob-close { transform: translateX(0); opacity: 1; }
  .mob-close:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #f87171; }
  .mob-close:active { transform: scale(0.92); }

  .mob-nav {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 0 24px; gap: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;
  }
  .mob-link-wrap {
    position: relative; display: flex; align-items: center; gap: 12px;
    padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
    overflow: hidden; cursor: pointer;
    transform: translateX(-60px); opacity: 0;
    transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease;
    text-decoration: none;
  }
  .mob-menu.is-open .mob-link-wrap { transform: translateX(0); opacity: 1; }
  .mob-link-wrap:last-child { border-bottom: none; }
  .mob-link-wrap::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    width: 0; height: 1px;
    background: linear-gradient(90deg, #14b8a6, #22c55e);
    transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
  }
  .mob-link-wrap:hover::after { width: 100%; }
  .mob-link-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(20,184,166,0.05) 0%, transparent 60%);
    opacity: 0; transform: translateX(-100%);
    transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
  }
  .mob-link-wrap:hover::before { opacity: 1; transform: translateX(0); }

  .mob-link-index {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    color: rgba(20,184,166,0.5); letter-spacing: 0.05em; min-width: 24px;
    transition: color 0.25s ease; position: relative; z-index: 1; user-select: none;
  }
  .mob-link-wrap:hover .mob-link-index { color: #2dd4bf; }

  .mob-link-label {
    font-family: 'Syne', sans-serif; font-size: clamp(22px, 6vw, 40px); font-weight: 800;
    color: rgba(255,255,255,0.88); letter-spacing: -0.02em; line-height: 1.1;
    position: relative; z-index: 1; flex: 1;
    transition: color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .mob-link-wrap:hover .mob-link-label { color: #fff; transform: translateX(6px); }
  .mob-link-wrap--active .mob-link-label { color: #2dd4bf; }

  .mob-link-sub {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 400;
    color: rgba(255,255,255,0.22); letter-spacing: 0.06em; text-transform: uppercase;
    align-self: center; position: relative; z-index: 1;
    transition: color 0.25s ease; white-space: nowrap;
  }
  .mob-link-wrap:hover .mob-link-sub { color: rgba(45,212,191,0.6); }
  @media (max-width: 360px) { .mob-link-sub { display: none; } }

  .mob-link-arrow {
    position: relative; z-index: 1; color: rgba(255,255,255,0.15);
    align-self: center; flex-shrink: 0;
    transition: color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .mob-link-wrap:hover .mob-link-arrow { color: #2dd4bf; transform: translateX(8px) rotate(-35deg); }

  .mob-footer {
    flex-shrink: 0; padding: 16px 24px 28px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    transform: translateY(24px); opacity: 0;
    transition: opacity 0.5s ease 0.5s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.5s;
  }
  .mob-menu.is-open .mob-footer { opacity: 1; transform: translateY(0); }
  .mob-footer-contact { display: flex; flex-direction: column; gap: 3px; }
  .mob-footer-label {
    font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.22);
  }
  .mob-footer-val {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
    color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s ease;
  }
  a.mob-footer-val:hover { color: #2dd4bf; }

  .mob-rule {
    position: absolute; left: 16px; top: 20%; bottom: 20%;
    width: 1px; background: linear-gradient(to bottom, transparent, rgba(20,184,166,0.25), transparent);
    z-index: 5; pointer-events: none;
    transform: scaleY(0); transform-origin: top;
    transition: transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s;
  }
  .mob-menu.is-open .mob-rule { transform: scaleY(1); }

  .mob-watermark {
    position: absolute; right: -20px; bottom: 60px;
    font-family: 'Syne', sans-serif; font-size: clamp(120px, 32vw, 200px); font-weight: 800;
    color: rgba(20,184,166,0.04); line-height: 1;
    pointer-events: none; z-index: 2; user-select: none; letter-spacing: -0.05em;
  }

  @media (max-width: 380px) {
    .mob-nav { padding: 0 16px; }
    .mob-topbar { padding: 12px 16px; }
    .mob-footer { padding: 14px 16px 24px; flex-direction: column; align-items: flex-start; }
    .mob-link-label { font-size: 20px; }
  }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [watermark, setWatermark] = useState("IN");
  const hamburgerRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("iniondata-theme") || "coral";
  });

  useEffect(() => {
    const theme = themes.find((t) => t.id === activeTheme) || themes[0];
    const root = document.documentElement;
    Object.entries(theme.rootColors).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    localStorage.setItem("iniondata-theme", activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => closeRef.current?.focus(), 100);

    function onKey(e) {
      if (e.key === "Escape" && open) closeMenu();
      if (e.key === "Tab" && open && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 50);
  }, []);

  const mobileMenu = createPortal(
    <div
      ref={menuRef}
      id="mobile-menu"
      className={`mob-menu${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      {...(!open ? { inert: "" } : {})}
    >
      <div className="mob-bg" />
      <div className="mob-blob mob-blob-1" />
      <div className="mob-blob mob-blob-2" />
      <div className="mob-blob mob-blob-3" />
      <div className="mob-noise" />
      <div className="mob-grid-lines" />
      <div className="mob-rule" />
      <div className="mob-watermark" aria-hidden="true">{watermark}</div>

      <div className="mob-inner">
        <div className="mob-topbar">
          <img src={logo} alt="InionData" className="mob-topbar-logo" />
          <button
            ref={closeRef}
            className="mob-close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Theme Switcher Row */}
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>Appearance</span>
          <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value)}
            className="accent-select"
            aria-label="Select accent color"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label.replace(" Accent", "")}
              </option>
            ))}
          </select>
        </div>

        <nav className="mob-nav" aria-label="Mobile navigation">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={closeMenu}
              onMouseEnter={() => setWatermark(String(i + 1).padStart(2, "0"))}
              onMouseLeave={() => setWatermark("IN")}
              className={({ isActive }) =>
                `mob-link-wrap${isActive ? " mob-link-wrap--active" : ""}`
              }
              style={{
                transitionDelay: open
                  ? `${0.08 + i * 0.065}s`
                  : `${(links.length - 1 - i) * 0.03}s`,
              }}
            >
              <span className="mob-link-index" aria-hidden="true">0{i + 1}</span>
              <span className="mob-link-label">{l.label}</span>
              <span className="mob-link-sub" aria-hidden="true">{l.sub}</span>
              <span className="mob-link-arrow" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 19L19 5M19 5H9M19 5V15"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mob-footer">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div className="mob-footer-contact">
              <span className="mob-footer-label">Phone</span>
              <a href="tel:+14244256499" className="mob-footer-val">(424) 425-6499</a>
            </div>
            <div className="mob-footer-contact">
              <span className="mob-footer-label">Email</span>
              <a href="mailto:contact@iniondata.com" className="mob-footer-val">contact@iniondata.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {/* Single style injection — no duplicate */}
      <style>{navStyles}</style>

      <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
        <div className="nav__inner">

          <Link to="/" className="brand" onClick={closeMenu}>
            <img src={logo} alt="InionData" className="brand__logo" />
          </Link>

          <nav className="nav__links" aria-label="Main navigation">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `navlink${isActive ? " navlink--active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop only: dot theme switcher + CTA */}
          <div className="nav__actions-desktop">
            <div className="theme-switcher">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`theme-switcher__btn${activeTheme === t.id ? " active" : ""}`}
                  style={{ background: t.color }}
                  title={t.label}
                  onClick={() => setActiveTheme(t.id)}
                  aria-label={`Switch theme to ${t.label}`}
                />
              ))}
            </div>
            <Link to="/contact" className="btn--cta">Get in touch</Link>
          </div>

          {/* Mobile only: accent dropdown + hamburger side by side */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="nav__mobile-right">
            <div className="nav__actions-mobile">
              <select
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value)}
                className="accent-select"
                aria-label="Select accent color"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label.replace(" Accent", "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              className={`nav__toggle${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>

        </div>
      </header>

      {mobileMenu}
    </>
  );
}