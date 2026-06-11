import React, { useState } from "react";

function ChangePassword() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid =
    form.currentPassword.trim() &&
    form.newPassword.trim() &&
    form.confirmPassword.trim();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.currentPassword ||
    !form.newPassword ||
    !form.confirmPassword
  ) {
    alert("Fill all fields");
    return;
  }

  if (form.newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: user._id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password Changed ✅");

      // 🔐 logout after password change
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } else {
      alert(data.error);
    }

  } catch (error) {
    console.error(error);
    alert("Server error ❌");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Change Password 🔒</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.actions}>
            <button
              type="submit"
              style={{
                ...styles.saveBtn,
                opacity: isFormValid ? 1 : 0.6,
                cursor: isFormValid ? "pointer" : "not-allowed"
              }}
              disabled={!isFormValid}
            >
              Update Password
            </button>

            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => (window.location.href = "/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },

  title: {
    textAlign: "center",
    color: "#ff6a3d",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  saveBtn: {
    flex: 1,
    background: "#ff7e5f",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  cancelBtn: {
    flex: 1,
    background: "#eee",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default ChangePassword;