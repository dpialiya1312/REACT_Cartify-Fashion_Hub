import React, { useState, useEffect } from "react";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const deleteUser = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE"
    });

    fetchUsers(); // refresh
  } catch (err) {
    console.log(err);
  }
};

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px", color: "#8B5E6C" }}>
        👥 Manage Users
      </h2>

      {/* SEARCH */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px"
      }}>
        <input
          type="text"
          placeholder="🔍 Search users..."
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
        <table width="100%" cellPadding="8" style={{ textAlign: "center" }}>
          <thead style={{ background: "#8B5E6C", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    onClick={() => deleteUser(u._id)}
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

      {/* MOBILE CARDS */}
      <div className="mobileCards">
        {filteredUsers.map((u, index) => (
          <div key={u._id} style={styles.card}>
            <p><b>ID:</b> {index + 1}</p>
            <p><b>Name:</b> {u.name}</p>
            <p><b>Email:</b> {u.email}</p>

            <button
              onClick={() => deleteUser(u._id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        .mobileCards{
          display:none;
        }

        @media (max-width:768px){

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

export default AdminUsers;