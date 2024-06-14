import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
export const BasePhoneInput = ({ name, value, label, error, isdisabled, placeholder, country, setFieldValue, }) => {
    return (_jsxs("div", { children: [label && (_jsx("label", { className: "block text-sm font-medium leading-6 text-primary-950", children: label })), _jsxs("div", { className: "w-full", children: [_jsx(PhoneInput, { country: country, value: value, disabled: isdisabled, placeholder: placeholder, onChange: (value) => { setFieldValue(name, value); }, buttonClass: "bg-primary-950", containerStyle: { width: '100%' }, inputStyle: { width: '100%', border: 'none' }, inputClass: `${error && 'ring-red-500'} block rounded-md border-0 py-1.5 text-primary-900 border-none shadow-none
          shadow-sm ring-1 ring-inset ring-primary-400 outline-none placeholder:text-neutral-400 focus:ring-primary-300 sm:text-sm sm:leading-6` }), error && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: "Invalid phone number" }))] })] }));
};
