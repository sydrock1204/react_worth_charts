import { FC, useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'

import Header from '../header'
import Footer from '../footer'

const ProtectedRoute: FC = () => {
  const location = useLocation()
  const { session, user, isLoading, loadUsers } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers()
      console.log('location: ', location, 'user: ', user)
    }

    fetchData().then(e => console.log(e))
    console.log('location: ', location, 'user: ', user)
  }, [])

  if (isLoading) {
    console.log('loading...')
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <>
        <Header />
        <div className="flex flex-row border-t-2 border-b-2 border-color-white min-h-[90vh] h-[2000px]">
          <div className="flex flex-col w-[324px] border-r-2 border-color-white">
            <Link
              to="/home"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              About
            </Link>
            <Link
              to="/chart"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Chart
            </Link>
            <Link
              to="/techmethod"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Technology & Method
            </Link>
            <Link
              to="/testimonials"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Contact
            </Link>
          </div>
          <div className="flex flex-col">
            {/* {session ? <Outlet /> : <Navigate to="/auth/login" />} */}
            <Outlet />
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return (
      <>
        <Header />
        <div className="flex flex-row border-t-2 border-b-2 border-color-white min-h-[90vh] h-[2000px]">
          <div className="flex flex-col w-[324px] border-r-2 border-color-white">
            <Link
              to="/home"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              About
            </Link>
            <Link
              to="/chart"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Chart
            </Link>
            <Link
              to="/techmethod"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Technology & Method
            </Link>
            <Link
              to="/testimonials"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9"
            >
              Contact
            </Link>
          </div>
          <div className="flex flex-col">
            <Navigate to="/auth/login" />
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default ProtectedRoute
