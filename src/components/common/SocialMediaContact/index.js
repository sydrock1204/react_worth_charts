import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconFacebook, IconInstagram, IconTelegram, IconWhatsapp, } from '../../../assets/icons';
export const SocialMediaContact = ({ user }) => {
    const goToLink = (e, link) => {
        e.stopPropagation();
        window.open(link, '_blank');
    };
    return (_jsxs("div", { className: "flex gap-2 items-center h-full", children: [user.socialMedia.instagram && (_jsx("button", { className: "cursor:pointer", onClick: (e) => {
                    goToLink(e, `https://www.instagram.com/${user.socialMedia.instagram}`);
                }, children: _jsx(IconInstagram, {}) })), user.socialMedia.facebook && (_jsx("button", { className: "cursor:pointer", onClick: (e) => { goToLink(e, `https://www.facebook.com/${user.socialMedia.facebook}`); }, children: _jsx(IconFacebook, {}) })), user.socialMedia.whatsapp && (_jsx("button", { className: "cursor:pointer", onClick: (e) => { goToLink(e, `https://wa.me/${user.socialMedia.whatsapp}`); }, children: _jsx(IconWhatsapp, {}) })), user.socialMedia.telegram && (_jsx("button", { className: "cursor:pointer", onClick: (e) => { goToLink(e, `https://telegram.me/${user.socialMedia.telegram}`); }, children: _jsx(IconTelegram, {}) }))] }));
};
