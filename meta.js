import React from "react";
import SEO from './seo'
const IndexPage = ({
  pageContext: {
    rsshub: { links },
    siteMetadata
  },
}) => {
  return (
    <div>
      <SEO siteTitle={siteMetadata.title}  siteDescription={siteMetadata.description} title="RSS List" author={siteMetadata.author}></SEO>
      <h2>Rss List</h2>
      <ul>
        {links.map((item) => (
          <li>
            <a href={item.href}>{item.title}</a> &nbsp;updated:&nbsp;{item.updated}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
