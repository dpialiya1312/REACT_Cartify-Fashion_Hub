import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [wishlist, setWishlist] = useState([]);

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/wishlist/${userId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);

      } catch (err) {
        console.log("FETCH ERROR:", err);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [userId]);

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: "DELETE"
      });

      setWishlist((prev) => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LOGIN CHECK ================= */
  if (!userId) {
    return (
      <div style={styles.page}>
        <h2>Please login to view wishlist ❤️</h2>
        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  /* ================= IMAGE HANDLER ================= */
  const getImageUrl = (img) => {
  if (!img) return "/no-image.png";

  // already full URL
  if (img.startsWith("http")) return img;

  // remove duplicate /uploads if exists
  const cleanPath = img.replace("/uploads/", "").replace("uploads/", "");

  return `http://localhost:5000/uploads/${cleanPath}`;
};

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <h1>❤️ My Wishlist</h1>

      {wishlist.length === 0 && <h2>No items in wishlist</h2>}

      {wishlist.map(item => (
        <div key={item._id} style={styles.card}>

          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            style={styles.img}
            onError={(e) => (e.target.src = "/no-image.png")}
          />
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>

            <button
              style={styles.remove}
              onClick={() => removeItem(item._id)}
            >
              Remove
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "40px",
    maxWidth: "900px",
    margin: "auto"
  },
  card: {
    display: "flex",
    gap: "20px",
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "20px",
    alignItems: "center"
  },
  img: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px"
  },
  remove: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Wishlist;