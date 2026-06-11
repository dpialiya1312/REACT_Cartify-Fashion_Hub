import React, { useState } from "react";

function Contact() {
  const [data, setData] = useState({
    name: "",
    email: "",
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
    if (!data.message) err.message = "Please fill out this field.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ NOW DYNAMIC (API CALL ADDED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
          alert("Message Sent Successfully ✅");

          // reset form
          setData({
            name: "",
            email: "",
            message: ""
          });
        } else {
          alert(result.error || "Something went wrong ❌");
        }
      } catch (error) {
        console.error(error);
        alert("Server error ❌");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <h2 style={styles.supportTitle}>24/7 Support</h2>
          <p>We are here to help you anytime. Feel free to contact us.</p>
        </div>

        <div style={styles.right}>
          <h1 style={styles.title}>Contact Us</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={data.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.name && styles.errorStyle)
              }}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={data.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email && styles.errorStyle)
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}

            <textarea
              name="message"
              placeholder="Your Message..."
              value={data.message}
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
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(65vh - 90px)",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 15px"
  },
  card: {
    width: "100%",
    maxWidth: "950px",
    display: "flex",
    flexWrap: "wrap", // 👈 mobile me stack ho jayega
    background: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },
  left: {
    flex: "1 1 300px",
    background: "linear-gradient(135deg, #6a5acd, #836fff)",
    color: "white",
    padding: "clamp(20px, 4vw, 40px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  right: {
    flex: "1 1 350px",
    padding: "clamp(20px, 4vw, 40px)",
    textAlign: "center"
  },
  supportTitle: {
    fontSize: "clamp(20px, 3vw, 28px)",
    marginBottom: "10px"
  },
  title: {
    color: "#ff6a3d",
    marginBottom: "20px",
    fontSize: "clamp(24px, 4vw, 32px)"
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
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
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

export default Contact;