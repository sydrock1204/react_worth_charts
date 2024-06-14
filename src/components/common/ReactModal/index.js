import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { IconClose } from '../../../assets/icons';
import useScreenWidth from '../../../hooks/ui/useScreenWidth';
export const ReactModal = ({ title, height, isOpen, children, closeModal, description, buttonClose = false, }) => {
    const isScreenSmall = useScreenWidth(780);
    const makeDinamicWidth = () => {
        if (isScreenSmall) {
            return '95%';
        }
        return '450px';
    };
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            border: 'none',
            height: height,
            marginRight: '-50%',
            borderRadius: '4px',
            width: makeDinamicWidth(),
            backgroundColor: '#f3faf8',
            transform: 'translate(-50%, -50%)',
        },
        overlay: {
            zIndex: 20,
            background: 'rgba(0,0,0,0.7)',
        },
    };
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };
    return (_jsx(Modal, { isOpen: isOpen, ariaHideApp: false, style: customStyles, onRequestClose: closeModal, contentLabel: "Example Modal", children: _jsxs(motion.div, { initial: "hidden", animate: "visible", variants: variants, transition: { ease: 'easeOut' }, className: "flex flex-col md:p-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("h2", { className: "text-primary-950 font-medium", children: title }), _jsx("p", { className: "text-gray-500", children: description })] }), buttonClose && (_jsx("div", { role: "button", onClick: closeModal, className: "text-primary-950", children: _jsx(IconClose, {}) }))] }), _jsx("div", { className: "flex flex-col h-full", children: children })] }) }));
};
