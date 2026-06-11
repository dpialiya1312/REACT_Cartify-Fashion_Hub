import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  margin: "12px 0",
  padding: "8px",
  borderRadius: "6px"
};

  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin-login";
  };

  return (
    <div style={{
        width: "230px",
        background: "#8B5E6C",
        color: "white",
        height: "100vh",
        padding: "25px"
      }}>
      <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>

      <Link
        to="/admin"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        🏠 Dashboard
      </Link>    
      <Link
        to="/admin/users"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        👥 Manage Users
      </Link>   
      <Link
        to="/admin/products"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        📦 Manage Products
      </Link>      
      <Link
        to="/admin/categories"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        📂 Manage Categories
      </Link>   
      <Link
        to="/admin/orders"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        📑 Manage Orders
      </Link>   
      <Link
        to="/admin/ManageCart"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        🛒 Manage Cart
      </Link>
      <Link
        to="/admin/ManageWishlist"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        ❤️ Manage Wishlist
      </Link>   
      <Link
        to="/admin/ViewMessages"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        💬 View Messages
      </Link>   
      <Link
        to="/admin/ViewFeedback"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        📝 View Feedback
      </Link>   
      <Link
        to="/admin/reviews"
        style={linkStyle}
        onMouseOver={(e) => e.target.style.background="#A87482"}
        onMouseOut={(e) => e.target.style.background="transparent"}>
        ⭐ Product Reviews & Ratings
      </Link>

      <button
        onClick={logout}
        style={{
          marginTop: "30px",
          padding: "10px",
          width: "100%",
          background: "#A87482",
          border: "none",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;