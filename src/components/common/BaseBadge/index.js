import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BaseBadge = ({ text, color = 'text-primary-900', pointer, iconLeft, iconRigth, backgroundColor = 'bg-primary-300', }) => {
    return (_jsxs("div", { className: `${backgroundColor} ${pointer && 'cursor-pointer hover:bg-primary-200'}  justify-center flex px-3 gap-2 py-1 items-cente rounded-xl`, children: [iconLeft && iconLeft, _jsx("p", { className: `text-xs font-medium ${color}`, children: text }), iconRigth && iconRigth] }));
};
