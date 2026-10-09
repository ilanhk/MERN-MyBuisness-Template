import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from 'react-router-dom';
import CIFormButton from "../../features/company/companyInfo/components/CIFormButton";
import '../css/AdminTable.css';
const AdminTable = ({ dataSet, columns, route, deleteHook }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(dataSet.length / rowsPerPage);
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = dataSet.slice(startIndex, startIndex + rowsPerPage);
    return (_jsxs("div", { className: "table-container", children: [_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [columns.map((col) => (_jsx("th", { children: col.name }, col.name))), _jsx("th", { children: "Edit" }), _jsx("th", { children: "Delete" })] }) }), _jsx("tbody", { children: currentData.length > 0 ? (currentData.map((data) => (_jsxs("tr", { children: [columns.map((col) => (_jsx("td", { children: data[col.attribute] }, col.attribute))), _jsx("td", { children: _jsx(Link, { to: `${route}/${data._id}/edit`, children: _jsx(CIFormButton, { text: "Edit", color: "primary" }) }) }), _jsx("td", { children: _jsx(CIFormButton, { text: "Delete", color: "error", onClick: async () => { deleteHook(data._id); } }) })] }, data._id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + 2, children: "No results found." }) })) })] }), dataSet.length > rowsPerPage && (_jsxs("div", { className: "pagination-controls", children: [_jsx("button", { onClick: handlePrevPage, disabled: currentPage === 1, children: "Previous" }), _jsxs("span", { children: ["Page ", currentPage, " of ", totalPages] }), _jsx("button", { onClick: handleNextPage, disabled: currentPage === totalPages, children: "Next" })] }))] }));
};
export default AdminTable;
