import React, { useState, useEffect } from "react";

function ManageCategory() {

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    category: "",
    subcategory: ""
  });

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/categories");

    if (!res.ok) {
      throw new Error("API not responding");
    }

    const data = await res.json();

    console.log("CATEGORY API:", data); // ✅ debug

    // ✅ handle all formats safely
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.categories)
      ? data.categories
      : [];

    setCategories(list);

  } catch (err) {
    console.log("FETCH ERROR:", err);
    setCategories([]); // fallback
  }
};

  /* ================= LOAD ================= */
  useEffect(() => {
  fetchCategories();
}, []);

  /* ================= ADD ================= */
  const addCategory = async () => {
  if (!form.category.trim() || !form.subcategory.trim()) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category: form.category.toLowerCase(),
        subcategory: form.subcategory.toLowerCase()
      })
    });

    const data = await res.json();
    alert(data.message || "Added ✅");

    // 🔥 UI instant update
    setCategories(prev => [
      ...prev,
      {
        _id: Date.now(),
        category: form.category.toLowerCase(),
        subcategory: form.subcategory.toLowerCase()
      }
    ]);

    setForm({ category: "", subcategory: "" });

    setTimeout(fetchCategories, 300);

  } catch (err) {
    console.log(err);
  }
};

  /* ================= DELETE ================= */
  const deleteCategory = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE"
      });

      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER ================= */
  const filtered = categories.filter(c =>
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    c.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", background: "#e9dfd3", minHeight: "100vh" }}>

      <h2 style={{ fontWeight: "bold", marginBottom: "20px", color:"#8B5E6C" }}>
        📂 Manage Categories
      </h2>

      {/* TOP BAR */}
      <div
        className="topBar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "25px"
        }}
      >

        {/* ADD */}
        <div>
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            style={{ padding: "8px", width: "160px", marginRight: "10px" }}
          />

          <input
            type="text"
            placeholder="Subcategory"
            value={form.subcategory}
            onChange={(e) =>
              setForm({ ...form, subcategory: e.target.value })
            }
            style={{ padding: "8px", width: "160px", marginRight: "10px" }}
          />

          <button
            onClick={addCategory}
            style={{
              background: "#8B5E6C",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "220px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />

      </div>

      {/* TABLE */}
      <table
        width="100%"
        cellPadding="12"
        style={{
          background: "#f3f3f3",
          borderCollapse: "collapse",
          textAlign: "center"
        }}
      >
        <thead style={{ background: "#8B5E6C", color: "white" }}>
          <tr>
            <th style={{ border: "1px solid #ccc" }}>ID</th>
            <th style={{ border: "1px solid #ccc" }}>Category</th>
            <th style={{ border: "1px solid #ccc" }}>Subcategory</th>
            <th style={{ border: "1px solid #ccc" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c, index) => (
            <tr key={c._id}>
              <td style={{ border: "1px solid #ccc" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ccc" }}>{c.category}</td>
              <td style={{ border: "1px solid #ccc" }}>{c.subcategory}</td>
              <td style={{ border: "1px solid #ccc" }}>
                <span
                  onClick={() => deleteCategory(c._id)}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  🗑 Delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RESPONSIVE */}
      <style>{`
        @media(max-width:768px){
          .topBar{
            width:fit-content;
            margin:auto;
          }
          table{
            width:fit-content;
            margin:auto;
          }
        }
      `}</style>
    </div>
  );
}

export default ManageCategory;