import React, { useState, useEffect } from "react";

function Cart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [cart, setCart] = useState([]);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [userId]);

  /* ================= REMOVE ================= */
  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE"
      });

      setCart(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= INCREASE ================= */
  const increase = async (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  /* ================= DECREASE ================= */
  const decrease = async (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  return (
    <div style={styles.page}>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 && <h2>Cart is Empty</h2>}

      {cart.map(item => (
        <div key={item._id} style={styles.card}>
          <img
            src={getImageUrl(item.image)}
            alt=""
            style={styles.img}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>

            <div style={styles.qtyBox}>
              <button onClick={() => decrease(item._id)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increase(item._id)}>+</button>
            </div>

            <button
              style={styles.remove}
              onClick={() => removeItem(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && <h2>Total: ₹ {total}</h2>}
    </div>
  );
}

const styles = {
  page: { padding: "40px", maxWidth: "900px", margin: "auto" },
  card: {
    display: "flex",
    gap: "20px",
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "20px"
  },
  img: { width: "150px", height: "150px", objectFit: "cover" },
  qtyBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },
  remove: {
    marginTop: "10px",
    padding: "8px",
    background: "red",
    color: "white",
    border: "none"
  }
};

export default Cart;