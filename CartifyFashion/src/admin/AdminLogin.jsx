import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!data.email) newErrors.email = "Please fill out this field.";
    if (!data.password) newErrors.password = "Please fill out this field.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      if (data.email === "admin@gmail.com" && data.password === "admin123") {
        localStorage.setItem("admin", "true");
        navigate("/admin");
      } else {
        alert("Invalid Admin Credentials!");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login 🔐</h2>
        <p style={styles.subtitle}>Login to access dashboard</p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email Address:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.email && styles.errorInput) }}
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}

          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={data.password}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.password && styles.errorInput) }}
          />
          {errors.password && <p style={styles.errorText}>{errors.password}</p>}

          <button type="submit" style={styles.btn}>
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
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
  title: { color: "#8B5E6C" },
  subtitle: { color: "#777", marginBottom: "20px" },
  label: { display: "block", textAlign: "left", marginBottom: "5px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },
  errorInput: { border: "1px solid red" },
  errorText: {
    color: "red",
    fontSize: "13px",
    textAlign: "left",
    marginBottom: "10px"
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#8B5E6C",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default AdminLogin;