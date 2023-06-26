const topLinks = document.getElementById('top-links');

document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

topLinks.parentElement.querySelector('.hamburger-btn').addEventListener('click', (evt) => {
  const target = evt.currentTarget;
  const closeNavList = target.getAttribute('aria-expanded') === 'true';
  if (closeNavList) closeSubNavList();
  toggleContent(target, closeNavList);
});

topLinks.querySelectorAll(':scope button').forEach((subNavBtn) => {
  subNavBtn.addEventListener('click', (evt) => {
    const target = evt.currentTarget;
    const closedNavListBtn = closeSubNavList();
    if (closedNavListBtn !== target) { // not the same btn clicked repeatedly
      toggleContent(target, false);
    }
  });
});

document.getElementById('main-nav-list').querySelectorAll(':scope .top-item').forEach((topNavItem) => {
  topNavItem.addEventListener('focusout', (evt) => {
    const target = evt.currentTarget;
    if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
  })
});

topLinks.parentElement.addEventListener('focusout', (evt) => {
  if (window.matchMedia('(min-width: 48em)').matches) return;
  const target = evt.currentTarget;
  if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
});

document.querySelectorAll('.accordion button').forEach((accordionBtn) => {
  accordionBtn.addEventListener('click', (evt) => {
    const target = evt.currentTarget;
    toggleContent(target, target.getAttribute('aria-expanded') === 'true', 'accordion');
  });
});

document.querySelectorAll('.accordion [id^="panel"]').forEach((accordionPanel) => {
  accordionPanel.addEventListener('animationend', (evt) => {
    if (evt.animationName === 'hide') evt.target.setAttribute('hidden', 'hidden');
  });
});

document.addEventListener('keydown', (evt) => {
  if (evt.key !== 'Escape') return;
  // check if a sub-nav btn is activated
  let activatedNavBtn = document.getElementById('main-nav-list').querySelector('button[aria-expanded="true"]');
  // check if hamburger-btn is activated
  if (!window.matchMedia('(min-width: 48em)').matches && activatedNavBtn === null) {
    activatedNavBtn = document.querySelector('.hamburger-btn[aria-expanded="true"]');
  }
  if (activatedNavBtn !== null) {
    toggleContent(activatedNavBtn);
    activatedNavBtn.focus();
  }
});

document.addEventListener('scroll', () => {
  if (!window.matchMedia('(min-width: 48em)').matches) return;
  const primaryNav = document.getElementById('primary-nav');
  if (primaryNav.getBoundingClientRect().top === 0 && !primaryNav.classList.contains('sticky')) {
    primaryNav.classList.add('sticky');
  } else if (primaryNav.getBoundingClientRect().top > 0 && primaryNav.classList.contains('sticky')) {
    primaryNav.classList.remove('sticky');
  }
});

function closeSubNavList() {
  const expandedSubNavBtn = topLinks.querySelector('button[aria-expanded="true"]');
  if (expandedSubNavBtn !== null) toggleContent(expandedSubNavBtn);
  return expandedSubNavBtn;
}

function toggleContent(btn, hideContent = true, contentType = 'menu') {
  const content = document.getElementById(`${btn.getAttribute('aria-controls')}`);
  btn.setAttribute('aria-expanded', hideContent ? 'false' : 'true');
  switch (contentType) {
    case 'accordion':
      if (hideContent) {
        content.classList.remove('show');
        content.classList.add('hide');
      } else {
        content.removeAttribute('hidden');
        content.classList.remove('hide');
        document.documentElement.style.setProperty('--accordion-content-height', content.scrollHeight + 'px');
        content.classList.add('show');
      }
      break;
    case 'menu':
      switch (btn.className === 'hamburger-btn') {
        case true:
          const btnSvg = btn.querySelector('svg');
          if (hideContent) {
            btnSvg.classList.remove('open');
            content.removeAttribute('data-visible');
          } else {
            btnSvg.classList.add('open');
            content.setAttribute('data-visible', 'true');
          }
          break;
        case false:
          if (hideContent) {
            btn.classList.add('hidden-sublist');
            content.parentElement.setAttribute('hidden', 'hidden');
          } else {
            btn.classList.remove('hidden-sublist');
            content.parentElement.removeAttribute('hidden');
          }
          break;
      }
      break;
  }
}
