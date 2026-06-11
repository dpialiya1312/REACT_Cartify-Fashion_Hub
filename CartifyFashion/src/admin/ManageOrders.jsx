import React, { useEffect, useState } from "react";

function ManageOrders() {

  const [orders, setOrders] = useState([]);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);

    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  fetchOrders(); // ✅ no error now
}, []);

  const deleteOrder = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE"
      });

      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "/images/no-image.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: "20px", background: "#e6ddd2", minHeight: "100vh" }}>

      <h2 style={{ fontWeight: "bold", marginBottom: "20px", color:"#8B5E6C" }}>
        📦 Manage Orders
      </h2>

      {/* DESKTOP TABLE */}
      <div className="desktopTable" style={{ overflowX: "auto" }}>

        <table
          width="100%"
          cellPadding="12"
          style={{
            borderCollapse: "collapse",
            background: "#fff",
            textAlign: "center"
          }}
        >

          <thead style={{ background: "#8B5E6C", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
  {orders.map((o, index) =>
    (o.items || []).map((item, i) => (
      <tr key={`${o._id}-${i}`}>

        <td>{index + 1}</td>
        <td>{o.userEmail}</td>

        <td>
          <img
            src={getImageUrl(item.image)}
            style={{ width: 60, height: 60 }}
            alt=""
          />
        </td>

        <td>{item.name}</td>
        <td>₹{item.price}</td>
        <td>{item.qty}</td>
        <td>₹{item.price * item.qty}</td>

        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
        <td>{o.address?.city}</td>

        <td>
          <button
            onClick={() => deleteOrder(o._id)}
            style={styles.deleteBtn}
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

      {/* MOBILE CARDS */}
      <div className="mobileCards">
  {orders.map((o, index) =>
    (o.items || []).map((item, i) => (

      <div key={`${o._id}-${i}`} style={styles.card}>

        <img
          src={getImageUrl(item.image)}
          alt=""
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "10px"
          }}
        />

        <p><b>ID:</b> {index + 1}</p>
        <p><b>User:</b> {o.userEmail}</p>
        <p><b>Product:</b> {item.name}</p>
        <p><b>Price:</b> ₹{item.price}</p>
        <p><b>Qty:</b> {item.qty}</p>
        <p><b>Total:</b> ₹{item.price * item.qty}</p>
        <p><b>Date:</b> {new Date(o.createdAt).toLocaleDateString()}</p>
        <p><b>Address:</b> {o.address?.city}</p>

        <button
          onClick={() => deleteOrder(o._id)}
          style={styles.deleteBtn}
        >
          Delete
        </button>

      </div>

    ))
  )}
</div>

      {/* RESPONSIVE CSS */}
      <style>{`

        .mobileCards{
          display:none;
        }

        @media (max-width:768px){

          .desktopTable{
            display:none;
          }

          .mobileCards{
            display:flex;
            flex-direction:column;
            gap:15px;
          }

        }

      `}</style>

    </div>
  );
}

const styles = {

  card:{
    background:"white",
    padding:"15px",
    borderRadius:"10px",
    border:"1px solid #E5D5DA",
    textAlign:"center"
  },

  deleteBtn:{
    marginTop:"10px",
    background:"#E74C3C",
    border:"none",
    color:"white",
    padding:"6px 12px",
    borderRadius:"6px",
    cursor:"pointer"
  }

};

export default ManageOrders;