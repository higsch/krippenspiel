function getPixelRatio(ctx) {
  // from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
  let devicePixelRatio = window.devicePixelRatio || 1;
  let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;
  let ratio = devicePixelRatio / backingStoreRatio;
  return ratio;
}

function crispyCanvas(canvas, ctx, width, height) {
  sf = Math.min(2, getPixelRatio(ctx)); //no more than 2

  if (screen.width < 500) sf = 1; //for small devices, 1 is enough
  
  canvas
    .attr('width', sf * width)
    .attr('height', sf * height)
    .style('width', width + 'px')
    .style('height', height + 'px');
  ctx.scale(sf, sf);
}
