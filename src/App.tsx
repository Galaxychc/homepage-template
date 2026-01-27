import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Waves,
  Shield,
  Zap,
  Moon,
  Sun,
  ArrowRight,
  ArrowDown,
  Star,
  Layers,
  Timer,
  Type,
  Link as LinkIcon,
  FileText,
  PencilLine,
  CheckCircle2,
  Github,
  Mail,
  Linkedin,
  Twitter,
  Tag,
  ExternalLink,
} from "lucide-react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ---------------- global CSS ---------------- */
function GlobalCSS() {
  return (
    <style>{`
      :root{
        --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,
          "Hiragino Sans","Hiragino Kaku Gothic ProN",
          "Noto Sans CJK JP","Noto Sans JP",
          "PingFang SC","PingFang TC",
          "Microsoft YaHei","Segoe UI",sans-serif;

        --font-display: ui-serif,
          "New York","New York Large","Iowan Old Style","Palatino Linotype",
          "Songti SC","STSong","Hiragino Mincho ProN","Yu Mincho",
          Georgia,"Times New Roman",serif;

        --gx: 50vw;
        --gy: 40vh;
        --g-strength: 1;
      }

      .font-sans { font-family: var(--font-sans); }
      .font-display { font-family: var(--font-display); letter-spacing: -0.018em; }

      .grain{
        pointer-events:none; position:fixed; inset:0; z-index:1;
        opacity:.05;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
        background-repeat:repeat;
      }

      @keyframes sweep {
        0% { transform: translateX(-55%) skewX(-18deg); opacity: 0; }
        14% { opacity: .16; }
        55% { opacity: .12; }
        100% { transform: translateX(175%) skewX(-18deg); opacity: 0; }
      }

      @keyframes btnSweep {
        0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
        30% { opacity: .16; }
        60% { opacity: .12; }
        100% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
      }

      .hairline {
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(0,0,0,0.10), rgba(255,255,255,0));
      }
      .hairline-dark {
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0));
      }
    `}</style>
  );
}

/* ---------------- glow controller ---------------- */
function useGlowController() {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const migrating = useRef(false);
  const migStart = useRef(0);
  const migFrom = useRef({ x: 0, y: 0 });
  const migTo = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    target.current = { x: w * 0.56, y: h * 0.33 };
    current.current = { x: w * 0.56, y: h * 0.33 };

    const tick = () => {
      const now = performance.now();

      let tx = target.current.x;
      let ty = target.current.y;

      if (migrating.current) {
        const t = Math.min(1, (now - migStart.current) / 850);
        const e = 1 - Math.pow(1 - t, 3);
        tx = migFrom.current.x + (migTo.current.x - migFrom.current.x) * e;
        ty = migFrom.current.y + (migTo.current.y - migFrom.current.y) * e;
        if (t >= 1) migrating.current = false;
      }

      const k = 0.14;
      current.current.x += (tx - current.current.x) * k;
      current.current.y += (ty - current.current.y) * k;

      const root = document.documentElement;
      root.style.setProperty("--gx", `${current.current.x.toFixed(1)}px`);
      root.style.setProperty("--gy", `${current.current.y.toFixed(1)}px`);

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const strength = Math.max(0.62, 1 - y / 1200);
      document.documentElement.style.setProperty(
        "--g-strength",
        strength.toFixed(3)
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setMouse = (x: number, y: number) => {
    target.current = { x, y };
  };

  const migrateToAnchor = (x: number, y: number) => {
    migrating.current = true;
    migStart.current = performance.now();
    migFrom.current = { ...current.current };
    migTo.current = { x, y };
  };

  return { setMouse, migrateToAnchor };
}

/* ---------------- ambient light ---------------- */
function AmbientLight({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 3 }}>
      <div
        className="absolute inset-0"
        style={{
          opacity: isDay ? 0.05 : 0.04,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.28'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: isDay ? 0.18 : 0.22,
          background: isDay
            ? "radial-gradient(980px 760px at var(--gx) var(--gy), rgba(255,224,170,calc(.23*var(--g-strength))) 0%, rgba(251,191,36,calc(.10*var(--g-strength))) 42%, rgba(251,146,60,calc(.04*var(--g-strength))) 58%, rgba(251,146,60,0) 74%)"
            : "radial-gradient(980px 760px at var(--gx) var(--gy), rgba(125,211,252,calc(.24*var(--g-strength))) 0%, rgba(165,180,252,calc(.14*var(--g-strength))) 44%, rgba(165,180,252,0) 76%)",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          left: "var(--gx)",
          top: "var(--gy)",
          width: "820px",
          height: "820px",
          transform: "translate(-50%, -50%)",
          filter: isDay
            ? "blur(150px) saturate(1.12)"
            : "blur(160px) saturate(1.08)",
          opacity: "var(--g-strength)" as any,
          background: isDay
            ? "radial-gradient(circle, rgba(255,224,170,0.42) 0%, rgba(251,191,36,0.16) 46%, rgba(251,146,60,0.06) 62%, transparent 78%)"
            : "radial-gradient(circle, rgba(125,211,252,0.40) 0%, rgba(165,180,252,0.18) 52%, transparent 78%)",
        }}
      />
    </div>
  );
}

/* ---------------- premium glass corner falloff ---------------- */
function CornerFalloff({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isDay ? 0.5 : 0.38,
          background:
            "radial-gradient(340px 220px at 0% 0%, rgba(0,0,0,0.10), transparent 60%)," +
            "radial-gradient(340px 220px at 100% 0%, rgba(0,0,0,0.10), transparent 60%)," +
            "radial-gradient(340px 220px at 0% 100%, rgba(0,0,0,0.10), transparent 60%)," +
            "radial-gradient(340px 220px at 100% 100%, rgba(0,0,0,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isDay ? 0.55 : 0.35,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.32)",
        }}
      />
    </>
  );
}

/* ---------------- progress bar ---------------- */
function ProgressBar({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";
  const fill = isDay
    ? "linear-gradient(90deg, #3b82f6, #60a5fa 55%, #fde68a)"
    : "linear-gradient(90deg, #7dd3fc, #a5b4fc)";

  return (
    <div
      className={cn(
        "mt-5 h-2 w-full overflow-hidden rounded-full",
        isDay ? "bg-black/5" : "bg-white/10"
      )}
    >
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "82%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative h-full rounded-full"
        style={{ background: fill }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.30), rgba(255,255,255,0))",
            filter: "blur(1px)",
            animation: "sweep 4.4s ease-in-out infinite",
            opacity: 0.14,
            transform: isDay
              ? "translateX(calc((var(--gx) - 50vw) * 0.03)) skewX(-18deg)"
              : "skewX(-18deg)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ---------------- specular button ---------------- */
function SpecButton({
  mode,
  href,
  children,
  variant = "primary",
}: {
  mode: "day" | "night";
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isDay = mode === "day";
  const base =
    variant === "primary"
      ? isDay
        ? "border-black/10 bg-white/84 text-slate-900 hover:bg-white"
        : "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
      : isDay
      ? "border-black/10 bg-white/72 text-slate-800 hover:bg-white"
      : "border-white/10 bg-white/[0.06] text-white/90 hover:bg-white/[0.10]";

  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border px-4 py-3 text-sm transition",
        base
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.26), rgba(255,255,255,0))",
          filter: "blur(0.5px)",
          transform: "translateX(-120%) skewX(-18deg)",
          animation: "btnSweep 1.25s ease-out 1",
        }}
      />
      {children}
    </a>
  );
}

/* ---------------- feature card ---------------- */
function FeatureCard({
  mode,
  icon: Icon,
  title,
  desc,
}: {
  mode: "day" | "night";
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  desc: string;
}) {
  const isDay = mode === "day";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-[filter,transform,box-shadow] duration-500",
        isDay
          ? "border-black/10 bg-white/74 hover:[filter:hue-rotate(0.6deg)_brightness(1.02)]"
          : "border-white/10 bg-white/[0.06] hover:[filter:hue-rotate(-0.6deg)_brightness(1.05)]"
      )}
      style={{
        boxShadow: isDay
          ? "0 12px 34px rgba(2,6,23,0.06)"
          : "0 16px 40px rgba(0,0,0,0.42)",
      }}
    >
      <CornerFalloff mode={mode} />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border",
              isDay
                ? "border-black/10 bg-white/85"
                : "border-white/10 bg-white/[0.08]"
            )}
          >
            <Icon size={18} />
          </span>
          <h3
            className={cn(
              "text-[17px] font-semibold",
              isDay ? "text-slate-900" : "text-white"
            )}
          >
            {title}
          </h3>
        </div>

        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed",
            isDay ? "text-slate-700" : "text-white/70"
          )}
        >
          {desc}
        </p>

        <ProgressBar mode={mode} />
      </div>
    </motion.div>
  );
}

/* ---------------- Hero contact links (match cards) ---------------- */
function HeroContacts({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";

  // ✅ 改成和下面卡片一致的“玻璃卡”风格（不突兀）
  const wrap = isDay
    ? "border-black/10 bg-white/74"
    : "border-white/10 bg-white/[0.06]";
  const btn = isDay
    ? "border-black/10 bg-white/78 text-slate-700 hover:text-slate-900 hover:bg-white"
    : "border-white/10 bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.12]";

  const links = [
    {
      icon: Github,
      label: "GitHub（放你的主页）",
      href: "https://github.com/",
    },
    { icon: Mail, label: "邮箱（mailto）", href: "mailto:hello@example.com" },
    {
      icon: Linkedin,
      label: "LinkedIn（可选）",
      href: "https://www.linkedin.com/",
    },
    { icon: Twitter, label: "X / Twitter（可选）", href: "https://x.com/" },
  ];

  return (
    <div
      className={cn(
        "relative mt-8 overflow-hidden rounded-2xl border p-5 backdrop-blur-md",
        wrap
      )}
      style={{
        boxShadow: isDay
          ? "0 12px 34px rgba(2,6,23,0.05)"
          : "0 16px 40px rgba(0,0,0,0.40)",
      }}
    >
      <CornerFalloff mode={mode} />
      <div className="relative">
        <div
          className={cn(
            "text-xs tracking-wide",
            isDay ? "text-slate-500" : "text-white/50"
          )}
        >
          联系方式（把链接替换成你的）
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {links.map((l) => {
            const I = l.icon;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                  btn
                )}
                title={l.label}
              >
                <I size={16} />
                <span className="hidden sm:inline">{l.label}</span>
                <ExternalLink
                  size={14}
                  className="opacity-0 transition group-hover:opacity-60"
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- BlueTypeSamples ---------------- */
function BlueTypeSamples({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";

  const blueTitle = isDay ? "text-[#2b4f6a]" : "text-[#a9d6ff]";
  const blueBody = isDay ? "text-[#2e5b7a]" : "text-[#93caff]";
  const blueLink = isDay ? "text-[#365d8f]" : "text-[#b7b9ff]";

  const caption = isDay ? "text-slate-600" : "text-white/60";
  const sampleBox = isDay
    ? "border-black/10 bg-white/70"
    : "border-[#9ad7ff]/10 bg-[#061526]/55";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-8 backdrop-blur-md",
        isDay
          ? "border-black/10 bg-white/72"
          : "border-white/10 bg-white/[0.06]"
      )}
      style={{
        boxShadow: isDay
          ? "0 14px 42px rgba(2,6,23,0.06)"
          : "0 18px 48px rgba(0,0,0,0.46)",
      }}
    >
      <CornerFalloff mode={mode} />
      <div className="relative">
        <div
          className={cn(
            "text-xs tracking-wide",
            isDay ? "text-slate-500" : "text-white/50"
          )}
        >
          蓝色字体示例（直接拿去用）
        </div>

        <div className="mt-4 grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm",
                isDay
                  ? "border-black/10 bg-white/75 text-slate-700"
                  : "border-white/10 bg-white/[0.08] text-white/70"
              )}
            >
              <Type size={16} />
              白天墨水蓝 / 夜晚极光蓝
            </div>

            <p className={cn("mt-4 text-[15px] leading-relaxed", caption)}>
              白天用低饱和“墨水蓝”，夜晚用更亮但更柔的“极光蓝/淡紫蓝”。把下方文案替换成你的内容即可。
            </p>
          </div>

          <div className="md:col-span-8 space-y-5">
            <div className={cn("rounded-2xl border px-5 py-4", sampleBox)}>
              <div
                className={cn(
                  "text-xs tracking-wide",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                标题蓝（适合大标题）
              </div>
              <div
                className={cn(
                  "mt-2 font-display text-[26px] leading-tight",
                  blueTitle
                )}
              >
                在这里写你的标题（不超过两行更高级）
              </div>
            </div>

            <div className={cn("rounded-2xl border px-5 py-4", sampleBox)}>
              <div
                className={cn(
                  "text-xs tracking-wide",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                正文蓝（适合段落）
              </div>
              <p className={cn("mt-2 text-[15px] leading-relaxed", blueBody)}>
                在这里写你的正文：每段 2–4
                行；重点信息用换行或加粗突出；读起来更像成品文案。
              </p>
            </div>

            <div className={cn("rounded-2xl border px-5 py-4", sampleBox)}>
              <div
                className={cn(
                  "text-xs tracking-wide",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                链接蓝（适合重要链接）
              </div>
              <div className="mt-2 flex items-center gap-2">
                <LinkIcon
                  size={16}
                  className={cn(isDay ? "text-slate-600" : "text-white/60")}
                />
                <a
                  href="#"
                  className={cn(
                    "text-[15px] underline-offset-4 hover:underline",
                    blueLink
                  )}
                >
                  在这里放一个关键链接（作品集 / 论文 / Demo）
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Section 2 ---------------- */
function RhythmSection({ mode }: { mode: "day" | "night" }): JSX.Element {
  const isDay = mode === "day";
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const y2 = useTransform(scrollYProgress, [0, 1], [26, -26]);

  const blocks = [
    {
      k: "01",
      icon: Layers,
      title: "一句话定位（你是谁 / 你做什么）",
      desc: "用一句话说明：身份 + 方向 + 价值。示例：用一句话说清你做的领域与能解决的问题。",
      hint: "定位 · 方向 · 价值",
    },
    {
      k: "02",
      icon: Timer,
      title: "3–5 条要点（方法 / 特点 / 结果）",
      desc: "用条目列清楚：你做过什么、怎么做的、结果怎样（尽量量化）。每条 1–2 行。",
      hint: "方法 · 特点 · 结果",
    },
    {
      k: "03",
      icon: Star,
      title: "1 个短案例（最好可量化）",
      desc: "用一个小案例落地：背景 → 你的动作 → 指标/结论（如速度提升、误差下降、体验变好）。",
      hint: "背景 · 动作 · 指标",
    },
  ];

  return (
    <section
      id="section-2"
      ref={ref}
      className="relative mx-auto max-w-5xl px-6 pb-20 pt-10 md:pt-12"
    >
      <div
        className={cn(
          "my-10 h-px w-full",
          isDay ? "hairline" : "hairline-dark"
        )}
      />

      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-24">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "text-sm tracking-wide",
                isDay ? "text-slate-600" : "text-white/60"
              )}
            >
              第二屏（结构模板）
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(
                "font-display mt-3 text-[28px] leading-tight md:text-[34px]",
                isDay ? "text-slate-900" : "text-white"
              )}
            >
              内容结构：让读者“扫一眼就懂”
            </motion.h2>

            <p
              className={cn(
                "mt-4 max-w-sm text-[15px] leading-relaxed",
                isDay ? "text-slate-700" : "text-white/70"
              )}
            >
              先把结构写对：定位 → 要点 → 案例。第三屏用来放长文本与“下一步”。
            </p>

            <a
              href="#section-3"
              className={cn(
                "mt-6 inline-flex items-center gap-2 text-sm",
                isDay
                  ? "text-slate-700 hover:text-slate-900"
                  : "text-white/70 hover:text-white"
              )}
            >
              去第三屏（长文本） <ArrowDown size={16} />
            </a>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="space-y-8 md:space-y-10">
            {blocks.map((b, idx) => {
              const Icon = b.icon;
              const flip = idx % 2 === 1;

              return (
                <motion.div
                  key={b.k}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className={cn(
                    "relative overflow-hidden rounded-3xl border backdrop-blur-md",
                    isDay
                      ? "border-black/10 bg-white/72"
                      : "border-white/10 bg-white/[0.06]"
                  )}
                  style={{
                    boxShadow: isDay
                      ? "0 14px 40px rgba(2,6,23,0.06)"
                      : "0 18px 46px rgba(0,0,0,0.44)",
                  }}
                >
                  <CornerFalloff mode={mode} />

                  <motion.div
                    aria-hidden
                    style={{ y: idx === 0 ? y1 : y2 }}
                    className={cn(
                      "pointer-events-none absolute -right-6 -top-10 select-none font-display text-[120px] leading-none",
                      isDay ? "text-slate-900/[0.06]" : "text-white/[0.06]"
                    )}
                  >
                    {b.k}
                  </motion.div>

                  <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8">
                    <div
                      className={cn(
                        "md:col-span-5",
                        flip ? "md:order-2" : "md:order-1"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm",
                          isDay
                            ? "border-black/10 bg-white/75 text-slate-700"
                            : "border-white/10 bg-white/[0.08] text-white/70"
                        )}
                      >
                        <Icon size={16} />
                        <span>{b.hint}</span>
                      </div>

                      <h3
                        className={cn(
                          "mt-4 text-[20px] font-semibold",
                          isDay ? "text-slate-900" : "text-white"
                        )}
                      >
                        {b.title}
                      </h3>
                    </div>

                    <div
                      className={cn(
                        "md:col-span-7",
                        flip ? "md:order-1" : "md:order-2"
                      )}
                    >
                      <p
                        className={cn(
                          "text-[15px] leading-relaxed",
                          isDay ? "text-slate-700" : "text-white/70"
                        )}
                      >
                        {b.desc}
                      </p>

                      <div
                        className={cn(
                          "mt-6 h-px w-full",
                          isDay ? "bg-black/5" : "bg-white/10"
                        )}
                      />

                      {/* ✅ 按你要求：删掉每个卡片里的“去第三屏链接” */}
                      <div className="mt-5 flex items-center justify-between">
                        <span
                          className={cn(
                            "text-xs",
                            isDay ? "text-slate-500" : "text-white/50"
                          )}
                        >
                          建议：每条 1–2 行；关键数字单独一行更清晰
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isDay ? "text-slate-500" : "text-white/50"
                          )}
                        >
                          Keep it calm.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <BlueTypeSamples mode={mode} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Third Screen ---------------- */
function ThirdScreen({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";
  const card = isDay
    ? "border-black/10 bg-white/72"
    : "border-white/10 bg-white/[0.06]";
  const soft = isDay
    ? "border-black/10 bg-white/70"
    : "border-white/10 bg-white/[0.06]";
  const textareaBg = isDay
    ? "bg-white/88 border-black/10"
    : "bg-[#061526]/55 border-[#9ad7ff]/10";
  const textareaText = isDay ? "text-slate-800" : "text-white/80";
  const placeholder = isDay
    ? "placeholder:text-slate-400"
    : "placeholder:text-white/40";

  const [val, setVal] = useState<string>(
    `【个人简介 / 项目说明 模板】\n\n一句话定位：\n- （你是谁 / 你做什么 / 你擅长什么）\n\n3–5 条要点：\n- 方法 / 特点 / 结果（尽量量化）\n- …\n- …\n\n短案例（可量化）：\n- 背景：\n- 我的做法：\n- 结果指标：\n\n下一步：\n- 我想要（机会/合作/申请方向）：\n- 我能提供（能力/资源/交付）：\n`
  );

  const count = useMemo(() => val.trim().length, [val]);
  const tags = ["个人简介", "项目复盘", "研究方向", "下一步"];

  return (
    <section
      id="section-3"
      className="relative mx-auto max-w-5xl px-6 pb-28 pt-10 md:pt-12"
    >
      <div
        className={cn(
          "my-10 h-px w-full",
          isDay ? "hairline" : "hairline-dark"
        )}
      />

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "text-sm tracking-wide",
          isDay ? "text-slate-600" : "text-white/60"
        )}
      >
        第三屏（长文本）
      </motion.p>

      <div className="mt-3 grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "font-display text-[30px] leading-tight md:text-[40px]",
              isDay ? "text-slate-900" : "text-white"
            )}
          >
            长文本区：个人简介 / 项目复盘 / 产品说明
          </motion.h2>

          <p
            className={cn(
              "mt-4 max-w-2xl text-[15px] leading-relaxed",
              isDay ? "text-slate-700" : "text-white/70"
            )}
          >
            右侧直接粘贴正文；左侧是写作模板。建议每段 2–4
            行，关键数字单独一行，会更像成品页面。
          </p>
        </div>

        <div className="md:col-span-5">
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 justify-start md:justify-end",
              isDay ? "text-slate-600" : "text-white/60"
            )}
          >
            {tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                  isDay
                    ? "border-black/10 bg-white/70"
                    : "border-white/10 bg-white/[0.06]"
                )}
              >
                <Tag size={12} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className={cn(
            "relative overflow-hidden rounded-3xl border p-6 backdrop-blur-md md:col-span-5",
            card
          )}
          style={{
            boxShadow: isDay
              ? "0 14px 42px rgba(2,6,23,0.06)"
              : "0 18px 48px rgba(0,0,0,0.46)",
          }}
        >
          <CornerFalloff mode={mode} />
          <div className="relative">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl border",
                  isDay
                    ? "border-black/10 bg-white/85"
                    : "border-white/10 bg-white/[0.08]"
                )}
              >
                <FileText size={18} />
              </span>
              <div>
                <div
                  className={cn(
                    "text-xs tracking-wide",
                    isDay ? "text-slate-500" : "text-white/50"
                  )}
                >
                  写作模板（可直接照抄）
                </div>
                <div
                  className={cn(
                    "mt-1 font-display text-[22px] leading-tight",
                    isDay ? "text-slate-900" : "text-white"
                  )}
                >
                  按顺序写：定位 → 要点 → 案例 → 下一步
                </div>
                <p
                  className={cn(
                    "mt-2 text-[14px] leading-relaxed",
                    isDay ? "text-slate-700" : "text-white/70"
                  )}
                >
                  先让读者快速判断你是谁，再给细节。每段短一点，信息密度反而更高。
                </p>
              </div>
            </div>

            <div className={cn("mt-5 rounded-2xl border p-4", soft)}>
              <div
                className={cn(
                  "flex items-center gap-2 text-xs tracking-wide",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                <PencilLine size={14} />
                结构清单
              </div>

              <ul
                className={cn(
                  "mt-3 space-y-2 text-[14px] leading-relaxed",
                  isDay ? "text-slate-700" : "text-white/70"
                )}
              >
                {[
                  "一句话定位（你是谁 / 你做什么）",
                  "3-5 条要点（方法 / 特点 / 结果）",
                  "1 个短案例（最好可量化）",
                  "下一步（你要什么 / 你能提供什么）",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className={cn(
                        "mt-[2px]",
                        isDay ? "text-slate-500" : "text-white/50"
                      )}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  "mt-4 text-xs",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                Tip：每段控制在 2–4 行；尽量用“我做了什么 → 结果是什么”。
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
          className={cn(
            "relative overflow-hidden rounded-3xl border p-6 backdrop-blur-md md:col-span-7",
            card
          )}
          style={{
            boxShadow: isDay
              ? "0 14px 42px rgba(2,6,23,0.06)"
              : "0 18px 48px rgba(0,0,0,0.46)",
          }}
        >
          <CornerFalloff mode={mode} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={cn(
                    "text-xs tracking-wide",
                    isDay ? "text-slate-500" : "text-white/50"
                  )}
                >
                  正文（可直接粘贴）
                </div>
                <div
                  className={cn(
                    "mt-1 font-medium",
                    isDay ? "text-slate-900" : "text-white"
                  )}
                >
                  在这里写你的长文本
                </div>
              </div>
              <div
                className={cn(
                  "text-xs",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                {count.toLocaleString()} 字符
              </div>
            </div>

            <div
              aria-hidden
              className="pointer-events-none mt-4 h-px w-full"
              style={{
                opacity: isDay ? 0.55 : 0.35,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.40), rgba(255,255,255,0))",
              }}
            />

            <textarea
              className={cn(
                "mt-4 w-full resize-none rounded-2xl border p-5 text-[15px] leading-relaxed outline-none transition",
                textareaBg,
                textareaText,
                placeholder
              )}
              rows={14}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder={
                "在这里粘贴你的长文本（个人简介 / 项目复盘 / 研究陈述）...\n\n建议结构：\n1) 一句话定位\n2) 3-5 条要点\n3) 一个短案例\n4) 下一步"
              }
            />

            <div className="mt-4 flex items-center justify-between">
              <span
                className={cn(
                  "text-xs",
                  isDay ? "text-slate-500" : "text-white/50"
                )}
              >
                建议：每段 2–4 行；关键数字单独一行更清晰
              </span>
              <a
                href="#section-2"
                className={cn(
                  "inline-flex items-center gap-2 text-sm",
                  isDay
                    ? "text-slate-700 hover:text-slate-900"
                    : "text-white/70 hover:text-white"
                )}
              >
                回到结构模板 <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Premium Header ---------------- */
function PremiumHeader({
  mode,
  onToggleMode,
}: {
  mode: "day" | "night";
  onToggleMode: () => void;
}) {
  const isDay = mode === "day";
  return (
    <header
      className={cn(
        "sticky top-0 border-b backdrop-blur-md transition-colors duration-700",
        isDay ? "border-black/10 bg-white/55" : "border-white/10 bg-black/35"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl border",
              isDay
                ? "border-black/10 bg-white/70"
                : "border-white/10 bg-white/[0.06]"
            )}
          >
            <Sparkles size={16} />
          </span>

          <div className="leading-tight">
            <div
              className={cn(
                "text-[11px] tracking-[0.22em] uppercase",
                isDay ? "text-slate-500" : "text-white/50"
              )}
            >
              PORTFOLIO TEMPLATE
            </div>
            <div
              className={cn(
                "font-display text-[18px] md:text-[19px]",
                isDay ? "text-slate-900" : "text-white"
              )}
            >
              一页式个人主页
            </div>
            <div
              className={cn(
                "hidden text-[12px] md:block",
                isDay ? "text-slate-600" : "text-white/55"
              )}
            >
              定位 · 要点 · 案例 · 下一步
            </div>
          </div>
        </div>

        <button
          onClick={onToggleMode}
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
            isDay
              ? "border-black/10 bg-white/65 text-slate-800 hover:bg-white/80"
              : "border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.10]"
          )}
          aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
        >
          <span
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full border transition",
              isDay
                ? "border-black/10 bg-white"
                : "border-white/10 bg-white/[0.06]"
            )}
          >
            {isDay ? <Moon size={15} /> : <Sun size={15} />}
          </span>
          <span className="font-medium">
            {isDay ? "Nightfall" : "Daylight"}
          </span>
          <span
            aria-hidden
            className={cn(
              "ml-1 h-1.5 w-1.5 rounded-full transition",
              isDay
                ? "bg-slate-900/30 group-hover:bg-slate-900/50"
                : "bg-white/35 group-hover:bg-white/60"
            )}
          />
        </button>
      </div>
    </header>
  );
}

/* ---------------- App ---------------- */
export default function App(): JSX.Element {
  const [mode, setMode] = useState<"day" | "night">("day");
  const isDay = mode === "day";
  const { setMouse, migrateToAnchor } = useGlowController();

  useEffect(() => {
    setMouse(window.innerWidth * 0.56, window.innerHeight * 0.33);
  }, []);

  const bg = useMemo(
    () =>
      isDay
        ? "bg-[linear-gradient(to_bottom,#e0edff,#eef6ff,#ffffff)] text-slate-900"
        : "bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white",
    [isDay]
  );

  const toggle = () => {
    const next = isDay ? "night" : "day";
    setMode(next);
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const ax = next === "day" ? w * 0.58 : w * 0.48;
    const ay = next === "day" ? h * 0.28 : h * 0.44;
    migrateToAnchor(ax, ay);
  };

  return (
    <div
      onPointerMoveCapture={(e) => setMouse(e.clientX, e.clientY)}
      onMouseMoveCapture={(e) => setMouse(e.clientX, e.clientY)}
      onPointerDownCapture={(e) => setMouse(e.clientX, e.clientY)}
      className={cn(
        "min-h-screen overflow-hidden transition-colors duration-700",
        bg
      )}
      style={{ isolation: "isolate", touchAction: "none" }}
    >
      <GlobalCSS />
      <div className="grain" />
      <AmbientLight mode={mode} />

      <div className="relative z-10 font-sans">
        <PremiumHeader mode={mode} onToggleMode={toggle} />

        {/* Screen 1 */}
        <main className="mx-auto max-w-5xl px-6 py-24">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className={cn(
              "font-display max-w-3xl text-[48px] font-semibold leading-[1.05] md:text-[62px]",
              isDay ? "text-slate-900" : "text-white"
            )}
          >
            一句话定位（你是谁 / 你做什么）
          </motion.h1>

          <p
            className={cn(
              "mt-6 max-w-2xl text-[17px] leading-relaxed",
              isDay ? "text-slate-700" : "text-white/70"
            )}
          >
            示例：用一句话说清你的领域、擅长的方法，以及能解决的问题。下面是跳转入口与内容模板。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <SpecButton mode={mode} href="#section-2" variant="primary">
              去第二屏（结构模板） <ArrowDown size={16} />
            </SpecButton>

            <SpecButton mode={mode} href="#section-3" variant="secondary">
              去第三屏（长文本） <ArrowDown size={16} />
            </SpecButton>

            <span
              className={cn(
                "text-sm",
                isDay ? "text-slate-600" : "text-white/60"
              )}
            >
              向下滚动：看结构与示例
            </span>
          </div>

          {/* ✅ 位置调整：先给内容卡片（更像“作品亮点”），联系方式放在卡片之后作为收口 */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              mode={mode}
              icon={Waves}
              title="3–5 条要点（方法 / 特点 / 结果）"
              desc="把你的要点写在这里：每条 1–2 行，尽量量化（如提升 X%，误差降低 Y）。"
            />
            <FeatureCard
              mode={mode}
              icon={Shield}
              title="1 个短案例（最好可量化）"
              desc="背景 → 你的动作 → 指标/结论。用一个小案例证明你的能力。"
            />
            <FeatureCard
              mode={mode}
              icon={Zap}
              title="下一步（你要什么 / 你能提供什么）"
              desc="写清楚你想要的机会/合作，以及你能提供的能力/交付。"
            />
          </div>

          <HeroContacts mode={mode} />
        </main>

        <RhythmSection mode={mode} />
        <ThirdScreen mode={mode} />

        <div className="pb-20" />
      </div>
    </div>
  );
}
