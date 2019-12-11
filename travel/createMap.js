function createMap(target) {
  // data from and inspired by http://www.datasketch.es/may/code/nadieh/
  // inspiration by https://observablehq.com/@mbostock/star-map
  
  // ========= Setup constants ========= //
  const cities = [
    {
      name: 'Nazareth',
      x: 955,
      y: 268.76028,
      r: 7,
      fill: '#695958'
    },
    {
      name: 'Bethlehem',
      x: 923,
      y: 723.76028,
      r: 7,
      fill: '#695958'
    }
  ];
  const path = {
    d: 'M1154.5,288.5c-36.87646,68.669-40.25476,122.12888-36,159,8.37964,72.61731,49.03784,104.03223,48,174-.77039,51.94208-24.06042,94.13928-44,122',
    translate: '-200 -20.23972'
  };

  const svg = d3.select(target);

  // ========= Add travel path ========= //
  const travelPath = svg.append('path')
    .attr('class', 'travel-path')
    .attr('d', path.d)
    .attr('transform', `translate(${path.translate})`)
    .attr('stroke', '#DE3C4B')
    .attr('stroke-width', 5)
    .attr('fill', 'none');

  path.length = travelPath.node().getTotalLength();

  travelPath
    .attr('stroke-dasharray', path.length + ' ' + path.length)
    .attr('stroke-dashoffset', path.length)
    .transition()
      .duration(10000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

  // ========= Draw cities ========= //
  svg.append('g')
    .attr('class', 'cities')
    .selectAll('.city')
    .data(cities)
    .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => d.fill);

  // ========= Label cities ========= //
  svg.append('g')
    .attr('class', 'city-labels')
    .selectAll('.city-label')
    .data(cities)
    .join('text')
      .attr('class', 'city-label')
      .attr('transform', d => `translate(${d.x - 15} ${d.y})`)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Verdana')
      .attr('font-size', '20px')
      .text(d => d.name);
}
