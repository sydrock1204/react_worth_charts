import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SLIDER_VARIANTS } from '../../../constants/animations';
import { toggleBodyScroll } from '../../../utils/toggleBodyScroll';
import FadeIn from '../../FadeIn';
import { BaseButton } from '../BaseButton';
export const SliderModal = ({ title, isOpen, closeSlider, handleSubmit, children = null, }) => {
    const { t } = useTranslation(['common']);
    useEffect(() => {
        toggleBodyScroll(isOpen);
    }, [isOpen]);
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx(FadeIn, { children: _jsx("div", { onClick: closeSlider, className: `fixed bg-black opacity-40 top-0 left-0 w-screen h-screen transition-opacity duration-1 z-40` }) })), isOpen && (_jsx(_Fragment, { children: _jsx(motion.div, { initial: "hidden", animate: "visible", className: `fixed overflow-auto overflow-x-hidden right-0 w-[60%] bg-primary-50 h-full top-0 z-40 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} t`, variants: SLIDER_VARIANTS, transition: { ease: 'easeOut', delay: 0.1 }, children: _jsxs("div", { className: "px-5", children: [_jsx("h1", { className: "text-xl font-semibold ", children: title }), children && _jsx("div", { className: "mt-5", children: children }), _jsxs("div", { className: "\n               flex gap-4 justify-end py-14 bg-primary-50\n            ", children: [closeSlider && _jsx(BaseButton, { text: t('common:cancel'), style: "secondary", onClick: closeSlider }), handleSubmit && _jsx(BaseButton, { text: t('common:save'), style: "primary", onClick: () => {
                                            handleSubmit && handleSubmit();
                                        } })] })] }) }) }))] }));
};
