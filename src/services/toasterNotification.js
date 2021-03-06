import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = (message, title) => {
    if (title.toLowerCase() === "success") {
        toast.success(message == null ? "" : message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
        });
    }
    else {
        toast.error(message == null ? "" : message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
        });
    }
}

const Toaster = (props) => {
    return (
        <ToastContainer autoClose={5000} />
    )
}

export default Toaster
export { showToastMessage }