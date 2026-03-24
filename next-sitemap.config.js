/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://umair-ahmed-portfolio.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'monthly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
    ],
    additionalSitemaps: [],
  },
};
