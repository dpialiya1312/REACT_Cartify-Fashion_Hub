import React, { useState, useEffect } from "react";

function ViewFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFeedback = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/feedback");

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();
    setFeedbacks(data || []);

  } catch (err) {
    console.log("ERROR:", err);
    setFeedbacks([]);
  }
};

  useEffect(() => {
    fetchFeedback();
  }, []);

  const deleteFeedback = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });

      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredFeedback = feedbacks.filter(f =>
    (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.message || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px", color: "#8B5E6C" }}>
        ⭐ Customer Feedback Management
      </h2>

      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "260px",
            maxWidth: "100%",
            padding: "8px 12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="desktopTable">

        <table
          width="100%"
          cellPadding="10"
          style={{
            textAlign: "center",
            background: "white",
            borderRadius: "10px"
          }}
        >

          <thead style={{ background: "#8B5E6C", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Message</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "40px" }}>
                  No Feedback Found 😢
                </td>
              </tr>
            ) : (
              filteredFeedback.map((f, index) => (
                <tr key={f._id} style={{ borderBottom: "1px solid #eee" }}>

                  <td>{index + 1}</td>
                  <td>{f.name}</td>
                  <td>{f.message}</td>

                  <td style={{ color: "#f4b400" }}>
                    {"⭐".repeat(Number(f.rating) || 0)}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteFeedback(f._id)}
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

        {filteredFeedback.length === 0 ? (
          <p>No Feedback Found 😢</p>
        ) : (
          filteredFeedback.map((f, index) => (

            <div key={f._id} style={styles.card}>

              <p><b>ID:</b> {index + 1}</p>
              <p><b>User:</b> {f.name}</p>
              <p><b>Message:</b> {f.message}</p>

              <p style={{ color: "#f4b400" }}>
                <b>Rating:</b> {"⭐".repeat(Number(f.rating) || 0)}
              </p>

              <button
                onClick={() => deleteFeedback(f._id)}
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

        @media(max-width:768px){

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
    border:"1px solid #E5D5DA"
  },

  deleteBtn:{
    marginTop:"10px",
    background:"#ff4d4d",
    border:"none",
    color:"white",
    padding:"6px 12px",
    borderRadius:"6px",
    cursor:"pointer"
  }

};

export default ViewFeedback;