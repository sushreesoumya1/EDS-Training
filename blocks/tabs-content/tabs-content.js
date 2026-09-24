/**
 * Tabbed content. Each row is a tab: first cell is the label, second is the panel.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'tabs-content-tablist';
  tablist.setAttribute('role', 'tablist');

  const panels = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() || `Tab ${i + 1}`;
    const panelBody = cells[1];

    const id = `tab-${i}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // tab button
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-content-tab';
    tab.setAttribute('role', 'tab');
    tab.id = `${id}-tab`;
    tab.setAttribute('aria-controls', id);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i !== 0) tab.tabIndex = -1;
    tab.textContent = label;
    tablist.append(tab);

    // panel
    const panel = document.createElement('div');
    panel.className = 'tabs-content-panel';
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${id}-tab`);
    if (i !== 0) panel.hidden = true;
    if (panelBody) {
      while (panelBody.firstChild) panel.append(panelBody.firstChild);
    }
    panels.push(panel);

    tab.addEventListener('click', () => {
      tablist.querySelectorAll('.tabs-content-tab').forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      panels.forEach((p) => { p.hidden = true; });
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;
      panel.hidden = false;
    });
  });

  block.replaceChildren(tablist, ...panels);
}
