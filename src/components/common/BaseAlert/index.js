import { jsx as _jsx } from "react/jsx-runtime";
export const BaseAlert = ({ text }) => {
    return (_jsx("div", { className: "rounded-md bg-yellow-100 p-4 w-full", children: _jsx("div", { className: "flex", children: _jsx("div", { className: "ml-3 flex-1 md:flex md:justify-between", children: _jsx("p", { className: "text-sm text-yellow-800", children: text }) }) }) }));
};
