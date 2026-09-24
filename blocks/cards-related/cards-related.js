/**
 * Related-articles list. Each row is a card with a linked title and a date.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-related-item';
    const cell = row.firstElementChild;
    if (cell) {
      while (cell.firstChild) li.append(cell.firstChild);
    }
    ul.append(li);
  });

  block.replaceChildren(ul);
}
