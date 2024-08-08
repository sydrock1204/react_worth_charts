import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'

import useHeaderWidthStore from '../../context/useHeadherWidth'
import useWindowWidth from '../../context/useScreenWidth'
import { MobileToggleContext } from '../../context/ToggleBtn'

const ProtectedRoute: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const setWidth = useHeaderWidthStore(state => state.setWidth)
  const location = useLocation()
  const { session, user, isLoading, loadUsers } = useAuthContext()
  const width = useWindowWidth()
  const context = useContext(MobileToggleContext);
  const { isToggled } = context;
  const [Toggled, setIsToggled] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setIsToggled(isToggled);
  },[isToggled])

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsToggled(false);
    }
  };

  useEffect(() => {
    if (Toggled) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [Toggled]);

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers()

   }
  
    fetchData().then(
     
    )
  }, [])

  const handleResize = () => {
    if (ref.current) {
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
    return <div>Loading...</div>
  }
 
  if (user) {
    return (
      <>
        <div className="flex justify-between w-full">
          {
            (width > 1117) ?
              <div
                ref={ref}
                className='w-[323px] h-full border-r-[1px] border-r-white font-IBM Plex Mono'
              >
                <Link
                  to="/home"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Home
                </Link>
                <br />
                <Link
                  to="/about"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  About
                </Link>
                <br />
                <Link
                  to="/chart"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Chart
                </Link>
                <br />
                <Link
                  to="/techmethod"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Technology & Method
                </Link>
                <br />
                <Link
                  to="/testimonials"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Testimonials
                </Link>
                <br />
                <Link
                  to="/contact"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Contact
                </Link>
              </div> : (
                  <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-black text-white transform ${Toggled ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
                  >
                      <div
                        ref={ref}
                        className='w-[323px] h-full border-r-[1px] border-r-white font-IBM Plex Mono'
                      >
                        <Link
                          to="/home"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Home
                        </Link>
                        <br />
                        <Link
                          to="/about"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          About
                        </Link>
                        <br />
                        <Link
                          to="/chart"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Chart
                        </Link>
                        <br />
                        <Link
                          to="/techmethod"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Technology & Method
                        </Link>
                        <br />
                        <Link
                          to="/testimonials"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Testimonials
                        </Link>
                        <br />
                        <Link
                          to="/contact"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Contact
                        </Link>
                      </div>                    
                  </div>
              ) 
          }
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="flex justify-between w-full">
          {
            (width > 1117) ?
              <div
                ref={ref}
                className='w-[323px] h-full border-r-[1px] border-r-white font-IBM Plex Mono'
              >
                <Link
                  to="/home"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Home
                </Link>
                <br />
                <Link
                  to="/about"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  About
                </Link>
                <br />
                <Link
                  to="/chart"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Chart
                </Link>
                <br />
                <Link
                  to="/techmethod"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Technology & Method
                </Link>
                <br />
                <Link
                  to="/testimonials"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Testimonials
                </Link>
                <br />
                <Link
                  to="/contact"
                  className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                >
                  Contact
                </Link>
              </div> : (
                  <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-black text-white transform ${Toggled ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
                  >
                      <div
                        ref={ref}
                        className='w-[323px] h-full border-r-[1px] border-r-white font-IBM Plex Mono'
                      >
                        <Link
                          to="/home"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Home
                        </Link>
                        <br />
                        <Link
                          to="/about"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          About
                        </Link>
                        <br />
                        <Link
                          to="/chart"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Chart
                        </Link>
                        <br />
                        <Link
                          to="/techmethod"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Technology & Method
                        </Link>
                        <br />
                        <Link
                          to="/testimonials"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Testimonials
                        </Link>
                        <br />
                        <Link
                          to="/contact"
                          className="flex w-[323px]  h-[72px] border-b-[1px] border-white pt-[20px] pl-[36px] text-[20px] font-semibold"
                        >
                          Contact
                        </Link>
                      </div>                    
                  </div>
              ) 
          }
          <div className="flex-1">
            <Navigate to="/auth/login" />
          </div>
        </div>
      </>
    )
  }
}

export default ProtectedRoute
