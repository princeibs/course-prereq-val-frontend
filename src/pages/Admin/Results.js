import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../helpers/config";

const ResultInputField = ({
  courses,
  splitCourseCode,
  result,
  index,
  handleResultCourseChange,
  handleResultGradeChange,
}) => (
  <div className="flex gap-4 rounded-lg border border-gray-300 bg-gray-50">
    {courses?.length > 0 ? (
      <>
        <select
          onChange={(event) => handleResultCourseChange(event, index)}
          class="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="-">Course</option>
          {courses.map((course) => (
            <option value={course._id}>{`${course.title} (${splitCourseCode(
              course.code
            )})`}</option>
          ))}
        </select>
      </>
    ) : (
      <div>No course found</div>
    )}

    <select
      onChange={(event) => handleResultGradeChange(event, index)}
      class="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15%] p-2.5"
      required
    >
      <option selected value="-">
        GRADE
      </option>
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
      <option value="d">D</option>
      <option value="e">E</option>
      <option value="f">F</option>
    </select>
  </div>
);

const Results = () => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useCookies();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [resultPayload, setResultPayload] = useState({
    studentId: "",
    level: "",
    semester: "",
    result: [],
  });

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

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/students`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      });
      if (res.data.statusCode === 200) {
        setStudents(res.data?.data.users);
      } else {
        toast.error("Failed to load students");
        toast.error(res.data?.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
      toast.error(e?.message);
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResultPayload({ ...resultPayload, [name]: value });
  };

  const handleResultCourseChange = (event, index) => {
    const { value } = event.target;
    const results = [...resultPayload.result];
    results[index] = { ...results[index], course: value };
    setResultPayload({ ...resultPayload, result: results });
  };

  const handleResultGradeChange = (event, index) => {
    const { value } = event.target;
    const results = [...resultPayload.result];
    results[index] = { ...results[index], grade: value };
    setResultPayload({ ...resultPayload, result: results });
  };

  const handleAddResult = () => {
    const result = [...resultPayload.result, { course: "", grade: "" }];
    setResultPayload({ ...resultPayload, result });
  };

  const validatePayload = (resultPayload) => {
    const { studentId, level, semester, result } = resultPayload;
    if (!studentId || studentId === "-") {
      toast.warn("Invalid student entered");
      return false;
    }

    if (!level || level === "-") {
      toast.warn("Invalid level entered");
      return false;
    }

    if (!semester || semester === "-") {
      toast.warn("Invalid semester entered");
      return false;
    }

    if (result.length < 1) {
      toast.warn("Please select atleast one result");
      return false;
    }

    let isValid = true;
    result.map((result) => {
      if (!result.grade || !result.course) {
        isValid = false;
        toast.warn("All result must contains course and grade");
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payloadIsValid = validatePayload(resultPayload);
    if (!payloadIsValid) return;

    try {
      for (let i = 0; i < resultPayload.result.length; i++) {
        const res = await axios.post(
          `${baseUrl}/result`,
          {
            user_id: resultPayload.studentId,
            level: resultPayload.level,
            semester: resultPayload.semester,
            course_id: resultPayload.result[i].course,
            grade: resultPayload.result[i].grade,
          },
          {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }
        );
        if (res.data.statusCode === 201 || res.data.statusCode === 200) {
          toast.success(res.data?.message)
        } else {
          if (res.data?.message) {
            toast.error(res.data?.message);
          } else {
            toast.error("Failed to add course");
          }
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
    loadStudents();
  }, []);

  return (
    <div className="w-full flex items-center flex-col mb-28">
      
      {/* Add Course */}
      <div className="w-[500px] mb-20">
        <p className="text-2xl mb-4 text-center">Add (or Update) Result</p>
        <form onSubmit={handleSubmit}>
          {/* Student */}
          <div class="mb-6">
            <label
              for="ccode"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Student
            </label>
            {students.length > 0 ? (
              <>
                <select
                  name="studentId"
                  onChange={handleChange}
                  class="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="-">---</option>
                  {students.map((student) => (
                    <option
                      value={student._id}
                    >{`${student.matric_number.toUpperCase()} (${
                      student.full_name
                    })`}</option>
                  ))}
                </select>
              </>
            ) : (
              <div>No student found</div>
            )}
          </div>

          {/* Level */}
          <label
            for="ccode"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Level
          </label>
          <select
            name="level"
            onChange={handleChange}
            class="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option selected value="-">
              ---
            </option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>

          {/* Semester */}
          <label
            for="ccode"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Semester
          </label>
          <select
            name="semester"
            onChange={handleChange}
            class="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option selected value="-">
              ---
            </option>
            <option value="first">First</option>
            <option value="second">Second</option>
          </select>

          {/* Results */}
          <label
            for="ccode"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Result
          </label>
          <div className="flex flex-col gap-1 mb-8">
            {resultPayload.result.map((result, index) => (
              <ResultInputField
                courses={courses}
                result={result}
                index={index}
                handleResultCourseChange={handleResultCourseChange}
                handleResultGradeChange={handleResultGradeChange}
                splitCourseCode={splitCourseCode}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>

            <button
              type="button"
              onClick={handleAddResult}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Field
            </button>
          </div>
        </form>
      </div>

      {/* List Courses */}
      <div className='w-[700px] mt-12'>
        <p className='text-2xl mb-4 text-center'>Results</p>
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                      <th scope="col" class="px-6 py-3">
                          S/N
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Name
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Matriculation Number
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Action
                      </th>
                  </tr>
              </thead>
              <tbody>
                {students?.map((student, index) => (
                  <tr class="bg-white border-b hover:bg-gray-100">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {index}
                      </th>
                      <td class="px-6 py-4">
                          {student.full_name}
                      </td>
                      <td class="px-6 py-4">
                          {student.matric_number.toUpperCase()}
                      </td>
                      <td class="px-6 py-4">
                          <Link className="underline text-blue-500" to={`/admin/results/${student._id}`}>View result</Link>
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

export default Results;
