import { toast, Zoom } from 'react-toastify';

const ToastMessage = ({ message }) => (
  <div className={`custom-toast-container `}>
    <div>{message}</div>
  </div>
)

const toastOptions = (type, position = toast.POSITION.TOP_RIGHT) => ({
  position,
  transition: Zoom,
  // autoClose: 400000,
  className: `toast-base-${type}`,
  progressClassName: 'toast-base-progress',
})

export default {
  success: (message) => {
    toast(<ToastMessage message={message} />, toastOptions('success'));
  },

  bottomSuccess: (message) => {
    toast(<ToastMessage message={message} />, toastOptions('success', toast.POSITION.BOTTOM_CENTER));
  },

  error: (message) => {
    toast(<ToastMessage message={message} />, toastOptions('error'));
  }
};
