// import React from 'react'
// import "./Loader.css"

// const Loader = () => {
//   return (
//     <div class="w-full h-[70vh] flex justify-center items-center">
//       <div class="lds-facebook"><div></div><div></div><div></div></div>
//     </div>
//   )
// }

// export default Loader

import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
