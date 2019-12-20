function createShootingStars(target) {
  // ========= Constants ========= //
  const width = document.querySelector(target).offsetWidth;
  const height = document.querySelector(target).offsetHeight;
  const minTimeToNext = 20000;
  const maxTimeToNext = 60000;

  // ========= Create canvas ========= //
  const canvas = d3.select(target).append('canvas')
    .attr('id', 'shooting-stars-canvas')
    .attr('class', 'canvas');
  const ctx = canvas.node().getContext('2d');
  crispyCanvas(canvas, ctx, width, height);

  // ========= Shoot ========= //
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height);

  const headRadii = [3, 4, 5, 8];
  const speeds = [20, 25, 35];
  const shootingLengths = [20, 40, 60];
  const starColors = ['#9db4ff', '#aabfff', '#cad8ff', '#fbf8ff', '#fff4e8', '#ffddb4'];

  const randomArrayElement = (arr) => arr[Math.floor(Math.random() * (arr.length))];

  function fly() {
    svg.selectAll('*').remove();

    const startHeight = Math.floor(Math.random() * height);
    const endHeight = Math.floor(Math.random() * height);
    const direction = Boolean(Math.round(Math.random()));
    const numCircles = shootingLength * 2;

    const startWidth = direction ? -headRadius : width + headRadius;
    const endWidth = direction ? 1.5 * width : -1.5 * width;
    
    const path = svg.append('path')
    .attr('d', `M ${startWidth} ${startHeight} 
                C ${startWidth} ${startHeight} 
                  ${width / 2} ${height / 2} 
                  ${endWidth} ${endHeight}`);

    const pathLength = path.node().getTotalLength();
    ctx.fillStyle = randomArrayElement(starColors);
    
    function draw() {
      ctx.clearRect(0, 0, width, height);
      let radius, x, y;
      for (let i = 0; i < numCircles; i++) {
        radius = headRadius * Math.exp(-i * 0.02);
        ({x, y} = path.node().getPointAtLength(localLength - radius * i));
        ctx.globalAlpha = Math.exp(-i * 0.1);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
      if (localLength < pathLength) {
        localLength += speed;
        requestAnimationFrame(draw);
      } else {
        headRadius = randomArrayElement(headRadii);
        speed = randomArrayElement(speeds);
        shootingLength = randomArrayElement(shootingLengths);
        setTimeout(fly, Math.min(minTimeToNext, Math.round(Math.random() * maxTimeToNext)));
      }
    }
    
    let localLength = 0;
    draw();
  }

  let headRadius = randomArrayElement(headRadii);
  let speed = randomArrayElement(speeds);
  let shootingLength = randomArrayElement(shootingLengths);
  fly();
}
