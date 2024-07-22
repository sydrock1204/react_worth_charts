import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import WorthChartLogo from '../../assets/WorthCharting.png'
import { BaseButton } from '../common/BaseButton'
import { useAuthContext } from '../../context/authContext'
import useWindowWidth from '../../context/useScreenWidth'
import { MobileToggleContext } from '../../context/ToggleBtn'


const Header = () => {
  const navigate = useNavigate()
  const { session, signOutHandler } = useAuthContext()
  const width = useWindowWidth()
  const context = useContext(MobileToggleContext);
  const { isToggled, setIsToggled } = context;

  const handleToggle = () => {
    setIsToggled(prevState => !prevState);
  };

  return (
    <div className="flex  h-[92px] justify-between border-b-[1px] border-b-white  ">
      {
        (width <= 1117) ? (
          <div>
            <button
              className=" fixed top-4 left-4 p-3 bg-black text-white rounded-lg z-50 flex flex-col justify-around h-12 w-12 mr-[20px]"
              onClick={handleToggle}
            >
              <span className="block w-full h-1 bg-white"></span>
              <span className="block w-full h-1 bg-white"></span>
              <span className="block w-full h-1 bg-white"></span>
            </button>
            <div>
              <img src={WorthChartLogo} width={214} height={44.3} alt="WorthChart"  className='pt-[24px] ml-[70px]'/>
            </div>
          </div>
        ) : (
          <div>
            <img src={WorthChartLogo} width={214} height={44.3} alt="WorthChart"  className='pt-[24px] pl-[31px]'/>
          </div>
        )
      }

      <div className=" flex gap-[12px] pr-[22px] pt-[24px]">
        <BaseButton
          text="subscribe"
          className="h-[43px] w-[164px]  bg-color-brand-green border-color-brand-green border-2 font-mono text-xl"
        />
        {!session && (
          <BaseButton
            text="login"
            className="w-[114px]  h-[43px] bg-transparent border-color-brand-green border-2 font-mono text-xl"
            onClick={() => {
              navigate('/auth/login')
            }}
          />
        )}
        {session && (
          <BaseButton
            text="logout"
            className="w-[114px]  h-[43px] bg-transparent border-color-brand-green border-2 font-mono text-xl"
            onClick={() => {
              if (signOutHandler) {
                signOutHandler()
                navigate('/auth/login')
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Header
