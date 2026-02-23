import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-skeleton">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="loader-block" />
      ))}
    </div>
  );
};

export default Loader;
