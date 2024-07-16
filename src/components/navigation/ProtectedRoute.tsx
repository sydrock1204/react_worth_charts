import { FC, useContext, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'

import Header from '../header'
import Footer from '../footer'
import useHeaderWidthStore from '../../context/useHeadherWidth'

const ProtectedRoute: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const setWidth = useHeaderWidthStore(state => state.setWidth)
  const location = useLocation()
  const { session, user, isLoading, loadUsers } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers()
      // console.log('location: ', location, 'user: ', user)
    }

    fetchData().then(
      // e => console.log(e)
    )
    // console.log('location: ', location, 'user: ', user)
  }, [])

  const handleResize = () => {
    // console.log('handleResize: ', ref.current.offsetWidth)
    if (ref.current) {
      // console.log('handleResized: ', ref.current.offsetWidth)
      setWidth(ref.current.offsetWidth + 1)
    }
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    setTimeout(handleResize, 1500)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (isLoading) {
    // console.log('loading...')
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <>
        <Header />
        <div className="flex flex-row border-t-2 border-b-2 border-color-white min-h-[2000px]">
          <div
            ref={ref}
            className="flex flex-col !w-[320px] border-r-2 border-color-white"
          >
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
          <div className="flex flex-col w-full lg:ml-2 xl:ml-4">
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
          <div className="flex flex-col w-[320px] border-r-2 bsorder-color-white">
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
