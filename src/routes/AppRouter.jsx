import { useLayoutEffect } from "react";
//Router Imports
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";


//Screens import
import Home from '../screens/Home';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../screens/Dashboard';
import Error404 from '../screens/Error404';
import Auth from "../screens/Auth";

// Checks if user is Authenticated or not
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";



// redux hooks import
import { useDispatch, useSelector } from "react-redux";

// Reducer functions
import { setError, setLoading, setUser } from "../context/slices/userState";

//axios configuration
import axiosInstance from "../config/axios";


export default function AppRouter() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => (state.user));
    useLayoutEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            dispatch(setLoading());
            try {
                const response = await axiosInstance.get('/temp', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const res = await response.data;
                dispatch(setUser({ user: res.data , token: token}));
                return;
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Session Expired'));
                localStorage.removeItem('token');
                navigate('/auth/sign-in');
            }
        }
        if (!isAuthenticated) fetchUser();
    }, [dispatch, isAuthenticated, navigate])

    return (
        <Routes>
            <Route path={'/'} element={<Home />} />
            {/* Auth Routes */}
            <Route path={'/auth'} element={<RedirectIfAuthenticated><Auth/></RedirectIfAuthenticated>}>
                <Route path={'sign-in'} element={<Login />} />
                <Route path={'sign-up'} element={<Signup />} />
            </Route>
            <Route path={'/dashboard'} element={isAuthenticated ? <Dashboard /> : <Navigate to={'/auth/sign-in'} replace/>} /> Protected Route 
            {/* <Route path={'/dashboard'} element={<Dashboard />}/>  */}
            <Route path={'/error'} element={<Error404 />} />
            <Route path={'*'} element={<Navigate to={'/error'} replace />} />
        </Routes>
    )
}
