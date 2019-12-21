function createTitle(target, text, foreground = '#FFFFFF', background = '#071e59') {
  // ========= Setup dimensions and constants ========= //
  const width = document.querySelector(target).offsetWidth;
  const height = document.querySelector(target).offsetHeight;
  const duration = 1000;
  const widthOffset = 60;
  const heightOffset = 20;

  const symbolGenerator = d3.symbol()
    .type(d3.symbolStar)
    .size(300);

  const starPath = symbolGenerator();

  // ========= Create SVG ========= //
  const svg = d3.select(target).append('svg')
    .attr('width', width)
    .attr('height', height);

  // ========= Defs ========= //
  const defs = svg.append('defs');

  // ========= Blur filter ========= //
  defs.append('filter')
    .attr('id', 'filter-blur')
    .append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', 8);

  // ========= Create g ========= //
  const g = svg.append('g')
    .attr('transform', `translate(${width / 2} ${height * 0.15})`)
    .attr('opacity', 0);

  g.append('rect')
    .attr('class', 'bg-glow')
    .attr('fill', foreground)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('filter', 'url(#filter-blur)');

  g.append('rect')
    .attr('class', 'bg')
    .attr('fill', background)
    .attr('rx', 5)
    .attr('ry', 5);

  g.append('path')
    .attr('class', 'star-left')
    .attr('d', starPath)
    .attr('fill', foreground);

  g.append('path')
    .attr('class', 'star-right')
    .attr('d', starPath)
    .attr('fill', foreground);

  // ========= Create song title ========= //
  const title = g.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', foreground)
    .attr('font-family', 'Verdana')
    .attr('font-size', '55px')
    .text(text);

  const textDim = title.node().getBBox();

  d3.select('.bg-glow')
    .attr('x', textDim.x - widthOffset)
    .attr('y', textDim.y - heightOffset)
    .attr('width', textDim.width + 2 * widthOffset)
    .attr('height', textDim.height + 2 * heightOffset);

  d3.select('.bg')
    .attr('x', textDim.x - widthOffset)
    .attr('y', textDim.y - heightOffset)
    .attr('width', textDim.width + 2 * widthOffset)
    .attr('height', textDim.height + 2 * heightOffset);

  d3.select('.star-left')
    .attr('transform', `translate(${textDim.x - widthOffset / 2} ${-heightOffset})`);

  d3.select('.star-right')
    .attr('transform', `translate(${-textDim.x + widthOffset / 2} ${-heightOffset})`)

  return g;
}
