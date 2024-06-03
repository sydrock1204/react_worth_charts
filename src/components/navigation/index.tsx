import { FC } from 'react'
import { Link, Outlet } from 'react-router-dom'

import Header  from '../../components/header'
import Footer from '../../components/footer'

const Navigation:FC = () => {

    return(
        <>
            <Header />
            <div className="flex flex-row border-t-2 border-b-2 border-color-white min-h-[90vh]">
                <div className="flex flex-col w-[324px] border-r-2 border-color-white">
                    <Link to="/home" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">Home</Link>
                    <Link to="/about" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">About</Link>
                    <Link to="/chart" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">Chart</Link>
                    <Link to="/techmethod" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">Technology & Method</Link>
                    <Link to="/testimonials" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">Testimonials</Link>
                    <Link to="/contact" className="flex text-[18px] h-20 items-center border-b-2 border-color-white pl-9">Contact</Link>
                </div>
                <div className="flex flex-col">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Navigation