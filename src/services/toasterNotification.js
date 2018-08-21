import React from 'react';
import {ToastContainer, toast } from 'react-toastify';

const showToastMessage=(message, title)=> {
    if (title==="Success"){
        toast.success(message==null?"":message , {
            position: toast.POSITION.TOP_RIGHT,
            autoClose:5000
          });
    }
    else {
        toast.error(message==null ?"":message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose:5000
          });
    }       
}


const Toaster = (props) => {
    return(
        <ToastContainer autoClose={5000} />
    )
  }

  export default Toaster
  export {showToastMessage}