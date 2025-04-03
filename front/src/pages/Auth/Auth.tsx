import { useState } from "react";
import styles from "./auth.module.css";

const AuthPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      localStorage.setItem(email, password);
      alert("Registration successful! You can now log in.");
      setIsRegister(false);
    } else {
      if (email === "test@mail.com" && password === "test") {
        localStorage.setItem("token", "fake-jwt-token");
        onLogin();
      } else {
        setError("Login failed. Check your credentials.");
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className={styles.switchText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className={styles.switchButton}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export { AuthPage };
