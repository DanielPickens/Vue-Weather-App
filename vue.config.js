module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/_colors.scss";',
      },
    },
  },
};
