import React, { useState, useEffect } from "react";

function AdminReviews() {

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH REVIEWS ================= */
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();

      // safety check (important fix for your previous error)
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= DELETE ================= */
  const deleteReview = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE"
      });

      fetchReviews(); // reload after delete
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredReviews = reviews.filter(r =>
    r.userName?.toLowerCase().includes(search.toLowerCase()) ||
    r.productName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px", color: "#8B5E6C" }}>
        ⭐ Product Reviews Management
      </h2>

      {/* SEARCH */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "260px",
            padding: "8px 12px",
            borderRadius: "20px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* TABLE */}
      <table width="100%" cellPadding="10" style={{ textAlign: "center", background: "white" }}>
        <thead style={{ background: "#8B5E6C", color: "white" }}>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredReviews.length === 0 ? (
            <tr>
              <td colSpan="6">No Reviews Found 😢</td>
            </tr>
          ) : (
            filteredReviews.map((r, index) => (
              <tr key={r._id}>
                <td>{index + 1}</td>
                <td>{r.userName}</td>
                <td>{r.productName}</td>

                <td style={{ color: "#f4b400" }}>
                  {"⭐".repeat(r.rating)}
                </td>

                <td>{r.comment}</td>

                <td>
                  <button
                    onClick={() => deleteReview(r._id)}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
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
  );
}

export default AdminReviews;