import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Products() {
  const { category, subcategory, type } = useParams();
  const navigate = useNavigate();

  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState("");

  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [wishlistCount, setWishlistCount] = useState(0);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProductsData(Array.isArray(data) ? data : data.products || []);

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setProductsData([]);
    }
  };

  useEffect(() => {
  const loadProducts = async () => {
    await fetchProducts();
  };

  loadProducts();
}, []);


/* ================= CART COUNT ================= */
useEffect(() => {
  if (!userId) return;

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();

      setCartCount(Array.isArray(data) ? data.length : 0);

    } catch (err) {
      console.log(err);
    }
  };

  fetchCart();
}, [userId]);

  /* ================= WISHLIST COUNT ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/wishlist/${userId}`
        );
        const data = await res.json();
        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCount();
  }, [userId]);

  /* ================= IMAGE FIX (IMPORTANT) ================= */
const getImageUrl = (img, category) => {
  if (!img) return "/images/no-image.jpg";

  // backend uploaded images
  if (img.startsWith("/uploads")) {
    return `http://localhost:5000${img}`;
  }

  if (img.startsWith("uploads")) {
    return `http://localhost:5000/${img}`;
  }

  if (img.startsWith("http")) return img;

  // fallback local images
  return `/images/${category?.toLowerCase()}/no-image.jpg`;
};

/* ================= FILTER ================= */
  const format = (str) =>
    str?.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

  let filtered = productsData;

  if (category === "trending") {
    filtered = filtered.filter(p => p.trending === true);
  } else if (category) {
    filtered = filtered.filter(
      p => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (type) {
  filtered = filtered.filter(
    p => format(p.subcategory) === format(type)
  );
} else if (subcategory) {
  filtered = filtered.filter(
    p => format(p.subcategory) === format(subcategory)
  );
}

  filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CART ================= */
  const addToCart = async (product) => {
  if (!userId) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      })
    });

    const data = await res.json();
    alert(data.message);

  } catch (err) {
    console.log(err);
  }
};

  /* ================= BUY ================= */
  const buyNow = (product) => {
  navigate("/checkout", {
    state: { buyNowItem: product }
  });
};

  /* ================= WISHLIST ================= */
  const addToWishlist = async (product) => {
    if (!userId) {
      alert("Please login first ❤️");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image
        })
      });

      const data = await res.json();
      alert(data.message);

      if (data.message === "Added to wishlist") {
        setWishlistCount(prev => prev + 1);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <h1>Products</h1>

      <input
        placeholder="Search products..."
        style={styles.search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>🛒 Cart: {cartCount}</h3>
      <h3>❤️ Wishlist: {wishlistCount}</h3>

      <div style={styles.grid}>
        {filtered.map(item => (
          <div key={item._id} style={styles.card}>

            {/* ✅ FIXED IMAGE */}
           <img
              src={getImageUrl(item.image, item.category)}
              alt={item.name}
              style={styles.img}
            />

            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>

            <button
              style={styles.btn}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              View Details
            </button>

            <button
              style={styles.cartBtn}
              onClick={() => addToCart(item)}
            >
              🛒 Add to Cart
            </button>

            <button
              style={styles.btnRed}
              onClick={() => addToWishlist(item)}
            >
              ❤️ Wishlist
            </button>

            <button
              style={styles.btnOrange}
              onClick={() => buyNow(item)}
            >
              ⚡ Buy Now
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { padding: "40px", textAlign: "center" },
  search: { padding: "12px", width: "300px", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px"
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "contain"
  },
  btn: { margin: "5px", padding: "10px", background: "#ff7e5f", color: "white", border: "none" },
  cartBtn: { margin: "5px", padding: "10px", background: "green", color: "white", border: "none" },
  btnRed: { margin: "5px", padding: "10px", background: "crimson", color: "white", border: "none" },
  btnOrange: { margin: "5px", padding: "10px", background: "orange", color: "white", border: "none" }
};

export default Products;