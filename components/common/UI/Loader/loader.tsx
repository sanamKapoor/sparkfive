import React from 'react'
import styles from './loader.module.css'
interface LoaderProps {
  className?: string;
}


function Loader ({ className }: LoaderProps){
  const loaderClass = `${styles.loader} ${className || ''}`.trim();
  

 
  return (
    <div className={loaderClass} />
  )
}

export default Loader;