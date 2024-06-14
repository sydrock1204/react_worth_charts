import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BaseLoading } from '../BaseLoading';
import { setSize, setType } from './utils';
import './styles.css';
export const BaseButton = ({ text, icon, wFull, isLoading, className, isDisabled, size = 'small', backgroundColor, type = 'button', style = 'primary', onClick = () => { }, }) => {
    // if only icon is passed, then the button will be a circle
    const shouldDisplayOnlyIcon = (text, icon) => {
        return (!text || text.trim() === '') && !!icon;
    };
    return (_jsxs("button", { type: type, onClick: onClick, disabled: isDisabled, style: { backgroundColor }, className: `flex items-center justify-center gap-3 ${setType(style)} ${setSize(size)} ${wFull ? 'w-full' : 'w-auto'} 
    ${className ? className : ''} py-2 px-4 rounded 
    ${shouldDisplayOnlyIcon(text, icon)
            ? 'w-[36px] h-[36px] md:w-[36px] md:h-[36px] py-0 px-0'
            : ''}
    ${isDisabled
            ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-300 hover:shadow-none'
            : ''}
  `, children: [isLoading && _jsx(BaseLoading, {}), icon && _jsx("div", { children: icon }), text && text] }));
};
