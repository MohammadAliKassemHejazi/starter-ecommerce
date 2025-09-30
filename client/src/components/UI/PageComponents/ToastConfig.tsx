import Swal from 'sweetalert2';

// Common toast configurations
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const bsPrimary = (typeof window !== 'undefined' && typeof document !== 'undefined')
  ? (getComputedStyle(document.documentElement).getPropertyValue('--bs-primary') || '#0d6efd').trim()
  : '#0d6efd';

const bsDanger = (typeof window !== 'undefined' && typeof document !== 'undefined')
  ? (getComputedStyle(document.documentElement).getPropertyValue('--bs-danger') || '#dc3545').trim()
  : '#dc3545';

export const ConfirmDialog = Swal.mixin({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: bsPrimary,
  cancelButtonColor: bsDanger,
  confirmButtonText: 'Yes, do it!',
  cancelButtonText: 'Cancel'
});

export const SuccessDialog = Swal.mixin({
  icon: 'success',
  title: 'Success!',
  showConfirmButton: false,
  timer: 1500
});

export const ErrorDialog = Swal.mixin({
  icon: 'error',
  title: 'Error!',
  showConfirmButton: false,
  timer: 1500
});

// Common toast functions
export const showToast = {
  success: (message: string) => Toast.fire({ icon: 'success', title: message }),
  error: (message: string) => Toast.fire({ icon: 'error', title: message }),
  warning: (message: string) => Toast.fire({ icon: 'warning', title: message }),
  info: (message: string) => Toast.fire({ icon: 'info', title: message })
};

export const showConfirm = (options?: {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  return ConfirmDialog.fire({
    title: options?.title || 'Are you sure?',
    text: options?.text || "You won't be able to revert this!",
    confirmButtonText: options?.confirmText || 'Yes, do it!',
    cancelButtonText: options?.cancelText || 'Cancel'
  });
};

export default Toast;
