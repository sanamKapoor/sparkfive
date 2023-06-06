import React from 'react';

import requestListStyles from "./request-list-item.module.css";


const RequestStatusBadge = ({ status, uploadType, isAdmin }) => {
    if(uploadType === 'approval'){
     switch (status) {
       case -1: {
         return <span className={requestListStyles['reject-tag']}>Rejected</span>
       }
       case 0: {
         return <span className={requestListStyles['pending-tag']}>Pending</span>
       }
       case 1: {
         // Admin role will see submitted tag as pending
         if (isAdmin) {
           return <span className={requestListStyles['pending-tag']}>Pending</span>
         } else {
           return <span className={requestListStyles['complete-tag']}>Submitted</span>
         }
 
       }
       case 2: {
         return <span className={requestListStyles['complete-tag']}>Completed</span>
       }
       default: {
         return <span className={requestListStyles['pending-tag']}>Pending</span>
       }
     }
    }else{
     switch(status){
       case 'Completed':
         return <span className={requestListStyles['complete-tag']}>Completed</span>
       case 'Pending':
         return <span className={requestListStyles['pending-tag']}>Pending</span>
       case 'In Progress':
         return <span className={requestListStyles['pending-tag']}>In Progress</span>
       case 'Rejected': {
          return <span className={requestListStyles['reject-tag']}>Rejected</span>
        }
        default: {
          return <span className={requestListStyles['pending-tag']}>Pending</span>
        }
        }
    }
 
   }

export default RequestStatusBadge