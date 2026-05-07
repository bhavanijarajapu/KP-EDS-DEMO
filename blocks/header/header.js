import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.style.cssText = 'display:flex;align-items:center;width:100%;';

  // Brand — KP logo
  const brandDiv = document.createElement('div');
  brandDiv.className = 'nav-brand';
  brandDiv.innerHTML = `<a href="/"><img src="https://hpp.kaiserpermanente.org/failover/assets/images/kp-logo.svg" alt="Kaiser Permanente" width="220" height="40"></a>`;

  // Sections — empty
  const sectionsDiv = document.createElement('div');
  sectionsDiv.className = 'nav-sections';
  sectionsDiv.style.flex = '1';

  // Tools — language picker
  const toolsDiv = document.createElement('div');
  toolsDiv.className = 'nav-tools';
  toolsDiv.style.cssText = 'margin-left:auto;display:flex;align-items:center;';

  try {
    const fragment = await loadFragment(navPath);
    if (fragment && fragment.children.length > 0) {
      const sections = [...fragment.children];
      const lastSection = sections[sections.length - 1];
      if (lastSection.textContent.trim()) {
        toolsDiv.append(lastSection.cloneNode(true));
      }
    }
  } catch (e) {
    toolsDiv.innerHTML = '<p>Language: English</p>';
  }

  nav.append(brandDiv, sectionsDiv, toolsDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
