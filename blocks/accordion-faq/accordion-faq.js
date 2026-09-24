/**
 * FAQ accordion. Each row is a question/answer pair rendered as a
 * <details>/<summary> disclosure with a +/− toggle.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const question = cells[0];
    const answer = cells[1];

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-question';
    if (question) {
      while (question.firstChild) summary.append(question.firstChild);
    }

    const body = document.createElement('div');
    body.className = 'accordion-faq-answer';
    if (answer) {
      while (answer.firstChild) body.append(answer.firstChild);
    }

    details.append(summary, body);
    row.replaceWith(details);
  });
}
