import React from "react";

function About() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>About Cartify 🛍️</h1>

        <p style={styles.text}>
          Cartify Fashion Hub is your one-stop destination for trendy fashion.
          We bring the latest styles for Men, Women, and Kids at affordable prices across India.
        </p>

        <div style={styles.features}>
          <div style={styles.box}>
            <h3>🚚 Fast Delivery</h3>
            <p>Quick shipping across India.</p>
          </div>

          <div style={styles.box}>
            <h3>💳 Secure Payment</h3>
            <p>100% safe payment methods.</p>
          </div>

          <div style={styles.box}>
            <h3>⭐ Quality Products</h3>
            <p>Best quality fashion guaranteed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(70vh - 90px)", // 👈 Navbar & Footer gap fix
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 15px"
  },
  card: {
    width: "100%",
    maxWidth: "900px", // responsive width
    background: "#ffffff",
    padding: "clamp(20px, 4vw, 40px)", // auto responsive padding
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  title: {
    color: "#ff6a3d",
    marginBottom: "12px",
    fontSize: "clamp(24px, 4vw, 36px)"
  },
  text: {
    color: "#555",
    marginBottom: "30px",
    fontSize: "clamp(14px, 2vw, 18px)",
    lineHeight: "1.6"
  },
  features: {
    display: "flex",
    flexWrap: "wrap", // 👈 mobile responsive
    gap: "20px",
    justifyContent: "center"
  },
  box: {
    flex: "1 1 250px", // 👈 auto responsive boxes
    background: "#fff3ec",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "220px"
  }
};

export default About;