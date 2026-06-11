import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    address: ""
  });

  const [errors, setErrors] = useState({});

  /* ================= FETCH CART / BUY NOW ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ BUY NOW FLOW
    if (buyNowItem) {
      setCart([{ ...buyNowItem, qty: 1 }]);
      setLoading(false);
      return;
    }

    // ✅ NORMAL CART
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${user._id}`);
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [buyNowItem]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!address.name.trim()) newErrors.name = "Full name required";
    if (!/^\d{10}$/.test(address.phone)) newErrors.phone = "10 digit phone required";
    if (!address.city.trim()) newErrors.city = "City required";
    if (!address.address.trim()) newErrors.address = "Address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getImageUrl = (img) => {
    if (!img) return "/images/no-image.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  const placeOrder = async () => {
    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?._id,
          userEmail: user?.email,
          items: cart,
          total,
          address
        })
      });

      const data = await res.json();
      alert(data.message);

      // ✅ ONLY CLEAR CART IF NORMAL FLOW
      if (!buyNowItem) {
        await fetch(`http://localhost:5000/api/cart/clear/${user._id}`, {
          method: "DELETE"
        });
      }

      setCart([]);
      navigate("/");

    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={styles.page}>
      <h1>Checkout</h1>

      <div style={styles.box}>
        <h2>Order Summary</h2>

        {cart.map(item => (
          <div key={item._id || item.name} style={styles.item}>
            <img src={getImageUrl(item.image)} style={styles.img} alt="" />
            <div>
              <h4>{item.name}</h4>
              <p>Qty: {item.qty}</p>
              <p>₹ {item.price * item.qty}</p>
            </div>
          </div>
        ))}

        <h2>Total: ₹ {total}</h2>
      </div>

      <div style={styles.box}>
        <h2>Shipping Details</h2>

        <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
        <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
        <input name="city" placeholder="City" onChange={handleChange} style={styles.input} />
        <textarea name="address" placeholder="Address" onChange={handleChange} style={styles.textarea} />

        <button style={styles.btn} onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px", display: "flex", gap: "40px" },
  box: { border: "1px solid #ddd", padding: "20px", width: "400px" },
  item: { display: "flex", gap: "15px", marginBottom: "15px" },
  img: { width: "80px", height: "80px", objectFit: "cover" },
  input: { width: "100%", padding: "10px", marginBottom: "8px" },
  textarea: { width: "100%", padding: "10px", marginBottom: "8px" },
  btn: { padding: "12px", background: "green", color: "white", border: "none" }
};

export default Checkout;