import React, { useEffect, useState } from "react";
import styles from "./notification.module.css";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setHide(true); 
      setTimeout(onClose, 500); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${show ? styles.show : ""} ${hide ? styles.hide : ""}`}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
};

export default Notification;