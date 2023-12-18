import React from 'react'
import TableComponent from './insight-table/insight-table'

export default function Account() {
    const columns = ["Username", "Email", "Role", "Actions"];
    const data = [
      { Username: "John Doe", Email: "john@example.com", Role: "Admin", Actions: "Edit" },
      { Username: "Jane Smith", Email: "jane@example.com", Role: "User", Actions: "Delete" },
      // Add more rows as needed
    ];
  
    const arrowColumns = ["Username", "Role"]; // Columns where you want to display arrow icons
    const buttonColumns = ["Actions"]; // Columns where you want to display buttons
    const buttonTexts = { Actions: "User Info" };
  return (
    <div>
     <TableComponent columns={columns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts} />
    </div>
  )
}
