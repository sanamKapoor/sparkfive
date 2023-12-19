import React from 'react'
import TableComponent from './insight-table/insight-table'
import InsightsHeader from './insights-header/insights.header';
import styles from "./index.module.css";
import { insights } from '../../assets';
export default function Account() {
    const columns = ["Username", "Role","Last session date","Sessions","Downloads","Shares", "Actions",];
    const data = [
      { Username: "Seraphina Alexandra Montgomery-Smith",icon: insights.userImg1,  Role: "Admin", "Last session date": "Today at 04:22pm", Sessions:"1.27",Downloads:"77",Shares:"30", Actions: "Edit" ,},
      { Username: "Charles Wells",icon: insights.userImg2,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "Harvey Elliott",icon: insights.userImg3,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "John Ali",icon: insights.userImg4,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "John Ali",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "Betty Anderson",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "Eugene Atkinson",  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      { Username: "Eugene Atkinson",icon: insights.userImg3,  Role: "Role name", "Last session date": "Today at 04:01pm", Sessions:"93",Downloads:"77",Shares:"30",  Actions: "Delete" },
      
      
    ];
  
    const arrowColumns = ["Username", "Role","Last session date","Sessions","Downloads","Shares"];
    const buttonColumns = ["Actions"]; 
    const buttonTexts = { Actions: "User Info" };
  return (
    <>
      <div className={styles.tableHeader}>
      <InsightsHeader title="Users" companyName="Holli Inc." />
      </div>   
     <TableComponent columns={columns} data={data} arrowColumns={arrowColumns} buttonColumns={buttonColumns} buttonTexts={buttonTexts}  imageSource="ImageSource" />
    </>
  )
}
