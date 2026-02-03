import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Calendar,
  Tag,
  Info,
  Hash,
} from "lucide-react";
import Modal from "../components/Modal";

const InventoryDetail = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    items: [],
    summary: {
      total: 0,
      in_stock: 0,
      in_use: 0,
      faulty: 0,
      non_workable: 0,
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    status: "IN_STOCK",
  });
  const [loading, setLoading] = useState(false);

  // GET /api/inventory/{category} -> returns { items, summary }
  const fetchInventory = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/inventory/${category}`,
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  // POST /api/inventory -> add a new inventory item
  // Body example: { category, name, serial_number, status }
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, category: category.toUpperCase() }),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", serial_number: "", status: "IN_STOCK" });
        fetchInventory();
      } else {
        const err = await response.json();
        alert("Error adding inventory: " + (err.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [category]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, category: category.toUpperCase() }),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", serial_number: "", status: "IN_STOCK" });
        fetchInventory();
      } else {
        const err = await response.json();
        alert("Error adding inventory: " + (err.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Items",
      value: data.summary.total,
      icon: Box,
      color: "#0d235c",
      bg: "#f1f5f9",
    },
    {
      label: "In Stock / Available",
      value: data.summary.in_stock,
      icon: CheckCircle,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "In Use / Deployed",
      value: data.summary.in_use,
      icon: RefreshCw,
      color: "#4f46e5",
      bg: "#f5f3ff",
    },
    {
      label: "Faulty / Needs Repair",
      value: data.summary.faulty,
      icon: XCircle,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      label: "Non-Workable / Damaged",
      value: data.summary.non_workable,
      icon: XCircle,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            onClick={() => navigate("/inventory")}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              cursor: "pointer",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <ArrowLeft size={20} color="#0d235c" />
          </button>
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: "#0d235c",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              {category.replace("_", " ")} STOCK
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              View and update technical assets for this category
            </p>
          </div>
        </div>
        <button
          className="login-btn"
          style={{
            width: "auto",
            padding: "0.75rem 2.5rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} /> Add New Stock
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          marginBottom: "3rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.75rem",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  background: stat.bg,
                  padding: "10px",
                  borderRadius: "12px",
                }}
              >
                <stat.icon size={24} color={stat.color} />
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
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
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#f8fafc",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Verified Inventory Units
          </h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
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
                Unit Details
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
                Serial Number
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
                Condition
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
                Acquisition Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.length > 0 ? (
              data.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tag size={18} color="#0d235c" />
                      </div>
                      <div style={{ fontWeight: "700", color: "#334155" }}>
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#4f46e5",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                      }}
                    >
                      {item.serial_number || "---"}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem" }}>
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        background:
                          item.status === "IN_STOCK"
                            ? "#d1fae5"
                            : item.status === "IN_USE"
                              ? "#ede9fe"
                              : item.status === "FAULTY"
                                ? "#fef3c7"
                                : item.status === "NON_WORKABLE"
                                  ? "#fee2e2"
                                  : item.status === "WORKABLE"
                                    ? "#d1fae5" // Legacy support
                                    : item.status === "USED"
                                      ? "#ede9fe"
                                      : "#f1f5f9", // Legacy support
                        color:
                          item.status === "IN_STOCK"
                            ? "#059669"
                            : item.status === "IN_USE"
                              ? "#6d28d9"
                              : item.status === "FAULTY"
                                ? "#f59e0b"
                                : item.status === "NON_WORKABLE"
                                  ? "#dc2626"
                                  : item.status === "WORKABLE"
                                    ? "#059669" // Legacy support
                                    : item.status === "USED"
                                      ? "#6d28d9"
                                      : "#64748b", // Legacy support
                      }}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>

                  <td style={{ padding: "1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      <Calendar size={14} />{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "#94a3b8",
                  }}
                >
                  <Info
                    size={48}
                    style={{ opacity: 0.1, marginBottom: "1rem" }}
                  />
                  <p>
                    No units found in this category. Click "Add New Stock" to
                    begin.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Register ${category.toUpperCase()} Unit`}
      >
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div className="input-group">
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Item Model / Description
            </label>
            <div style={{ position: "relative", marginTop: "8px" }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. TP-Link Archer C6"
                required
                style={{
                  padding: "0.85rem 1rem 0.85rem 2.8rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
              />
              <Tag
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
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
              Serial Number / Barcode
            </label>
            <div style={{ position: "relative", marginTop: "8px" }}>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                placeholder="e.g. SN992200..."
                style={{
                  padding: "0.85rem 1rem 0.85rem 2.8rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
              />
              <Hash
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
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
              Item Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              style={{
                padding: "0.85rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "8px",
                cursor: "pointer",
              }}
            >
              <option value="IN_STOCK">
                IN STOCK (Available / Ready to Use)
              </option>
              <option value="IN_USE">IN USE (Deployed / Currently Used)</option>
              <option value="FAULTY">
                FAULTY (Needs Repair / Maintenance)
              </option>
              <option value="NON_WORKABLE">
                NON-WORKABLE (Damaged / Beyond Repair)
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Stock Intake"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryDetail;
