import { useState } from "react";
import { Link } from 'react-router-dom';
import CIFormButton from "../../features/company/companyInfo/components/CIFormButton";
import '../css/AdminTable.css';


interface Attributes {
  name: string;
  attribute: string;
}

interface AdminTableProps {
  dataSet: any[];
  columns: Attributes[];
  route: string;
  deleteHook: (id: string) => void;
}

const AdminTable = ({ dataSet, columns, route, deleteHook }: AdminTableProps) => {
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

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((data) => (
              <tr key={data._id}>
                {columns.map((col) => (
                  <td key={col.attribute}>{data[col.attribute]}</td>
                ))}
                <td>
                  <Link to={`${route}/${data._id}/edit`}>
                    <CIFormButton text="Edit" color="primary"/>
                  </Link>
                </td>
                <td>
                  <CIFormButton text="Delete" color="error" onClick={async ()=>{ deleteHook(data._id)}}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 2}>No results found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {dataSet.length > rowsPerPage && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
