const I18N = {
  useCookie: false,
  alwaysRedirect: true,
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
      file: 'en/index.js',
    },
    {
      code: 'ko',
      iso: 'ko-Kr',
      name: '한국어',
      file: 'ko/index.js',
    },
  ],
  lazy: true,
  seo: false,
  langDir: '/locales/',
  defaultLocale: 'ko',
  parsePages: false,
};

module.exports = {
  I18N,
};
