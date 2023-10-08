// @ts-ignore
function Resolver(path, options) {
  return options.defaultResolver(path, {
    ...options,
// @ts-ignore
    packageFilter: pkg => {
      if (pkg.name === 'nanoid') {
        // eslint-disable-next-line
        delete pkg.exports;
        // eslint-disable-next-line
        delete pkg.module;
      }
      return pkg;
    },
  });
}

module.exports = Resolver;