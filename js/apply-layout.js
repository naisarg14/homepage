// Fetch templates/layout.html and inject current page content into #site-content
(async function() {
  try {
    const pageContainer = document.getElementById('page-content');
    if (!pageContainer) return; // nothing to do

    const pageHTML = pageContainer.innerHTML;
    const pageName = (pageContainer.dataset.page || document.title || '').trim();

    const resp = await fetch('templates/layout.html');
    if (!resp.ok) {
      console.error('Failed to load layout:', resp.status);
      return;
    }

    const layoutText = await resp.text();

    // Replace body contents with layout HTML
    document.body.innerHTML = layoutText;

    // Insert page content
    const siteContent = document.getElementById('site-content');
    if (siteContent) siteContent.innerHTML = pageHTML;

    // Set active nav link by matching link href or text to data-page or filename
    const links = document.querySelectorAll('.nav a');
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      a.classList.remove('active');
      try {
        const hrefFile = a.getAttribute('href').split('/').pop();
        if (hrefFile === currentFile) a.classList.add('active');
        else if (pageName && a.textContent.trim().toLowerCase() === pageName.toLowerCase()) a.classList.add('active');
      } catch (e) {}
    });

    // Populate year in footer if present
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // run any inline scripts inside injected content (simple approach)
    siteContent.querySelectorAll('script').forEach(oldScript => {
      const s = document.createElement('script');
      if (oldScript.src) s.src = oldScript.src;
      else s.textContent = oldScript.textContent;
      document.body.appendChild(s);
    });

  } catch (err) {
    console.error('apply-layout error', err);
  }
})();
