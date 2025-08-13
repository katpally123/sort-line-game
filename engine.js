class Engine {
  constructor(rootEl) {
    this.root = rootEl;
    this.itemsLayer = document.getElementById('items');
    this.lineEl = document.getElementById('line');
    this.cfg = null;
    this.levelMult = 1;
    this.items = [];
    this.running = false;
    this.lastTs = 0;
    this.spawnTimer = 0;
  }

  async loadConfig(url = 'game.config.json') {
    const res = await fetch(url + '?v=' + Date.now());
    this.cfg = await res.json();
    this.applyConfig(this.cfg);
  }

  applyConfig(cfgPartial) {
    this.cfg = { ...this.cfg, ...cfgPartial };
    document.documentElement.style.setProperty('--line-width-ft', this.cfg.line.widthFeet);
    this.levelMult = this.cfg.speed.levelMultipliers[this.cfg.level] ?? 1;
  }

  setConfig(partial) { this.applyConfig(partial); }
  loadLevel(level) { this.setConfig({ level }); }
  pause() { this.running = false; }
  resume() { if (!this.running) { this.running = true; requestAnimationFrame(this.loop.bind(this)); } }

  clearItems() { this.items.forEach(i => i.el.remove()); this.items = []; }

  spawn() {
    const isPallet = Math.random() < 0.2; // 20% pallets
    const size = isPallet ? this.cfg.spawn.palletSize : this.cfg.spawn.caseSize;
    const el = document.createElement('div');
    el.className = isPallet ? 'pallet' : 'case';
    el.style.width = size.w + 'px';
    el.style.height = size.h + 'px';
    const lineRect = this.lineEl.getBoundingClientRect();
    const wrapRect = this.root.getBoundingClientRect();
    const y = (wrapRect.height - lineRect.height)/2 + (1 - this.cfg.line.trickleOffset) * lineRect.height - size.h/2;
    el.style.transform = `translate(0px, ${y}px)`;
    this.itemsLayer.appendChild(el);
    this.items.push({ el, x: 0, y, w: size.w, h: size.h, done:false });
  }

  start() {
    this.running = true;
    this.lastTs = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(ts) {
    if (!this.running) return;
    const dt = (ts - this.lastTs) / 1000; // seconds
    this.lastTs = ts;

    // spawn
    this.spawnTimer += dt * 1000;
    const spawnEvery = this.cfg.spawn.spawnEveryMs;
    if (this.spawnTimer >= spawnEvery) { this.spawnTimer = 0; this.spawn(); }

    // move
    const speed = this.cfg.speed.pixelsPerSec * this.levelMult;
    const lineLen = this.cfg.line.lengthPx;
    for (const it of this.items) {
      if (this.cfg.line.stopAtEnd && it.x + it.w >= lineLen) { it.done = true; continue; }
      it.x = Math.min(it.x + speed * dt, lineLen - it.w);
      it.el.style.transform = `translate(${it.x}px, ${it.y}px)`;
    }

    // cleanup DOM for finished items if not stopping
    if (!this.cfg.line.stopAtEnd) {
      this.items = this.items.filter(it => {
        const keep = it.x < lineLen;
        if (!keep) it.el.remove();
        return keep;
      });
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

window.SLG = { Engine };
