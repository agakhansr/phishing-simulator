import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Notification from "../../components/Notification";
import {
    getPhishingAttempts,
    sendPhishingEmail
} from "../../services/phishingService";
import { PhishingAttempt, PhishingAttemptStatus } from "../../types/types";
import websocketService from "../../services/websocketService";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
    const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
    const [email, setEmail] = useState<string>("");
    const [templateId, setTemplateId] = useState<string>("");
    const [notification, setNotification] = useState<string>("");
    const [isWebSocketConnected, setIsWebSocketConnected] = useState<boolean>(false);

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

        // Connect to WebSocket and subscribe to status changes
        websocketService.connect();
        setIsWebSocketConnected(true);

        const unsubscribe = websocketService.subscribeToPhishingStatusChanges((updatedAttempt) => {
            setAttempts((prevAttempts) =>
                prevAttempts.map((attempt) =>
                    attempt.trackingId === updatedAttempt.trackingId
                        ? { ...attempt, ...updatedAttempt }
                        : attempt
                )
            );

            // Show notification for clicked attempts
            if (updatedAttempt.status === PhishingAttemptStatus.CLICKED) {
                setNotification(`Phishing link clicked by ${updatedAttempt.email}!`);
            }
        });

        // Cleanup on component unmount
        return () => {
            unsubscribe();
            websocketService.disconnect();
            setIsWebSocketConnected(false);
        };
    }, []);

    const handleSendMail = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            if (token) {
                const response = await sendPhishingEmail(token, email, templateId);
                setNotification(`Phishing message sent to ${email}`);

                // Add the new attempt with real tracking ID from server response
                if (response && response.trackingId) {
                    setAttempts((prevAttempts) => [
                        ...prevAttempts,
                        {
                            email,
                            templateId,
                            status: PhishingAttemptStatus.SENT,
                            trackingId: response?.trackingId,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        } as PhishingAttempt
                    ]);
                } else {
                    // Fallback in case no response with tracking ID
                    setAttempts((prevAttempts) => [
                        ...prevAttempts,
                        {
                            _id: Date.now().toString(),
                            email,
                            templateId,
                            status: PhishingAttemptStatus.SENT,
                            trackingId: "",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            __v: 0
                        },
                    ]);
                }

                setEmail("");
                setTemplateId("");
            }
        } catch (error) {
            console.error("Failed to send phishing message:", error);
            setNotification("Failed to send phishing message");
        }
    };

    const handleCloseNotification = () => {
        setNotification("");
    };

    const getStatusIndicator = (status: string) => {
        switch (status) {
            case PhishingAttemptStatus.CLICKED:
                return <span
                    className={`${styles.statusIndicator} ${styles.statusClicked}`}></span>;
            case PhishingAttemptStatus.SENT:
                return <span
                    className={`${styles.statusIndicator} ${styles.statusNotClicked}`}></span>;
            case PhishingAttemptStatus.FAILED:
                return <span
                    className={`${styles.statusIndicator} ${styles.statusFailed}`}></span>;
            default:
                return <span
                    className={`${styles.statusIndicator} ${styles.statusPending}`}></span>;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardBox}>
                <div className={styles.header}>
                    <h2>Phishing Attempts</h2>
                    {isWebSocketConnected && (
                        <div className={styles.wsStatus}>
                            <span className={styles.wsIndicator}></span> Live
                            Updates Active
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMail}
                      className={styles.inputContainer}>
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
                        <option value="account-verification">Account
                            Verification
                        </option>
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
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {attempts.length > 0 ? (
                        attempts.map((attempt) => (
                            <tr key={attempt._id || attempt.trackingId}>
                                <td>{attempt.email}</td>
                                <td className={styles.statusCell}>
                                    {getStatusIndicator(attempt.status)}
                                    <span className={
                                        attempt.status === PhishingAttemptStatus.CLICKED
                                            ? styles.statusClicked
                                            : attempt.status === PhishingAttemptStatus.SENT
                                                ? styles.statusNotClicked
                                                : styles.statusFailed
                                    }>
                      {attempt.status}
                    </span>
                                </td>
                                <td>{attempt.templateId}</td>
                                <td>
                                    {attempt.status === PhishingAttemptStatus.CLICKED && attempt.clickedAt
                                        ? new Date(attempt.clickedAt).toLocaleTimeString()
                                        : attempt.sentAt
                                            ? new Date(attempt.sentAt).toLocaleTimeString()
                                            : new Date(attempt.createdAt).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className={styles.noData}>No
                                phishing attempts yet
                            </td>
                        </tr>
                    )}
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
