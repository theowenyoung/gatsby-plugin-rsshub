import React from "react";
const IndexPage = ({
  pageContext: {
    rsshub: { links },
  },
}) => {
  return (
    <div>
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
