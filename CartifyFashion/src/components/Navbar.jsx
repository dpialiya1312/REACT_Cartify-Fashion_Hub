// import React, { useState } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";



function Navbar() {
  const [active, setActive] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/categories");

    if (!res.ok) {
      console.log("❌ API NOT FOUND");
      setCategoryData({});
      return;
    }

    const data = await res.json();
    console.log("CATEGORY API:", data);

    // ✅ SAFE ARRAY HANDLING
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.categories)
      ? data.categories
      : [];

    const grouped = {};

    list.forEach(item => {
      const cat = item.category?.toLowerCase();
      const sub = item.subcategory;

      if (!cat || !sub) return;

      if (!grouped[cat]) grouped[cat] = [];

      // ✅ avoid duplicates
      if (!grouped[cat].includes(sub)) {
        grouped[cat].push(sub);
      }
    });

    setCategoryData(grouped);

  } catch (err) {
    console.log("CATEGORY ERROR:", err);
    setCategoryData({});
  }
};
    
  useEffect(() => {
  fetchCategories();

  const interval = setInterval(fetchCategories, 2000); // 🔥 auto refresh
  return () => clearInterval(interval);

}, []);

  const handleLeave = () => {
    setActive(null);
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <div style={styles.topBar}>
        <div style={styles.logo}>Cartify Fashion Hub</div>

        <div style={styles.links}>
          <Link to="/home" style={styles.topLink}>HOME</Link>
          <Link to="/products" style={styles.topLink}>PRODUCTS</Link>
          <Link to="/about" style={styles.topLink}>ABOUT</Link>
          <Link to="/contact" style={styles.topLink}>CONTACT</Link>
          <Link to="/feedback" style={styles.topLink}>FEEDBACK</Link>
        </div>

        <div style={styles.authBtns}>
          {user ? (
            <Link to="/profile">
              <img
                src={user?.image || "/images/profile/dhruti.jpg"}
                alt="profile"
                style={styles.profileImg}
              />
            </Link>
          ) : (
            <>
              <Link to="/login" style={styles.authBtn}>Login</Link>
              <Link to="/register" style={styles.authBtn}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* ================= CATEGORY NAVBAR ================= */}
      <div style={styles.bottomBar}>
        <div style={styles.categories}>

          {/* ================= MEN ================= */}
          <div
            style={styles.categoryItem}
            onMouseEnter={() => setActive("men")}
            onClick={() => setActive(active === "men" ? null : "men")}
          >
            <span style={styles.menuLabel}>MEN ⌄</span>

            {active === "men" && (
              <div
                style={styles.megaMenu}
                onMouseEnter={() => setActive("men")}
                onMouseLeave={handleLeave}
              >
                <div style={styles.imageSection}>
                <img src="/images/mencategory.png" alt="men" style={styles.menuImage} />                </div>

                <div style={styles.menuContent}>
                  <div style={styles.column}>
                    {categoryData["men"]?.map(sub => (
                      <Link
                        key={sub}
                        to={`/products/men/${sub}`}
                        style={styles.dropLink}
                      >
                        {sub}
                      </Link>
                    ))}
                    
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= WOMEN ================= */}
          <div
            style={styles.categoryItem}
            onMouseEnter={() => setActive("women")}
            onClick={() => setActive(active === "women" ? null : "women")}
          >
            <span style={styles.menuLabel}>WOMEN ⌄</span>

            {active === "women" && (
              <div
                style={styles.megaMenu}
                onMouseEnter={() => setActive("women")}
                onMouseLeave={handleLeave}
              >
                <div style={styles.imageSection}>
                  <img src="/images/womencategory.jpg" alt="women" style={styles.menuImage} />
                </div>

                <div style={styles.menuContent}>
                  <div style={styles.column}>
                    {categoryData["women"]?.map(sub => (
                    <Link
                      key={sub}
                      to={`/products/women/${sub}`}
                      style={styles.dropLink}
                    >
                      {sub}
                    </Link>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= KIDS ================= */}
          <div
            style={styles.categoryItem}
            onMouseEnter={() => setActive("kids")}
            onClick={() => setActive(active === "kids" ? null : "kids")}
          >
            <span style={styles.menuLabel}>KIDS ⌄</span>

            {active === "kids" && (
              <div
                style={styles.megaMenu}
                onMouseEnter={() => setActive("kids")}
                onMouseLeave={handleLeave}
              >
                <div style={styles.imageSection}>
                  <img src="/images/kidscategory.png" alt="kids" style={styles.menuImage} />
                </div>

                <div style={styles.menuContent}>
                  <div style={styles.column}>
                    {categoryData["kids"]?.map(sub => (
                    <Link
                      key={sub}
                      to={`/products/kids/${sub}`}
                      style={styles.dropLink}
                    >
                      {sub}
                    </Link>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= SHOES (WITH IMAGE) ================= */}
          <div
            style={styles.categoryItem}
            onMouseEnter={() => setActive("shoes")}
            onClick={() => setActive(active === "shoes" ? null : "shoes")}
          >
            <span style={styles.menuLabel}>SHOES ⌄</span>

            {active === "shoes" && (
              <div style={styles.megaMenuCenter}
                onMouseEnter={() => setActive("shoes")}
                onMouseLeave={handleLeave}
              >
                <div style={styles.imageSection}>
                  <img src="/images/shoescategory.jpg" alt="shoes" style={styles.menuImage} />
                </div>

                <div style={styles.menuContent}>
                  <div style={styles.column}>
                    {categoryData["shoes"]?.map(sub => (
                    <Link
                      key={sub}
                      to={`/products/shoes/${sub}`}
                      style={styles.dropLink}
                    >
                      {sub}
                    </Link>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= WATCHES (WITH IMAGE) ================= */}
          <div
            style={styles.categoryItem}
            onMouseEnter={() => setActive("watches")}
            onClick={() => setActive(active === "watches" ? null : "watches")}
          >
            <span style={styles.menuLabel}>WATCHES ⌄</span>

            {active === "watches" && (
              <div style={styles.megaMenuWatch}
                onMouseEnter={() => setActive("watches")}
                onMouseLeave={handleLeave}
              >
                <div style={styles.imageSection}>
                  <img src="/images/watchcategory.jpg" alt="watch" style={styles.menuImage} />
                </div>

                <div style={styles.menuContent}>
                  <div style={styles.column}>
                    {categoryData["watches"]?.map(sub => (
                    <Link
                      key={sub}
                      to={`/products/watches/${sub}`}
                      style={styles.dropLink}
                    >
                      {sub}
                    </Link>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ✅ RIGHT SIDE ICONS */}
          <div style={styles.iconBox}>
            <Link to="/wishlist" style={styles.icon}>❤️</Link>
            <Link to="/cart" style={styles.icon}>🛒</Link>
            <Link to="/products/trending" style={styles.icon}>🔥</Link>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  topBar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 30px",
  background: "linear-gradient(90deg,#ff7e5f,#feb47b)",
  color: "white",
  fontWeight: "bold",
  flexWrap: "wrap", // mobile fix
},

profileImg: {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer"
},
  logo: { fontSize: "45px", color: "#1a1a1a" },

  links: { display: "flex", gap: "25px" },

  topLink: { textDecoration: "none", color: "white" },

  authBtns: {
  display: "flex",
  gap: "12px",
  alignItems: "center",
},

authBtn: {
  textDecoration: "none",
  color: "white",
  background: "#000",
  padding: "8px 18px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "bold",
  transition: "0.3s",
},

authBtnHover: {
  background: "#333",
},

  bottomBar: {
    background: "linear-gradient(90deg,#ff7e5f,#feb47b)",
    padding: "14px 40px",
    color: "white",
  },

  categories: {
    display: "flex",
    gap: "35px",
    fontWeight: "bold",
    flexWrap: "wrap", // mobile me break ho jayega
  },

  categoryItem: {
    position: "relative",
    cursor: "pointer",
  },

  menuLabel: {
    cursor: "pointer",
  },

  megaMenu: {
  position: "absolute",
  top: "100%",
  left: "0",
  right: "0",
  transform: "translateX(-10%)",
  marginTop: "5px", // 👈 yahi wala marginTop hai
  width: "92vw",        // ⭐ mobile fit
  maxWidth: "500px",    // desktop limit
  background: "linear-gradient(to right, #e0f3ff, #ffffff)",
  display: "flex",
  borderRadius: "10px",
  padding: "15px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  zIndex: 9999,
  overflow: "visible", // 🔥 IMAGE CUT FIX
  flexWrap: "wrap",     // ⭐ MOBILE FIX
},

megaMenuCenter: {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  marginTop: "5px",
  width: "92vw",
  maxWidth: "500px",
  background: "linear-gradient(to right, #e0f3ff, #ffffff)",
  display: "flex",
  borderRadius: "10px",
  padding: "15px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  zIndex: 9999,
  flexWrap: "wrap",
},

megaMenuWatch: {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-60%)", // 👈 thoda extra left shift
  marginTop: "5px",
  width: "92vw",
  maxWidth: "500px",
  background: "linear-gradient(to right, #e0f3ff, #ffffff)",
  display: "flex",
  borderRadius: "10px",
  padding: "15px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  zIndex: 9999,
  flexWrap: "wrap",
},

imageSection: {
  minWidth: "150px",
  marginRight: "20px",
  flexShrink: 0,
},

 menuImage: {
  width: "130px",
  height: "160px",
},

  menuContent: {
    display: "flex",
    gap: "35px",
     flexWrap: "wrap",
     color: "#222",   // 👈 ADD THIS
  },

  column: {
    minWidth: "110px",
    color: "#111",   // 👈 ADD
  },

  dropLink: {
    display: "block",
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
    margin: "8px 0",
  },

  iconBox: {
  marginLeft: "auto",
  display: "flex",
  gap: "20px",
  alignItems: "center"
},

icon: {
  fontSize: "26px",
  textDecoration: "none",
  color: "white",
  cursor: "pointer"
},

};

export default Navbar;