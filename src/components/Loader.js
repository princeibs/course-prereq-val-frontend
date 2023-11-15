import React from 'react'
import "./Loader.css"

const Loader = () => {
  return (
    <div class="w-full h-[70vh] flex justify-center items-center">
      <div class="lds-facebook"><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader