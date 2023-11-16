import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { baseUrl } from "../../helpers/config";

const RegisterCourse = () => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useCookies();
  const [courses, setCourses] = useState([]);
  const [registeredCoursesList, setRegisteredCoursesList] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  function splitCourseCode(str) {
    if (!str) return;
    str = str.toString().toUpperCase();
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

  const loadCourses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/course`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      if (res.data.statusCode === 200) {
        setCourses(res.data?.data.courses);
      } else {
        toast.error("Failed to load courses");
        toast.error(res.data?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    }
  };

  const loadRegisteredCourses = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/course/${cookies.user_id}/registered`,
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      );
      if (res.data.statusCode === 200) {
        const courses = res.data?.data.courses;
        setRegisteredCourses(courses);
        const regCourses = courses.map((course) => course.course_id._id);
        setRegisteredCoursesList(regCourses);
      } else {
        toast.error("Failed to load courses");
        toast.error(res.data?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    }
  };

  const registerCourse = async (e, course_id) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${baseUrl}/course/register`,
        { course_id },
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      );
      if (res.data.statusCode === 201) {
        toast.success("Registered course successfully");
        await loadCourses();
        await loadRegisteredCourses();
      } else {
        if (res.data?.message) {
          toast.error(res.data?.message);
        } else {
          toast.error("Failed to register course");
        }
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    }
  };

  useEffect(() => {
    loadCourses();
    loadRegisteredCourses();
  }, []);

  return (
    <div className="w-full flex items-center flex-col mb-12">

      {/* Registered Courses */}
      <div className="w-[700px] mt-12">
        <p className="text-2xl mb-4 text-center">Registered Courses</p>
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
                {/* <th scope="col" class="px-6 py-3">
                  Prerequisite
                </th> */}
                {/* <th scope="col" class="px-6 py-3">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {registeredCourses?.map((course) => (
                <tr class="bg-white border-b hover:bg-gray-100">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {splitCourseCode(course.course_id.code)}
                  </th>
                  <td class="px-6 py-4">{course.course_id.title}</td>
                  <td class="px-6 py-4">{course.course_id.credit_units}</td>
                  <td class="px-6 py-4">{course.course_id.status}</td>
                  {/* <td class="px-6 py-4">
                    {splitCourseCode(course?.prerequisite?.code)}
                  </td> */}
                  {/* <td class="px-6 py-4">
                    {registeredCoursesList.includes(course._id) ? (
                      <button
                        className="px-5 py-3 rounded-2xl font-bold bg-gray-200 text-white"
                        disabled={true}
                      >
                        Registered
                      </button>
                    ) : (
                      <button
                        className="px-5 py-3 rounded-2xl font-bold bg-gray-900 text-white"
                        onClick={(e) => registerCourse(e, course._id)}
                      >
                        Register
                      </button>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* List Courses */}
      <div className="w-[700px] mt-12">
        <p className="text-2xl mb-4 text-center">Course Registration</p>
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
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course) => (
                <tr class="bg-white border-b hover:bg-gray-100">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {splitCourseCode(course.code)}
                  </th>
                  <td class="px-6 py-4">{course.title}</td>
                  <td class="px-6 py-4">{course.credit_units}</td>
                  <td class="px-6 py-4">{course.status}</td>
                  <td class="px-6 py-4">
                    {splitCourseCode(course?.prerequisite?.code)}
                  </td>
                  <td class="px-6 py-4">
                    {registeredCoursesList.includes(course._id) ? (
                      <button
                        className="px-5 py-3 rounded-2xl font-bold bg-gray-200 text-white"
                        disabled={true}
                      >
                        Registered
                      </button>
                    ) : (
                      <button
                        className="px-5 py-3 rounded-2xl font-bold bg-gray-900 text-white"
                        onClick={(e) => registerCourse(e, course._id)}
                      >
                        Register
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisterCourse;
