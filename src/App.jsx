import { useState, useRef, useEffect, useCallback } from "react";
import { LANGUAGES, FONTS_EN, FONTS_AR, PAPER_STYLES, INK_COLORS, SAMPLE_EN, SAMPLE_AR, DEFAULTS, UI_FONT_AR } from "./config";
import { drawPaper, drawText } from "./renderer";

function loadFont(url) {
  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

export default function App() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [text, setText] = useState(SAMPLE_EN);
  const [font, setFont] = useState(FONTS_EN[0].name);
  const [paper, setPaper] = useState(PAPER_STYLES[0]);
  const [ink, setInk] = useState(INK_COLORS[0]);
  const [fontSize, setFontSize] = useState(DEFAULTS.en.fontSize);
  const [lineHeight, setLineHeight] = useState(DEFAULTS.en.lineHeight);
  const [wobble, setWobble] = useState(DEFAULTS.en.wobble);
  const [letterSpacing, setLetterSpacing] = useState(DEFAULTS.en.letterSpacing);
  const [inkWeight, setInkWeight] = useState(DEFAULTS.en.inkWeight);
  const [marginLeft] = useState(90);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [seed] = useState(42);
  const canvasRef = useRef(null);

  const isRTL = lang.dir === "rtl";
  const currentFonts = isRTL ? FONTS_AR : FONTS_EN;

  useEffect(() => {
    [...FONTS_EN, ...FONTS_AR].forEach((f) => loadFont(f.url));
    loadFont(UI_FONT_AR);
    setTimeout(() => setFontsLoaded(true), 1800);
  }, []);

  const switchLang = (newLang) => {
    setLang(newLang);
    const d = DEFAULTS[newLang.id];
    setFontSize(d.fontSize);
    setLineHeight(d.lineHeight);
    setLetterSpacing(d.letterSpacing);
    setInkWeight(d.inkWeight);
    setWobble(d.wobble);

    if (newLang.id === "ar") {
      setFont(FONTS_AR[0].name);
      if (text === SAMPLE_EN || !text) setText(SAMPLE_AR);
    } else {
      setFont(FONTS_EN[0].name);
      if (text === SAMPLE_AR || !text) setText(SAMPLE_EN);
    }
  };

  const renderOptions = { text, font, paper, ink, fontSize, lineHeight, wobble, letterSpacing, inkWeight, marginLeft, seed, isRTL };

  const render = useCallback(() => {
    if (!fontsLoaded || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    ctx.clearRect(0, 0, w, h);
    drawPaper(ctx, w, h, renderOptions);
    drawText(ctx, w, h, renderOptions);
  }, [fontsLoaded, renderOptions]);

  useEffect(() => { render(); }, [render]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = "handwritten.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const accent = "#e8a87c";

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#8a8780",
    marginBottom: 8,
    display: "block",
  };

  const pill = (active) => ({
    padding: "6px 14px",
    background: active ? "#3a3548" : "#26252d",
    border: active ? `1.5px solid ${accent}` : "1px solid rgba(255,255,255,0.06)",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    color: active ? accent : "#a8a6a0",
    fontFamily: "inherit",
  });

  const sliders = [
    { label: isRTL ? "\u062D\u062C\u0645 \u0627\u0644\u062E\u0637" : "Font Size", value: fontSize, set: setFontSize, min: 14, max: 40 },
    { label: isRTL ? "\u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0633\u0637\u0631" : "Line Height", value: lineHeight, set: setLineHeight, min: 24, max: 56 },
    { label: isRTL ? "\u0627\u0647\u062A\u0632\u0627\u0632" : "Wobble", value: wobble, set: setWobble, min: 0, max: 4, step: 0.1 },
    { label: isRTL ? "\u062A\u0628\u0627\u0639\u062F" : "Spacing", value: letterSpacing, set: setLetterSpacing, min: -2, max: 4, step: 0.1 },
    { label: isRTL ? "\u062B\u0642\u0644 \u0627\u0644\u062D\u0628\u0631" : "Ink Weight", value: inkWeight, set: setInkWeight, min: 0.3, max: 1.0, step: 0.05 },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">{"\u270D"}</div>
          <div>
            <h1>Text {"\u2192"} Handwriting</h1>
            <p className="subtitle">LTR + RTL handwriting converter</p>
          </div>
        </div>
        <div className="lang-toggle">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => switchLang(l)}
              className={lang.id === l.id ? "active" : ""}
              style={{ fontFamily: l.id === "ar" ? "'Noto Naskh Arabic', sans-serif" : "inherit" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <div className="layout">
        <aside className="controls">

          <div>
            <label style={labelStyle}>{isRTL ? "\u0627\u0644\u0646\u0635" : "Your Text"}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
              className="text-input"
              style={{
                fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "inherit",
                textAlign: isRTL ? "right" : "left",
              }}
              placeholder={isRTL ? "\u0627\u0643\u062A\u0628 \u0623\u0648 \u0627\u0644\u0635\u0642 \u0627\u0644\u0646\u0635 \u0647\u0646\u0627..." : "Type or paste your text here..."}
            />
          </div>

          <div>
            <label style={labelStyle}>{isRTL ? "\u0646\u0645\u0637 \u0627\u0644\u062E\u0637" : "Handwriting Style"}</label>
            <div className="font-grid" style={{ maxHeight: 320, overflowY: "auto" }}>
              {currentFonts.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFont(f.name)}
                  className={`font-btn ${font === f.name ? "active" : ""}`}
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  <span
                    className="font-preview"
                    style={{ fontFamily: `'${f.name}', cursive, sans-serif`, direction: isRTL ? "rtl" : "ltr" }}
                  >
                    {isRTL ? "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647" : "Abc"}
                  </span>
                  <span className="font-label">{f.label}</span>
                  {isRTL && f.desc && <span className="font-desc">{f.desc}</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>{isRTL ? "\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u0642" : "Paper Style"}</label>
            <div className="pill-row">
              {PAPER_STYLES.map((p) => (
                <button key={p.id} onClick={() => setPaper(p)} style={pill(paper.id === p.id)}>
                  {isRTL ? p.labelAr : p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>{isRTL ? "\u0644\u0648\u0646 \u0627\u0644\u062D\u0628\u0631" : "Ink Color"}</label>
            <div className="ink-row">
              {INK_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setInk(c)}
                  className={`ink-dot ${ink.id === c.id ? "active" : ""}`}
                  style={{ background: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="sliders">
            {sliders.map((s) => (
              <div key={s.label} className="slider-row">
                <div className="slider-header">
                  <span style={{ ...labelStyle, marginBottom: 0, fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "inherit" }}>
                    {s.label}
                  </span>
                  <span className="slider-value">{Number(s.value).toFixed(s.step ? 1 : 0)}</span>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step || 1}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <button onClick={download} className="download-btn"
            style={{ fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "inherit" }}>
            <span>{"\u2193"}</span> {isRTL ? "\u062A\u062D\u0645\u064A\u0644 \u0643\u0635\u0648\u0631\u0629 PNG" : "Download as PNG"}
          </button>
        </aside>

        <main className="preview">
          <div className="canvas-wrap">
            {!fontsLoaded ? (
              <div className="loading">
                <div className="spinner" />
                <span>{isRTL ? "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062E\u0637\u0648\u0637..." : "Loading fonts..."}</span>
              </div>
            ) : (
              <canvas ref={canvasRef} width={680} height={880} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
