import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST /api/login — body: { username, password, companyCode }
      // Expects: { status: 'success', user: { id, name, role, balance } } on success.
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, companyCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || errorData.message || "Login failed");
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        setUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login connection error:", error);
      // Fallback for demo
      if (username === "mzahidtalib" && password === "mz@2917") {
        setUser({ name: "M Zahid Talib", role: "CEO" });
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        fontFamily: "'Outfit', 'Inter', sans-serif", // Using a more modern font stack
        background: "#0f172a", // Dark base
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, #1e3a8a 0%, transparent 70%)",
          opacity: 0.4,
          filter: "blur(80px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          opacity: 0.3,
          filter: "blur(80px)",
        }}
      ></div>

      {/* Left Brand Panel (Desktop) */}
      <div
        style={{
          flex: "1.2",
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 6rem",
          position: "relative",
          zIndex: 2,
          color: "white",
          "@media (min-width: 1024px)": { display: "flex" },
        }}
        className="desktop-panel"
      >
        <div style={{ marginBottom: "3rem" }}>
          <img
            src="/logo.jpg"
            alt="Peak Fiber"
            style={{
              width: "180px", // MUCH LARGER LOGO
              borderRadius: "24px",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
        <h1
          style={{
            fontSize: "4.5rem",
            fontWeight: "800",
            lineHeight: "1",
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
            background: "linear-gradient(to right, #fff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Future
          <br />
          Ready
          <br />
          ISP.
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#cbd5e1",
            maxWidth: "500px",
            lineHeight: "1.7",
            borderLeft: "4px solid #3b82f6",
            paddingLeft: "20px",
          }}
        >
          Advanced operational control for next-generation fiber networks.
          Monitor, manage, and scale with precision.
        </p>
      </div>

      {/* Right Login Card (Centered on Mobile, Right on Desktop) */}
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            padding: "3.5rem 3rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Mobile Logo */}
          <div
            className="mobile-only"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              display: "none",
            }}
          >
            <img
              src="/logo.jpg"
              alt="Peak Fiber"
              style={{
                width: "100px",
                borderRadius: "20px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#0d235c",
                fontWeight: "700",
                fontSize: "0.9rem",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <ShieldCheck size={16} /> Secure Access
            </div>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: "800",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Welcome Back
            </h2>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div className="input-group">
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Operator ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "#f8fafc",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div className="input-group">
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    background: "#f8fafc",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Organization Code
              </label>
              <input
                type="text"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="PF-xxxx"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "#f8fafc",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "16px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg, #0d235c 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
                @media (max-width: 1024px) {
                    .desktop-panel { display: none !important; }
                    .mobile-only { display: block !important; }
                }
            `}</style>
    </div>
  );
};

export default Login;
