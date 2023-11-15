import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { baseUrl } from '../../helpers/config';
import { DEFAULT_STATUS, DEFAULT_ROLE } from '../../helpers/constants';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useGetUserId } from '../../hooks/useGetUserId';


const Register = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("");
    const [matric, setMatric] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const [cookies, _] = useCookies(["access_token"])

    const navigate = useNavigate();
    const userId = useGetUserId();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.warning("Passwords must match");
            return
        }
        try {
            setLoading(true);
            const res = await axios.post(`${baseUrl}/auth/register`, {
                matric_number: matric,
                full_name: fullName,
                email,
                password
            });

            if (res.data.statusCode === 201) {
                toast.success("Registration Successful. Please login")
                navigate("/login")
            } else {
                toast.error("Registration failed")
                toast.error(res.data?.message)
            }
        } catch (e) {
            toast.error(e?.response?.data?.message);
            console.error(e)  
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (cookies.access_token && userId) {
            toast.warn("Already logged in");
            navigate("/");
        }    
    }, [])
  return (
      <div class="flex flex-col items-center px-6 sm:px-2 mx-auto w-[55rem] min-h-[80vh] sm:w-full">
          <div class="w-full bg-inherit rounded-lg">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      Register
                  </h1>
                  <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                      <div>
                          <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                          <input type="text" name="firstName" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="" value={fullName} onChange={e => setFullName(e.target.value)} required/>
                      </div>
                      <div>
                          <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">Matriculation Number</label>
                          <input type="text" name="email" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="" value={matric} onChange={e => setMatric(e.target.value)} required/>
                      </div>
                      <div>
                          <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                          <input type="text" name="email" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="" value={email} onChange={e => setEmail(e.target.value)} required/>
                      </div>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                          <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={password} onChange={e => setPassword(e.target.value)} required/>
                      </div>
                      <div>
                          <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 ">Confirm password</label>
                          <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                      </div>
                      <button disabled={loading} type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-primary-300">
                        {loading ? (<svg aria-hidden="true" role="status" class="inline w-6 h-6 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>)
                            :""}
                        {loading  ? "Register..." : "Register"}
                      </button>
                      <p class="text-sm font-light text-gray-500">
                          Have existing account? <a href="#" class="font-medium text-primary-600 hover:underline"><Link to="/login">Log in here</Link></a>
                      </p>
                  </form>
              </div>
          </div>
      </div>
  )
}

export default Register