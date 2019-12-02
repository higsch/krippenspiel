function createStarMap(stars) {
  // data from and inspired by http://www.datasketch.es/may/code/nadieh/
  
  // --- setup dimensions and constants
  const width = document.getElementById('star-map').offsetWidth;
  const height = document.getElementById('star-map').offsetHeight;
  const scale = 180; //(width - 120) * 0.5;
  // const center = [180, -90]; // North pole view
  const center = [0, -31]; // Betlehem: 31N 35E

  // --- create canvas
  const canvas = d3.select('#star-map').append('canvas')
    .attr('id', 'star-canvas')
    .attr('class', 'canvas');
  const ctx = canvas.node().getContext('2d');
  crispyCanvas(canvas, ctx, width, height);

  // --- setup scales
  // star colors
  const starColors = ['#9db4ff', '#aabfff', '#cad8ff', '#fbf8ff', '#fff4e8', '#ffddb4', '#ffbd6f', '#f84235', '#AC3D5A', '#5A4D6E'];
  const starTemperatures = [30000, 20000, 8500, 6800, 5600, 4500, 3000, 2000, 1000, 500];
  const scaleColor = chroma
    .scale(starColors)
    .domain(starTemperatures);

  // radius
  const scaleRadius = d3.scalePow()
    .exponent(0.9)
    .domain([-2, 6, 11])
    .range([9, 0.5, 0.1].map(d => {
      const scaleFocus = d3.scaleLinear()
        .domain([300, 2600])
        .range([0.6, 1.5]);
      return d * scaleFocus(scale);
    }));

  // --- setup projection
  const projection = d3.geoAzimuthalEquidistant()
    .scale(scale)
    .precision(0.1)
    .translate([width / 2, height / 2])
    .rotate(center)
    .clipAngle(90 + 1e-3);
  
  // --- create the star circles
  ctx.shadowBlur = 25;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  stars.forEach((d) => {
    // get pixel coordinates on the screen
    const pos = pixelPos(d.ra, d.dec, projection);
  
    // if this star falls outside of the map, don't plot
    if (pos[0] < 0 || pos[0] > width || pos[1] < 0 || pos[1] > height) return;

    // star dependend settings
    let r = scaleRadius(d.mag);
    let col = d.t_eff ? scaleColor(d.t_eff) : 'white';

    if (d.proper && d.proper === 'Polaris') { col = 'green'; r = 10; }
    if (d.const_name && d.const_name === 'Ursa Major') col = 'red';

    // create a gradient to fill each star with: lighter in center and darker around edges
    let grd = ctx.createRadialGradient(pos[0], pos[1], 1, pos[0], pos[1], r * 1.1);
    const brightCol = chroma(col).brighten(1);
    const darkCol = chroma(col).saturate(3).darken(1);
    grd.addColorStop(0, brightCol);
    grd.addColorStop(0.6, col);
    grd.addColorStop(1, darkCol);
    ctx.fillStyle = grd;
    
    // create a glow around each star
    ctx.shadowColor = col;

    // draw the star
    ctx.beginPath()
    ctx.arc(pos[0], pos[1], r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
}
