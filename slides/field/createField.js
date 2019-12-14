function createField(target) {
  console.log('field')
  // ========= Constants ========= //
  const width = document.querySelector(target).offsetWidth;
  const height = document.querySelector(target).offsetHeight;

  // ========= Create SVG ========= //
  const svg = d3.select(target).append('svg')
    .attr('width', width)
    .attr('height', height);

  // ========= Defs ========= //
  const defs = svg.append('defs');
}
