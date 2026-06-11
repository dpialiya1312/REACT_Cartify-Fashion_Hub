import React, { useState } from "react";

function Feedback() {
  const [data, setData] = useState({
    name: "",
    email: "",
    rating: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!data.name) err.name = "Please fill out this field.";
    if (!data.email) err.email = "Please fill out this field.";
    if (!data.rating) err.rating = "Please select rating.";
    if (!data.message) err.message = "Please fill out this field.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Feedback submitted successfully ✅");

        // ✅ CLEAR FORM AFTER SUCCESS
        setData({
          name: "",
          email: "",
          rating: "",
          message: ""
        });

        // optional: clear errors also
        setErrors({});
      } else {
        alert(result.error || "Something went wrong ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>We Value Your Feedback 💬</h1>
        <p style={styles.subtitle}>
          Please share your experience with Cartify Fashion Hub.
        </p>

        <form onSubmit={handleSubmit}>
          <input
              name="name"
              value={data.name}
              placeholder="Full Name"
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.name && styles.errorStyle)
              }}
            />
          {errors.name && (
            <p style={styles.errorText}>{errors.name}</p>
          )}

          <input
            name="email"
            value={data.email}
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.email && styles.errorStyle)
            }}
          />
          {errors.email && (
            <p style={styles.errorText}>{errors.email}</p>
          )}

          <select
            name="rating"
            value={data.rating}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.rating && styles.errorStyle)
            }}
          >
            <option value="">-- Select Rating --</option>
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐⭐ 2 - Average</option>
            <option value="3">⭐⭐⭐ 3 - Good</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          </select>
          {errors.rating && (
            <p style={styles.errorText}>{errors.rating}</p>
          )}

          <textarea
            name="message"
            value={data.message}
            placeholder="Write your feedback..."
            onChange={handleChange}
            style={{
              ...styles.textarea,
              ...(errors.message && styles.errorStyle)
            }}
          />
          {errors.message && (
            <p style={styles.errorText}>{errors.message}</p>
          )}

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(65vh - 90px)", // 👈 no extra gap with navbar/footer
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 15px"
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#ffffff",
    padding: "clamp(20px, 4vw, 35px)",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  title: {
    color: "#ff6a3d",
    marginBottom: "10px",
    fontSize: "clamp(22px, 4vw, 30px)"
  },
  subtitle: {
    color: "#666",
    marginBottom: "25px",
    fontSize: "clamp(14px, 2vw, 16px)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px"
  },
  textarea: {
    width: "100%",
    height: "110px",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ff7e5f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  },

  errorStyle: {
    border: "1px solid red"
  },

  errorText: {
    color: "red",
    fontSize: "13px",
    textAlign: "left",
    marginTop: "-5px",
    marginBottom: "10px"
  }
};

export default Feedback;