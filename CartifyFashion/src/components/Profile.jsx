import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user?._id;

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState([]);

  /* ================= LOGIN CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await res.json();

        setCartCount(Array.isArray(data) ? data.length : 0);

        // 👉 TEMP: use cart as orders (until order API created)
        setOrders(Array.isArray(data) ? data : []);

      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [userId]);

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const data = await res.json();

        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, [userId]);

  /* ================= REMOVE ORDER ================= */
  const handleRemove = (id) => {
    setOrders(prev => prev.filter(item => item._id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <img
            src={user?.image || "/images/profile/dhruti.jpg"}
            style={styles.avatar}
          />

          <h3>{user?.name || "User"}</h3>
          <p>{user?.email || "No Email"}</p>

          <ul style={styles.menu}>
            <li style={styles.menuItem} onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </li>

            <li style={styles.menuItem} onClick={() => navigate("/change-password")}>
              Change Password
            </li>

            <li
              style={{ ...styles.menuItem, color: "red" }}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {/* CARDS */}
          <div style={styles.cards}>
            <div style={styles.card}>
              🛒 <h4>My Cart</h4>
              <p>{cartCount} Items</p>
            </div>

            <div style={styles.card}>
              ❤️ <h4>Wishlist</h4>
              <p>{wishlistCount} Items</p>
            </div>

            <div style={styles.card}>
              📦 <h4>Orders</h4>
              <p>{orders.length} Orders</p>
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div style={styles.orders}>
            <h3 style={styles.heading}>Recent Orders</h3>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="4">No Orders</td>
                  </tr>
                ) : (
                  orders.map(item => (
                    <tr key={item._id}>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>₹{item.price}</td>
                      <td style={styles.td}>{item.qty}</td>

                      <td style={styles.td}>
                        <button
                          style={styles.btn}
                          onClick={() => handleRemove(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    minHeight: "90vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },

  wrapper: {
    width: "100%",
    maxWidth: "1100px",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  },

  menuItem: {
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s",
  background: "#f9f9f9"
},
  /* SIDEBAR */
  sidebar: {
    flex: "1 1 260px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },

  avatar: {
  width: "90px",     // ✅ size control
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover", // ✅ image crop properly
  marginBottom: "10px"
},

  email: {
    color: "#777",
    fontSize: "14px"
  },

  menu: {
  listStyle: "none",
  padding: 0,
  marginTop: "20px",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "12px"   // ✅ buttons ke beech space
},

  /* CONTENT */
  content: {
    flex: "3 1 600px"
  },

  /* CARDS */
  cards: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  card: {
    flex: "1 1 180px",
    background: "#fff3ec",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },

  /* ORDERS */
  orders: {
    marginTop: "20px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },

  heading: {
    color: "#ff6a3d",
    marginBottom: "15px"
  },

  table: {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px"   // 🔥 row gap
  },

  th: {
  textAlign: "left",
  padding: "12px",
  color: "#ff6a3d",
  fontWeight: "600",
  fontSize: "14px"
},

td: {
  padding: "12px",
  background: "#f9f9f9",
  borderTop: "1px solid #eee",
  borderBottom: "1px solid #eee"
},

tr: {
  borderRadius: "10px",
  overflow: "hidden"
},

  btn: {
    background: "#ff7e5f",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Profile;