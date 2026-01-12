import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/sign-up',
    element: <SignUp/>
  },
  {
    path: '/verify',
    element: <VerifyEmail/>
  },
  {
    path: '/verify/:token',
    element: <Verify/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword/>
  },
])

function App() {

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
