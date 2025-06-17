import { useState } from "react";
import '../css/AdminTable.css';

interface Attributes {
  name: string;
  attribute: string;
}

interface AdminTableProps {
  dataSet: any[];
  columns: Attributes[];
}

const AdminTable = ({ dataSet, columns }: AdminTableProps) => {
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
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
            <th >Edit</th>
            <th >Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((data) => (
              <tr key={data._id}>
                {columns.map((col) => (
                  <td key={col.attribute}>{data[col.attribute]}</td>
                ))}
                  <td>Edit</td>
                  <td>Delete</td>
              </tr>
            ))
            
          ) : (
            <tr>
              <td colSpan={columns.length}>No results found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {dataSet.length > rowsPerPage && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
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
