import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      if (isRegister) {
        // Register
        await axios.post("http://localhost:5000/api/users/register", {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
        });
        setMsg("Registered successfully! Now login with your credentials.");
        setIsRegister(false);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      } else {
        // Login
        const res = await axios.post("http://localhost:5000/api/users/login", {
          email: email.trim(),
          password: password.trim(),
        });

        // Success — save token and user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMsg("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000); // 1 second delay taaki message dikhe
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      setMsg(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", padding: "50px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", width: "420px", textAlign: "center" }}>
        <h1 style={{ color: "#ff6b35", fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>NoBroker</h1>
        <h2 style={{ color: "#333", marginBottom: "30px" }}>{isRegister ? "Create Account" : "Login to Continue"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "16px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: "100%", padding: "16px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "16px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "16px", marginBottom: "25px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
          />

          <button
            type="submit"
            style={{ width: "100%", padding: "18px", background: "#ff6b35", color: "white", fontSize: "20px", border: "none", borderRadius: "10px", cursor: "pointer" }}
          >
            {isRegister ? "REGISTER" : "CONTINUE"}
          </button>
        </form>

        {msg && (
          <p style={{ marginTop: "20px", color: msg.includes("success") || msg.includes("Registered") ? "green" : "red", fontWeight: "bold", fontSize: "16px" }}>
            {msg}
          </p>
        )}

        <p style={{ marginTop: "25px", color: "#666" }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setMsg("");
              setName("");
              setPhone("");
              setEmail("");
              setPassword("");
            }}
            style={{ color: "#ff6b35", fontWeight: "bold", cursor: "pointer" }}
          >
            {isRegister ? "Login" : "Register now"}
          </span>
        </p>
      </div>
    </div>
  );
}