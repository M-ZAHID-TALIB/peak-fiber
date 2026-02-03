import React, { useState, useEffect } from "react";
import {
  Search,
  Inbox,
  Plus,
  CheckCircle2,
  Package,
  User,
  MapPin,
  Phone,
  Cpu,
  ShieldCheck,
  Clock,
  Layers,
  Filter,
} from "lucide-react";
import Modal from "../components/Modal";

const ActionQueue = () => {
  const [queue, setQueue] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    username: "",
    address: "",
    password: "password123",
    isp_name: "Main Fiber",
    package_name: "4 Mbps",
    vlan: "",
    activity_type: "Installation",
  });

  // GET /api/action-queue -> list of tasks
  const fetchQueue = () => {
    fetch("http://localhost:8000/api/action-queue")
      .then((res) => res.json())
      .then((data) => setQueue(data))
      .catch((err) => console.error(err));
  };

  // POST /api/action-queue -> create a new task (deployment/order)
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/action-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          ...formData,
          full_name: "",
          phone_number: "",
          username: "",
          address: "",
        });
        fetchQueue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // POST /api/action-queue/{id}/complete -> complete a task
  // Optional body: { serial_number } — if provided backend marks inventory item as IN_USE
  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/action-queue/${selectedTask.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serial_number: serialNumber }),
        },
      );
      if (response.ok) {
        setIsCompleteModalOpen(false);
        setSerialNumber("");
        fetchQueue();
        alert("Task completed successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchQueue();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/action-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          ...formData,
          full_name: "",
          phone_number: "",
          username: "",
          address: "",
        });
        fetchQueue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/action-queue/${selectedTask.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serial_number: serialNumber }),
        },
      );
      if (response.ok) {
        setIsCompleteModalOpen(false);
        setSerialNumber("");
        fetchQueue();
        alert("Task completed successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = queue.filter((item) => item.status === activeTab);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#f1f5f9",
            borderRadius: "16px",
            padding: "5px",
            gap: "5px",
          }}
        >
          {["Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 2rem",
                border: "none",
                borderRadius: "12px",
                background: activeTab === tab ? "#0d235c" : "transparent",
                color: activeTab === tab ? "white" : "#64748b",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontSize: "0.9rem",
              }}
            >
              {tab === "Pending"
                ? "Active Tasks"
                : tab === "Approved"
                  ? "Completed"
                  : "Cancelled"}
            </button>
          ))}
        </div>
        <button
          className="login-btn"
          style={{
            width: "auto",
            padding: "0.8rem 2.5rem",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 12px rgba(13, 35, 92, 0.15)",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} /> Deploy Technician
        </button>
      </div>

      <div
        className="table-container"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={20} color="#0d235c" />
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "#1e293b",
                margin: 0,
              }}
            >
              Work Order Stream
            </h3>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th
                style={{
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Ticket Details
              </th>
              <th
                style={{
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Configuration
              </th>
              <th
                style={{
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Operation Type
              </th>
              <th
                style={{
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Time Elapsed
              </th>
              <th
                style={{
                  padding: "1.25rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "right",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Resolution
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  transition: "0.2s",
                }}
              >
                <td style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#0f172a",
                      fontSize: "1rem",
                    }}
                  >
                    {item.full_name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "4px",
                    }}
                  >
                    <MapPin size={12} /> {item.address}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#4f46e5",
                      fontWeight: "600",
                    }}
                  >
                    {item.phone_number}
                  </div>
                </td>
                <td style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ShieldCheck size={16} color="#059669" />
                    <div style={{ fontWeight: "600", color: "#334155" }}>
                      {item.username}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginLeft: "24px",
                    }}
                  >
                    Plan: {item.package_name}
                  </div>
                </td>
                <td style={{ padding: "1.25rem" }}>
                  <span
                    style={{
                      background:
                        item.activity_type === "Installation"
                          ? "#eff6ff"
                          : "#fff7ed",
                      color:
                        item.activity_type === "Installation"
                          ? "#3b82f6"
                          : "#f97316",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: "800",
                    }}
                  >
                    {item.activity_type.toUpperCase()}
                  </span>
                </td>
                <td
                  style={{
                    padding: "1.25rem",
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock size={14} />{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: "1.25rem", textAlign: "right" }}>
                  {item.status === "Pending" && (
                    <button
                      onClick={() => {
                        setSelectedTask(item);
                        setIsCompleteModalOpen(true);
                      }}
                      style={{
                        background: "#0d235c",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "auto",
                      }}
                    >
                      <CheckCircle2 size={16} /> Complete Task
                    </button>
                  )}
                  {item.status === "Approved" && (
                    <div
                      style={{
                        color: "#059669",
                        fontWeight: "800",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <CheckCircle2 size={16} /> VERIFIED
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div
            style={{ padding: "6rem", textAlign: "center", color: "#94a3b8" }}
          >
            <Inbox size={64} style={{ opacity: 0.1, marginBottom: "1.5rem" }} />
            <h4 style={{ margin: 0, color: "#64748b" }}>Queue is Empty</h4>
            <p style={{ fontSize: "0.85rem" }}>
              No {activeTab.toLowerCase()} tasks currently in the system.
            </p>
          </div>
        )}
      </div>

      {/* MODERN TASK CREATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Deployment Order"
      >
        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              gridColumn: "span 2",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "10px",
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
              <User size={16} /> Customer Information
            </h4>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              WhatsApp / Phone
            </label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            />
          </div>

          <div
            style={{
              gridColumn: "span 2",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "10px",
              marginTop: "10px",
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
              <Layers size={16} /> Technical Details
            </h4>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              CID Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            />
          </div>
          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Password (PPPoE)
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            />
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Activity Assignment
            </label>
            <select
              value={formData.activity_type}
              onChange={(e) =>
                setFormData({ ...formData, activity_type: e.target.value })
              }
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            >
              <option value="Installation">New Installation</option>
              <option value="Complaint Check">Complaint & Troubleshoot</option>
              <option value="Payment Collection">Dunning / Collection</option>
              <option value="Hardware Replacement">ONT/Router Upgrade</option>
            </select>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Main ISP Line
            </label>
            <input
              type="text"
              value={formData.isp_name}
              onChange={(e) =>
                setFormData({ ...formData, isp_name: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
              }}
            />
          </div>

          <div className="input-group" style={{ gridColumn: "span 2" }}>
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Site Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "5px",
                minHeight: "60px",
              }}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              gridColumn: "span 2",
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "14px",
              fontWeight: "800",
              boxShadow: "0 4px 12px rgba(13, 35, 92, 0.2)",
            }}
            disabled={loading}
          >
            {loading ? "Submitting Order..." : "Dispatch Technician Now"}
          </button>
        </form>
      </Modal>

      {/* RESOLUTION MODAL */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Work Order Resolution"
      >
        <form onSubmit={handleComplete}>
          <div
            style={{
              marginBottom: "25px",
              background: "#eff6ff",
              padding: "20px",
              borderRadius: "16px",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#3b82f6",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Resolving Ticket:
            </div>
            <div
              style={{
                fontWeight: "800",
                fontSize: "1.35rem",
                color: "#0d235c",
                marginTop: "5px",
              }}
            >
              {selectedTask?.full_name}
            </div>
            <div
              style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "2px" }}
            >
              Account Ref: {selectedTask?.username}
            </div>
          </div>

          <div className="input-group">
            <label
              style={{
                fontSize: "0.9rem",
                fontWeight: "700",
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Package size={20} color="#4f46e5" /> Consumer Asset Serial
              (Optional)
            </label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Scan or enter SN-..."
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                marginTop: "10px",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                background: "#f8fafc",
                padding: "10px",
                borderRadius: "8px",
                marginTop: "15px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <Filter size={14} />
              <span>
                Providing a serial will auto-mark the item as "USED" in your
                inventory.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              marginTop: "30px",
              background: "#059669",
              padding: "1.2rem",
              borderRadius: "16px",
              fontWeight: "800",
              fontSize: "1.1rem",
            }}
          >
            Finalize & Close Task
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ActionQueue;
