document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});

document.querySelector('.hamburger-btn').addEventListener('click', (evt) => {
  const hamburgerButton = evt.currentTarget;
  const navIsOpen = hamburgerButton.getAttribute('aria-expanded') === 'true';
  hamburgerButton.setAttribute('aria-expanded', navIsOpen ? 'false' : 'true');
  hamburgerButton.nextElementSibling.toggleAttribute('hidden');
})