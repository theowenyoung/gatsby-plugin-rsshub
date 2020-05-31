# gatsby-plugin-rsshub

Generate static xml from rsshub

_NOTE: This plugin only generates output when run in `production` mode! To test your sitemap, run: `gatsby build && gatsby serve`_

## Pre require

You must install [gatsby-source-rsshub](https://github.com/theowenyoung/gatsby-source-rsshub) first.

## Install

`npm install --save gatsby-plugin-rsshub`

## How to Use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-rsshub`
    }
```

All options:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-rsshub`,
      options: {
        // xml or atom, default xml
        outputType:"xml",
        // default 150
        titleLengthLimit:150,
        // rss output path prefix, base on public , default ""
        prefix:'', 
        // query siteUrl graphql
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
          }
        `,
        // should return object with key siteUrl
        serialize({query}){
          return {siteUrl:query.site.siteMetadata.siteUrl}
        }, 
        // generate meta index page path
        indexPath:"/rsshub",
        // index template component
        indexComponent:""
      },
    },
  ],
}
```
