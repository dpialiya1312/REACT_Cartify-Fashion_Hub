import React, { useState, useEffect } from "react";

function ViewMessages() {

  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact");

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setMessages(data || []);

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "DELETE",
      });

      setMessages(prev => prev.filter(m => m._id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  const filteredMessages = messages.filter(m => {
    return (
      (m?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (m?.message || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={styles.page}>

      <h2 style={styles.title}>📩 Customer Messages</h2>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <table style={styles.table}>

        <thead>
          <tr style={styles.theadRow}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredMessages.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.empty}>
                No Messages Found 😢
              </td>
            </tr>
          ) : (
            filteredMessages.map((m, index) => (
              <tr key={m._id} style={styles.row}>
                <td>{index + 1}</td>
                <td>{m?.name}</td>
                <td>{m?.email}</td>
                <td>{m?.message}</td>

                <td>
                  <button
                    onClick={() => deleteMessage(m._id)}
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
  );
}

const styles = {

  page: {
    padding: "20px",
    background: "#f6f6f6",
    minHeight: "100vh"
  },

  title: {
    color: "#8B5E6C",
    marginBottom: "20px"
  },

  searchBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px"
  },

  searchInput: {
    width: "260px",
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc"
  },

  table: {
    width: "100%",
    background: "white",
    borderCollapse: "collapse"   // 🔥 IMPORTANT FIX
  },

  theadRow: {
    background: "#8B5E6C",
    color: "white"
  },

  row: {
    textAlign: "center",
    borderBottom: "1px solid #eee"
  },

  deleteBtn: {
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  empty: {
    padding: "30px",
    textAlign: "center"
  }
};

export default ViewMessages;