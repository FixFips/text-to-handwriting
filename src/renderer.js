function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function varyInk(rgb, rng, amount) {
  return [
    Math.max(0, Math.min(255, rgb[0] + (rng() - 0.5) * amount)),
    Math.max(0, Math.min(255, rgb[1] + (rng() - 0.5) * amount)),
    Math.max(0, Math.min(255, rgb[2] + (rng() - 0.5) * amount)),
  ];
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

  const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.15);
  topGrad.addColorStop(0, isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.04)");
  topGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, h * 0.15);

  const dotCount = isDark ? 5000 : 8000;
  for (let i = 0; i < dotCount; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const a = rng() * (isDark ? 0.05 : 0.03);
    ctx.fillStyle = isDark ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  if (!isDark && paper.id !== "blank") {
    for (let i = 0; i < 3000; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const a = rng() * 0.012;
      const size = rng() * 2 + 0.5;
      ctx.fillStyle = `rgba(120,110,90,${a})`;
      ctx.fillRect(x, y, size, size);
    }
  }

  if (["ruled", "college", "aged"].includes(paper.id)) {
    for (let y = 60; y < h; y += lineHeight) {
      ctx.strokeStyle = paper.lineColor;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.7 + rng() * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
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
    ctx.globalAlpha = 0.6;
    const mx = isRTL ? w - marginLeft + 10 : marginLeft - 10;
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, h);
    ctx.stroke();
    ctx.globalAlpha = 1;
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

  const leftGrad = ctx.createLinearGradient(0, 0, 12, 0);
  leftGrad.addColorStop(0, isDark ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)");
  leftGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, 12, h);

  const edgeGrad = isRTL
    ? ctx.createLinearGradient(0, 0, 12, 0)
    : ctx.createLinearGradient(w - 12, 0, w, 0);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, isDark ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(isRTL ? 0 : w - 12, 0, 12, h);

  const bottomGrad = ctx.createLinearGradient(0, h - 12, 0, h);
  bottomGrad.addColorStop(0, "rgba(0,0,0,0)");
  bottomGrad.addColorStop(1, isDark ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.06)");
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, h - 12, w, 12);
}

export function drawText(ctx, w, h, options) {
  const { text, font, paper, ink, fontSize, lineHeight, wobble, letterSpacing, inkWeight, marginLeft, seed, isRTL } = options;
  const rng = seededRandom(seed);
  const inkColor = paper.inkColor || ink.color;
  const inkRgb = hexToRgb(inkColor);
  const weight = inkWeight || 0.65;
  const pad = 40;
  const startX = isRTL ? (paper.margin ? w - marginLeft : w - pad) : (paper.margin ? marginLeft : pad);
  const startY = 58;
  const limitX = isRTL ? pad : w - pad;
  const tokens = tokenize(text);

  ctx.textBaseline = "alphabetic";

  let cx = startX;
  let cy = startY;
  let lineIdx = 0;
  let charIdx = 0;
  let totalChars = 0;

  const lineSlopes = [];
  const lineDriftPhases = [];
  const lineInkFade = [];
  const slopeRng = seededRandom(seed + 200);
  for (let i = 0; i < 50; i++) {
    lineSlopes.push((slopeRng() - 0.5) * 0.008 * wobble);
    lineDriftPhases.push(slopeRng() * Math.PI * 2);
    lineInkFade.push(0.92 + slopeRng() * 0.08);
  }

  function getBaselineDrift(charPos, line) {
    const phase = lineDriftPhases[line % 50] || 0;
    const drift1 = Math.sin(charPos * 0.08 + phase) * wobble * 1.2;
    const drift2 = Math.sin(charPos * 0.03 + phase * 1.7) * wobble * 0.6;
    return drift1 + drift2;
  }

  function getLineSlope(line) {
    return lineSlopes[line % 50] || 0;
  }

  function drawChar(ch, x, y, sz, rot, alpha, isWord) {
    const varied = varyInk(inkRgb, rng, 18);
    const col = `rgb(${varied[0]|0},${varied[1]|0},${varied[2]|0})`;

    const fadeProgress = (totalChars % 80) / 80;
    const inkFade = lineInkFade[lineIdx % 50] - fadeProgress * 0.08;
    const finalAlpha = alpha * Math.max(0.65, inkFade) * weight;

    const pressure = 0.5 + rng() * 0.5;
    const blur = 0.1 + pressure * wobble * 0.2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    ctx.font = `${sz}px '${font}', cursive, sans-serif`;
    ctx.textAlign = isWord && isRTL ? "right" : "left";

    ctx.fillStyle = col;
    ctx.globalAlpha = finalAlpha * 0.25;
    ctx.shadowColor = col;
    ctx.shadowBlur = blur + 0.8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(ch, 0, 0);

    ctx.shadowBlur = blur * 0.3;
    ctx.globalAlpha = finalAlpha * 0.75;
    ctx.fillText(ch, 0, 0);

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = finalAlpha * 0.1;
    const ox = (rng() - 0.5) * 0.6;
    const oy = (rng() - 0.5) * 0.6;
    ctx.fillText(ch, ox, oy);

    ctx.restore();
  }

  tokens.forEach((token) => {
    if (token === "\n") {
      cx = startX;
      cy += lineHeight;
      lineIdx++;
      charIdx = 0;
      return;
    }

    if (/^\s+$/.test(token)) {
      const spaceW = fontSize * (0.35 + rng() * 0.1);
      cx += isRTL ? -spaceW : spaceW;
      charIdx += 1;
      totalChars += 1;
      return;
    }

    ctx.font = `${fontSize}px '${font}', cursive, sans-serif`;
    const wordW = ctx.measureText(token).width + token.length * letterSpacing;

    if (isRTL) {
      if (cx - wordW < limitX && cx < startX) { cx = startX; cy += lineHeight; lineIdx++; charIdx = 0; }
    } else {
      if (cx + wordW > limitX && cx > startX) { cx = startX; cy += lineHeight; lineIdx++; charIdx = 0; }
    }

    if (cy > h - 30) return;

    const slope = getLineSlope(lineIdx);
    const wordSzVariation = (rng() - 0.5) * wobble * 0.8;

    if (isRTL) {
      const sz = fontSize + wordSzVariation;
      const drift = getBaselineDrift(charIdx, lineIdx);
      const slopeOffset = (startX - cx) * slope;
      const rot = (rng() - 0.5) * wobble * 0.012;
      const alpha = 0.75 + rng() * 0.2;

      ctx.font = `${sz}px '${font}', cursive, sans-serif`;
      const mw = ctx.measureText(token).width;

      drawChar(token, cx, cy + drift + slopeOffset, sz, rot, alpha, true);

      cx -= mw + letterSpacing * token.length + fontSize * 0.3;
      charIdx += token.length;
      totalChars += token.length;
      for (let i = 0; i < token.length; i++) { rng(); }
    } else {
      let prevDrift = getBaselineDrift(charIdx, lineIdx);

      for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        const sz = fontSize + wordSzVariation + (rng() - 0.5) * wobble * 0.6;
        const drift = getBaselineDrift(charIdx + i, lineIdx);
        const smoothDrift = prevDrift * 0.3 + drift * 0.7;
        prevDrift = smoothDrift;

        const xFromStart = cx - startX;
        const slopeOffset = xFromStart * slope;

        const rot = (rng() - 0.5) * wobble * 0.012;
        const alpha = 0.7 + rng() * 0.2;

        ctx.font = `${sz}px '${font}', cursive, sans-serif`;
        const cw = ctx.measureText(ch).width;

        drawChar(ch, cx, cy + smoothDrift + slopeOffset, sz, rot, alpha, false);

        const microShift = (rng() - 0.5) * wobble * 0.3;
        cx += cw + letterSpacing + microShift;
        totalChars++;
      }
      charIdx += token.length;
      cx += fontSize * 0.25 + (rng() - 0.5) * wobble * 0.5;
    }
  });
}
