import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isValidElement } from 'react';
export const LinkedIconText = ({ icon, url, text }) => {
    return (_jsxs("div", { className: "flex flex-row gap-1 items-center content-center", children: [isValidElement(icon) && (_jsx("span", { className: 'w-4 h-[14.44px]', children: icon })), _jsx("a", { className: "text-[15.28px] underline underline-offset-[3px]", href: url, target: "_blank", children: text })] }));
};
