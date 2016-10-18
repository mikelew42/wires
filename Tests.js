function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./Base', true, /\.tests\.js$/));
// make a /src/ and /public/ folder
// we can't use "./" yet, because then webpack will search node_modules :/