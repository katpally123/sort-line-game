(function(){
  const btn = document.getElementById('btnConfig');
  const dlg = document.getElementById('configDlg');
  const e = window.engine; // set in main.js

  btn.addEventListener('click', () => dlg.showModal());

  function syncFromEngine(){
    const c = e.cfg;
    inpWidthFeet.value = c.line.widthFeet;
    inpTrickle.value = c.line.trickleOffset;
    inpSpeed.value = c.speed.pixelsPerSec;
    inpSpawnMs.value = c.spawn.spawnEveryMs;
    selLevel.value = c.level;
    chkStop.checked = c.line.stopAtEnd;
  }

  function pushToEngine(){
    e.setConfig({
      line: {
        ...e.cfg.line,
        widthFeet: parseFloat(inpWidthFeet.value),
        trickleOffset: parseFloat(inpTrickle.value),
        stopAtEnd: chkStop.checked
      },
      speed: { ...e.cfg.speed, pixelsPerSec: parseFloat(inpSpeed.value) },
      spawn: { ...e.cfg.spawn, spawnEveryMs: parseInt(inpSpawnMs.value,10) },
      level: selLevel.value
    });
  }

  dlg.addEventListener('close', pushToEngine);
  document.getElementById('btnSavePreset').addEventListener('click', (ev)=>{
    ev.preventDefault();
    pushToEngine();
    localStorage.setItem('SLG_PRESET', JSON.stringify(e.cfg));
    alert('Preset saved to this browser.');
  });

  window.addEventListener('engine:ready', syncFromEngine);
})();
