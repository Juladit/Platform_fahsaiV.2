(function(){
  const canvas = document.getElementById('bgWords');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const WORDS = [
    'Social','Sport','Badminton','Football','Book','Activity','Fun','Connect','Community',
    'Creative','Music','Art','Volunteer','Leadership','Health','Wellness','Hiking','Run','Dance',
    'Innovation','Workshop','Seminar','Teamwork','Inspire','Growth','Skills','Challenge','Explore',
    'Coding','Design','Research','Culture','Festival','Event','Learning','Mentor','Play','Energy',
    'Ideas','Support','Gaming','Unity','Sharing','Outdoor','Fitness','Network','Create','Achieve'
  ];

  let items = [];
  let running = true;
  let lastTime = performance.now();

  function scale(){
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function pickColor(){
    const r = Math.random();
    if (r < 0.55) return `rgba(31,41,55,${(0.40+Math.random()*0.28).toFixed(3)})`; // dark slate
    if (r < 0.9)  return `rgba(255,255,255,${(0.42+Math.random()*0.32).toFixed(3)})`; // white
    return `rgba(220,38,38,${(0.26+Math.random()*0.20).toFixed(3)})`; // subtle accent
  }

  function initItems(){
    items = [];
    const vw = window.innerWidth, vh = window.innerHeight;
    const area = vw*vh;
  let count = Math.floor(area/60000); // adjust density with more words
  count = Math.max(28, Math.min(70, count));
    if (vw < 640) count = Math.max(16, Math.min(32, Math.floor(count*0.7)));

    for(let i=0;i<count;i++){
      const text = WORDS[Math.floor(Math.random()*WORDS.length)];
      const size = rand(22, 58);
      const weight = Math.random()<0.5?400:600;
      ctx.font = `${weight} ${size}px Inter, sans-serif`;
      const width = ctx.measureText(text).width;
      const y = rand(24, vh-24); // random Y; avoid edges a bit
      // speed ties lightly to size to create depth (bigger -> a bit faster)
      const speed = rand(20, 40) + (size-22)*0.4; // px/sec
      const x = rand(-vw, vw); // spread start positions
      const color = pickColor();
      items.push({text,x,y,size,weight,width,color,speed});
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const it of items){
      ctx.font = `${it.weight} ${it.size}px Inter, sans-serif`;
      ctx.fillStyle = it.color;
      ctx.shadowColor = 'rgba(0,0,0,0.14)';
      ctx.shadowBlur = 3;
      ctx.fillText(it.text, it.x, it.y);
    }
    ctx.shadowBlur = 0;
  }

  function tick(now){
    if(!running) return;
    const dt = Math.min(0.05,(now-lastTime)/1000); // clamp
    lastTime = now;
    const vw = window.innerWidth;
    const margin = 60;

    for(const it of items){
      it.x += it.speed * dt; // left -> right
      if (it.x - it.width > vw + margin) {
        // wrap to left with fresh Y (and occasional style refresh)
        it.x = -it.width - margin;
        it.y = rand(24, window.innerHeight-24);
        if (Math.random() < 0.25) {
          // occasionally vary size/speed/color for more variety
          it.size = rand(22, 58);
          it.weight = Math.random()<0.5?400:600;
          ctx.font = `${it.weight} ${it.size}px Inter, sans-serif`;
          it.width = ctx.measureText(it.text).width;
          it.speed = rand(20, 40) + (it.size-22)*0.4;
          it.color = pickColor();
        }
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function start(){
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scale();
    initItems();
    draw();
    if (reduced) { running = false; return; }
    running = true; lastTime = performance.now(); requestAnimationFrame(tick);
  }

  window.addEventListener('resize', ()=>{ scale(); initItems(); draw(); });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', start);
  }
  start();
})();
