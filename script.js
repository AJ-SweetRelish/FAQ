function checkTriangleRotation() {
  document.querySelectorAll('.parent, .middle, .question').forEach(el => {
    const before = window.getComputedStyle(el, '::before');
    const transform = before.getPropertyValue('transform');
    const isActive = el.classList.contains('active');
    if (isActive) {
      if (transform !== 'none' && transform !== '' && transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
        console.log('Active and triangle is rotated:', el, transform);
      } else {
        console.warn('Active but triangle is NOT rotated:', el, transform);
      }
    } else {
      if (transform === 'none' || transform === '' || transform === 'matrix(1, 0, 0, 1, 0, 0)') {
        console.log('Inactive and triangle is not rotated:', el, transform);
      } else {
        console.warn('Inactive but triangle IS rotated:', el, transform);
      }
    }
  });
}

function toggle(element) {
  event.stopPropagation();
  if (element.classList.contains('parent')) {
    document.querySelectorAll('.parent.active').forEach(el => {
      if (el !== element) {
        el.classList.remove('active');
        el.querySelectorAll('.middle.active, .question.active').forEach(child => {
          child.classList.remove('active');
        });
      }
    });
  }
  element.classList.toggle('active');
  // If closing the clicked parent, close all its descendants
  if (element.classList.contains('parent') && !element.classList.contains('active')) {
    element.querySelectorAll('.middle.active, .question.active').forEach(child => {
      child.classList.remove('active');
    });
  }
  checkTriangleRotation();
}

function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.style.display = bar.style.display === 'block' ? 'none' : 'block';
  if (bar.style.display === 'block') {
    document.body.classList.add('search-open');
    document.getElementById('searchInput').focus();
  } else {
    document.body.classList.remove('search-open');
  }
}

function resetFAQ() {
  // Reset search bar
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');
  searchInput.value = '';
  if (searchBar.style.display === 'block') {
    searchBar.style.display = 'none';
    document.body.classList.remove('search-open');
  }
  const event = new Event('input', { bubbles: true });
  searchInput.dispatchEvent(event);

  // Close all parent dropdowns
  document.querySelectorAll('.parent.active').forEach(el => {
    el.classList.remove('active');
  });

  // Hide no results message
  const noResults = document.getElementById('noResultsMessage');
  if (noResults) noResults.style.display = 'none';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAllDropdowns() {
  document.querySelectorAll('.parent, .middle, .question').forEach(el => {
    el.classList.add('active');
  });
  checkTriangleRotation();
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const noResults = document.getElementById('noResultsMessage');
  const openAllBtn = document.getElementById('openAllDropdownsBtn');
  if (openAllBtn) {
    openAllBtn.addEventListener('click', openAllDropdowns);
  }
  searchInput.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    const allDropdowns = document.querySelectorAll('.parent, .middle, .question');
    let anyVisible = false;

    // Remove all highlights and collapse all
    document.querySelectorAll('mark').forEach(m => m.replaceWith(m.textContent));
    allDropdowns.forEach(drop => {
      drop.classList.remove('active');
      drop.style.display = 'block';
    });

    if (!value) {
      // If search is empty, show all
      allDropdowns.forEach(drop => {
        drop.style.display = 'block';
      });
      if (noResults) noResults.style.display = 'none';
      return;
    }

    // Hide all by default
    allDropdowns.forEach(drop => {
      drop.style.display = 'none';
    });

    // Show and expand matches
    document.querySelectorAll('.dropdown-label').forEach(label => {
      const text = label.textContent.trim().toLowerCase();
      if (text.includes(value)) {
        // Highlight
        label.innerHTML = label.textContent.replace(new RegExp(`(${value})`, 'gi'), '<mark>$1</mark>');
        // Show this dropdown and all ancestors
        let el = label.parentElement;
        while (el && el !== document && el.classList) {
          if (el.classList.contains('parent') || el.classList.contains('middle') || el.classList.contains('question')) {
            el.style.display = 'block';
            el.classList.add('active');
            anyVisible = true;
          }
          el = el.parentElement;
        }
      } else {
        label.innerHTML = label.textContent;
      }
    });

    // Show/hide no results message
    if (value && !anyVisible) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  });
}); 
