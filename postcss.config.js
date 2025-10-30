// PostCSS configuration using plugin names/arrays (compatible with PostCSS loader).
// Plugins can be provided as strings or as [name, options] tuples. This matches
// the example you provided and allows PostCSS to resolve the plugins by name.
module.exports = {
  plugins: [
    // A plugin that does not require configuration
    'tailwindcss',

    // A plugin which needs a configuration object (not required for autoprefixer here,
    // but shown as an example):
    ['autoprefixer', {}],
  ],
};
