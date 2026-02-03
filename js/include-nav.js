// Inject shared navbar from templates/nav.html and mark active link
function loadSharedNav(){
  const placeholder = document.getElementById('site-nav');
  if(!placeholder) return;
  fetch('templates/nav.html')
    .then(r => r.ok ? r.text() : Promise.reject('nav load failed'))
    .then(html => {
      placeholder.innerHTML = html;
      const pageHint = (placeholder.dataset.page || '').toLowerCase();
      const links = placeholder.querySelectorAll('a');
      links.forEach(a => {
        const text = (a.textContent || '').trim().toLowerCase();
        if(pageHint && text === pageHint.toLowerCase()) a.classList.add('active');
        const href = a.getAttribute('href') || '';
        const current = location.pathname.split('/').pop().toLowerCase();
        if(current && href.toLowerCase() === current) a.classList.add('active');
      });
    })
    .catch(e => console.error('loadSharedNav', e));
}
document.addEventListener('DOMContentLoaded', loadSharedNav);
