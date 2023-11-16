import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import { baseUrl } from '../../helpers/config'

const Courses = () => {
  const [loading, setLoading] = useState(false)
  const [cookies, setCookies] = useCookies();
  const [courses, setCourses] = useState([])

  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [creditUnits, setCreditUnits] = useState(0)
  const [status, setStatus] = useState("core")
  const [prerequisite, setPrerequisite] = useState("")

  function splitCourseCode(str) {
    if (!str) return
    str = str.toString().toUpperCase()
    let index = str.search(/\d/); // Find the index of the first number

    if (index !== -1) {
      // Split the string at the index of the first number with space preservation
      let firstPart = str.slice(0, index);
      let secondPart = str.slice(index);
      return `${firstPart} ${secondPart}`;
    } else {
      // If no number found, return the whole string
      return str;
    }
  }

  const getCoursePayload = () => {
    if (prerequisite && prerequisite !== '-') {
      return {  
        code, title, credit_units: creditUnits.toString(), status, prerequisite
      }
    } else {
      return {
        code, title, credit_units: creditUnits.toString(), status
      }
    }
  }

  const loadCourses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/course`,
      {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      if (res.data.statusCode === 200) {
        setCourses(res.data?.data.courses)
      } else {  
        toast.error('Failed to load courses')
        toast.error(res.data?.message)
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message)
      console.log(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${baseUrl}/course`, getCoursePayload(),
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      )
      if (res.data.statusCode === 201) {
        toast.success('Added new course successfully')
        await loadCourses()
      } else {
        toast.error('Failed to add course')
        toast.error(res.data?.message)
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message)
      console.log(e)
    } 
  }

  useEffect(() => {
    loadCourses()
  }, [])

  return (
    <div className='w-full flex items-center flex-col mb-12'>

      {/* Add Course */}
      <div className='w-[500px]'>
        <p className='text-2xl mb-4 text-center'>Add Course</p>
        <form onSubmit={handleSubmit}>
          <div class="mb-6">
            <label for="ccode" class="block mb-2 text-sm font-medium text-gray-900">Course Code</label>
            <input type="text" id="ccode" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" value={code} onChange={e => setCode(e.target.value)} required />
          </div>
          <div class="mb-6">
            <label for="ccode" class="block mb-2 text-sm font-medium text-gray-900">Course Title</label>
            <input type="text" id="ccode" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div class="mb-6">
            <label for="ccode" class="block mb-2 text-sm font-medium text-gray-900">Course Credit Units</label>
            <input type="number" id="ccode" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" value={creditUnits} onChange={e => setCreditUnits(e.target.value)} required />
          </div>
          <label for="ccode" class="block mb-2 text-sm font-medium text-gray-900">Status</label>
          <select
            onChange={(e) => setStatus(e.target.value)}
            class="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option selected value="core">Core</option>
            <option value="elective">Elective</option>
            <option value="general">General</option>
          </select>

          <label for="ccode" class="block mb-2 text-sm font-medium text-gray-900">Prerequisite</label>

            {courses.length > 0 ? (
              <>          
              <select
            onChange={(e) => setPrerequisite(e.target.value)}
            class="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
              <option value="-">None</option>
              {
                courses.map(course => (
                  <option value={course._id}>{`${course.title} (${splitCourseCode(course.code)})`}</option>
                ))
              }  
              </select>
              </>
            ) : (<div>No prerequisite course found</div>)}
        
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
        </form>
      </div>

      {/* List Courses */}
      <div className='w-[700px] mt-12'>
        <p className='text-2xl mb-4 text-center'>Courses</p>
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                      <th scope="col" class="px-6 py-3">
                          Course Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Course Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Credit Unit
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Status
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Prerequisite
                      </th>
                  </tr>
              </thead>
              <tbody>
                {courses?.map(course => (
                  <tr class="bg-white border-b hover:bg-gray-100">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {splitCourseCode(course.code)}
                      </th>
                      <td class="px-6 py-4">
                          {course.title}
                      </td>
                      <td class="px-6 py-4">
                          {course.credit_units}
                      </td>
                      <td class="px-6 py-4">
                          {course.status}
                      </td>
                      <td class="px-6 py-4">
                          {splitCourseCode(course?.prerequisite?.code)}
                      </td>
                  </tr>
                ))}
       
              </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Courses