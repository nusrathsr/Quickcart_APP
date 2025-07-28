import React, { useEffect } from "react";

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // fades after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-8 right-8 bg-black bg-opacity-80 text-white px-5 py-3 rounded shadow-lg z-50 transition-opacity duration-500"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Toast;
