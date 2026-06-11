import React, { useState, useEffect } from "react";

function ManageProducts() {

const [products, setProducts] = useState([]);
const [editId, setEditId] = useState(null);
const [categoryData, setCategoryData] = useState({});

const [form, setForm] = useState({
  name: "",
  price: "",
  category: "",
  subcategory: "",
  trending: "No",
  image: null,
  preview: ""
});

// ✅ Add this function (Products.jsx જેવું)
const getImageUrl = (img) => {
  if (!img) return "/no-image.png";

  if (img.startsWith("http")) return img;
  if (img.startsWith("uploads")) return `http://localhost:5000/${img}`;
  if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;

  return `http://localhost:5000/${img}`;
};

/* ================= FETCH (⬆️ FIRST DEFINE THIS) ================= */
const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/products");

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    setProducts(
      Array.isArray(data) ? data : data.products || []
    );

  } catch (err) {
    console.log("FETCH ERROR:", err);
    setProducts([]);
  }
};

/* ================= USE EFFECT ================= */
// useEffect(() => {
//   async function fetchData() {
//     const res = await fetch("http://localhost:5000/api/products");
//     const data = await res.json();
//     setProducts(data);
//   }

//   fetchData();
// }, []);


/* ================= CATEGORY DATA ================= */
const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : data.categories || [];

    const grouped = {};

    list.forEach(item => {
      const cat = item.category?.toLowerCase();
      const sub = item.subcategory;

      if (!cat || !sub) return;

      if (!grouped[cat]) grouped[cat] = [];

      if (!grouped[cat].includes(sub)) {
        grouped[cat].push(sub);
      }
    });

    setCategoryData(grouped);

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  const loadData = async () => {
    await fetchProducts();
    await fetchCategories();
  };

  loadData();
}, []);

/* ================= INPUT ================= */
const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

/* IMAGE */
const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm({
    ...form,
    image: file,
    preview: URL.createObjectURL(file)
  });
};

/* ================= SAVE ================= */
// saveProduct function replace કરો
const saveProduct = async () => {
  if (!form.name || !form.price || !form.category || !form.subcategory) {
    alert("Fill all fields");
    return;
  }

  try {
    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : "http://localhost:5000/api/products";

    const method = editId ? "PUT" : "POST";

    // ✅ FORMDATA for IMAGE UPLOAD
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);
    formData.append("trending", form.trending === "Yes");


    if (form.image && form.image instanceof File) {
      formData.append("image", form.image);  // ✅ Real file
    }

    const res = await fetch(url, {
      method,
      body: formData  // ✅ No Content-Type header
    });

    const result = await res.json();
    alert(result.message || "Saved ✅");

    fetchProducts();  // ✅ Refresh list
    resetForm();

  } catch (err) {
    console.log(err);
    alert("Error saving");
  }
};
/* RESET */
const resetForm = () => {
  setForm({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    trending: "No",
    image: null,
    preview: ""
  });
  setEditId(null);
};

/* EDIT */
const editProduct = (p) => {
  setForm({
    name: p.name,
    price: p.price,
    category: p.category,
    subcategory: p.subcategory,
    trending: p.trending ? "Yes" : "No",
    preview: p.image
  });

  setEditId(p._id);
};

/* DELETE */
const deleteProduct = async (id) => {
  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE"
  });

  setProducts(products.filter(p => p._id !== id));
};

/* ================= UI ================= */

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  marginBottom: "10px",
};

const styles = {
  container: { padding: "30px" },
  title: { color: "#8B5E6C", marginBottom: "25px" },
  formBox: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "30px"
  },
 formGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  columnGap: "35px",   // ✅ horizontal gap
  rowGap: "15px"       // vertical gap
},
  addBtn: {
    background: "#8B5E6C",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  tableBox: {
    overflowX: "auto",
    background: "white",
    padding: "20px",
    borderRadius: "15px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  thtd: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #eee"
  },
  thead: {
    background: "#8B5E6C",
    color: "white"
  },
  deleteBtn: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

return (
<div style={styles.container}>

<h2 style={styles.title}>📦 Manage Products</h2>

{/* FORM */}
<div style={styles.formBox}>
<div style={styles.formGrid}>

<input
name="name"
value={form.name}
placeholder="Product Name"
onChange={handleChange}
style={inputStyle}
/>

<input
name="price"
value={form.price}
placeholder="Price"
onChange={handleChange}
style={inputStyle}
/>

{/* CATEGORY */}
<select
name="category"
value={form.category}
onChange={(e) =>
  setForm({ ...form, category: e.target.value, subcategory: "" })
}
style={inputStyle}
>
<option value="">Select Category</option>
{Object.keys(categoryData).map(cat => (
<option key={cat} value={cat}>{cat}</option>
))}
</select>

{/* SUBCATEGORY */}
<select
name="subcategory"
value={form.subcategory}
onChange={handleChange}
style={inputStyle}
disabled={!form.category}
>
<option value="">Select Subcategory</option>
{form.category &&
  categoryData[form.category].map(sub => (
    <option key={sub} value={sub}>{sub}</option>
  ))}
</select>

{/* TRENDING */}
<select
name="trending"
value={form.trending}
onChange={handleChange}
style={inputStyle}
>
<option value="No">No</option>
<option value="Yes">Yes</option>
</select>

<input type="file" onChange={handleImage} />

<button onClick={saveProduct} style={styles.addBtn}>
{editId ? "Update" : "Add"} Product
</button>

</div>
</div>

{/* TABLE */}
<div style={styles.tableBox}>
<table style={styles.table}>

<thead style={styles.thead}>
<tr>
<th>ID</th>
<th>Image</th>
<th>Name</th>
<th>Price</th>
<th>Category</th>
<th>Subcategory</th>
<th>Trending</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{products.map(p => (
<tr key={p._id}>

<td>{p._id}</td>

<td>
<img
  src={getImageUrl(p.image)}
  width="60"
  height="60"
  alt={p.name}
  style={{ objectFit: "contain" }}
/>
  </td>

<td>{p.name}</td>
<td>₹{p.price}</td>
<td>{p.category}</td>
<td>{p.subcategory}</td>
<td>{p.trending ? "Yes" : "No"}</td>

<td>
<button onClick={() => editProduct(p)}>Edit</button>

<button
onClick={() => deleteProduct(p._id)}
style={styles.deleteBtn}
>
Delete
</button>
</td>

</tr>
))}

</tbody>

</table>
</div>

</div>
);
}

export default ManageProducts;