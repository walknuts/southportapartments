const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');

module.exports = function(eleventyConfig) {
  // Add Eleventy Navigation plugin
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  
  // Ignore problematic files
  eleventyConfig.ignores.add("src/pages/*.md");
  
  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });

  // Custom collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date; // Sort posts in reverse chronological order
    });
  });

  // Add categories as a collection
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach(item => {
      if (item.data.categories) {
        item.data.categories.forEach(category => categories.add(category));
      }
    });
    return [...categories].sort();
  });

  // Simple filter for slugifying
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  });
  
  // Array slice filter (similar to Array.slice())
  eleventyConfig.addFilter("slice", function(array, start, end) {
    if (!Array.isArray(array)) return [];
    return array.slice(start, end);
  });

  // Return configuration object
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};