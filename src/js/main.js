// Main JavaScript file for Southport Apartments website

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.navbar .dropdown div[role="button"]');
  const mobileMenu = document.querySelector('.navbar .dropdown ul.dropdown-content');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('dropdown-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.remove('dropdown-open');
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'southport' ? 'southportDark' : 'southport';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  // Handle active states for current page in navigation
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar a, .footer a').forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath.includes('/blog/') && link.getAttribute('href') === '/blog/')) {
      link.classList.add('active');
    }
  });
});