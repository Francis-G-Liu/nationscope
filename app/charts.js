/* NationScope charts — hand-rolled SVG, no library. */

function fmtCompact(v) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "k";
  return String(v);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Horizontal bar chart. items: [{label, value, highlight}]. */
function barChart(items, opts) {
  opts = opts || {};
  var width = opts.width || 640;
  var rowH = opts.rowH || 30;
  var labelW = opts.labelW || 130;
  var height = items.length * rowH + 14;
  var max = 0;
  for (var i = 0; i < items.length; i++) if (items[i].value > max) max = items[i].value;
  var plotW = width - labelW - 70;
  var out = [];
  out.push('<svg class="chart" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart">');
  for (var j = 0; j < items.length; j++) {
    var it = items[j];
    var y = 7 + j * rowH;
    var bw = Math.max(2, Math.round((it.value / max) * plotW));
    var cls = it.highlight ? "bar hl" : "bar";
    out.push('<text class="bar-label" x="0" y="' + (y + 15) + '">' + esc(it.label) + '</text>');
    out.push('<rect class="' + cls + '" x="' + labelW + '" y="' + y + '" width="' + bw + '" height="18" rx="3"/>');
    out.push('<text class="bar-label" x="' + (labelW + bw + 6) + '" y="' + (y + 15) + '">' + esc(it.format || fmtCompact(it.value)) + '</text>');
  }
  out.push("</svg>");
  return out.join("");
}

/* Line chart. points: [{x (label), y (number)}]. */
function lineChart(points, opts) {
  opts = opts || {};
  var width = opts.width || 640;
  var height = opts.height || 260;
  var padL = 46, padR = 14, padT = 14, padB = 30;
  var ys = points.map(function (p) { return p.y; });
  var min = Math.min.apply(null, ys);
  var max = Math.max.apply(null, ys);
  var span = max - min;
  if (span === 0) span = 1;
  min = min - span * 0.15;
  max = max + span * 0.15;
  var plotW = width - padL - padR;
  var plotH = height - padT - padB;
  function X(i) { return padL + (i / (points.length - 1)) * plotW; }
  function Y(v) { return padT + (1 - (v - min) / (max - min)) * plotH; }
  var out = [];
  out.push('<svg class="chart" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Line chart">');
  var ticks = 4;
  for (var t = 0; t <= ticks; t++) {
    var tv = min + ((max - min) * t) / ticks;
    var ty = Y(tv);
    out.push('<line class="gridline" x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (width - padR) + '" y2="' + ty.toFixed(1) + '"/>');
    out.push('<text class="tick" x="' + (padL - 6) + '" y="' + (ty + 4).toFixed(1) + '" text-anchor="end">' + esc(opts.tickFormat ? opts.tickFormat(tv) : tv.toFixed(0)) + '</text>');
  }
  var d = points.map(function (p, i) {
    return (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(p.y).toFixed(1);
  }).join(" ");
  out.push('<path class="line" d="' + d + '"/>');
  for (var i2 = 0; i2 < points.length; i2++) {
    out.push('<circle class="dot" cx="' + X(i2).toFixed(1) + '" cy="' + Y(points[i2].y).toFixed(1) + '" r="4.5"><title>' + esc(points[i2].x + ": " + points[i2].label) + '</title></circle>');
    out.push('<text class="tick" x="' + X(i2).toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle">' + esc(points[i2].x) + '</text>');
  }
  out.push("</svg>");
  return out.join("");
}
