// Renders the glyph of `el` (an inline-block span with line-height 1) to a canvas
// and flood-fills its counter, so the inside of the "O" can be used as a CSS mask.
// Returns the mask as a data URL plus the counter's bounding box (0–1 of the span box).
export function counterMask(el, fontPx = 600) {
  const cs = getComputedStyle(el);
  const k = fontPx / parseFloat(cs.fontSize);
  const W = Math.ceil(el.offsetWidth * k);
  const H = Math.ceil(el.offsetHeight * k);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = `${cs.fontWeight} ${fontPx}px ${cs.fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  const ch = el.firstChild.textContent;
  const m = ctx.measureText(ch);
  const base = (H - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  ctx.fillText(ch, 0, base);

  const ink = ctx.getImageData(0, 0, W, H).data;
  const cx = Math.round((m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2);
  const cy = Math.round(base - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);

  // Flood fill the empty pixels connected to the glyph centre
  const filled = new Uint8Array(W * H);
  const stack = [cy * W + cx];
  let count = 0;
  while (stack.length) {
    const p = stack.pop();
    if (filled[p] || ink[p * 4 + 3] > 110) continue;
    filled[p] = 1;
    count++;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < W * (H - 1)) stack.push(p + W);
  }

  let mask = filled;
  if (count === 0 || count > W * H * 0.4) {
    // The fill escaped (font not ready / open glyph): fall back to an ellipse
    mask = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = (x - cx) / (W * 0.27), dy = (y - cy) / (fontPx * 0.27);
      if (dx * dx + dy * dy <= 1) mask[y * W + x] = 1;
    }
  } else {
    // Grow the counter a few pixels so its edge tucks under the glyph's stroke
    mask = dilate(filled, W, H, 4);
  }

  const out = ctx.createImageData(W, H);
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let p = 0; p < W * H; p++) {
    if (!mask[p]) continue;
    out.data[p * 4] = out.data[p * 4 + 1] = out.data[p * 4 + 2] = 255;
    out.data[p * 4 + 3] = 255;
    const x = p % W, y = (p / W) | 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  ctx.clearRect(0, 0, W, H);
  ctx.putImageData(out, 0, 0);
  return { url: canvas.toDataURL('image/png'), box: { x0: x0 / W, y0: y0 / H, x1: x1 / W, y1: y1 / H } };
}

function dilate(src, W, H, r) {
  const tmp = new Uint8Array(W * H);
  const dst = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!src[y * W + x]) continue;
    for (let d = Math.max(0, x - r); d <= Math.min(W - 1, x + r); d++) tmp[y * W + d] = 1;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!tmp[y * W + x]) continue;
    for (let d = Math.max(0, y - r); d <= Math.min(H - 1, y + r); d++) dst[d * W + x] = 1;
  }
  return dst;
}
