import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [images, setImages] = useState(null);
  const [properties, setProperties] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchCity, setSearchCity] = useState("");
  const [searchLocality, setSearchLocality] = useState("");
  const [searchBhk, setSearchBhk] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("Logged in user ID:", parsedUser._id); // DEBUG
    } catch (err) {
      console.error("Invalid user data in localStorage", err);
      localStorage.clear();
      navigate("/login");
      return;
    }

    const loadProperties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties");
        setProperties(res.data);
        console.log("Fetched properties:", res.data); // DEBUG - dekh owner._id hai ya nahi
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [navigate]);

  const addProperty = async () => {
    if (!title.trim() || !price || !bhk || !city || !locality.trim()) {
      setMsg("All fields are required! Please fill everything 😊");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("price", price);
    formData.append("bhk", bhk);
    formData.append("city", city);
    formData.append("locality", locality.trim());

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/properties", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("Property added successfully with photos! 🎉");
      setTitle("");
      setPrice("");
      setBhk("");
      setCity("");
      setLocality("");
      setImages(null);
      fetchProperties();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Failed to add property");
    }
  };

  const handleEdit = (property) => {
    setTitle(property.title);
    setPrice(property.price);
    setBhk(property.bhk);
    setCity(property.city);
    setLocality(property.locality);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMsg("Ab changes kar ke ADD PROPERTY daba do — update ho jayega!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Pakka delete karna hai? Wapas nahi aayega!")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMsg("Property delete ho gayi!");
        fetchProperties();
      } catch (err) {
        setMsg("Delete nahi ho paya");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/properties");
      setProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (searchCity && !p.city.toLowerCase().includes(searchCity.toLowerCase())) return false;
    if (searchLocality && !p.locality.toLowerCase().includes(searchLocality.toLowerCase())) return false;
    if (searchBhk && p.bhk !== searchBhk) return false;
    if (searchPrice && p.price > Number(searchPrice)) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: "#ff6b35" }}>
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ color: "#ff6b35", fontSize: "42px" }}>NoBroker Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "20px", marginRight: "30px" }}>Welcome, {user.name || "User"}</span>
            <button onClick={logout} style={{ padding: "12px 30px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Add Property Form */}
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", marginBottom: "50px" }}>
          <h2 style={{ color: "#333", fontSize: "28px", marginBottom: "30px" }}>Add New Property</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>Title</label>
              <input placeholder="e.g. Beautiful 2BHK Flat" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>Price (₹ per month)</label>
              <input type="number" placeholder="e.g. 35000" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>BHK</label>
              <select value={bhk} onChange={(e) => setBhk(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }}>
                <option value="">Select BHK</option>
                <option value="1RK">1RK</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="4+BHK">4+BHK</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }}>
                <option value="">Select City</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>Locality</label>
              <input placeholder="e.g. Koramangala" value={locality} onChange={(e) => setLocality(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", fontSize: "18px", color: "#333" }}>
                Property Photos (Multiple select kar sakte ho)
              </label>
              <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} style={{ padding: "16px", borderRadius: "10px", border: "2px dashed #ff6b35", width: "100%", backgroundColor: "#fff5f2", fontSize: "16px" }} />
              {images && images.length > 0 && <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>✓ Selected {images.length} photo(s)</p>}
            </div>
            <button onClick={addProperty} style={{ gridColumn: "1 / -1", padding: "18px", background: "#ff6b35", color: "white", fontSize: "20px", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              ADD PROPERTY
            </button>
          </div>
          {msg && <p style={{ marginTop: "25px", color: msg.includes("successfully") ? "green" : "red", fontSize: "18px", fontWeight: "bold" }}>{msg}</p>}
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "40px", padding: "25px", background: "white", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "20px", color: "#333", fontSize: "24px" }}>Search Properties</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <input placeholder="Search by City" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }} />
            <input placeholder="Search by Locality" value={searchLocality} onChange={(e) => setSearchLocality(e.target.value)} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }} />
            <select value={searchBhk} onChange={(e) => setSearchBhk(e.target.value)} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}>
              <option value="">Any BHK</option>
              <option value="1RK">1RK</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
              <option value="4+BHK">4+BHK</option>
            </select>
            <input type="number" placeholder="Max Price (₹)" value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }} />
          </div>
        </div>

        {/* Properties List */}
        <h2 style={{ color: "#333", fontSize: "28px", marginBottom: "30px" }}>
          Available Properties ({filteredProperties.length})
        </h2>
        {filteredProperties.length === 0 ? (
          <p style={{ fontSize: "18px", color: "#666" }}>No properties found. Try different search!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" }}>
            {filteredProperties.map((p) => (
              <div key={p._id} style={{ position: "relative" }}>
                <Link to={`/property/${p._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    style={{
                      background: "white",
                      padding: "30px",
                      borderRadius: "16px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {p.images && p.images.length > 0 ? (
                      <div style={{ marginBottom: "20px" }}>
                        {p.images.map((img, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/uploads/${img}`}
                            alt={`Property photo ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "220px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              marginBottom: "10px"
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "220px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                          fontSize: "18px",
                          marginBottom: "20px"
                        }}
                      >
                        No Photos
                      </div>
                    )}

                    <h3 style={{ color: "#ff6b35", fontSize: "26px", marginBottom: "10px" }}>
                      {p.title}
                    </h3>
                    <p style={{ color: "#333", fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
                      ₹{p.price}/month
                    </p>
                    <p style={{ color: "#555", fontSize: "18px", marginBottom: "15px" }}>
                      {p.bhk} • {p.locality}, {p.city}
                    </p>
                    <p style={{ color: "#777", fontSize: "16px" }}>
                      Owner: {p.owner?.name || "Unknown"}
                    </p>
                  </div>
                </Link>

                {/* Edit & Delete Buttons - SUPER SAFE CHECK */}
                {p.owner && p.owner._id && user && user._id && p.owner._id.toString() === user._id.toString() && (
                  <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px", zIndex: 10 }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(p);
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(p._id);
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}