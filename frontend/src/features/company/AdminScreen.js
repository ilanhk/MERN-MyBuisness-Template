import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const AdminScreen = () => {
    const [webTraffic, setWebTraffic] = useState('day');
    const [productAnalytics, setProductAnalytics] = useState('day');
    return (_jsxs("div", { children: [_jsx("h2", { children: "Admin Page" }), _jsxs("div", { children: [_jsx("h3", { children: "Web Traffic" }), _jsxs("p", { children: ["per: ", webTraffic] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Product Analytics" }), _jsxs("p", { children: ["per: ", productAnalytics] })] })] }));
};
export default AdminScreen;
