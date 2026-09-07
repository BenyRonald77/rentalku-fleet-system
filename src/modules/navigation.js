// Navigation & App Shell Module
import { initIcons } from '../utils/icons.js';
import { store } from '../data/store.js';

export function setupNavigation(onNavigate, onModeChange) {
  const navLinks = document.querySelectorAll('.nav-link');
  const modeBtns = document.querySelectorAll('.mode-btn');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      if (!target) return;

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      onNavigate(target);
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      onModeChange(mode);
    });
  });

  // Mobile hamburger toggle if present
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Update branch display in sidebar footer
  const branch = store.getBranch();
  const branchNameEl = document.getElementById('sidebarBranchName');
  if (branchNameEl && branch) {
    branchNameEl.textContent = branch.name.split('—')[0].trim();
  }

  initIcons();
}
