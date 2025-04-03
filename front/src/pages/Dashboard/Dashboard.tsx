import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Notification from "../../components/Notification";
import { getPhishingAttempts, sendPhishingEmail } from "../../services/phishingService";
import { PhishingAttempt } from "../../types/types";


const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [email, setEmail] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getPhishingAttempts(token);
          setAttempts(data);
        }
      } catch (error) {
        console.error("Failed to fetch phishing attempts:", error);
      }
    };

    fetchAttempts();
  }, []);

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
  
    try {
      if (token) {
        await sendPhishingEmail(token, email, templateId);
        setNotification(`Phishing message sent to ${email}`);
        setEmail("");
        setTemplateId("");
      }
      
    } catch (error) {
      console.error("Failed to send phishing message:", error);
      setNotification("Failed to send phishing message");
    }
finally {
  setAttempts((prevAttempts) => [
    ...prevAttempts,
    { _id: "", email, templateId, status: "sent", trackingId: "", createdAt: "", updatedAt: "", __v: 0 },
  ]);
}
  };

  const handleCloseNotification = () => {
    setNotification("");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardBox}>
        <h2>Phishing Attempts</h2>
       
        <form onSubmit={handleSendMail} className={styles.inputContainer}>
          <input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            name="templateId"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className={styles.dropdown} 
          >
            <option value="">Select content</option>
            <option value="account-verification">Account Verification</option>
            <option value="password-reset">Password Reset</option>
          </select>

          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
        {notification && (
          <Notification
            message={notification}
            onClose={handleCloseNotification}
          />
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id}>
                <td>{attempt.email}</td>
                <td
                  className={
                    attempt.status === "clicked"
                      ? styles.statusClicked
                      : attempt.status === "sent"
                      ? styles.statusNotClicked
                      : styles.statusFailed
                  }
                >
                  {attempt.status}
                </td>
                <td>{attempt.templateId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;