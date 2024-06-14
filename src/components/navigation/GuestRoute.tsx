import { FC, useContext } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'

import Header from '../header'
import Footer from '../footer'

const GuestRoute: FC = () => {
  const location = useLocation()
  const { user, session } = useAuthContext()

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
          {session ? <Navigate to="/chart" /> : <Outlet />}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GuestRoute
