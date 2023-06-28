const topLinks = document.getElementById('top-links');

document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

topLinks.parentElement.querySelector('.hamburger-btn').addEventListener('click', (evt) => {
  const target = evt.currentTarget;
  toggleContent(target, target.getAttribute('aria-expanded') === 'true');
});

topLinks.parentElement.querySelector('.hamburger-btn').addEventListener('focusout', (evt) => {
  const target = evt.currentTarget;
  if (!topLinks.contains(evt.relatedTarget)) {
    const openSubNavBtn = topLinks.querySelector('.main-subnav-btn[aria-expanded="true"]');
    if (openSubNavBtn !== null) toggleContent(openSubNavBtn);
    toggleContent(target);
  }
});

topLinks.querySelectorAll(':scope .main-subnav-btn').forEach((subNavBtn) => {
  subNavBtn.addEventListener('click', (evt) => {
    const target = evt.currentTarget;
    toggleContent(target, target.getAttribute('aria-expanded') === 'true');
  });
});

topLinks.querySelectorAll(':scope .top-item').forEach((topNavItem) => {
  topNavItem.addEventListener('focusout', (evt) => {
    const target = evt.currentTarget;
    if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
  })
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
  let activatedNavBtn = topLinks.querySelector('.main-subnav-btn[aria-expanded="true"]');
  // check if hamburger-btn is activated
  if (!window.matchMedia('(min-width: 48em)').matches && activatedNavBtn === null) {
    activatedNavBtn = topLinks.parentElement.querySelector('.hamburger-btn[aria-expanded="true"]');
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

function toggleContent(btn, hideContent = true, contentType = 'nav') {
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
    case 'nav':
      switch (btn.classList.contains('hamburger-btn')) {
        case true:
          hideContent ? content.removeAttribute('data-visible') : content.setAttribute('data-visible', 'true');
          break;
        case false:
          if (hideContent) {
            (
              window.matchMedia('(min-width: 48em)').matches ?
              btn.classList.add('hidden-sublist') :
              btn.querySelector('svg').classList.remove('rotate')
            );
            content.parentElement.setAttribute('hidden', 'hidden');
          } else {
            (
              window.matchMedia('(min-width: 48em)').matches ?
              btn.classList.remove('hidden-sublist') :
              btn.querySelector('svg').classList.add('rotate')
            );
            content.parentElement.removeAttribute('hidden');
          }
          break;
      }
      break;
  }
}
