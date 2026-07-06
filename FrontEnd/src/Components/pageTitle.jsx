import { useEffect } from "react";

function PageTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} | HomeBuzz` : "HomeBuzz";
  }, [title]);

  return null;
}

export default PageTitle;