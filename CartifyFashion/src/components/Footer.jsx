import React from "react";

function Footer() {
  return (
    <div style={styles.footer}>

      <div style={styles.container}>

        {/* BRAND */}
        <div>
          <h2 style={styles.logo}>Cartify Fashion Hub</h2>
          <p style={styles.text}>
            Your one-stop destination for trendy fashion collections.
          </p>
        </div>

        {/* ABOUT */}
        <div>
          <h3 style={styles.heading}>ABOUT US</h3>
          <p style={styles.link}>Who are we?</p>
          <p style={styles.link}>Terms of Service</p>
          <p style={styles.link}>Contact Us</p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 style={styles.heading}>QUICK LINKS</h3>
          <p style={styles.link}>Sell on Cartify</p>
          <p style={styles.link}>Shipping & Delivery</p>
          <p style={styles.link}>Returns</p>
          <p style={styles.link}>Privacy Policy</p>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 style={styles.heading}>STAY IN THE LOOP!</h3>
          <p style={styles.text}>
            Enter your email to get new offers & updates.
          </p>

          <input
            placeholder="Enter your email"
            style={styles.input}
          />
        </div>

      </div>

      <div style={styles.bottom}>
        © 2026 Cartify Fashion Hub — All Rights Reserved
      </div>

    </div>
  );
}

const styles = {

  footer: {
    marginTop: "50px",
    background: "linear-gradient(90deg,#ff7e5f,#feb47b)",
    color: "white"
  },

  container: {
    display: "flex",
    justifyContent: "space-around",
    padding: "40px 20px",
    flexWrap: "wrap",
    gap: "30px"
  },

  logo: {
    fontSize: "22px",
    color: "#1a1a1a"
  },

  heading: {
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#1a1a1a"
  },

  text: {
    color: "#fff",
    marginBottom: "8px",
    maxWidth: "250px"
  },

  link: {
    cursor: "pointer",
    marginBottom: "6px"
  },

  input: {
    padding: "8px",
    width: "200px",
    border: "none",
    outline: "none",
    borderRadius: "3px"
  },

  bottom: {
    textAlign: "center",
    padding: "15px",
    background: "rgba(0,0,0,0.2)",
    fontSize: "14px"
  }

};

export default Footer;