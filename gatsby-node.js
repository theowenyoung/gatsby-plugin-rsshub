const fs = require("fs-extra")
const  path = require("path")
const { defaultOptions, runQuery } = require("./internals")
const template = require('./template')
const publicPath = `./public`
exports.createPages = async ({ graphql, actions },pluginOptions) => {
  const { createPage } = actions
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }
  const outputType = options.outputType;
  const template = options.indexComponent;
  const rsshubQuery = await runQuery(graphql,options.rsshubQuery)
  const links = []
  for(let i=0;i<rsshubQuery.allRsshub.edges.length;i++){
    const {node} = rsshubQuery.allRsshub.edges[i];
    const outputPath = getOutputPath({
      node,
      outputType
    })
    links.push({
      href:outputPath,
      title:node.data.title,
      updated:node.data.updated
    })
  }
  createPage({
    // Path for this page — required
    path: options.indexPath,
    component: template,
    context: {
     rsshub:{
       links
     }
    },
  })

}
exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  /*
   * Run the site settings query to gather context, then
   * then run the corresponding feed for each query.
   */
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }
  const prefix = options.prefix;
  const outputType = options.outputType
  const serialize = options.serialize;
  const baseQuery = await runQuery(graphql, options.query)
  const {siteUrl} = serialize({
    query:baseQuery
  })
  const titleLengthLimit = options.titleLengthLimit
  const rsshubQuery = await runQuery(graphql,options.rsshubQuery)
  for(let i=0;i<rsshubQuery.allRsshub.edges.length;i++){
    const {node} = rsshubQuery.allRsshub.edges[i]
    const json = node.json
    const data  = JSON.parse(json)
    const outputPath = getOutputPath({
      node,
      outputType
    })
    const outputData =await template({
      data,
      type:outputType,
      atomlink:siteUrl+"/"+outputPath,
      titleLengthLimit
    })
    await fs.outputFile(path.resolve(publicPath,prefix,outputPath),outputData)
  }
  
  
}

function getOutputPath({node,outputType}){
    const ext = path.extname(node.slug)
    const outputTypeExt = `.${outputType}`
    const outputPath = `${node.slug}${ext?"":outputTypeExt}`
    return outputPath
}