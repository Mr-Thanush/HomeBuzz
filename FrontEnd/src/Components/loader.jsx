import React from "react";
import '../Styles/loader.css';

function Loader() {
  return (
    <div className="loaderContainer" role="alert" aria-busy="true" aria-live="polite">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;