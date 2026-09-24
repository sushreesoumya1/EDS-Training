/**
 * Adventure spec list. Each row is a label/value pair
 * (Activity, Adventure Type, Trip Length, Group Size, Difficulty, Price).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-specs-item');
    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('columns-specs-label');
    if (cells[1]) cells[1].classList.add('columns-specs-value');
  });
}
