import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import { toast } from 'react-toastify'
import axios from 'axios'
import { baseUrl } from '../helpers/config'

const Navbar = ({userDetails, userId, cookies, role, setCookies, setUserDetails}) => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    try {    
      setCookies("access_token", "");
      setCookies("role", "");
      setUserDetails("")
      toast.success("Logout successful")
      navigate("/");
  } catch (e) {
          toast.error(e?.response?.data?.message);
          toast.error(e?.message)
          console.error(e)
  } finally {
      setLoading(false)
  }
  }

  return (
    <div className='flex flex-row items-center w-full px-[20px] py-[30px] mb-4 bg-green-500 sm:flex-col sm:items-start sm:p-3'>
      <div id='logo-text' className='text-2xl sm:text-2xl sm:font-semibold sm:mx-auto'>Course Registration Prerequisite Validator</div>
      <div className='font-bold flex flex-row justify-around items-center w-[700px] h-[50px] rounded-[10px] ml-[6rem] no-underline sm:m-0 sm:w-full sm:border-0 sm:flex-wrap sm:h-auto sm:items-start sm:mt-4 sm:gap-1'>  
        <Link className='sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/">Home</Link>

        {/* {(userDetails.role == 2) && <Link className='bg-primary-100 sm:bg-primary-0 sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/x">Search</Link> }
        {(userDetails.role == 2) && <Link className='bg-primary-100 sm:bg-primary-0 sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/y">Supervisor/Topic</Link> } */}
        
        <div className='block sm:hidden'>|</div>
        {cookies.access_token? (
          <>
          {role == 'student' && (
            <>
              <Link className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/course/reg">Course Reg</Link>
              <Link className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/results">Results</Link>
            </>
          )}

          {role == 'admin' && (
            <>
              <Link className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/admin/courses">Courses</Link>
              <Link className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/admin/results">Results</Link>
              {/* <Link className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/admin/students">Students</Link> */}
            </>
          )}
            <div className='cursor-pointer sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' onClick={logout}>Logout</div>
          </>
        ) : (
          <>
            <Link className='sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/login">Log in</Link>
            <Link className='sm:rounded-md sm:px-6 sm:py-2 drop-shadow-[0] sm:drop-shadow' to="/register">Register</Link>
          </>
        )}
      </div>
      {(cookies.access_token) && (<div className='border text-white mx-auto px-4 py-2 sm:mt-4 rounded-md bg-slate-700'>{userDetails? userDetails.full_name?.toString().toUpperCase() : ""}</div>)}
    </div>
  )
}

export default Navbar