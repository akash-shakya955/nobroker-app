import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px", fontSize: "24px" }}>Loading...</div>;
  if (!property) return <div style={{ textAlign: "center", marginTop: "100px", fontSize: "24px", color: "red" }}>Property not found</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "30px", padding: "12px 24px", background: "#ff6b35", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          ← Back to Dashboard
        </button>

        <div style={{ background: "white", padding: "50px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <h1 style={{ color: "#ff6b35", fontSize: "48px", marginBottom: "20px" }}>{property.title}</h1>
          <p style={{ color: "#333", fontSize: "36px", fontWeight: "bold", marginBottom: "20px" }}>₹{property.price}/month</p>
          <p style={{ color: "#555", fontSize: "28px", marginBottom: "40px" }}>{property.bhk} • {property.locality}, {property.city}</p>

          {/* Photos - BADI GRID MEIN */}
          <h2 style={{ color: "#333", fontSize: "32px", marginBottom: "30px" }}>Property Photos</h2>
          {property.images && property.images.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`Property photo ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "20px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#999", fontSize: "22px" }}>No photos available</p>
          )}

          {/* Owner Contact */}
          <h2 style={{ color: "#333", fontSize: "32px", marginTop: "60px", marginBottom: "30px" }}>Owner Contact</h2>
          <div style={{ background: "#f8f9fa", padding: "30px", borderRadius: "16px" }}>
            <p style={{ fontSize: "22px", marginBottom: "15px" }}><strong>Name:</strong> {property.owner?.name || "Unknown"}</p>
            <p style={{ fontSize: "22px", marginBottom: "15px" }}><strong>Email:</strong> {property.owner?.email || "Not available"}</p>
            <p style={{ fontSize: "22px" }}><strong>Phone:</strong> {property.owner?.phone || "Not available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}