function createStarMap(target, stars, latlon) {
  // data from and inspired by http://www.datasketch.es/may/code/nadieh/
  // inspiration by https://observablehq.com/@mbostock/star-map
  
  // ========= Setup dimensions and constants ========= //
  const width = document.querySelector(target).offsetWidth;
  const height = document.querySelector(target).offsetHeight;
  const scale = 800;
  
  // ========= Setup scales ========= //
  // star colors
  const starColors = ['#9db4ff', '#aabfff', '#cad8ff', '#fbf8ff', '#fff4e8', '#ffddb4', '#ffbd6f', '#f84235', '#AC3D5A', '#5A4D6E'];
  const starTemperatures = [30000, 20000, 8500, 6800, 5600, 4500, 3000, 2000, 1000, 500];
  const scaleColor = chroma
    .scale(starColors)
    .domain(starTemperatures);

  // radius
  const scaleRadius = d3.scalePow()
    .exponent(0.7)
    .domain([-2, 6, 11])
    .range([9, 0.5, 0.1].map(d => {
      const scaleFocus = d3.scaleLinear()
        .domain([300, 2600])
        .range([1, 2]);
      return d * scaleFocus(scale);
    }));

  // ========= Projection ========= //
  const projection = d3.geoProjection((x, y) => d3.geoStereographicRaw(x, -y))
    .scale(scale)
    .rotate([0, -90, 0]) // North pole
    .translate([width / 2, height / 2])
    .precision(0.1)
    .clipAngle(90.001);

  // get the clipping radius
  const clipRadius = height / 2 - projection([0, 0])[1];
  
  // ========= Create the star circles ========= //
  // --- create canvas
  const canvas = d3.select(target).append('canvas')
    .attr('id', 'star-canvas')
    .attr('class', 'canvas');
  const ctx = canvas.node().getContext('2d');
  crispyCanvas(canvas, ctx, width, height);

  ctx.shadowBlur = 25;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  // clip circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, clipRadius, 0, Math.PI * 2);
  ctx.clip();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // turn to correct position and time
    const raOffset = getLSTInDeg(new Date(), latlon[1]); // depending on date the sky is turned
    projection.rotate([-raOffset, -latlon[0], 180]);

    stars.forEach((d) => {
      // get pixel coordinates on the screen
      const pos = projection([d.ra * (360 / 24), d.dec]);
    
      // if this star falls outside of the map, don't plot
      if (pos[0] < 0 || pos[0] > width || pos[1] < 0 || pos[1] > height) return;

      // star depen dend settings
      let r = scaleRadius(d.mag);
      let col = d.t_eff ? scaleColor(d.t_eff) : 'white';

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

  draw();
}
