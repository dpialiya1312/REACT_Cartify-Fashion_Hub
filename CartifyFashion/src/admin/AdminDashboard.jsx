import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [growthData, setGrowthData] = useState([]);

  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    users: 0,
    cart: 0,
    wishlist: 0,
    messages: 0,
    feedback: 0,
    reviews: 0
  });

  /* ================= FETCH COUNTS ================= */
  const fetchCounts = async () => {
    try {
      const [
        productsRes,
        categoriesRes,
        usersRes,
        cartRes,
        wishlistRes,
        messagesRes,
        feedbackRes,
        reviewsRes
      ] = await Promise.all([
        fetch("http://localhost:5000/api/products"),
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/users"),
        fetch("http://localhost:5000/api/cart"),
        fetch("http://localhost:5000/api/wishlist"),
        fetch("http://localhost:5000/api/contact"),
        fetch("http://localhost:5000/api/feedback"),
        fetch("http://localhost:5000/api/reviews")
      ]);

      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      const users = await usersRes.json();
      const cart = await cartRes.json();
      const wishlist = await wishlistRes.json();
      const messages = await messagesRes.json();
      const feedback = await feedbackRes.json();
      const reviews = await reviewsRes.json();

      setCounts({
        products: Array.isArray(products) ? products.length : products.products?.length || 0,
        categories: Array.isArray(categories) ? categories.length : categories.categories?.length || 0,
        users: Array.isArray(users) ? users.length : 0,
        cart: Array.isArray(cart) ? cart.length : 0,
        wishlist: Array.isArray(wishlist) ? wishlist.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        feedback: Array.isArray(feedback) ? feedback.length : 0,
        reviews: Array.isArray(reviews) ? reviews.length : 0
      });

    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  /* ================= USER GROWTH ================= */
  const fetchUserGrowth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const users = await res.json();

      if (!Array.isArray(users)) return;

      const months = new Array(12).fill(0);
      const currentYear = new Date().getFullYear();

      users.forEach(user => {
        if (!user.createdAt) return;

        const date = new Date(user.createdAt);

        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          months[monthIndex] += 1;
        }
      });

      setGrowthData(months);

    } catch (err) {
      console.log("Growth Error:", err);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchCounts();
    fetchUserGrowth();
  }, []);

  /* ================= CARDS ================= */
  const cards = [
    ["Total Products", counts.products],
    ["Total Categories", counts.categories],
    ["Total Users", counts.users],
    ["Total Cart Items", counts.cart],
    ["Total Wishlist", counts.wishlist],
    ["Total Messages", counts.messages],
    ["Total Feedback", counts.feedback],
    ["Total Reviews", counts.reviews]
  ];

  const cardStyle = {
    background: "linear-gradient(135deg,#ffffff,#F6F1F3)",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s ease",
    border: "1px solid #E5D5DA",
    width: "100%",
    maxWidth: "240px"
  };

  const hover = e => {
    e.currentTarget.style.transform = "translateY(-10px)";
    e.currentTarget.style.boxShadow = "0 15px 30px rgba(139,94,108,0.35)";
  };

  const leave = e => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  };

  /* ================= SAFE MAX VALUE ================= */
const maxValue = Math.max(...growthData);

const safeMax = maxValue === 0 ? 1 : maxValue;

  return (
    <div style={{ background: "#F6F1F3", minHeight: "100vh", padding: "30px" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(90deg,#8B5E6C,#A87482)",
        padding: "20px",
        borderRadius: "15px",
        color: "white",
        marginBottom: "30px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
      }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here is your store summary.</p>
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {cards.map((item, i) => (
          <div
            key={i}
            style={cardStyle}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            <h3 style={{ color: "#8B5E6C" }}>{item[0]}</h3>
            <h1 style={{ fontSize: "40px", marginTop: "10px" }}>
              {item[1]}
            </h1>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={{
        marginTop: "40px",
        background: "white",
        padding: "25px",
        borderRadius: "18px",
        border: "1px solid #E5D5DA",
        maxWidth: "500px",
        margin: "40px auto"
      }}>
        <h3 style={{ color: "#8B5E6C" }}>
          User Growth This Year
        </h3>

        {/* BARS */}
        <div style={{
          height: "180px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderLeft: "2px solid #8B5E6C",
          borderBottom: "2px solid #8B5E6C",
          padding: "10px"
        }}>
          {growthData.map((value, i) => (
            <div
              key={i}
              title={`${value} users`}
              style={{
                width: "18px",
                height: `${Math.max((value / safeMax) * 150, value > 0 ? 8 : 3)}px`,
                background: "linear-gradient(#8B5E6C,#A87482)",
                borderRadius: "6px",
                transition: "0.3s"
              }}
            />
          ))}
        </div>

        {/* MONTHS */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginTop: "8px"
        }}>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            .map((m,i)=>(<span key={i}>{m}</span>))}
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;