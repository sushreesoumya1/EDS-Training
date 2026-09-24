/**
 * loads and decorates the columns-article-header block
 * Two-column article header: a large image alongside breadcrumb/heading/meta.
 * @param {Element} block The columns-article-header block element
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-article-header-${cols.length}-cols`);

  // mark columns whose only content is an image so layout can order them
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-article-header-img-col');
        }
      }
    });
  });
}
