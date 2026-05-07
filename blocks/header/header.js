import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Move all sections from fragment into nav
  while (fragment && fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const children = [...nav.children];

  // Normalize to always have 3 divs: brand, sections, tools
  if (children.length === 0) {
    nav.append(document.createElement('div'));
    nav.append(document.createElement('div'));
    nav.append(document.createElement('div'));
  } else if (children.length === 1) {
    nav.append(document.createElement('div'));
    nav.append(document.createElement('div'));
  } else if (children.length === 2) {
    const mid = document.createElement('div');
    nav.insertBefore(mid, children[1]);

  }

  // Assign nav classes
  const classes = ['brand', 'sections', 'tools'];
  [...nav.children].forEach((child, i) => {
    if (classes[i]) child.classList.add(`nav-${classes[i]}`);
  });

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  const navSections = nav.querySelector('.nav-sections');
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
