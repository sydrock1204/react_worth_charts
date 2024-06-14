import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
export const BaseButtonGroups = ({ group, buttonSelected, handleSelectButtonGroup, }) => {
    const { t } = useTranslation(['common']);
    return (_jsx("span", { className: "isolate inline-flex rounded-md", children: group.map((item, index) => {
            // Initialize class names common to all buttons
            const isSelected = buttonSelected === item.path;
            let classNames = `${isSelected
                ? 'bg-primary-200 ring-primary-400 text-primary-900'
                : 'transparent'} relative inline-flex items-center px-3 text-sm font-semibold h-9
        text-primary-950 ring-1 ring-inset ring-primary-400 hover:bg-primary-200 focus:z-10`;
            // Modify class names based on position within array
            if (index === 0) {
                classNames += ' rounded-l-md';
            }
            if (index === group.length - 1) {
                classNames += ' -ml-px rounded-r-md';
            }
            else {
                classNames += ' -ml-px';
            }
            return (_jsx("button", { type: "button", className: classNames, onClick: () => handleSelectButtonGroup && handleSelectButtonGroup(item.path), children: t(`common:${item.name}`) }, index));
        }) }));
};
