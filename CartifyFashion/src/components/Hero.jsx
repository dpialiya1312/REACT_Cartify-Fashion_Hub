import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const images = [
    "/images/fashion.webp",
    "/images/formal.webp",
    "/images/saree.webp"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      ...styles.hero,
      backgroundImage: `url(${images[index]})`
    }}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>New Fashion Collection 2026</h1>
        <p style={styles.subtitle}>Trendy styles for Men, Women & Kids</p>

        <button
          style={styles.btn}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    height: "500px",
    marginTop: "20px",   // ✅ ADD THIS
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-image 1s ease-in-out"
  },

  overlay: {
    textAlign: "center",
    background: "rgba(0,0,0,0.5)",
    padding: "40px",
    borderRadius: "10px",
    color: "white"
  },

  title: {
    fontSize: "48px",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "20px",
    marginBottom: "20px"
  },

  btn: {
    padding: "12px 30px",
    fontSize: "18px",
    border: "none",
    background: "linear-gradient(90deg,#ff7e5f,#feb47b)",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Hero;