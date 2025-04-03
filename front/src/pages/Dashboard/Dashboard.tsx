import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Notification from "../../components/Notification";

interface PhishingAttempt {
  id: number;
  email: string;
  status: string;
  content: string; 
}

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [email, setEmail] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    // Fake data
    const fakeData: PhishingAttempt[] = [
      {
        id: 1,
        email: "user1@example.com",
        status: "2",
        content: "Phishing email content 1",
      },
      {
        id: 2,
        email: "user2@example.com",
        status: "1",
        content: "Phishing email content 2",
      },
      {
        id: 3,
        email: "user3@example.com",
        status: "3",
        content: "Phishing email content 3",
      },
    ];
    setAttempts(fakeData);
  }, []);

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake sending mail
    setTimeout(() => {
      setNotification(`Phishing message sent to ${email}`);
      setEmail("");
      setContent("");
    }, 1000);
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
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
              <th>ID</th>
              <th>Email</th>
              <th>Status</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td>{attempt.id}</td>
                <td>{attempt.email}</td>
                <td
                  className={
                    attempt.status === "1"
                      ? styles.statusClicked
                      : attempt.status === "2"
                      ? styles.statusNotClicked
                      : styles.reviewed
                  }
                >
                  {attempt.status === "1"
                    ? "Clicked"
                    : attempt.status === "2"
                    ? "Not Clicked"
                    : "Email sent"}
                </td>
                <td>{attempt.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;