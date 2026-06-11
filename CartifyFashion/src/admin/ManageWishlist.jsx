import React, { useState, useEffect } from "react";

function ManageWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/wishlist");

        if (!res.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, []);

  /* ================= DELETE ITEM ================= */
  const deleteItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredWishlist = wishlist.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= IMAGE HANDLER ================= */
  const getImageUrl = (img) => {
  if (!img) return "/no-image.png";

  // already full URL
  if (img.startsWith("http")) return img;

  // remove duplicate /uploads if exists
  const cleanPath = img.replace("/uploads/", "").replace("uploads/", "");

  return `http://localhost:5000/uploads/${cleanPath}`;
};

  return (
    <div>
      <h2 style={{ marginBottom: "20px", color: "#8B5E6C" }}>
        ❤️ Manage Wishlist
      </h2>

      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search wishlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <table
          width="100%"
          cellPadding="10"
          style={{ textAlign: "center", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#8B5E6C", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>User</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredWishlist.length === 0 ? (
              <tr>
                <td colSpan="6">No Wishlist Items 😢</td>
              </tr>
            ) : (
              filteredWishlist.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  {/* IMAGE */}
                  <td>
                    <img
                      src={getImageUrl(item.image)}
                      width="60"
                      height="60"
                      alt={item.name}
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.userId}</td>

                  <td>
                    <button
                      onClick={() => deleteItem(item._id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
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
    </div>
  );
}

export default ManageWishlist;