import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { baseUrl } from "../../helpers/config";

const ViewResults = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState(null);
  const [cookies, setCookies] = useCookies();
  const [loading, setLoading] = useState(false);

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

  const getStudentData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/users/${studentId}`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      if (res.data.statusCode === 200) {
        setStudent(res.data?.data.user);
      } else {
        toast.error("Failed to get student");
        toast.error(res.data?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/result/${studentId}/records`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      if (res.data.statusCode === 200) {
        setResults(res.data?.data.results);
      } else {
        toast.error("Failed to load results");
        toast.error(res.data?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentData();
    loadResults();
  }, []);

  return (
    <div className="mb-10">
      {!loading ? (
        <>
          {student ? (
            <div className="mb-16">
              <p className="text-3xl mb-1">Student Profile</p>
              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <tbody>
                  <tr class="bg-white border-b hover:bg-gray-100">
                    <td class="px-6 py-4 text-black font-bold">Full Name</td>
                    <td class="px-6 py-4">{student.full_name.toUpperCase()}</td>
                    <td class="px-6 py-4">
                      <Link className="underline text-blue-500">Actions</Link>
                    </td>
                  </tr>

                  <tr class="bg-white border-b hover:bg-gray-100">
                    <td class="px-6 py-4 text-black font-bold">
                      Matriculation Number
                    </td>
                    <td class="px-6 py-4">
                      {student.matric_number.toUpperCase()}
                    </td>
                    <td class="px-6 py-4">
                      <Link className="underline text-blue-500">Actions</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>Student data not found</div>
          )}

          {results ? (
            <div>
              <p className=" text-3xl mb-4">Results</p>
              <p className="font-bold text-lg underline mb-2">100 level</p>
              <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        S/N
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      ?.filter((result) =>
                        splitCourseCode(result.course_id.code)
                          .split(" ")[1]
                          ?.startsWith(1)
                      )
                      .map((result, index) => (
                        <tr class="bg-white border-b hover:bg-gray-100">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td class="px-6 py-4">
                            {splitCourseCode(result.course_id.code)}
                          </td>
                          <td class="px-6 py-4">{result.course_id.title}</td>
                          <td class="px-6 py-4">
                            {result.grade.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <p className="font-bold underline mt-8">200 level</p>
              <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        S/N
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      ?.filter((result) =>
                        splitCourseCode(result.course_id.code)
                          .split(" ")[1]
                          ?.startsWith(2)
                      )
                      .map((result, index) => (
                        <tr class="bg-white border-b hover:bg-gray-100">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td class="px-6 py-4">
                            {splitCourseCode(result.course_id.code)}
                          </td>
                          <td class="px-6 py-4">{result.course_id.title}</td>
                          <td class="px-6 py-4">
                            {result.grade.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <p className="font-bold underline mt-8">300 level</p>
              <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        S/N
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      ?.filter((result) =>
                        splitCourseCode(result.course_id.code)
                          .split(" ")[1]
                          ?.startsWith(3)
                      )
                      .map((result, index) => (
                        <tr class="bg-white border-b hover:bg-gray-100">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td class="px-6 py-4">
                            {splitCourseCode(result.course_id.code)}
                          </td>
                          <td class="px-6 py-4">{result.course_id.title}</td>
                          <td class="px-6 py-4">
                            {result.grade.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <p className="font-bold underline mt-8">400 level</p>
              <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        S/N
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Code
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Course Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      ?.filter((result) =>
                        splitCourseCode(result.course_id.code)
                          .split(" ")[1]
                          ?.startsWith(4)
                      )
                      .map((result, index) => (
                        <tr class="bg-white border-b hover:bg-gray-100">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td class="px-6 py-4">
                            {splitCourseCode(result.course_id.code)}
                          </td>
                          <td class="px-6 py-4">{result.course_id.title}</td>
                          <td class="px-6 py-4">
                            {result.grade.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>Cannot find any results associated to student</div>
          )}
        </>
      ) : (
        <Loader/>
      )}
    </div>
  );
};

export default ViewResults;
