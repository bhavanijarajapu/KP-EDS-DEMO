/**
 * Contact Details Block
 *
 * Pure fragment renderer — no region orchestration.
 * Designed to live under /fragments/contact-details/{region}
 * and be fetched by the fragment-region-picker block.
 *
 * Authored table structure (in da.live / Word / Google Doc):
 * ┌─────────────────────────────────────────┐
 * │ Region heading text                     │  ← row 1, single cell
 * ├─────────────────┬───────────────────────┤
 * │ Department name │ phone:1-800-xxx-xxxx  │  ← row 2..N, two cells
 * │                 │ Hours: Mon–Fri 8–5    │
 * │                 │ TTY: 711              │
 * └─────────────────┴───────────────────────┘
 *
 * Any row with a single cell is treated as a section heading or intro text.
 * Any row with two cells is treated as a contact entry.
 */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'contact-details-inner';

  rows.forEach((row, index) => {
    const cells = [...row.children];

    if (cells.length === 1) {
      // Single cell — heading (first row) or intro paragraph
      if (index === 0) {
        const heading = document.createElement('h2');
        heading.textContent = cells[0].textContent.trim();
        container.appendChild(heading);
      } else {
        const intro = document.createElement('p');
        intro.className = 'contact-intro';
        intro.textContent = cells[0].textContent.trim();
        container.appendChild(intro);
      }
      return;
    }

    if (cells.length >= 2) {
      // Two-cell row — contact entry
      const item = document.createElement('div');
      item.className = 'contact-item';

      // Left cell — department / service name
      const nameEl = document.createElement('h3');
      nameEl.textContent = cells[0].textContent.trim();
      item.appendChild(nameEl);

      // Right cell — may contain phone numbers, hours, TTY etc.
      // Preserve line breaks by splitting on newlines or <br>
      const rightCell = cells[1];
      const lines = rightCell.innerHTML
        .split(/<br\s*\/?>/i)
        .map((l) => l.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean);

      lines.forEach((line) => {
        // Detect phone numbers — format as tel: links
        const phoneMatch = line.match(/(\d[\d\s\-().]{6,}\d)/);
        if (
          line.toLowerCase().startsWith('phone') ||
          line.toLowerCase().startsWith('call') ||
          (phoneMatch && !line.toLowerCase().startsWith('tty'))
        ) {
          const anchor = document.createElement('a');
          anchor.className = 'phone';
          anchor.textContent = line;
          const digits = line.replace(/\D/g, '');
          anchor.href = `tel:+1${digits}`;
          anchor.setAttribute('aria-label', `Call ${line}`);
          item.appendChild(anchor);
        } else {
          const p = document.createElement('p');
          p.textContent = line;
          item.appendChild(p);
        }
      });

      container.appendChild(item);
    }
  });

  block.innerHTML = '';
  block.appendChild(container);
}
