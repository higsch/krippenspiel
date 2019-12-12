function createChristmasStar(target) {
  const width = document.querySelector(target).offsetWidth;
  const height = document.querySelector(target).offsetHeight;
  
  const polyWidth = 20;
  const polyHeight = 170;
  const poly = `0,${-polyHeight / 2} ${polyWidth / 2},0 0,${polyHeight / 2} ${-polyWidth / 2},0`;
  const position = `${width - polyHeight} ${polyHeight}`;
  const rotationDuration = 50000;

  const svg = d3.select(target).append('svg')
    .attr('width', width)
    .attr('height', height);

  const defs = svg.append('defs');
  defs.append('filter')
    .attr('id', 'filter-blur')
    .append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', 3);

  const gradient = defs.append('radialGradient')
    .attr('id', 'star-gradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%');

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#ffbd6f');

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'white');

  const starGroupWrapper = svg.append('g')
    .attr('transform', `translate(${position})`);
  
  const starGroup = starGroupWrapper.append('g')
    .attr('class', 'star-poly');

  for (let i = 0; i < 360; i += 90) {
    starGroup.append('polygon')
      .attr('points', poly)
      .attr('fill', 'url(#star-gradient)')
      .attr('filter', 'url(#filter-blur)')
      .attr('transform', `rotate(${i})`);
  }

  for (let i = 45; i < 360; i += 90) {
    starGroup.append('polygon')
      .attr('points', poly)
      .attr('fill', 'url(#star-gradient)')
      .attr('filter', 'url(#filter-blur)')
      .attr('transform', `rotate(${i}) scale(0.7)`);
  }

  starGroup.append('circle')
    .attr('r', polyHeight / 14)
    .attr('fill', 'white');

  function turn() {
    starGroup
      .transition()
      .duration(rotationDuration)
      .ease(d3.easeLinear)
      .attrTween('transform', () => d3.interpolateString('rotate(0)', 'rotate(360)'))
      .on('end', turn);
  }

  turn();
}
