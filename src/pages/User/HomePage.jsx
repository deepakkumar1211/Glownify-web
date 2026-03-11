import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFeaturedSaloons, fetchAllCategories, setSelectedCategory, setLocation } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";
import useMobile from "../../hooks/useMobile";
import MobileHomePage from "./Mobile/MobileHomePage";
import DesktopHomePage from "./Desktop/DesktopHomePage";

/**
 * HomePage — thin dispatcher
 * ─────────────────────────────────────────────────────────────
 * Handles ALL data fetching (Redux, geolocation) in one place,
 * then renders either MobileHomePage or DesktopHomePage.
 *
 * ✅ Edit mobile UI  →  src/pages/User/Mobile/MobileHomePage.jsx
 * ✅ Edit desktop UI →  src/pages/User/Desktop/DesktopHomePage.jsx
 */
const HomePage = () => {
  const isMobile = useMobile();
  const dispatch = useDispatch();
  const { featuredSalons, categories } = useSelector((state) => state.user);
  const [gender, setGender] = useState("women");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  // ── Derived data (computed once, passed to both layouts) ──
  const filteredCategories = categories?.filter(
    (cat) => cat.gender === gender || cat.gender === "unisex"
  );
  const filteredFeaturedSalons = featuredSalons?.filter(
    (salon) => salon.gender === gender || salon.gender === "unisex"
  );
  const fallbackSalons =
    filteredFeaturedSalons?.length > 0 ? filteredFeaturedSalons : featuredSalons || [];

  // ── Load salons + categories on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        await toast.promise(
          Promise.all([
            dispatch(fetchAllFeaturedSaloons()).unwrap(),
            dispatch(fetchAllCategories()).unwrap(),
          ]),
          {
            loading: "Loading salons & categories...",
            success: "Welcome 👋",
            error: (err) => err?.message || "Failed to load homepage data",
          }
        );
      } catch (error) {
        console.error("Homepage data load failed:", error);
      }
    };
    load();
  }, [dispatch]);

  // ── Geolocation ──
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        localStorage.setItem("lat", latitude);
        localStorage.setItem("lng", longitude);
        toast.success("Location detected 📍");
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error(err.code === err.PERMISSION_DENIED ? "Location permission denied" : "Unable to detect location");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // ── Sync gender → Redux selectedCategory ──
  useEffect(() => { dispatch(setSelectedCategory(gender)); }, [gender, dispatch]);

  // ── Sync lat/lng → Redux ──
  useEffect(() => { if (lat && lng) dispatch(setLocation({ lat, lng })); }, [lat, lng, dispatch]);

  // ── Shared props passed to both layouts ──
  const sharedProps = { gender, setGender, filteredCategories, fallbackSalons, lat, lng };

  return isMobile
    ? <MobileHomePage {...sharedProps} />
    : <DesktopHomePage {...sharedProps} />;
};

export default HomePage;
