import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { BaseButton } from '../BaseButton';
import { ReactModal } from '../ReactModal';
export const DeleteModal = ({ title, isOpen, handleClose, handleDelete, }) => {
    const { t } = useTranslation(['common']);
    return (_jsx(ReactModal, { title: title, closeModal: handleClose, isOpen: isOpen, children: _jsxs("div", { className: "flex justify-end mt-5 gap-2", children: [_jsx(BaseButton, { style: "secondary", onClick: handleClose, text: t('common:cancel') }), _jsx(BaseButton, { style: "delete", onClick: handleDelete, text: t('common:delete') })] }) }));
};
