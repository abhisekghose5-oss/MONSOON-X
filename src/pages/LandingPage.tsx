import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CloudRain,
  ShieldAlert,
  Sprout,
  ArrowRight,
  MapPin,
  Globe,
  Cpu,
  Database,
  BarChart3,
  Zap,
  Users,
  ChevronDown,
} from 'lucide-react';

/* ─── Rain Particle Canvas ────────────────────────────────────── */
function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed drops
    for (let i = 0; i < 120; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 2 + Math.random() * 4,
        length: 12 + Math.random() * 20,
        opacity: 0.08 + Math.random() * 0.18,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.5, d.y + d.length);
        ctx.strokeStyle = `rgba(56, 189, 248, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

/* ─── Feature Card ────────────────────────────────────────────── */
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  delay: number;
}

function FeatureCard({ icon, title, description, accent, delay }: FeatureProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="group relative p-5 rounded-xl border transition-all duration-700 ease-out cursor-default"
      style={{
        background: 'linear-gradient(180deg, rgba(13,32,56,0.85) 0%, rgba(10,25,47,0.95) 100%)',
        borderColor: visible ? '#1E354D' : 'transparent',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}12 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex items-start gap-4">
        <div
          className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center border"
          style={{
            background: `${accent}18`,
            borderColor: `${accent}40`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight mb-1">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Pill ───────────────────────────────────────────────── */
function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="text-center px-4 py-3 transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
        {value}
      </div>
      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}

/* ─── Main Landing Page ───────────────────────────────────────── */
export function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setHeroReady(true), 300);
    const t2 = setTimeout(() => setCtaReady(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const features: FeatureProps[] = [
    {
      icon: <CloudRain className="w-5 h-5" />,
      title: 'Hyperlocal Monsoon Prediction',
      description:
        'WRF 3km downscaling over 14 blocks of Koraput with ECMWF 51-member ensemble forecasts for 7–30 day windows.',
      accent: '#38BDF8',
      delay: 1200,
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      title: 'False Onset Detection',
      description:
        'Bayesian multi-parameter algorithm distinguishing genuine monsoon onset from misleading pre-monsoon rainfall events.',
      accent: '#F59E0B',
      delay: 1400,
    },
    {
      icon: <Sprout className="w-5 h-5" />,
      title: 'Crop-Level Advisories',
      description:
        'Translating precipitation forecasts and soil moisture into actionable sowing, irrigation, and harvest directives per crop.',
      accent: '#10B981',
      delay: 1600,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Trilingual Farmer Mode',
      description:
        'Simplified interface in English, Hindi, and Odia — zero meteorological jargon, with audio read-aloud support.',
      accent: '#A78BFA',
      delay: 1800,
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Officer Operations Command',
      description:
        'District-level risk matrix, block-wise dashboards, CSV exports, and advisory generation for Agriculture Officers.',
      accent: '#F472B6',
      delay: 2000,
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Full Data Transparency',
      description:
        'Every forecast traceable to IMD, ECMWF, ERA5, Open-Meteo, and SRTM source data with quality classification.',
      accent: '#34D399',
      delay: 2200,
    },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#060D17] text-white flex flex-col">
      {/* Rain Effect */}
      <RainCanvas />

      {/* Ambient Radial Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-[#0284C7]/8 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] bg-[#10B981]/6 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-[#F59E0B]/4 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Grid Background */}
      <div className="absolute inset-0 gov-grid opacity-30 pointer-events-none z-0" />

      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Top Badges */}
        <div
          className="flex items-center gap-3 flex-wrap justify-center mb-8 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 tracking-widest uppercase">
            SIH26086
          </span>
          <span className="font-mono text-[11px] font-semibold px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
            Smart India Hackathon 2026
          </span>
          <span className="font-mono text-[11px] font-semibold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30">
            Koraput District, Odisha
          </span>
        </div>

        {/* Animated Radar Reticle */}
        <div
          className="relative w-20 h-20 mb-6 transition-all duration-1000 ease-out"
          style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? 'scale(1)' : 'scale(0.5)',
          }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#0284C7]/30" />
          <div className="absolute inset-2 rounded-full border border-dashed border-[#38BDF8]/40 radar-sweep" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Compass className="w-8 h-8 text-[#38BDF8]" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            </div>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none mb-4 transition-all duration-1000 ease-out"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(30px)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #38BDF8 40%, #0284C7 70%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            MONSOON-X
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-200 mb-3 transition-all duration-1000 ease-out delay-100"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Hyperlocal Monsoon Onset &amp; Break Prediction System
          </p>

          <p
            className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2 transition-all duration-1000 ease-out delay-200 font-mono"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            "From climate signals to crop decisions."
          </p>

          <p
            className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 transition-all duration-1000 ease-out delay-300"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            An AI-powered Decision Support System bridging the gap between complex NWP ensemble models
            and the last-mile farmer — protecting India's rainfed agricultural economy from false
            monsoon onsets and break-spell losses.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-14 transition-all duration-700 ease-out"
          style={{
            opacity: ctaReady ? 1 : 0,
            transform: ctaReady ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <button
            onClick={() => navigate('/overview')}
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#0284C7]/30 hover:shadow-xl hover:shadow-[#0284C7]/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5 overflow-hidden"
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <Cpu className="w-4.5 h-4.5 relative z-10" />
            <span className="relative z-10">Enter Mission Control</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/farmer')}
            className="group px-8 py-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#6EE7B7] font-bold text-sm tracking-wide hover:bg-[#10B981]/25 hover:border-[#10B981]/60 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5"
          >
            <Sprout className="w-4.5 h-4.5" />
            <span>Farmer Mode</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399]">
              त्रिभाषी
            </span>
          </button>
        </div>

        {/* Stats Strip */}
        <div
          className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap mb-10 px-6 py-4 rounded-xl border border-[#1E354D]/60 bg-[#071324]/60 backdrop-blur-sm"
          style={{
            opacity: ctaReady ? 1 : 0,
            transition: 'opacity 0.7s ease-out 0.3s',
          }}
        >
          <StatPill value="14" label="Blocks" delay={1000} />
          <div className="w-px h-10 bg-[#1E354D]" />
          <StatPill value="3km" label="Resolution" delay={1100} />
          <div className="w-px h-10 bg-[#1E354D]" />
          <StatPill value="51" label="Ensemble Members" delay={1200} />
          <div className="w-px h-10 bg-[#1E354D]" />
          <StatPill value="8,807" label="km² Coverage" delay={1300} />
          <div className="w-px h-10 bg-[#1E354D]" />
          <StatPill value="3" label="Languages" delay={1400} />
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce text-slate-500">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ─── FEATURES SECTION ─────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-20 pt-8 max-w-6xl mx-auto w-full">
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] font-bold px-3 py-1 rounded-full bg-[#0284C7]/15 text-[#38BDF8] border border-[#0284C7]/30 tracking-widest uppercase">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-4 mb-2">
            End-to-End Monsoon Intelligence
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Six integrated modules transforming raw atmospheric data into farmer-actionable decisions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─── TECH STACK STRIP ─────────────────────────────────── */}
      <section className="relative z-10 border-t border-[#1E354D] bg-[#071324]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Data Sources */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-2">
              Data Pipeline:
            </span>
            {['IMD AWS', 'ECMWF IFS', 'ERA5', 'Open-Meteo', 'SRTM 30m', 'WRF-ARW'].map((src) => (
              <span
                key={src}
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10"
              >
                {src}
              </span>
            ))}
          </div>

          {/* Tech */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-2">
              Built with:
            </span>
            {['React 19', 'TypeScript', 'Vite', 'Leaflet', 'Recharts', 'TanStack Query'].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#0284C7]/10 text-[#7DD3FC] border border-[#0284C7]/20"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#1E354D] bg-[#060D17]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              MONSOON-X · SIH26086 · DSS{' '}
              <span className="text-slate-400">v1.0.0-rc</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
            <span>
              Koraput, Odisha · 18°48'N, 82°42'E · Elevation 380m–1672m MSL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
