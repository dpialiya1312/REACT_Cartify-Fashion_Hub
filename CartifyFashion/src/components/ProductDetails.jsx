import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  /* ================= FETCH PRODUCT ================= */
  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH REVIEWS ================= */
  const fetchReviews = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/reviews/product/${id}`
    );

    const data = await res.json();

    // ✅ IMPORTANT FIX
    if (Array.isArray(data)) {
      setReviews(data);
    } else {
      setReviews([]); // fallback
    }

  } catch (err) {
    console.log(err);
    setReviews([]);
  }
};

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  /* ================= IMAGE ================= */
  const getImageUrl = (img) => {
    if (!img) return "/images/no-image.jpg";
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    if (img.startsWith("uploads")) return `http://localhost:5000/${img}`;
    if (img.startsWith("http")) return img;
    return "/images/no-image.jpg";
  };

  /* ================= AVG RATING ================= */
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
  if (!rating || !comment.trim()) {
    alert("Fill all fields");
    return;
  }

  try {
    // ✅ GET USER OUTSIDE fetch
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product._id,
        productName: product.name,
        userName: user?.name || user?.userName || "Guest", // ✅ FIX
        rating,
        comment
      })
    });

    const data = await res.json();
    alert(data.message);

    fetchReviews();
    setRating(0);
    setComment("");

  } catch (err) {
    console.log(err);
  }
};

  /* ================= DELETE REVIEW ================= */
  const deleteReview = async (reviewId) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE"
      });

      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="productCard">

        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          style={styles.img}
        />

        <div style={{ flex: 1 }}>
          <h1>{product.name}</h1>
          <h2 style={{ color: "#8B5E6C" }}>₹ {product.price}</h2>

          <h3 style={{ color: "#f4b400" }}>
            ⭐ {avgRating} / 5 ({reviews.length})
          </h3>

          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>

          {/* REVIEW FORM */}
          <div style={styles.reviewSection}>
            <h2>Write Review</h2>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={styles.select}
            >
              <option value={0}>Rating</option>
              <option value={5}>5 Star</option>
              <option value={4}>4 Star</option>
              <option value={3}>3 Star</option>
              <option value={2}>2 Star</option>
              <option value={1}>1 Star</option>
            </select>

            <textarea
              placeholder="Write review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.reviewBtn} onClick={submitReview}>
              Submit Review
            </button>
          </div>

          {/* REVIEWS LIST */}
          <h3 style={{ marginTop: 30 }}>Customer Reviews</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet 😢</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} style={styles.reviewBox}>
                <div style={{ color: "#f4b400" }}>
                  {"★".repeat(r.rating)}
                </div>

                <p>{r.comment}</p>

                <small>
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>

                <br />

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteReview(r._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media(max-width:768px){
          .productCard{
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: 40,
    display: "flex",
    justifyContent: "center",
    background: "#f9f9f9"
  },
  card: {
    display: "flex",
    gap: 40,
    border: "1px solid #ddd",
    padding: 30,
    borderRadius: 10,
    background: "#fff",
    maxWidth: 1000,
    width: "100%"
  },
  img: {
    width: 300,
    height: 300,
    objectFit: "contain"
  },
  backBtn: {
    marginTop: 10,
    padding: "8px 14px",
    background: "gray",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  reviewSection: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  select: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 150
  },
  textarea: {
    width: "100%",
    height: 90,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  reviewBtn: {
    width: 150,
    padding: 10,
    background: "orange",
    color: "#fff",
    border: "none",
    borderRadius: 6
  },
  reviewBox: {
    border: "1px solid #ccc",
    marginTop: 10,
    padding: 10,
    borderRadius: 8
  },
  deleteBtn: {
    marginTop: 10,
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6
  }
};

export default ProductDetails;