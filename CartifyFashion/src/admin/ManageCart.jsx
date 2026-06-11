import React, { useState, useEffect } from "react";

function ManageCart() {

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cart");
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, []);

  const deleteItem = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE"
      });

      setCart(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCart = cart.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={styles.title}>🛒 Manage Cart</h2>

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Search cart..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="desktopTable">
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCart.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  No Cart Items 😢
                </td>
              </tr>
            ) : (
              filteredCart.map((item, i) => (
                <tr key={item._id} style={styles.row}>
                  <td>{i + 1}</td>

                  <td>
                    <img
                      src={getImageUrl(item.image)}
                      style={styles.img}
                      alt=""
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price * item.qty}</td>

                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="mobileCards">
        {filteredCart.length === 0 ? (
          <p>No Cart Items 😢</p>
        ) : (
          filteredCart.map((item, i) => (
            <div key={item._id} style={styles.card}>
              <img src={getImageUrl(item.image)} style={styles.mobileImg} />

              <p><b>ID:</b> {i + 1}</p>
              <p><b>Name:</b> {item.name}</p>
              <p><b>Price:</b> ₹{item.price}</p>
              <p><b>Qty:</b> {item.qty}</p>
              <p><b>Total:</b> ₹{item.price * item.qty}</p>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteItem(item._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* RESPONSIVE */}
      <style>{`
        .mobileCards {
          display: none;
        }

        @media(max-width:768px) {
          .desktopTable {
            display: none;
          }
          .mobileCards {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  title: {
    marginBottom: "20px",
    color: "#8B5E6C",
    textAlign: "center"
  },

  searchBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    width: "250px"
  },

  table: {
    width: "100%",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden"
  },

  thead: {
    background: "#8B5E6C",
    color: "white"
  },

  row: {
    borderBottom: "1px solid #eee",
    textAlign: "center"
  },

  img: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "6px"
  },

  mobileImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #E5D5DA",
    textAlign: "center"
  },

  deleteBtn: {
    marginTop: "10px",
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  empty: {
    padding: "40px",
    textAlign: "center"
  }
};

export default ManageCart;