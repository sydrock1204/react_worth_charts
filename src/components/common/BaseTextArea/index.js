import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BaseTextArea = ({ name, label, value, error, className, placeholder, height = 200, handleChange, }) => {
    const styles = `resize rounded-md border-0 py-2 text-primary-900 shadow-sm ring-1 ring-inset ring-primary-300 outline-none 
     focus:ring-primary-500 sm:text-sm sm:leading-6 pl-3 placeholder:text-neutral-500 placeholder:text-sm`;
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium leading-6 text-primary-950", children: label }), _jsx("textarea", { name: name, value: value, onChange: handleChange, placeholder: placeholder, style: { height: `${height}px` }, className: `${className} 
            ${styles} 
            ${error ? 'ring-red-500' : ''}` }), error && _jsx("p", { className: "text-red-500 text-xs mt-1", children: error })] }));
};
