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
  const prefix = options.prefix;
  const outputType = options.outputType;
  const template = options.indexComponent;
  const baseQuery = await runQuery(graphql, options.query)
  const rsshubQuery = await runQuery(graphql,options.rsshubQuery)
  const links = []
  for(let i=0;i<rsshubQuery.allRsshub.edges.length;i++){
    const {node} = rsshubQuery.allRsshub.edges[i];
    const outputPath = getOutputPath({
      node,
      outputType,
      prefix
    })
    
    links.push({
      href:(`/${outputPath}`),
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
     },
     siteMetadata:baseQuery.site.siteMetadata
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
  const templateDataSerialize = options.templateDataSerialize;
  const rsshubQuery = await runQuery(graphql,options.rsshubQuery)
  for(let i=0;i<rsshubQuery.allRsshub.edges.length;i++){
    const {node} = rsshubQuery.allRsshub.edges[i]
    const json = node.json
    let data  = JSON.parse(json)
    if(templateDataSerialize && typeof templateDataSerialize === 'function'){
      data = templateDataSerialize(data);
    }
    const outputPath = getOutputPath({
      node,
      outputType,
      prefix
    })
    
    const outputData =await template({
      data,
      type:outputType,
      atomlink:siteUrl+"/"+outputPath,
      titleLengthLimit
    })
    await fs.outputFile(path.resolve(publicPath,outputPath),outputData)
  }
  
  
}

function getOutputPath({node,outputType,prefix}){
    let ext = path.extname(node.slug)
    if(ext!=='.xml' && ext !=='.atom'){
      ext = ''
    }
    const outputTypeExt = `.${outputType}`
    let outputPath = `${prefix}${node.slug}${ext?"":outputTypeExt}`
    // Make sure pathPrefix is empty if not needed
    // Make sure pathPrefix only contains the first forward slash
    outputPath = outputPath.replace(/\/\//g, "/")    
    if(outputPath.indexOf('/')===0){
      outputPath = outputPath.slice(1)
    }
    return outputPath
}