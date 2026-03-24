import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { LANGUAGES, FONTS_EN, FONTS_AR, PAPER_STYLES, INK_COLORS, SAMPLE_EN, SAMPLE_AR, DEFAULTS, UI_FONT_AR } from "./config";

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
  const [letterSpacing, setLetterSpacing] = useState(DEFAULTS.en.letterSpacing);
  const [wordSpacing, setWordSpacing] = useState(DEFAULTS.en.wordSpacing);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const pageRef = useRef(null);

  const isRTL = lang.dir === "rtl";
  const currentFonts = isRTL ? FONTS_AR : FONTS_EN;
  const inkColor = paper.inkColor || ink.color;

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
    setWordSpacing(d.wordSpacing);

    if (newLang.id === "ar") {
      setFont(FONTS_AR[0].name);
      if (text === SAMPLE_EN || !text) setText(SAMPLE_AR);
    } else {
      setFont(FONTS_EN[0].name);
      if (text === SAMPLE_AR || !text) setText(SAMPLE_EN);
    }
  };

  const download = async () => {
    if (!pageRef.current) return;
    const canvas = await html2canvas(pageRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const a = document.createElement("a");
    a.download = "handwritten.png";
    a.href = canvas.toDataURL("image/png");
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
    { label: isRTL ? "\u062D\u062C\u0645 \u0627\u0644\u062E\u0637" : "Font Size", value: fontSize, set: setFontSize, min: 10, max: 32, step: 1, unit: "pt" },
    { label: isRTL ? "\u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0633\u0637\u0631" : "Line Height", value: lineHeight, set: setLineHeight, min: 1.0, max: 3.0, step: 0.1, unit: "em" },
    { label: isRTL ? "\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u062D\u0631\u0648\u0641" : "Letter Spacing", value: letterSpacing, set: setLetterSpacing, min: -2, max: 5, step: 0.5, unit: "px" },
    { label: isRTL ? "\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u0643\u0644\u0645\u0627\u062A" : "Word Spacing", value: wordSpacing, set: setWordSpacing, min: -2, max: 10, step: 0.5, unit: "px" },
  ];

  const paperLineStyle = paper.id === "grid"
    ? `repeating-linear-gradient(0deg, ${paper.lineColor} 0px, ${paper.lineColor} 1px, transparent 1px, transparent ${lineHeight}em), repeating-linear-gradient(90deg, ${paper.lineColor} 0px, ${paper.lineColor} 1px, transparent 1px, transparent ${lineHeight}em)`
    : ["ruled", "college", "aged"].includes(paper.id)
      ? `linear-gradient(${paper.lineColor} 0.05em, transparent 0.1em)`
      : "none";

  const paperBgSize = paper.id === "grid"
    ? `${lineHeight}em ${lineHeight}em`
    : `100% ${lineHeight}em`;

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
                  <span className="slider-value">{Number(s.value).toFixed(s.step < 1 ? 1 : 0)}{s.unit}</span>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
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
          {!fontsLoaded ? (
            <div className="loading">
              <div className="spinner" />
              <span>{isRTL ? "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062E\u0637\u0648\u0637..." : "Loading fonts..."}</span>
            </div>
          ) : (
            <div className="page-wrap">
              <div
                ref={pageRef}
                className={`page ${paper.margin ? "margined" : ""}`}
                style={{
                  background: paper.bg,
                  backgroundImage: paperLineStyle,
                  backgroundSize: paperBgSize,
                }}
              >
                {paper.margin && <div className="margin-line" style={{ [isRTL ? "right" : "left"]: 60 }} />}
                <div
                  className="page-text"
                  style={{
                    fontFamily: `'${font}', cursive, sans-serif`,
                    fontSize: `${fontSize}pt`,
                    lineHeight: `${lineHeight}em`,
                    letterSpacing: `${letterSpacing}px`,
                    wordSpacing: `${wordSpacing}px`,
                    color: inkColor,
                    direction: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                    paddingLeft: !isRTL && paper.margin ? 70 : 30,
                    paddingRight: isRTL && paper.margin ? 70 : 30,
                  }}
                >
                  {text.split("\n").map((line, i) => (
                    <p key={i} style={{ minHeight: `${lineHeight}em` }}>{line || "\u00A0"}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
