 const path = require('path')
 const runQuery = (handler, query) =>
  handler(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }

    return r.data
  })
exports.runQuery = runQuery
 const defaultOptions = {
  outputType:'xml',
  prefix:'',
  titleLengthLimit:150,
  // Run a default query to gather some information about the site.
  query: `
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `,
  serialize({query}){
    return {siteUrl:query.site.siteMetadata.siteUrl}
  },
  rsshubQuery:`
    {
      allRsshub {
        edges {
          node {
            slug
            json
            data {
              updated
              title
            }
          }
        }
      }
    }
  `,
  indexPath:'/rsshub',
  indexComponent:path.resolve(__dirname,'meta.js')

}

exports.defaultOptions = defaultOptions