import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import '../css/adminTable.css'; // Import the CSS file

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];



const paginationModel = { page: 0, pageSize: 5 };

interface TypeA {
  id: number;
  name: string;
}

interface TypeB {
  code: string;
  value: number;
}

type MixedArray = (TypeA | TypeB)[]; // Array of either TypeA or TypeB

interface AdminTableProps{
  cols: GridColDef[],
  rowz: MixedArray
}

export default function AdminTable({cols, rowz}: AdminTableProps) {
  return (
    <Paper className="admin-table-container">
      <DataGrid
        rows={rowz}
        columns={cols}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Paper>
  );
}
