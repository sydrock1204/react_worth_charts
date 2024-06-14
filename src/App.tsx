import { useState, useContext, createContext, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'

import { AuthProvider } from './context/authContext.tsx'

import Home from './pages/Home'
import About from './pages/About'
import Chart from './pages/Chart/index'
import Techmethod from './pages/Techmethod'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import ProtectedRoute from './components/navigation/ProtectedRoute.tsx'
import GuestRoute from './components/navigation/GuestRoute.tsx'
import WorthAuth from './pages/Auth/signin.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/chart',
        element: <Chart />,
      },
      {
        path: '/techmethod',
        element: <Techmethod />,
      },
      {
        path: '/testimonials',
        element: <Testimonials />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
    ],
  },
  {
    path: '/auth',
    element: <GuestRoute />,
    children: [
      {
        index: true,
        path: 'login',
        element: <WorthAuth />,
      },
    ],
  },
])

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </div>
  )
}

export default App
