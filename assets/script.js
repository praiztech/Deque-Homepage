const primaryNav = document.getElementById('primary-nav');
const mainNavList = document.getElementById('main-nav-list');

// with css, ensures search label is visually hidden when user types a query
document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

primaryNav.querySelector('.hamburger-btn').addEventListener('click', (evt) => {
  const target = evt.currentTarget;
  const closeMainNav = target.getAttribute('aria-expanded') === 'true';
  if (closeMainNav) {
    const activatedSubNavBtn = mainNavList.querySelector('.main-subnav-btn[aria-expanded="true"]');
    if (activatedSubNavBtn !== null) toggleContent(activatedSubNavBtn);
  }
  toggleContent(target, closeMainNav);
});

mainNavList.querySelectorAll(':scope .top-item').forEach((topNavItem) => {
  const subNavBtn = topNavItem.querySelector('.main-subnav-btn');
  /*
   * unable to use click evt coz focusout evt on related target 
   * may cause related target to close, moving current target b4 click registers
   * and focusout evt handling is reqd to account for focus change from keyboard tabbing
   */
  subNavBtn.addEventListener('pointerdown', (evt) => {
    evt.preventDefault();
    evt.currentTarget.setPointerCapture(evt.pointerId);
  });
  // used pointerup to execute evt handling to meet WCAG 2.5.2 Pointer Cancellation
  subNavBtn.addEventListener('pointerup', (evt) => {
    const target = evt.currentTarget;
    const activatedSubNavBtn = mainNavList.querySelector('.main-subnav-btn[aria-expanded="true"]');
    if (!(activatedSubNavBtn === null || activatedSubNavBtn === target)) toggleContent(activatedSubNavBtn);
    toggleContent(target, target.getAttribute('aria-expanded') === 'true');
    target.focus();
  });
  topNavItem.addEventListener('focusout', (evt) => {
    const target = evt.currentTarget;
    if (!target.contains(evt.relatedTarget)) toggleContent(target.querySelector('.main-subnav-btn'));
  });
});

primaryNav.addEventListener('focusout', (evt) => {
  if (primaryNav.contains(evt.relatedTarget)) return;
  const activatedSubNavBtn = mainNavList.querySelector('.main-subnav-btn[aria-expanded="true"]');
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

// ensures accordion panel is hidden from all users after it closes
document.querySelectorAll('.accordion [id^="panel"]').forEach((accordionPanel) => {
  accordionPanel.addEventListener('animationend', (evt) => {
    if (evt.animationName === 'hide') evt.target.setAttribute('hidden', 'hidden');
  });
});

document.addEventListener('keydown', (evt) => {
  switch (evt.key) {
    case 'Escape':
      // check if a main-sub-nav btn is activated
      let activatedNavBtn = mainNavList.querySelector('.main-subnav-btn[aria-expanded="true"]');
      // else check if the hamburger btn is activated
      if (!window.matchMedia('(min-width: 48em)').matches && activatedNavBtn === null) {
        activatedNavBtn = primaryNav.querySelector('.hamburger-btn[aria-expanded="true"]');
      }
      if (activatedNavBtn !== null) {
        toggleContent(activatedNavBtn);
        activatedNavBtn.focus();
      }
      break;
    case ' ': // necessary coz click evt cant be used
    case 'Enter':
      const target = evt.target;
      if (target.classList.contains('main-subnav-btn')) {
        toggleContent(target, target.getAttribute('aria-expanded') === 'true');
      }
      break;
  }
});

function toggleContent(btn, hideContent = true, contentType = 'nav') {
  btn.setAttribute('aria-expanded', hideContent ? 'false' : 'true');

  /*
   * corresponding nav list does not always immediately follow btn but aria-controls
   * always points to the right nav list
   */
  const content = document.getElementById(`${btn.getAttribute('aria-controls')}`);
  switch (contentType) {
    case 'accordion':
      if (hideContent) {
        content.classList.remove('show');
        content.classList.add('hide');
        // animationend evt handler sets hidden attribute
      } else {
        content.removeAttribute('hidden'); // makes content available to all users
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
        case false: // main subnav btn
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
