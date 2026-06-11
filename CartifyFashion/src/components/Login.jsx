import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
    agree: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!data.email) newErrors.email = "Please fill out this field.";
    if (!data.password) newErrors.password = "Please fill out this field.";
    if (!data.agree) newErrors.agree = "Check this checkbox to continue.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    console.log("EMAIL:", data.email);
console.log("PASSWORD:", data.password);

    e.preventDefault();

    if (validate()) {
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email.trim(),
            password: data.password.trim()
          })
        });

        const result = await res.json();

        if (res.ok) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));

          alert("Login Successful ✅");
          window.location.href = "/profile";
        } else {
          alert(result.error || "Login failed ❌");
        }
      } catch (error) {
  console.error("Server Error:", error);
  alert("Server error ❌");
}
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue shopping</p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", textAlign: "left", marginBottom: "5px" }}>
            Email Address:
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}

          <label style={{ display: "block", textAlign: "left", marginBottom: "5px" }}>
            Password:
          </label>

          {/* 👇 ONLY ICON INSIDE SAME BOX */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={data.password}
              onChange={handleChange}
              style={styles.input}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errors.password && <p style={styles.errorText}>{errors.password}</p>}

          <p style={{ textAlign: "right", marginTop: "-5px" }}>
            <Link to="/forgot-password" style={{ color: "#ff6a3d", fontSize: "14px" }}>
              Forgot Password?
            </Link>
          </p>

          <div style={styles.checkboxRow}>
            <input type="checkbox" name="agree" onChange={handleChange} />
            <span>I agree.</span>
          </div>

          {errors.agree && <p style={styles.errorText}>{errors.agree}</p>}

          <button type="submit" style={styles.btn}>
            Log In
          </button>
        </form>

        <p style={styles.text}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Signup now
          </Link>
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
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "12px",
    cursor: "pointer",
    fontSize: "18px"
  },

  errorText: {
    color: "red",
    fontSize: "13px",
    textAlign: "left",
    marginTop: "-5px",
    marginBottom: "10px"
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    textAlign: "left"
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

  text: { marginTop: "15px" },

  link: { color: "#ff6a3d", fontWeight: "bold", cursor: "pointer" }
};

export default Login;