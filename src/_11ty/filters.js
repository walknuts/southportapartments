module.exports = {
  // Date display filter
  dateDisplay: (dateObj) => {
    const date = new Date(dateObj);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  },

  // Filter posts by category
  filterByCategory: (posts, category) => {
    return posts.filter(post => {
      return post.data.categories && post.data.categories.includes(category);
    });
  },

  // Get a subset of posts
  head: (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if(n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  },

  // Create a URL-friendly slug
  slug: (str) => {
    if (!str) {
      return '';
    }
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Limit string to specific length
  limit: (str, limit) => {
    if (!str || str.length <= limit) {
      return str;
    }
    return str.slice(0, limit) + '...';
  },

  // Current year for copyright
  currentYear: () => {
    return new Date().getFullYear();
  }
};