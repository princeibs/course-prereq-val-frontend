import React from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const Home = ({userDetails}) => {
  const [cookies, _] = useCookies(["access_token"])

  return (
    <div className='flex mx-[5rem] border-0 flex-col sm:flex-col sm:m-0 sm:p-0 min-h-[80vh]'>
      {/* <div className={`rounded-lg w-[40%]  sm:border-0 mt-8 ${role == 2 ? 'border bg-primary-100' : ''} sm:bg-primary-50 flex flex-col justify-center items-center  sm:w-[90%] sm:mx-auto`}> */}
        {cookies.access_token? (
          <>
          <div>Hello World</div>
          </>
        ) : (
          <>
            <Link to={"/register"}><div className='w-[16rem] sm:w-[20rem] flex justify-center items-center h-[5rem] mt-[2rem] text-white bg-black hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center'>Register</div></Link>
            <Link to={"/login"}><div className='w-[16rem] sm:w-[20rem] flex justify-center items-center h-[5rem] mt-[2rem] text-white bg-black hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center'>Login</div></Link>
          </>
            )}
      {/* </div> */}
    </div>
  )
}

export default Home