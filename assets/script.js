const mainNavList = document.getElementById('main-nav-list');

document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

document.querySelector('.hamburger-btn').addEventListener('click', (evt) => {
  const target = evt.currentTarget;
  const closeNavList = target.getAttribute('aria-expanded') === 'true';
  if (closeNavList) closeSubNavList();
  toggleContent(target, closeNavList);
});

mainNavList.querySelectorAll(':scope button').forEach((subNavBtn) => {
  subNavBtn.addEventListener('click', (evt) => {
    const target = evt.currentTarget;
    const closedNavListBtn = closeSubNavList();
    if (closedNavListBtn !== target) { // not the same btn clicked repeatedly
      toggleContent(target, false);
    }
  });
});

mainNavList.querySelectorAll(':scope .main-nav-item').forEach((navItem) => {
  navItem.addEventListener('focusout', (evt) => {
    const target = evt.currentTarget;
    if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
  })
});

mainNavList.parentElement.addEventListener('focusout', (evt) => {
  const target = evt.currentTarget;
  if (!target.contains(evt.relatedTarget)) toggleContent(target.firstElementChild);
});

document.addEventListener('keydown', (evt) => {
  if (evt.key !== 'Escape') return;
  const activatedNavBtn = (
    // check if a sub-nav btn is activated. if not, check if the mobile-nav btn is activated
    mainNavList.querySelector('button[aria-expanded="true"]') ??
    mainNavList.parentElement.querySelector('button[aria-expanded="true"]')
  );
  if (activatedNavBtn !== null) {
    toggleContent(activatedNavBtn);
    activatedNavBtn.focus();
  }
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

function closeSubNavList() {
  const expandedSubNavBtn = mainNavList.querySelector('button[aria-expanded="true"]');
  if (expandedSubNavBtn !== null) toggleContent(expandedSubNavBtn);
  return expandedSubNavBtn;
}

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
      const navBtnSvg = btn.querySelector('svg');
      if (hideContent) {
        navBtnSvg.classList.remove('open');
        content.setAttribute('hidden', 'hidden')
      } else {
        navBtnSvg.classList.add('open');
        content.removeAttribute('hidden');
      }
      break;
  }
}
