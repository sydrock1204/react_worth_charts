import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
const SwiperGallery = ({ slides }) => {
    const [activeThumb] = useState(null);
    const pictures = Object.values(slides);
    return (_jsx(_Fragment, { children: _jsx("div", { className: "mt-4", children: _jsx(Swiper, { modules: [Navigation, Pagination, Scrollbar, A11y, Thumbs], className: "w-[70vw] md:w-[70vw] lg:w-[70vw] xl:w-full m-0 rounded-xl", loop: true, navigation: true, grabCursor: true, thumbs: {
                    swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null,
                }, pagination: { clickable: true }, scrollbar: { draggable: true }, breakpoints: {
                    320: {
                        slidesPerView: 1,
                    },
                    480: {
                        slidesPerView: 2,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 2,
                    },
                    1336: {
                        slidesPerView: 4,
                        spaceBetween: 1,
                    },
                }, children: pictures.map((slide, index) => (_jsx(SwiperSlide, { children: _jsx("img", { src: slide, alt: 'title', id: slide.id }) }, index))) }) }) }));
};
export default SwiperGallery;
