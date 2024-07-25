import { FC, useContext, useRef, useState, useEffect } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import useHeaderWidthStore from '../../context/useHeadherWidth'
import { useAuthContext } from '../../context/authContext'
import useWindowWidth from '../../context/useScreenWidth'
import Header from '../header'
import Footer from '../footer'
import { MobileToggleContext } from '../../context/ToggleBtn'


const GuestRoute: FC = () => {
  const location = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const setWidth = useHeaderWidthStore(state => state.setWidth)
  const { user, session } = useAuthContext()
  const width = useWindowWidth()
  const sidebarRef = useRef(null);
  const context = useContext(MobileToggleContext);
  const { isToggled } = context;
  const [Toggled, setIsToggled] = useState(false);

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

  const handleResize = () => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth + 1)
    }
  }

  return (
    <>
      <Header />
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
            {session ? <Navigate to="/chart" /> : <Outlet />}
          </div>
        </div>
      <Footer />
    </>
  )
}

export default GuestRoute
