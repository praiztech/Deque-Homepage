const primaryNav = document.getElementById('primary-nav');

document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

primaryNav.firstElementChild.addEventListener('click', (evt) => {
  const target = evt.currentTarget;
  const closeMainNav = target.getAttribute('aria-expanded') === 'true';
  if (closeMainNav) {
    const activatedSubNavBtn = primaryNav.lastElementChild.querySelector('.main-subnav-btn[aria-expanded="true"]');
    if (activatedSubNavBtn !== null) toggleContent(activatedSubNavBtn);
  }
  toggleContent(target, closeMainNav);
});

primaryNav.lastElementChild.querySelectorAll(':scope .top-item').forEach((topNavItem) => {
  // unable to use click evt coz main-subnav-btn may move b4 click evt registers
  topNavItem.firstElementChild.addEventListener('pointerdown', (evt) => {
    evt.preventDefault();
    evt.currentTarget.setPointerCapture(evt.pointerId);
  });
  topNavItem.firstElementChild.addEventListener('pointerup', (evt) => {
    const target = evt.currentTarget;
    const activatedSubNavBtn = primaryNav.lastElementChild.querySelector('.main-subnav-btn[aria-expanded="true"]');
    if (!(activatedSubNavBtn === null || activatedSubNavBtn === target)) toggleContent(activatedSubNavBtn);
    toggleContent(target, target.getAttribute('aria-expanded') === 'true');
    target.focus();
  });
  topNavItem.addEventListener('focusout', (evt) => {
    const target = evt.currentTarget;
    if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
  });
});

primaryNav.addEventListener('focusout', (evt) => {
  if (primaryNav.contains(evt.relatedTarget)) return;
  const activatedSubNavBtn = primaryNav.lastElementChild.querySelector('.main-subnav-btn[aria-expanded="true"]');
  const activatedHamburgerBtn = primaryNav.querySelector('.hamburger-btn[aria-expanded="true"]');
  if (activatedSubNavBtn !== null) toggleContent(activatedSubNavBtn);
  if (activatedHamburgerBtn !== null) toggleContent(activatedHamburgerBtn);
})

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
  switch (evt.key) {
    case 'Escape':
      // check if a main-sub-nav btn is activated
      let activatedNavBtn = primaryNav.lastElementChild.querySelector('.main-subnav-btn[aria-expanded="true"]');
      // else check if the hamburger-btn is activated
      if (!window.matchMedia('(min-width: 48em)').matches && activatedNavBtn === null) {
        activatedNavBtn = primaryNav.querySelector('.hamburger-btn[aria-expanded="true"]');
      }
      if (activatedNavBtn !== null) {
        toggleContent(activatedNavBtn);
        activatedNavBtn.focus();
      }
      break;
    case ' ':
    case 'Enter':
      const target = evt.target;
      if (target.classList.contains('main-subnav-btn')) {
        toggleContent(target, target.getAttribute('aria-expanded') === 'true');
      }
      break;
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
