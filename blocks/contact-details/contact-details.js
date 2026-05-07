export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const regionName = rows[0]?.children[1]?.textContent?.trim()
    || rows[0]?.children[0]?.textContent?.trim()
    || '';
  const regionKey = regionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const wrapper = block.closest('.contact-details-wrapper');
  if (wrapper) {
    wrapper.dataset.region = regionKey;
    wrapper.style.display = 'none';
  }

  block.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = regionName;
  block.appendChild(heading);

  const intro = document.createElement('p');
  intro.className = 'region-intro';
  intro.textContent = 'As always, you can call us if you have questions or need help with our care and services. Select the right phone number from the list below.';
  block.appendChild(intro);

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent?.trim();
    const value = cells[1]?.innerHTML?.trim();
    if (!label) return;

    const item = document.createElement('div');
    item.className = 'contact-item';

    const itemHeading = document.createElement('h3');
    itemHeading.textContent = label;
    item.appendChild(itemHeading);

    if (value) {
      const content = document.createElement('div');
      content.innerHTML = value;
      content.innerHTML = content.innerHTML.replace(
        /(\d[\d\s().+-]{6,})/g,
        (match) => {
          const cleaned = match.replace(/[^\d+]/g, '');
          return `<a class="phone" href="tel:${cleaned}">${match}</a>`;
        },
      );
      item.appendChild(content);
    }

    block.appendChild(item);
  });
}
