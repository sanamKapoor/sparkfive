import React from 'react'
import TableComponent from './insight-table/insight-table'

export default function Account() {
    const columns = ["Username", "Role","Last session date","Sessions","Downloads","Shares", "Actions",];
    const data = [
      { Username: "John Doe",  Role: "Admin", "Last session date": "Today at 04:22pm", Sessions:"1.27",Downloads:"77",Shares:"30", Actions: "Edit" ,},
      { Username: "Jane Smith",  Role: "User", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      
    ];
  
    const arrowColumns = ["Username", "Role","Last session date","Sessions","Downloads","Shares"];
    const buttonColumns = ["Actions"]; 
    const buttonTexts = { Actions: "User Info" };
  return (
    <div>
     <TableComponent columns={columns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts} />
    </div>
  )
}
