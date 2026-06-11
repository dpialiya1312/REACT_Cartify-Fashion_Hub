import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!formData.fullName) err.fullName = "Please fill out this field.";
    if (!formData.email) err.email = "Please fill out this field.";
    if (!formData.password) err.password = "Please fill out this field.";
    if (!formData.confirmPassword)
      err.confirmPassword = "Please fill out this field.";
    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Passwords do not match!";
    if (!formData.gender) err.gender = "Please select gender.";
    if (!formData.mobile) err.mobile = "Please fill out this field.";
    if (!formData.address) err.address = "Please fill out this field.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
            phone: formData.mobile
          })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration Successful ✅");
          navigate("/login");
        } else {
          alert(data.error || "Something went wrong ❌");
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
        <h2 style={styles.title}>Create Account ✨</h2>
        <p style={styles.subtitle}>Join Cartify Fashion Hub</p>

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <label style={styles.label}>Full Name:</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.fullName && styles.error) }}
          />
          {errors.fullName && <p style={styles.errorText}>{errors.fullName}</p>}

          {/* EMAIL */}
          <label style={styles.label}>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.email && styles.error) }}
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}

          {/* PASSWORD */}
          <label style={styles.label}>Password:</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                paddingRight: "40px",
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.password && <p style={styles.errorText}>{errors.password}</p>}

          {/* CONFIRM PASSWORD */}
          <label style={styles.label}>Confirm Password:</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                paddingRight: "40px",
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eye}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.confirmPassword && (
            <p style={styles.errorText}>{errors.confirmPassword}</p>
          )}

          {/* GENDER */}
          <label style={styles.label}>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.gender && styles.error) }}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && <p style={styles.errorText}>{errors.gender}</p>}

          {/* MOBILE */}
          <label style={styles.label}>Mobile Number:</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.mobile && styles.error) }}
          />
          {errors.mobile && <p style={styles.errorText}>{errors.mobile}</p>}

          {/* ADDRESS */}
          <label style={styles.label}>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ ...styles.textarea, ...(errors.address && styles.error) }}
          />
          {errors.address && <p style={styles.errorText}>{errors.address}</p>}

          <button type="submit" style={styles.btn}>
            Register
          </button>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Login now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: { color: "#ff6a3d" },
  subtitle: { color: "#777", marginBottom: "25px" },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    fontWeight: "500",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    height: "70px",
    resize: "none",
    marginBottom: "8px",
  },

  error: {
    border: "1px solid red",
  },

  errorText: {
    color: "red",
    fontSize: "13px",
    textAlign: "left",
    marginBottom: "10px",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "#ff7e5f",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },

  text: {
    marginTop: "15px",
    color: "#555",
  },

  link: {
    color: "#ff6a3d",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Register;