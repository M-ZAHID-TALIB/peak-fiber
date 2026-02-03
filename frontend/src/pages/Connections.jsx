import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Globe,
  MessageCircle,
  AlertCircle,
  Box,
  Printer,
  ShieldCheck,
  DollarSign,
  UserCheck,
  User,
  Phone,
  MapPin,
  Package,
  Cpu,
  Key,
  Calendar,
} from "lucide-react";
import Modal from "../components/Modal";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [isps, setIsps] = useState([]);
  const [areas, setAreas] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedConn, setSelectedConn] = useState(null);
  const [filter, setFilter] = useState("All Connections");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [payData, setPayData] = useState({ staff_id: "", amount: 0 });
  const [formData, setFormData] = useState({
    s_no: Math.floor(100000 + Math.random() * 900000),
    isp_id: "",
    full_name: "",
    username: "",
    password: "password123",
    phone_number: "",
    package_name: "4 Mbps",
    area_id: "",
    address: "",
    box_id: "BOX-01",
    monthly_bill: 1500,
    activation_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
    status: "Active",
    type: "Broadband",
  });

  const fetchAll = async () => {
    try {
      // GET /api/connections -> connections list
      // GET /api/isps -> ISP options for new connections
      // GET /api/areas -> Area/zone options
      // GET /api/staff -> Staff list (used for payment collectors)
      const [connRes, ispRes, areaRes, staffRes] = await Promise.all([
        fetch("http://localhost:8000/api/connections"),
        fetch("http://localhost:8000/api/isps"),
        fetch("http://localhost:8000/api/areas"),
        fetch("http://localhost:8000/api/staff"),
      ]);

      setConnections(await connRes.json());
      const ispData = await ispRes.json();
      setIsps(ispData);
      const areaData = await areaRes.json();
      setAreas(areaData);
      setStaff(await staffRes.json());

      // Set defaults if data exists
      if (ispData.length > 0 && !formData.isp_id) {
        setFormData((prev) => ({ ...prev, isp_id: ispData[0].id }));
      }
      if (areaData.length > 0 && !formData.area_id) {
        setFormData((prev) => ({ ...prev, area_id: areaData[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        isp_id: parseInt(formData.isp_id),
        area_id: parseInt(formData.area_id),
        monthly_bill: parseFloat(formData.monthly_bill),
        s_no: parseInt(formData.s_no),
      };

      // POST /api/connections — create a new customer connection
      // Body: connection details (s_no, isp_id, full_name, username, monthly_bill, area_id, etc.)
      const response = await fetch("http://localhost:8000/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          ...formData,
          s_no: Math.floor(100000 + Math.random() * 900000),
          full_name: "",
          username: "",
          phone_number: "",
          address: "",
        });
        fetchAll();
      } else {
        const errData = await response.json();
        alert(
          "Error adding connection: " + (errData.detail || "Check all fields"),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      // POST /api/connections/{id}/pay — record a payment
      // Body: { amount, staff_id } — backend extends expiry and increments staff.cash when staff_id is provided
      const response = await fetch(
        `http://localhost:8000/api/connections/${selectedConn.id}/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payData),
        },
      );
      if (response.ok) {
        setIsPayModalOpen(false);
        fetchAll();
        alert("Payment recorded successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusInfo = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)
      return { label: "Expired", color: "#ef4444", bg: "#fee2e2" };
    if (diffDays <= 2)
      return { label: "Soft Block", color: "#f59e0b", bg: "#fef3c7" };
    return { label: "Active", color: "#10b981", bg: "#d1fae5" };
  };

  // Opens WhatsApp web with a templated reminder message (no backend call)
  const sendWhatsApp = (conn) => {
    const message = `Dear ${conn.full_name}, your internet bill of PKR ${conn.monthly_bill} is due. Reference: ${conn.username}. Please pay soon. - Peak Fiber`;
    window.open(
      `https://wa.me/${conn.phone_number}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const performPrint = () => {
    const printContent = document.getElementById("printable-bill").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const filteredConnections = connections.filter((conn) => {
    const matchesSearch =
      conn.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "Expired Connections")
      return (
        matchesSearch && getStatusInfo(conn.expiry_date).label === "Expired"
      );
    return matchesSearch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#0d235c",
              margin: 0,
            }}
          >
            Active Connections
          </h2>
          <select
            className="input-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            <option>All Connections</option>
            <option>Expired Connections</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flex: 1,
            justifyContent: "flex-end",
            minWidth: "300px",
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Search by name or CID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.75rem 1rem 0.75rem 2.8rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            />
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
          </div>
          <button
            className="login-btn"
            style={{
              width: "auto",
              padding: "0.75rem 2rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> New Connection
          </button>
        </div>
      </div>

      <div
        className="table-container"
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ID / S.No
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Customer Info
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Plan & Hardware
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Renewal
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Quick Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredConnections.map((conn) => {
              const status = getStatusInfo(conn.expiry_date);
              return (
                <tr key={conn.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.25rem" }}>
                    <div style={{ fontWeight: "700", color: "#1e293b" }}>
                      #{conn.s_no}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#4f46e5",
                        fontWeight: "600",
                      }}
                    >
                      CID: {conn.username}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>
                      {conn.full_name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Phone size={12} /> {conn.phone_number}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <div style={{ fontWeight: "600", color: "#334155" }}>
                      {conn.package_name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Box size={12} /> {conn.box_id}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.color}22`,
                      }}
                    >
                      {status.label.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <div
                      style={{
                        color: status.color,
                        fontWeight: "700",
                        fontSize: "0.9rem",
                      }}
                    >
                      {conn.expiry_date}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                      Expiring on
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => sendWhatsApp(conn)}
                        title="WhatsApp Reminder"
                        style={{
                          padding: "8px",
                          borderRadius: "10px",
                          background: "#22c55e",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                      >
                        <MessageCircle size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedConn(conn);
                          setPayData({
                            staff_id: "",
                            amount: conn.monthly_bill,
                          });
                          setIsPayModalOpen(true);
                        }}
                        title="Pay Bill"
                        style={{
                          padding: "8px",
                          borderRadius: "10px",
                          background: "#4f46e5",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <DollarSign size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedConn(conn);
                          setIsPrintModalOpen(true);
                        }}
                        title="Print Receipt"
                        style={{
                          padding: "8px",
                          borderRadius: "10px",
                          background: "#0d235c",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredConnections.length === 0 && (
          <div
            style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}
          >
            <Search size={48} style={{ opacity: 0.1, marginBottom: "1rem" }} />
            <p>No connections found matching your search.</p>
          </div>
        )}
      </div>

      {/* MODERN MULTI-STEP LOOK FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Fiber Connection"
        maxWidth="850px"
      >
        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
          }}
        >
          {/* Basic Info */}
          <div
            style={{
              gridColumn: "span 3",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "5px",
              marginBottom: "0px",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <User size={16} /> Personal Details
            </h4>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Customer Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter name"
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Phone Number (WhatsApp)
            </label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder="92300..."
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Area / Zone
            </label>
            <select
              value={formData.area_id}
              onChange={(e) =>
                setFormData({ ...formData, area_id: e.target.value })
              }
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            >
              <option value="">Choose Area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: "span 3" }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Complete Installation Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Street/House details..."
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                minHeight: "45px",
                fontSize: "0.9rem",
                resize: "none",
              }}
            />
          </div>

          {/* Technical Info */}
          <div
            style={{
              gridColumn: "span 3",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "5px",
              marginBottom: "0px",
              marginTop: "5px",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Cpu size={16} /> Network & Billing
            </h4>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              ISP Provider
            </label>
            <select
              value={formData.isp_id}
              onChange={(e) =>
                setFormData({ ...formData, isp_id: e.target.value })
              }
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            >
              <option value="">Choose ISP</option>
              {isps.map((isp) => (
                <option key={isp.id} value={isp.id}>
                  {isp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Distribution Box
            </label>
            <input
              type="text"
              value={formData.box_id}
              onChange={(e) =>
                setFormData({ ...formData, box_id: e.target.value })
              }
              placeholder="e.g. BOX-22"
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Monthly Subscription
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "0.8rem",
                  color: "#059669",
                  fontWeight: "bold",
                }}
              >
                PKR
              </span>
              <input
                type="number"
                value={formData.monthly_bill}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_bill: e.target.value })
                }
                required
                style={{
                  padding: "0.6rem 0.6rem 0.6rem 3rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              CID / Login ID
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="e.g. pf_user_01"
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Login Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Activation Date
            </label>
            <input
              type="date"
              value={formData.activation_date}
              onChange={(e) =>
                setFormData({ ...formData, activation_date: e.target.value })
              }
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "2px",
                display: "block",
              }}
            >
              Next Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) =>
                setFormData({ ...formData, expiry_date: e.target.value })
              }
              required
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              gridColumn: "span 2",
              marginTop: "0.5rem",
              padding: "0.8rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: "700",
              boxShadow: "0 4px 6px rgba(13, 35, 92, 0.2)",
              height: "fit-content",
              alignSelf: "end",
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Complete Registration"}
          </button>
        </form>
      </Modal>

      {/* Billing Modal unchanged as requested but styled inside */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Receive Monthly Bill"
      >
        <form onSubmit={handlePayBill}>
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "16px",
              marginBottom: "20px",
              borderLeft: "4px solid #4f46e5",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              Collecting payment for:
            </div>
            <div
              style={{
                fontWeight: "800",
                fontSize: "1.25rem",
                color: "#0f172a",
              }}
            >
              {selectedConn?.full_name}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#4f46e5",
                fontWeight: "600",
                marginTop: "4px",
              }}
            >
              Account Ref: {selectedConn?.username}
            </div>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Received By
            </label>
            <select
              value={payData.staff_id}
              onChange={(e) =>
                setPayData({ ...payData, staff_id: e.target.value })
              }
              style={{
                padding: "0.85rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "8px",
              }}
              required
            >
              <option value="">Select Staff Member</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginTop: "20px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Total Collected (PKR)
            </label>
            <input
              type="number"
              value={payData.amount}
              onChange={(e) =>
                setPayData({ ...payData, amount: parseFloat(e.target.value) })
              }
              style={{
                fontWeight: "800",
                color: "#059669",
                fontSize: "1.25rem",
                padding: "0.85rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "8px",
              }}
              required
            />
          </div>

          <div
            style={{
              marginTop: "24px",
              fontSize: "0.75rem",
              color: "#64748b",
              background: "#f1f5f9",
              padding: "12px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <AlertCircle size={18} color="#3b82f6" />
            <div>
              This will move expiry by 30 days and mark the bill as cleared.
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              marginTop: "24px",
              background: "#059669",
              padding: "1rem",
              borderRadius: "12px",
              fontWeight: "700",
            }}
          >
            Confirm Settlement
          </button>
        </form>
      </Modal>

      {/* Bill Print Modal remains similar but cleaner */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Bill Receipt Generation"
      >
        <div
          id="printable-bill"
          style={{
            padding: "30px",
            fontFamily: "'Courier New', Courier, monospace",
            width: "100%",
            maxWidth: "350px",
            margin: "0 auto",
            background: "white",
            color: "#000",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              borderBottom: "2px solid #000",
              paddingBottom: "15px",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "2px" }}>
              PEAK FIBER
            </h1>
            <p style={{ margin: "5px 0", fontSize: "0.8rem" }}>
              HIGH-SPEED INTERNET SOLUTIONS
            </p>
            <p style={{ margin: 0, fontSize: "0.7rem" }}>
              HELD LINE: 0311-7768900
            </p>
          </div>

          <div style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DATE:</span> <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>BILL NO:</span> <span>#{selectedConn?.s_no}</span>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                borderBottom: "1px solid #000",
                marginBottom: "8px",
              }}
            >
              CUSTOMER INFO
            </div>
            <div style={{ fontSize: "0.9rem" }}>{selectedConn?.full_name}</div>
            <div style={{ fontSize: "0.9rem" }}>
              {selectedConn?.phone_number}
            </div>
            <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
              CID:{" "}
              <span style={{ fontWeight: "bold" }}>
                {selectedConn?.username}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.95rem",
                marginBottom: "10px",
              }}
            >
              <span>Package ({selectedConn?.package_name})</span>
              <span>{selectedConn?.monthly_bill}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px double #000",
                paddingTop: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              <span>TOTAL PAID</span>
              <span>PKR {selectedConn?.monthly_bill}</span>
            </div>
          </div>

          <div
            style={{
              border: "2px solid #000",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
              VALID UNTIL: {selectedConn?.expiry_date}
            </div>
            <div style={{ fontSize: "0.7rem", marginTop: "5px" }}>
              Thank you for your business!
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          <button
            onClick={() => setIsPrintModalOpen(false)}
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "white",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
          <button
            onClick={performPrint}
            className="login-btn"
            style={{
              flex: 1,
              background: "#0d235c",
              padding: "1rem",
              borderRadius: "12px",
            }}
          >
            Print Receipt
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Connections;
