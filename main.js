(async function(){
  const eng = new SLG.Engine(document.getElementById('stageWrap'));
  window.engine = eng;

  // Load base config
  await eng.loadConfig('game.config.json');

  // Apply saved preset (if any)
  const saved = localStorage.getItem('SLG_PRESET');
  if (saved) eng.setConfig(JSON.parse(saved));

  // URL overrides e.g. ?speed=140&level=L3
  const q = new URLSearchParams(location.search);
  const speed = q.get('speed');
  const level = q.get('level');
  const widthFt = q.get('widthFt');
  const trickle = q.get('trickle');
  if (speed || level || widthFt || trickle) {
    eng.setConfig({
      speed: speed ? { ...eng.cfg.speed, pixelsPerSec: Number(speed) } : eng.cfg.speed,
      level: level || eng.cfg.level,
      line: {
        ...eng.cfg.line,
        widthFeet: widthFt ? Number(widthFt) : eng.cfg.line.widthFeet,
        trickleOffset: trickle ? Number(trickle) : eng.cfg.line.trickleOffset
      }
    });
  }

  window.dispatchEvent(new Event('engine:ready'));
  eng.start();
})();
