import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [params] = useSearchParams();

  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword: password })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/login";
    } else {
      setError(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password 🔒</h2>
        <p style={styles.subtitle}>Create new password</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            style={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.btn}>Reset Password</button>
        </form>

        <p style={styles.text}>
          Back to <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "60vh",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "380px",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  title: { color: "#ff6a3d" },
  subtitle: { color: "#777", marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginBottom: "10px"
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#ff7e5f",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "13px",
    textAlign: "left"
  },
  text: { marginTop: "15px" },
  link: { color: "#ff6a3d", fontWeight: "bold" }
};

export default ResetPassword;