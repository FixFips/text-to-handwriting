function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function tokenize(text) {
  const tokens = [];
  text.split(/(\n)/).forEach((segment) => {
    if (segment === "\n") {
      tokens.push("\n");
    } else {
      segment.split(/(\s+)/).forEach((w) => {
        if (w) tokens.push(w);
      });
    }
  });
  return tokens;
}

export function drawPaper(ctx, w, h, options) {
  const { paper, lineHeight, marginLeft, isRTL, seed } = options;
  const rng = seededRandom(seed + 99);
  const isDark = paper.id === "dark";

  ctx.fillStyle = paper.bg;
  ctx.fillRect(0, 0, w, h);

  const dotCount = isDark ? 5000 : 8000;
  for (let i = 0; i < dotCount; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const a = rng() * (isDark ? 0.05 : 0.03);
    ctx.fillStyle = isDark ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  if (["ruled", "college", "aged"].includes(paper.id)) {
    ctx.strokeStyle = paper.lineColor;
    ctx.lineWidth = 0.7;
    for (let y = 60; y < h; y += lineHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  if (paper.id === "grid") {
    ctx.strokeStyle = paper.lineColor;
    ctx.lineWidth = 0.4;
    for (let y = lineHeight; y < h; y += lineHeight) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let x = lineHeight; x < w; x += lineHeight) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
  }

  if (paper.margin) {
    ctx.strokeStyle = "#e88888";
    ctx.lineWidth = 1.5;
    const mx = isRTL ? w - marginLeft + 10 : marginLeft - 10;
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, h);
    ctx.stroke();
  }

  if (["ruled", "college"].includes(paper.id)) {
    const hx = isRTL ? w - 25 : 25;
    [120, h / 2, h - 120].forEach((hy) => {
      ctx.beginPath();
      ctx.arc(hx, hy, 10, 0, Math.PI * 2);
      ctx.fillStyle = paper.id === "college" ? "#e8e4dc" : "#eee";
      ctx.fill();
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }

  const edgeGrad = isRTL
    ? ctx.createLinearGradient(0, 0, 8, 0)
    : ctx.createLinearGradient(w - 8, 0, w, 0);
  edgeGrad.addColorStop(0, isRTL ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, isRTL ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.06)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(isRTL ? 0 : w - 8, 0, 8, h);

  const bottomGrad = ctx.createLinearGradient(0, h - 8, 0, h);
  bottomGrad.addColorStop(0, "rgba(0,0,0,0)");
  bottomGrad.addColorStop(1, "rgba(0,0,0,0.04)");
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, h - 8, w, 8);
}

export function drawText(ctx, w, h, options) {
  const { text, font, paper, ink, fontSize, lineHeight, wobble, letterSpacing, marginLeft, seed, isRTL } = options;
  const rng = seededRandom(seed);
  const inkColor = paper.inkColor || ink.color;
  const pad = 40;
  const startX = isRTL ? (paper.margin ? w - marginLeft : w - pad) : (paper.margin ? marginLeft : pad);
  const startY = 58;
  const limitX = isRTL ? pad : w - pad;
  const tokens = tokenize(text);

  ctx.textBaseline = "alphabetic";

  let cx = startX;
  let cy = startY;

  tokens.forEach((token) => {
    if (token === "\n") {
      cx = startX;
      cy += lineHeight;
      return;
    }

    if (/^\s+$/.test(token)) {
      cx += isRTL ? -(fontSize * 0.4) : fontSize * 0.4;
      return;
    }

    ctx.font = `${fontSize}px '${font}', cursive, sans-serif`;
    const wordW = ctx.measureText(token).width + token.length * letterSpacing;

    if (isRTL) {
      if (cx - wordW < limitX && cx < startX) { cx = startX; cy += lineHeight; }
    } else {
      if (cx + wordW > limitX && cx > startX) { cx = startX; cy += lineHeight; }
    }

    if (cy > h - 30) return;

    if (isRTL) {
      const sz = fontSize + (rng() - 0.5) * wobble * 2;
      const dy = (rng() - 0.5) * wobble * 1.8;
      const rot = (rng() - 0.5) * wobble * 0.015;
      const alpha = 0.82 + rng() * 0.18;

      ctx.save();
      ctx.font = `${sz}px '${font}', cursive, sans-serif`;
      const mw = ctx.measureText(token).width;
      ctx.translate(cx, cy + dy);
      ctx.rotate(rot);
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = alpha;
      ctx.textAlign = "right";
      ctx.fillText(token, 0, 0);
      ctx.restore();

      cx -= mw + letterSpacing * token.length + fontSize * 0.3;
      for (let i = 0; i < token.length; i++) { rng(); rng(); rng(); rng(); }
    } else {
      for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        const sz = fontSize + (rng() - 0.5) * wobble * 2;
        const dy = (rng() - 0.5) * wobble * 1.8;
        const rot = (rng() - 0.5) * wobble * 0.02;
        const alpha = 0.82 + rng() * 0.18;

        ctx.font = `${sz}px '${font}', cursive, sans-serif`;
        const cw = ctx.measureText(ch).width;

        ctx.save();
        ctx.translate(cx, cy + dy);
        ctx.rotate(rot);
        ctx.fillStyle = inkColor;
        ctx.globalAlpha = alpha;
        ctx.textAlign = "left";
        ctx.fillText(ch, 0, 0);
        ctx.restore();

        cx += cw + letterSpacing + (rng() - 0.5) * wobble * 0.6;
      }
      cx += fontSize * 0.3;
    }
  });
}
