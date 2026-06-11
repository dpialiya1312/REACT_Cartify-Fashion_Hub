import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: user?.name || "",
    gender: user?.gender || "Female",
    phone: user?.phone || "",
    address: user?.address || "",
    image: user?.image || "/images/profile/dhruti.jpg"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Image preview
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      // ✅ File type check
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, or WEBP files are allowed.");
        return;
      }

      // ✅ File size check (<2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.name.trim() ||
    !form.gender.trim() ||
    !form.phone.trim() ||
    !form.address.trim()
  ) {
    alert("Please fill all details");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: user._id,
        ...form
      })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile Updated ✅");

      window.location.href = "/profile";
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
        <h2 style={styles.title}>Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div style={styles.imageWrapper}>
          <img src={form.image} alt="Profile" style={styles.avatar} />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <label>Mobile</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            maxLength="10"
          />

          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            style={styles.textarea}
          />

          <label>Profile Picture (JPG/PNG/WEBP, &lt;2MB)</label>
          <input type="file" onChange={handleImage} style={styles.file} />

          <div style={styles.actions}>
            <button type="submit" style={styles.saveBtn}>
              Save Changes
            </button>

            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => Navigate("/profile")}
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
    background: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    borderTop: "6px solid #c96b00"
  },

  title: {
    color: "#c96b00",
    marginBottom: "15px",
    borderBottom: "2px solid #c96b00",
    display: "inline-block",
    paddingBottom: "5px"
  },

  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px"
  },

  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    border: "3px solid #c96b00",
    objectFit: "cover"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "70px"
  },

  file: {
    padding: "5px"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  saveBtn: {
    background: "#198754",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    flex: 1
  },

  cancelBtn: {
    background: "transparent",
    color: "#c96b00",
    border: "none",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default EditProfile;