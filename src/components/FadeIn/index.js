import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const FadeIn = ({ children, className }) => {
    const VARIANTS_OPACITY = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };
    return (_jsx(motion.div, { initial: "hidden", animate: "visible", className: className, variants: VARIANTS_OPACITY, transition: { ease: 'easeOut', delay: 0.1 }, children: children }));
};
export default FadeIn;
