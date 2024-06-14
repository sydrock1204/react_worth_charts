import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import worthChartingLogo from '../../../assets/WorthCharting.png';
export const Header = ({ buttonBack, title }) => {
    const navigate = useNavigate();
    const goToBack = () => {
        navigate(-1);
    };
    return (_jsxs("div", { className: "flex gap-5 mt-1 items-center", children: [_jsx("img", { src: worthChartingLogo, width: 300, height: 300 }), _jsx("h1", { className: "text-3xl font-semibold", children: title })] }));
};
