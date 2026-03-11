import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileSalonNotificationsScreen() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <div style={{ backgroundColor: "#156778", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", padding: 0, marginTop: "2px", cursor: "pointer" }}>
                    <ChevronLeft size={26} color="#ffffff" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>Notifications</h1>
                    <p style={{ fontSize: "12px", color: "#ddd", marginTop: "2px", marginBottom: 0 }}>View your latest notifications</p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 20px" }}>
                <span style={{ color: "#999", fontSize: "14px" }}>No new notifications</span>
            </div>
        </div>
    );
}
