import { FC, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ReactLogo from './assets/react.svg'
import WorthChartLogo from './assets/WorthCharting.png'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './pages/Home'
import About from './pages/About'
import Chart from './pages/Chart/index'
import Techmethod from './pages/Techmethod'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Navigation from './components/navigation'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigation />,
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
])
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
