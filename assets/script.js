document.getElementById('search-input').addEventListener('input', (evt) => {
  const searchInput = evt.target;
  searchInput.setAttribute('value', searchInput.value);
});