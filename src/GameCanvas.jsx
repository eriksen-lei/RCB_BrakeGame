import { useEffect, useRef } from 'react';

const LW = 1280;
const LH = 720;

const STATE = {
  DEMO: 'demo',
  STANDBY: 'standby',
  STAGING: 'staging',
  PLAYING: 'playing',
  RESULT: 'result',
};

const STATE_LABEL = {
  [STATE.DEMO]: '演示',
  [STATE.STANDBY]: '待机',
  [STATE.STAGING]: '预备',
  [STATE.PLAYING]: '制动',
  [STATE.RESULT]: '结果',
};

export const DEFAULT_TUNING = {
  targetStartMinPct: 34,
  targetStartMaxPct: 82,
  stagingMinSec: 1.4,
  stagingMaxSec: 3.8,
  practiceWidth: 34,
  challengeWidth: 20,
  extremeWidth: 11,
  practiceHoldMs: 1450,
  challengeHoldMs: 1900,
  extremeHoldMs: 2200,
  practiceTimeLimit: 0,
  challengeTimeLimit: 8.2,
  extremeTimeLimit: 6.8,
};

const C = {
  bg: '#030208',
  line: 'rgba(40,244,255,0.26)',
  text: '#f8fbff',
  muted: '#9ba7b9',
  dim: '#596275',
  red: '#ff1744',
  magenta: '#ff2bd6',
  cyan: '#28f4ff',
  green: '#30ff95',
  amber: '#ffd166',
  steel: '#aab7d4',
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(current, target, speed, dt) {
  return lerp(current, target, Math.min(1, speed * dt));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function pathFromPoints(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function textC(ctx, text, x, y, color, size, font = '"Orbitron","Share Tech Mono","Microsoft YaHei",sans-serif') {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function textL(ctx, text, x, y, color, size, font = '"Orbitron","Share Tech Mono","Microsoft YaHei",sans-serif') {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}

function textR(ctx, text, x, y, color, size, font = '"Orbitron","Share Tech Mono","Microsoft YaHei",sans-serif') {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function panel(ctx, x, y, w, h, r = 8, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(19, 22, 45, 0.88)');
  grad.addColorStop(1, 'rgba(4, 5, 14, 0.84)');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.stroke();
  ctx.restore();
}

function getDifficultySpec(difficulty, tuning) {
  if (difficulty === '练习') {
    return {
      width: tuning.practiceWidth,
      holdMs: tuning.practiceHoldMs,
      timeLimit: tuning.practiceTimeLimit,
    };
  }
  if (difficulty === '极限') {
    return {
      width: tuning.extremeWidth,
      holdMs: tuning.extremeHoldMs,
      timeLimit: tuning.extremeTimeLimit,
    };
  }
  return {
    width: tuning.challengeWidth,
    holdMs: tuning.challengeHoldMs,
    timeLimit: tuning.challengeTimeLimit,
  };
}

function createGame(difficulty) {
  return {
    state: STATE.STANDBY,
    difficulty,
    brakeValue: 0,
    targetMin: 0.42,
    targetMax: 0.62,
    signalTime: 0,
    reactionMs: 0,
    stableMs: 0,
    score: 0,
    reacted: false,
    inZone: false,
    zoneEnterT: 0,
    totalTests: 0,
    bestReaction: Infinity,
    bestScore: 0,
    streak: 0,
    stagingStart: 0,
    holdStart: 0,
    holdDur: 0,
    stagingPhase: 'lights',
    resultStart: 0,
    demoPhase: 0,
    demoPhaseT: 0,
    demoStagingStart: 0,
    flash: 0,
    shake: 0,
    hitPulse: 0,
    traceStart: 0,
    brakeTrace: [],
    lastSnapshotAt: 0,
    hudIntro: 0,
    speedFx: 0.18,
    decelBlur: 0,
    camJolt: 0,
    prevBrakeValue: 0,
  };
}

function resetTrace(game, now) {
  game.traceStart = now;
  game.brakeTrace = [{ t: 0, v: game.brakeValue }];
}

function recordTrace(game, now) {
  if (!game.traceStart) game.traceStart = now;
  const elapsed = Math.max(0, now - game.traceStart);
  const last = game.brakeTrace[game.brakeTrace.length - 1];
  if (!last || elapsed - last.t > 0.045 || Math.abs(last.v - game.brakeValue) > 0.018) {
    game.brakeTrace.push({ t: elapsed, v: game.brakeValue });
    if (game.brakeTrace.length > 180) game.brakeTrace.shift();
  }
}

function startDemo(game, now) {
  game.state = STATE.DEMO;
  game.demoPhase = 0;
  game.demoPhaseT = now;
  game.demoStagingStart = 0;
  game.brakeValue = 0;
  game.targetMin = 0.42;
  game.targetMax = 0.58;
  game.inZone = false;
  game.stableMs = 0;
  game.hudIntro = 0;
  resetTrace(game, now);
}

function startStaging(game, now, tuning) {
  game.state = STATE.STAGING;
  game.stagingStart = now;
  game.holdStart = 0;
  const minHold = Math.max(0.6, tuning.stagingMinSec);
  const maxHold = Math.max(minHold + 0.1, tuning.stagingMaxSec);
  game.holdDur = minHold + Math.random() * (maxHold - minHold);
  game.stagingPhase = 'lights';
  game.flash = 0;
  resetTrace(game, now);
}

function startPlaying(game, now, tuning) {
  const diff = getDifficultySpec(game.difficulty, tuning);
  const minTargetPct = clamp(Math.round(tuning.targetStartMinPct), 30, 88);
  const maxTargetPct = clamp(Math.round(tuning.targetStartMaxPct), minTargetPct + diff.width, 95);
  const maxStartPct = Math.max(minTargetPct, maxTargetPct - diff.width);
  const targetStartPct = Math.floor(Math.random() * (maxStartPct - minTargetPct + 1)) + minTargetPct;

  game.targetMin = targetStartPct / 100;
  game.targetMax = (targetStartPct + diff.width) / 100;
  game.signalTime = now;
  game.reacted = false;
  game.inZone = false;
  game.zoneEnterT = 0;
  game.reactionMs = 0;
  game.stableMs = 0;
  game.brakeValue = 0;
  game.state = STATE.PLAYING;
  game.flash = 1;
  game.shake = 12;
  game.camJolt = 8;
  resetTrace(game, now);
}

function showResult(game, now, tuning) {
  game.resultStart = now;
  game.state = STATE.RESULT;
  game.totalTests += 1;

  if (game.reactionMs > 0) {
    if (game.reactionMs < game.bestReaction) game.bestReaction = game.reactionMs;
    const diff = getDifficultySpec(game.difficulty, tuning);
    const accuracy = game.inZone ? 1 : 0;
    const reactionScore = Math.max(0, 430 - game.reactionMs) * 1.8;
    const holdScore = Math.min(game.stableMs, diff.holdMs) * 0.46;
    const streakBonus = game.inZone ? Math.min(game.streak, 6) * 42 : 0;
    game.score = Math.floor((reactionScore + holdScore + streakBonus) * accuracy);
    if (game.inZone) game.streak += 1;
    else game.streak = 0;
  } else {
    game.score = 0;
    game.streak = 0;
  }

  game.bestScore = Math.max(game.bestScore, game.score);
}

function drawBackground(ctx, game, t, logo) {
  const sky = ctx.createLinearGradient(0, 0, 0, LH);
  sky.addColorStop(0, '#130f25');
  sky.addColorStop(0.45, '#070813');
  sky.addColorStop(1, '#020208');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, LW, LH);

  const halo = ctx.createRadialGradient(640, 170, 18, 640, 170, 700);
  halo.addColorStop(0, 'rgba(40,244,255,0.16)');
  halo.addColorStop(0.3, 'rgba(255,43,214,0.08)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, LW, LH);

  ctx.save();
  ctx.fillStyle = 'rgba(3,5,15,0.96)';
  ctx.fillRect(0, 166, LW, 140);
  for (let i = 0; i < 38; i += 1) {
    const x = i * 38 - 24;
    const h = 26 + ((i * 53) % 96);
    ctx.fillStyle = i % 4 === 0 ? 'rgba(16,24,46,0.94)' : 'rgba(8,12,28,0.96)';
    ctx.fillRect(x, 226 - h, 22 + (i % 5) * 10, h + 120);
    if (i % 2 === 0) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255,43,214,0.34)' : 'rgba(40,244,255,0.26)';
      ctx.fillRect(x + 6, 236 - h, 2, h * 0.7);
    }
  }
  ctx.restore();

  if (logo.complete && logo.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(logo, 920, 72, 220, 158);
    ctx.restore();
  }

  const road = ctx.createLinearGradient(0, 238, 0, LH);
  road.addColorStop(0, '#171b2a');
  road.addColorStop(0.5, '#090b14');
  road.addColorStop(1, '#030309');
  ctx.fillStyle = road;
  ctx.beginPath();
  ctx.moveTo(188, LH);
  ctx.lineTo(530, 246);
  ctx.lineTo(750, 246);
  ctx.lineTo(1092, LH);
  ctx.closePath();
  ctx.fill();

  const shoulderGlow = ctx.createLinearGradient(0, 246, 0, LH);
  shoulderGlow.addColorStop(0, 'rgba(40,244,255,0.04)');
  shoulderGlow.addColorStop(1, 'rgba(255,43,214,0.16)');
  ctx.strokeStyle = shoulderGlow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(530, 246);
  ctx.lineTo(188, LH);
  ctx.moveTo(750, 246);
  ctx.lineTo(1092, LH);
  ctx.stroke();

  drawRoadFlow(ctx, game, t);
  drawSpeedSmear(ctx, game, t);
}

function drawRoadFlow(ctx, game, t) {
  const flow = (t * (0.14 + game.speedFx * 0.72)) % 1;
  const brakeSmear = game.decelBlur;

  ctx.save();
  ctx.lineCap = 'round';

  for (let i = 0; i < 28; i += 1) {
    const p = ((i / 28) + flow) % 1;
    const depth = Math.pow(p, 1.55);
    const y = 250 + depth * 470;
    const laneHalf = lerp(72, 470, depth);
    const innerGap = lerp(42, 132, depth);
    const dashLen = lerp(10, 148, depth);
    const brightness = 0.08 + depth * 0.56 + game.speedFx * 0.04;

    ctx.strokeStyle = `rgba(40,244,255,${brightness})`;
    ctx.shadowColor = C.cyan;
    ctx.shadowBlur = 8 + depth * 14;
    ctx.lineWidth = lerp(1.5, 7.5, depth);
    ctx.beginPath();
    ctx.moveTo(640 - innerGap - dashLen, y);
    ctx.lineTo(640 - innerGap + brakeSmear * 18, y + depth * 30 + brakeSmear * 8);
    ctx.moveTo(640 + innerGap - brakeSmear * 18, y + depth * 30 + brakeSmear * 8);
    ctx.lineTo(640 + innerGap + dashLen, y);
    ctx.stroke();

    if (i % 2 === 0) {
      ctx.strokeStyle = `rgba(255,43,214,${brightness * 0.58})`;
      ctx.shadowColor = C.magenta;
      ctx.beginPath();
      ctx.moveTo(640 - laneHalf, y);
      ctx.lineTo(640 - laneHalf + dashLen * 0.38, y - depth * 20 - brakeSmear * 4);
      ctx.moveTo(640 + laneHalf, y);
      ctx.lineTo(640 + laneHalf - dashLen * 0.38, y - depth * 20 - brakeSmear * 4);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i += 1) {
    const p = i / 14;
    const y = 262 + Math.pow(p, 1.4) * 448;
    const half = lerp(110, 515, p);
    ctx.beginPath();
    ctx.moveTo(640 - half, y);
    ctx.lineTo(640 + half, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSpeedSmear(ctx, game, t) {
  const smear = clamp(game.decelBlur * 0.9 + Math.max(0, game.speedFx - 0.85) * 0.32, 0, 1);
  if (smear < 0.04) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 18; i += 1) {
    const x = i * 78 + ((t * 120 + i * 37) % 70);
    const len = 90 + (i % 5) * 26 + smear * 120;
    const alpha = 0.03 + smear * 0.1;
    const grad = ctx.createLinearGradient(x, 0, x + len, LH);
    grad.addColorStop(0, `rgba(40,244,255,0)`);
    grad.addColorStop(0.45, `rgba(40,244,255,${alpha})`);
    grad.addColorStop(1, `rgba(255,43,214,0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1 + smear * 3;
    ctx.beginPath();
    ctx.moveTo(x, 214 + (i % 3) * 24);
    ctx.lineTo(x + len, LH);
    ctx.stroke();
  }

  const edgeGlowLeft = ctx.createRadialGradient(-40, 520, 60, -40, 520, 340);
  edgeGlowLeft.addColorStop(0, `rgba(40,244,255,${smear * 0.08})`);
  edgeGlowLeft.addColorStop(1, 'rgba(40,244,255,0)');
  ctx.fillStyle = edgeGlowLeft;
  ctx.fillRect(0, 220, 300, 420);

  const edgeGlowRight = ctx.createRadialGradient(LW + 40, 520, 60, LW + 40, 520, 340);
  edgeGlowRight.addColorStop(0, `rgba(255,43,214,${smear * 0.08})`);
  edgeGlowRight.addColorStop(1, 'rgba(255,43,214,0)');
  ctx.fillStyle = edgeGlowRight;
  ctx.fillRect(LW - 300, 220, 300, 420);
  ctx.restore();
}

function drawHandlebars(ctx, game, t) {
  const brake = clamp(game.brakeValue, 0, 1);
  const sway = Math.sin(t * 2.2) * 4 + Math.sin(t * 0.8) * 3;
  const forkGlow = 0.22 + brake * 0.2;

  ctx.save();
  ctx.translate(sway, 0);

  const shadow = ctx.createRadialGradient(640, 690, 10, 640, 690, 360);
  shadow.addColorStop(0, 'rgba(0,0,0,0.5)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(180, 420, 920, 300);

  const glass = [
    [490, 408],
    [790, 408],
    [846, 586],
    [434, 586],
  ];
  const glassFill = ctx.createLinearGradient(0, 408, 0, 586);
  glassFill.addColorStop(0, 'rgba(190,245,255,0.06)');
  glassFill.addColorStop(1, 'rgba(40,244,255,0.015)');
  ctx.fillStyle = glassFill;
  pathFromPoints(ctx, glass);
  ctx.fill();
  ctx.strokeStyle = 'rgba(190,245,255,0.12)';
  ctx.lineWidth = 2;
  pathFromPoints(ctx, glass);
  ctx.stroke();

  function drawTube(points, glowColor) {
    const grad = ctx.createLinearGradient(points[0][0], points[0][1], points[2][0], points[2][1]);
    grad.addColorStop(0, '#4d5568');
    grad.addColorStop(0.45, '#dae3f5');
    grad.addColorStop(1, '#364052');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.bezierCurveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawTube([[252, 710], [292, 626], [372, 560], [512, 548]], `rgba(40,244,255,${forkGlow})`);
  drawTube([[1028, 710], [988, 626], [908, 560], [768, 548]], `rgba(255,43,214,${forkGlow})`);

  const forkGrad = ctx.createLinearGradient(0, 470, 0, 720);
  forkGrad.addColorStop(0, '#d7e4f7');
  forkGrad.addColorStop(0.5, '#6a7489');
  forkGrad.addColorStop(1, '#2a3242');
  ctx.strokeStyle = forkGrad;
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(528, 706);
  ctx.lineTo(590, 530);
  ctx.moveTo(752, 706);
  ctx.lineTo(690, 530);
  ctx.stroke();

  function grip(x, y, angle, side) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const gripGrad = ctx.createLinearGradient(-58, 0, 40, 0);
    gripGrad.addColorStop(0, '#07090f');
    gripGrad.addColorStop(0.5, '#151b24');
    gripGrad.addColorStop(1, '#0a0d14');
    ctx.fillStyle = gripGrad;
    roundRect(ctx, side === 'left' ? -62 : -4, -18, 66, 36, 12);
    ctx.fill();

    ctx.strokeStyle = 'rgba(40,244,255,0.26)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i += 1) {
      const gx = side === 'left' ? -54 + i * 11 : 4 + i * 11;
      ctx.beginPath();
      ctx.moveTo(gx, -14);
      ctx.lineTo(gx, 14);
      ctx.stroke();
    }

    ctx.fillStyle = '#111727';
    ctx.beginPath();
    ctx.arc(side === 'left' ? 10 : -10, -14, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#bac8dc';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (side === 'left') {
      ctx.moveTo(6, -10);
      ctx.quadraticCurveTo(78, 8 + brake * 16, 92, 42 + brake * 18);
    } else {
      ctx.moveTo(-6, -10);
      ctx.quadraticCurveTo(-78, 8 + brake * 18, -96, 44 + brake * 20);
    }
    ctx.stroke();
    ctx.restore();
  }

  grip(462, 546, -0.2 + brake * 0.03, 'left');
  grip(818, 546, 0.2 - brake * 0.05, 'right');

  const clampGrad = ctx.createLinearGradient(0, 0, 0, 70);
  clampGrad.addColorStop(0, '#c8d5ea');
  clampGrad.addColorStop(0.45, '#697487');
  clampGrad.addColorStop(1, '#242c3b');
  ctx.fillStyle = clampGrad;
  roundRect(ctx, 550, 532, 180, 76, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, 550.5, 532.5, 179, 75, 18);
  ctx.stroke();

  ctx.fillStyle = 'rgba(10,14,24,0.95)';
  roundRect(ctx, 594, 546, 92, 38, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(40,244,255,0.4)';
  ctx.stroke();
  textC(ctx, 'RCB', 640, 565, C.cyan, 18, '"Orbitron","Bahnschrift",sans-serif');

  ctx.restore();
}

function drawBrakeSparks(ctx, game, t) {
  const brake = clamp(game.brakeValue, 0, 1);
  if (brake < 0.16) return;
  if (![STATE.STAGING, STATE.PLAYING, STATE.DEMO].includes(game.state)) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.lineCap = 'round';
  const count = 18 + Math.floor(brake * 34);
  const anchors = [
    { x: 566, y: 608, dir: -1 },
    { x: 714, y: 608, dir: 1 },
  ];

  anchors.forEach((anchor, anchorIndex) => {
    for (let i = 0; i < count; i += 1) {
      const seed = Math.sin((anchorIndex + 1) * 97.1 + i * 13.3 + Math.floor(t * 30) * 0.61) * 10000;
      const rnd = seed - Math.floor(seed);
      const spread = 10 + rnd * 26;
      const len = 12 + rnd * 24 + brake * 20;
      const tilt = (0.18 + rnd * 0.28) * anchor.dir;
      const sx = anchor.x + anchor.dir * spread;
      const sy = anchor.y + rnd * 12;
      const ex = sx + anchor.dir * (16 + rnd * 26);
      const ey = sy + len;
      const alpha = clamp(0.34 + brake * 0.72 - (i / count) * 0.26, 0, 1);

      ctx.strokeStyle = i % 4 === 0
        ? `rgba(255,255,255,${alpha})`
        : `rgba(255,209,102,${alpha})`;
      ctx.shadowColor = i % 4 === 0 ? C.text : C.amber;
      ctx.shadowBlur = 10 + brake * 18;
      ctx.lineWidth = 1.2 + rnd * 2.2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex + tilt * 24, ey);
      ctx.stroke();

      if (i % 5 === 0) {
        ctx.fillStyle = `rgba(255,221,140,${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(sx + anchor.dir * (4 + rnd * 10), sy + 6 + rnd * 12, 1.2 + rnd * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  ctx.restore();
}

function drawHudArc(ctx, value) {
  const start = Math.PI * 0.76;
  const end = Math.PI * 2.24;
  const radius = 72;
  const arcEnd = start + (end - start) * clamp(value, 0, 1);

  ctx.save();
  ctx.translate(432, 192);
  ctx.strokeStyle = 'rgba(40,244,255,0.16)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(0, 0, radius, start, end);
  ctx.stroke();

  const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  grad.addColorStop(0, C.cyan);
  grad.addColorStop(0.5, C.magenta);
  grad.addColorStop(1, C.red);
  ctx.strokeStyle = grad;
  ctx.shadowColor = value > 0.7 ? C.red : C.cyan;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, 0, radius, start, arcEnd);
  ctx.stroke();
  ctx.shadowBlur = 0;

  textC(ctx, `${Math.round(value * 100)}`, 0, 6, C.text, 42);
  textC(ctx, 'BRAKE', 0, 40, C.muted, 12, '"Share Tech Mono","Bahnschrift",sans-serif');
  ctx.restore();
}

function drawHudCurve(ctx, game, x, y, w, h, tuning, options = {}) {
  const { compact = false } = options;
  const diff = getDifficultySpec(game.difficulty, tuning);
  ctx.save();
  roundRect(ctx, x, y, w, h, 12);
  ctx.clip();
  ctx.fillStyle = 'rgba(5,9,18,0.34)';
  ctx.fillRect(x, y, w, h);

  if (game.targetMax > game.targetMin) {
    const ty = y + (1 - game.targetMax) * h;
    const th = (game.targetMax - game.targetMin) * h;
    ctx.fillStyle = 'rgba(48,255,149,0.12)';
    ctx.fillRect(x, ty, w, th);
  }

  ctx.strokeStyle = 'rgba(40,244,255,0.1)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    const gy = y + (h * i) / 5;
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
    ctx.stroke();
  }

  const samples = game.brakeTrace.length ? game.brakeTrace : [{ t: 0, v: game.brakeValue }];
  const targetWindow = game.state === STATE.RESULT
    ? Math.max(samples[samples.length - 1].t, diff.timeLimit || 4.5, 4.5)
    : Math.max(samples[samples.length - 1].t, diff.timeLimit || 3.6, 3.6);
  const maxT = Math.max(3, targetWindow);
  ctx.strokeStyle = C.cyan;
  ctx.shadowColor = C.cyan;
  ctx.shadowBlur = 12;
  ctx.lineWidth = compact ? 2.5 : 3;
  ctx.beginPath();
  samples.forEach((sample, index) => {
    const px = x + (sample.t / maxT) * w;
    const py = y + (1 - sample.v) * h;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  if (!compact) {
    const last = samples[samples.length - 1];
    ctx.fillStyle = C.text;
    ctx.beginPath();
    ctx.arc(x + (last.t / maxT) * w, y + (1 - last.v) * h, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (!compact) {
    textL(ctx, '0 s', x, y + h + 10, C.dim, 11, '"Share Tech Mono","Bahnschrift",sans-serif');
    textR(ctx, `${maxT.toFixed(1)} s`, x + w, y + h + 10, C.dim, 11, '"Share Tech Mono","Bahnschrift",sans-serif');
  }
}

function drawProjectedHud(ctx, game, tuning, t) {
  const intro = game.hudIntro;
  if (intro < 0.02) return;

  const diff = getDifficultySpec(game.difficulty, tuning);
  const alpha = intro * 0.96;
  const offsetY = lerp(36, 0, intro);
  const scale = lerp(0.92, 1, intro);
  const hint = game.state === STATE.STAGING
    ? (game.stagingPhase === 'lights' ? '预备' : '等待')
    : game.state === STATE.PLAYING
      ? (game.brakeValue < game.targetMin ? '加压' : game.brakeValue > game.targetMax ? '回收' : '保持')
      : game.state === STATE.RESULT
        ? '成绩'
        : '演示';

  ctx.save();
  ctx.translate(0, offsetY);
  ctx.translate(640, 170);
  ctx.scale(scale, scale);
  ctx.translate(-640, -170);
  ctx.globalAlpha = alpha;

  panel(ctx, 318, 108, 644, 182, 12, 0.58);

  textC(ctx, hint, 640, 118, game.state === STATE.RESULT ? C.amber : C.cyan, 15, '"Share Tech Mono","Bahnschrift",sans-serif');
  textC(ctx, game.difficulty, 640, 142, C.muted, 13, '"Share Tech Mono","Bahnschrift",sans-serif');

  drawHudArc(ctx, game.brakeValue);

  const rangeX = 506;
  const rangeY = 160;
  const rangeW = 294;
  const rangeH = 26;
  ctx.fillStyle = 'rgba(7,12,22,0.4)';
  roundRect(ctx, rangeX, rangeY, rangeW, rangeH, 12);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.stroke();
  const targetX = rangeX + game.targetMin * rangeW;
  const targetW = (game.targetMax - game.targetMin) * rangeW;
  ctx.fillStyle = 'rgba(48,255,149,0.16)';
  roundRect(ctx, targetX, rangeY + 3, targetW, rangeH - 6, 10);
  ctx.fill();

  const markerX = rangeX + rangeW * clamp(game.brakeValue, 0, 1);
  ctx.shadowColor = game.brakeValue >= game.targetMin && game.brakeValue <= game.targetMax ? C.green : C.amber;
  ctx.shadowBlur = 18;
  ctx.fillStyle = C.text;
  roundRect(ctx, markerX - 4, rangeY - 8, 8, rangeH + 16, 4);
  ctx.fill();
  ctx.shadowBlur = 0;

  textL(ctx, 'TARGET', rangeX, 132, C.dim, 12, '"Share Tech Mono","Bahnschrift",sans-serif');
  textR(ctx, `${Math.round(game.targetMin * 100)}% - ${Math.round(game.targetMax * 100)}%`, rangeX + rangeW, 141, C.amber, 15, '"Orbitron","Bahnschrift",sans-serif');

  const holdRatio = diff.holdMs ? game.stableMs / diff.holdMs : 0;
  ctx.fillStyle = 'rgba(7,12,22,0.34)';
  roundRect(ctx, 520, 214, 252, 12, 6);
  ctx.fill();
  if (holdRatio > 0) {
    const holdGrad = ctx.createLinearGradient(520, 0, 772, 0);
    holdGrad.addColorStop(0, C.green);
    holdGrad.addColorStop(1, C.cyan);
    ctx.fillStyle = holdGrad;
    roundRect(ctx, 520, 214, 252 * clamp(holdRatio, 0, 1), 12, 6);
    ctx.fill();
  }
  textL(ctx, 'HOLD', 520, 230, C.dim, 12, '"Share Tech Mono","Bahnschrift",sans-serif');
  textR(ctx, `${game.stableMs} ms`, 772, 236, game.inZone ? C.green : C.muted, 14, '"Orbitron","Bahnschrift",sans-serif');

  if (diff.timeLimit > 0 && game.state === STATE.PLAYING) {
    const remain = Math.max(0, diff.timeLimit - (t - game.signalTime));
    textC(ctx, `${remain.toFixed(1)} s`, 640, 272, C.text, 22, '"Orbitron","Bahnschrift",sans-serif');
  } else if (game.state === STATE.PLAYING) {
    textC(ctx, '自由保持', 640, 272, C.muted, 16, '"Share Tech Mono","Bahnschrift",sans-serif');
  }

  drawHudCurve(ctx, game, 812, 144, 122, 118, tuning, { compact: true });
  textL(ctx, 'TRACE', 812, 126, C.dim, 12, '"Share Tech Mono","Bahnschrift",sans-serif');
  textR(ctx, game.reacted ? `${game.reactionMs} ms` : '--', 934, 126, C.text, 15, '"Orbitron","Bahnschrift",sans-serif');

  ctx.restore();
}

function drawLights(ctx, game, t) {
  const x0 = 444;
  const y = 318;
  const gap = 98;
  const now = performance.now() / 1000;
  let litCount = 0;

  if (game.state === STATE.DEMO && game.demoPhase === 2) {
    const elapsed = t - game.demoStagingStart;
    litCount = elapsed < 3 ? Math.min(5, Math.floor(elapsed / 0.6) + 1) : elapsed < 4.2 ? 5 : 0;
  } else if (game.state === STATE.STAGING) {
    if (game.stagingPhase === 'lights') litCount = Math.min(5, Math.floor((now - game.stagingStart) / 0.62) + 1);
    else litCount = 5;
  }

  panel(ctx, 374, 254, 532, 118, 14, 0.8);
  ctx.fillStyle = 'rgba(3,4,10,0.92)';
  roundRect(ctx, 396, 274, 488, 76, 10);
  ctx.fill();

  for (let i = 0; i < 5; i += 1) {
    const x = x0 + i * gap;
    const on = i < litCount;
    if (on) {
      const pulse = 0.85 + Math.sin(t * 12 + i) * 0.15;
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 48);
      glow.addColorStop(0, `rgba(255,255,255,${0.82 * pulse})`);
      glow.addColorStop(0.24, `rgba(255,23,68,${0.8 * pulse})`);
      glow.addColorStop(1, 'rgba(255,23,68,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    const lamp = ctx.createRadialGradient(x - 8, y - 8, 2, x, y, 28);
    lamp.addColorStop(0, on ? '#ffffff' : '#3b1514');
    lamp.addColorStop(0.34, on ? '#ff745d' : '#1d0c0b');
    lamp.addColorStop(1, on ? '#8d1612' : '#070707');
    ctx.fillStyle = lamp;
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(248,251,255,0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawLogoTitle(ctx, logoWord) {
  panel(ctx, 404, 42, 472, 110, 14, 0.48);
  if (logoWord.complete && logoWord.naturalWidth > 0) {
    ctx.save();
    ctx.shadowColor = C.red;
    ctx.shadowBlur = 18;
    ctx.drawImage(logoWord, 504, 56, 272, 56);
    ctx.shadowColor = C.cyan;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.32;
    ctx.drawImage(logoWord, 506, 56, 272, 56);
    ctx.restore();
  }
  textC(ctx, '制动控制测试', 640, 122, C.text, 22);
}

function drawStandbyOverlay(ctx, game, assets) {
  drawLogoTitle(ctx, assets.logoWord);
  panel(ctx, 426, 206, 428, 112, 16, 0.74);
  textC(ctx, game.difficulty, 640, 244, C.amber, 28);
  textC(ctx, '按住 SPACE 或点击屏幕进入预备', 640, 286, C.muted, 18);
}

function drawResultOverlay(ctx, game) {
  let grade = 'MISS';
  let color = C.red;
  let sub = '没有稳定进入目标区';
  if (game.score > 740) {
    grade = 'APEX';
    color = C.green;
    sub = '反应干净，制动力控制非常稳';
  } else if (game.score > 430) {
    grade = 'GOOD';
    color = C.amber;
    sub = '节奏已经对了，再压缩一点波动';
  } else if (game.score > 100) {
    grade = 'OK';
    color = C.cyan;
    sub = '已经打进目标区，继续提稳定性';
  }

  panel(ctx, 282, 94, 716, 316, 18, 0.9);
  textC(ctx, grade, 640, 156, color, 86, '"Orbitron","Bahnschrift",sans-serif');
  textC(ctx, sub, 640, 216, C.muted, 20);

  const cards = [
    ['反应', `${game.reactionMs || '--'} ms`, C.cyan],
    ['命中', game.inZone ? 'HIT' : 'MISS', game.inZone ? C.green : C.red],
    ['保持', `${game.stableMs} ms`, C.amber],
    ['得分', String(game.score || 0), C.text],
  ];
  const w = 148;
  const gap = 18;
  const sx = (LW - (w * cards.length + gap * (cards.length - 1))) / 2;
  cards.forEach((card, index) => {
    const x = sx + index * (w + gap);
    panel(ctx, x, 258, w, 98, 12, 0.88);
    ctx.fillStyle = card[2];
    ctx.fillRect(x + 14, 272, w - 28, 3);
    textC(ctx, card[0], x + w / 2, 292, C.dim, 13, '"Share Tech Mono","Bahnschrift",sans-serif');
    textC(ctx, card[1], x + w / 2, 326, card[2], 26);
  });

  textC(ctx, 'ENTER 再来一局    ESC 返回待机', 640, 388, C.dim, 15, '"Share Tech Mono","Bahnschrift",sans-serif');
}

function drawScene(ctx, game, t, assets, tuning) {
  const wobbleX = Math.sin(t * 18) * game.shake * 0.22;
  const wobbleY = Math.cos(t * 14) * game.shake * 0.18 + game.camJolt * 0.6;
  const worldScale = 1 + Math.max(0, game.speedFx - 0.9) * 0.035;

  ctx.save();
  ctx.translate(wobbleX, wobbleY);
  ctx.translate(LW / 2, LH / 2);
  ctx.scale(worldScale, worldScale);
  ctx.translate(-LW / 2, -LH / 2);
  drawBackground(ctx, game, t, assets.logo);
  ctx.restore();

  if (game.state !== STATE.RESULT) {
    drawProjectedHud(ctx, game, tuning, t);
  }
  drawBrakeSparks(ctx, game, t);
  drawHandlebars(ctx, game, t);

  if (game.state === STATE.STANDBY) {
    drawStandbyOverlay(ctx, game, assets);
  }

  if (game.state === STATE.STAGING) {
    drawLights(ctx, game, t);
  }

  if (game.state === STATE.PLAYING) {
    const cue = game.brakeValue < game.targetMin
      ? '继续加压'
      : game.brakeValue > game.targetMax
        ? '轻收一点'
        : '保持住';
    const color = game.brakeValue < game.targetMin
      ? C.cyan
      : game.brakeValue > game.targetMax
        ? C.amber
        : C.green;
    textC(ctx, cue, 640, 446, color, 28);
  }

  if (game.state === STATE.RESULT) {
    drawResultOverlay(ctx, game);
    panel(ctx, 266, 430, 748, 180, 14, 0.88);
    textL(ctx, 'BRAKE CURVE', 300, 450, C.cyan, 14, '"Share Tech Mono","Bahnschrift",sans-serif');
    drawHudCurve(ctx, game, 300, 478, 680, 102, tuning);
  }

  if (game.state === STATE.DEMO) {
    if (game.demoPhase === 0) {
      drawLogoTitle(ctx, assets.logoWord);
      panel(ctx, 342, 224, 596, 208, 16, 0.8);
      ['红灯熄灭后开始制动。', '把制动力压进绿色目标区。', '稳定保持到计量条满格。'].forEach((line, index) => {
        textL(ctx, line, 426, 272 + index * 44, index === 0 ? C.text : C.muted, 20);
      });
    } else if (game.demoPhase === 2) {
      drawLights(ctx, game, t);
    }
  }

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(248,251,255,${game.flash * 0.24})`;
    ctx.fillRect(0, 0, LW, LH);
  }
}

function updateDemo(game, now) {
  const elapsed = now - game.demoPhaseT;
  if (game.demoPhase === 0 && elapsed > 3.2) {
    game.demoPhase = 1;
    game.demoPhaseT = now;
  } else if (game.demoPhase === 1) {
    game.brakeValue = Math.min(0.82, elapsed / 2.2 * 0.82);
    if (elapsed > 3.2) {
      game.demoPhase = 2;
      game.demoPhaseT = now;
      game.demoStagingStart = now;
      game.brakeValue = 0.74;
    }
  } else if (game.demoPhase === 2 && elapsed > 5.2) {
    game.demoPhase = 3;
    game.demoPhaseT = now;
    game.brakeValue = 0;
  } else if (game.demoPhase === 3) {
    const target = 0.5;
    if (elapsed < 0.85) game.brakeValue = Math.min(0.76, elapsed / 0.45 * 0.76);
    else game.brakeValue = target + Math.sin(elapsed * 4) * 0.016;
    const inZone = game.brakeValue >= game.targetMin && game.brakeValue <= game.targetMax;
    if (inZone) {
      if (!game.inZone) {
        game.inZone = true;
        game.zoneEnterT = now;
      }
      game.stableMs = Math.floor((now - game.zoneEnterT) * 1000);
    }
    if (elapsed > 4.5) {
      game.demoPhase = 4;
      game.demoPhaseT = now;
      game.reactionMs = 248;
      game.stableMs = 1320;
      game.inZone = true;
      game.score = 648;
    }
  } else if (game.demoPhase === 4 && elapsed > 4.2) {
    game.state = STATE.STANDBY;
    game.brakeValue = 0;
  }
}

function updateGame(game, input, now, dt, tuning) {
  game.flash = Math.max(0, game.flash - dt * 2.8);
  game.shake = Math.max(0, game.shake - dt * 16);
  game.hitPulse = Math.max(0, game.hitPulse - dt * 2.5);
  game.camJolt = Math.max(0, game.camJolt - dt * 18);

  if (game.state === STATE.DEMO) {
    updateDemo(game, now);
    recordTrace(game, now);
  } else {
    if (input.spaceHeld || input.mouseHeld) {
      const target = input.mouseHeld ? clamp(1 - input.mouseNormY, 0, 1) : 1;
      game.brakeValue = Math.min(1, game.brakeValue + dt * 3.1);
      if (game.brakeValue > target + 0.02) {
        game.brakeValue = Math.max(target, game.brakeValue - dt * 2.5);
      }
    } else {
      game.brakeValue = Math.max(0, game.brakeValue - dt * 4.2);
    }

    recordTrace(game, now);

    if (game.state === STATE.STANDBY && game.brakeValue > 0.12) {
      startStaging(game, now, tuning);
    }

    if (game.state === STATE.STAGING) {
      const elapsed = now - game.stagingStart;
      if (game.stagingPhase === 'lights' && elapsed >= 5 * 0.62) {
        game.stagingPhase = 'hold';
        game.holdStart = now;
      }
      if (game.stagingPhase === 'hold' && now - game.holdStart >= game.holdDur) {
        startPlaying(game, now, tuning);
        return;
      }
    }

    if (game.state === STATE.PLAYING) {
      const diff = getDifficultySpec(game.difficulty, tuning);
      const elapsed = now - game.signalTime;

      if (!game.reacted && game.brakeValue > 0.055) {
        game.reacted = true;
        game.reactionMs = Math.max(0, Math.floor(elapsed * 1000));
      }

      const inZoneNow = game.brakeValue >= game.targetMin && game.brakeValue <= game.targetMax;
      if (inZoneNow && !game.inZone) {
        game.inZone = true;
        game.zoneEnterT = now;
        game.hitPulse = 1;
      }
      if (!inZoneNow && game.inZone) {
        game.stableMs = Math.floor((now - game.zoneEnterT) * 1000);
      }
      if (game.inZone && inZoneNow) {
        game.stableMs = Math.floor((now - game.zoneEnterT) * 1000);
      }

      if (game.inZone && game.stableMs >= diff.holdMs) showResult(game, now, tuning);
      else if (diff.timeLimit > 0 && elapsed >= diff.timeLimit) showResult(game, now, tuning);
    }

    if (game.state === STATE.RESULT && now - game.resultStart >= 6.0) {
      game.state = STATE.STANDBY;
      game.brakeValue = 0;
    }
  }

  const risingBrake = Math.max(0, game.brakeValue - game.prevBrakeValue);
  game.decelBlur = clamp(game.decelBlur + risingBrake * 4.6 - dt * 1.7, 0, 1);
  game.camJolt = clamp(game.camJolt + risingBrake * 28, 0, 18);
  game.prevBrakeValue = game.brakeValue;

  const activeHud =
    game.state === STATE.PLAYING ||
    (game.state === STATE.DEMO && game.demoPhase >= 3);
  game.hudIntro = ease(game.hudIntro, activeHud ? 1 : 0, activeHud ? 5 : 3.2, dt);

  const targetSpeed = game.state === STATE.PLAYING
    ? 1.26 - game.brakeValue * 0.52
    : game.state === STATE.STAGING
      ? 0.86
      : game.state === STATE.DEMO
        ? 1.04
        : 0.2;
  game.speedFx = ease(game.speedFx, targetSpeed, 2.5, dt);
}

export default function GameCanvas({ difficulty, demoTick, tuning = DEFAULT_TUNING, onSnapshot }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame(difficulty));
  const inputRef = useRef({ spaceHeld: false, mouseHeld: false, mouseNormY: 0.5 });
  const assetsRef = useRef({ logo: new Image(), logoWord: new Image() });
  const lastDemoTickRef = useRef(demoTick);

  useEffect(() => {
    assetsRef.current.logo.src = 'rcb-logo.png';
    assetsRef.current.logoWord.src = 'rcb-logo-word.png';
  }, []);

  useEffect(() => {
    const game = gameRef.current;
    if (game.state === STATE.STANDBY || game.state === STATE.RESULT) game.difficulty = difficulty;
  }, [difficulty]);

  useEffect(() => {
    if (demoTick !== lastDemoTickRef.current) {
      lastDemoTickRef.current = demoTick;
      startDemo(gameRef.current, performance.now() / 1000);
    }
  }, [demoTick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let last = performance.now() / 1000;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.scale(rect.width / LW, rect.height / LH);
    }

    function frame(ms) {
      const now = ms / 1000;
      const dt = Math.min(now - last, 0.1);
      last = now;
      resize();
      const game = gameRef.current;
      updateGame(game, inputRef.current, now, dt, tuning);
      drawScene(ctx, game, now, assetsRef.current, tuning);

      if (now - game.lastSnapshotAt > 0.16) {
        game.lastSnapshotAt = now;
        onSnapshot({
          state: STATE_LABEL[game.state],
          brake: game.brakeValue,
          tests: game.totalTests,
          bestReaction: game.bestReaction === Infinity ? null : game.bestReaction,
          bestScore: game.bestScore,
          streak: game.streak,
        });
      }

      raf = requestAnimationFrame(frame);
    }

    function keyDown(event) {
      const game = gameRef.current;
      if (game.state === STATE.DEMO && !['Escape', 'F5', 'F12'].includes(event.key)) {
        event.preventDefault();
        game.state = STATE.STANDBY;
        game.brakeValue = 0;
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        game.state = STATE.STANDBY;
        game.brakeValue = 0;
      }
      if (event.key === ' ') {
        event.preventDefault();
        inputRef.current.spaceHeld = true;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (game.state === STATE.STANDBY || game.state === STATE.RESULT) {
          startStaging(game, performance.now() / 1000, tuning);
        }
      }
    }

    function keyUp(event) {
      if (event.key === ' ') inputRef.current.spaceHeld = false;
    }

    function pointerDown(event) {
      const rect = canvas.getBoundingClientRect();
      inputRef.current.mouseHeld = true;
      inputRef.current.mouseNormY = (event.clientY - rect.top) / rect.height;
      canvas.setPointerCapture?.(event.pointerId);
    }

    function pointerMove(event) {
      if (!inputRef.current.mouseHeld) return;
      const rect = canvas.getBoundingClientRect();
      inputRef.current.mouseNormY = (event.clientY - rect.top) / rect.height;
    }

    function pointerUp() {
      inputRef.current.mouseHeld = false;
    }

    window.addEventListener('resize', resize);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
    };
  }, [onSnapshot, tuning]);

  return <canvas ref={canvasRef} className="game-canvas" />;
}
