import toast from "react-hot-toast";

export const checkSubscription = async (navigate) => {
  try {
    const now = new Date();
    const localData = localStorage.getItem("subscription");
    let subscription = localData ? JSON.parse(localData) : null;
    let isActive = false;

    // ✅ CASE 1: Local subscription exists
    if (subscription?.endDate && subscription?.paymentStatus === "paid") {
      const endDate = new Date(subscription.endDate);
      const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      isActive = endDate > now;

      // ⚠️ Expiry warning
      if (diffDays <= 3 && diffDays > 0) {
        toast(`⚠️ Your subscription expires in ${diffDays} day(s).`);
      }
    }

    // ✅ CASE 2: No local subscription OR expired → verify backend
    if (!subscription || !isActive) {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/salon-admin/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch subscription");

      const data = await res.json();

      localStorage.setItem(
        "subscription",
        JSON.stringify(data.subscription || null)
      );

      if (!data.isSubscriptionActive) {
        toast.error("🚫 Subscription inactive. Please renew.");
        navigate("/subscription");
        return;
      }

      return;
    }

    // ✅ CASE 3: Active locally → skip API
    console.log("✅ Subscription active (local)");
  } catch (err) {
    console.error("❗ Subscription check failed:", err);
    toast.error("Session expired. Please login again.");
    navigate("/login");
  }
};
