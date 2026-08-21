import * as toastr from 'toastr';
import 'toastr/build/toastr.css';

export default class Message {
 static success(message = 'Task Submission Complete', duration = 3000) {
  // Check if CSS is loaded, if not add it dynamically
  if (!document.querySelector('#custom-toast-style')) {
    const style = document.createElement('style');
    style.id = 'custom-toast-style';
    style.textContent = `
      .custom-toast {
        position: fixed; /* Changed from fixed to absolute */
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background-color: #48BB78;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px #48BB78;
        opacity: 0;
        z-index: 1000; /* Reduced from 9999 to stay within page content */
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 90%;
        width:100%;
        word-wrap: break-word;
        text-align: center;
      }
      .custom-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      
      /* Optional: Add a container if you want it in a specific place */
      .custom-toast-container {
        position: relative;
        width: 100%;
        min-height: 60px; /* Reserve space for the toast */
      }
    `;
    document.head.appendChild(style);
  }

    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
      existingToast.classList.remove('show');
      setTimeout(() => existingToast.remove(), 300);
    }

    // Create and show new toast
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, duration);
  }

  static error(arg) {
    // must be changed change because Bootstrap UI
    // css overrides the style
    toastr.options.toastClass = 'toastr';
    toastr.options.positionClass = 'toast-top-left';

    toastr.error(arg);
  }
}
