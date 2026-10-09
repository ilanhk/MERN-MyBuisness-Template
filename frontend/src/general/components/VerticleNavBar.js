import { jsx as _jsx } from "react/jsx-runtime";
const VerticleMenu = (title, list) => {
    return (_jsx("nav", { className: "vnavbar", children: _jsx("ul", { className: "vnavbar-list", children: _jsx("li", { className: "vnavbar-item" }) }) }));
};
export default VerticleMenu;
