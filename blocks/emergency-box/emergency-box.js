export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const title = rows[0]?.children[0]?.textContent?.trim() || 'In case of an emergency';
  const body = rows[0]?.children[1]?.innerHTML?.trim() || '';

  block.innerHTML = '';

  const icon = document.createElement('div');
  icon.className = 'emergency-icon';
  icon.textContent = '⚠️';

  const content = document.createElement('div');
  content.className = 'emergency-content';

  const heading = document.createElement('h2');
  heading.textContent = title;

  const text = document.createElement('p');
  text.innerHTML = body;

  content.appendChild(heading);
  content.appendChild(text);

  block.appendChild(icon);
  block.appendChild(content);
}
