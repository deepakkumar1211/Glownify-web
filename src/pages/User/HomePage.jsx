import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFeaturedSaloons } from "../../redux/slice/userSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Hero from "./HomePageLayout/Hero";
import { fetchAllCategories } from "../../redux/slice/userSlice";
import Categories from "./HomePageLayout/Categories";
import Services from "./HomePageLayout/Services";
import ServicesBanner from "./HomePageLayout/ServicesBanner";
import { GenderSwitch } from "./HomePageLayout/GenderSwitch";
import TopRatedSaloons from "./HomePageLayout/TopRatedSaloons";
import HomeSaloons from "./HomePageLayout/HomeSaloons";
import { setSelectedCategory, setLocation } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";
import IndependentProfessionals from "./HomePageLayout/IndependentProfessionals";
import UnisexSalon from "./HomePageLayout/UnisexSalon";
import SalonHomeServices from "./HomePageLayout/SalonHomeServices";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salons, featuredSalons, categories, loading } = useSelector((state) => state.user);
  const [gender, setGender] = useState('women');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const filteredCategories = categories?.filter(
    (cat) => cat.gender === gender || cat.gender === 'unisex'
  );

  const filteredSalons = salons?.filter(
    (salon) => salon.gender === gender || salon.gender === 'unisex'
  );

  const filteredFeaturedSalons = featuredSalons?.filter(
    (salon) => salon.gender === gender || salon.gender === 'unisex'
  );

  // Use gender-filtered featured salons, or all featured salons if filter returns empty
  const fallbackSalons = filteredFeaturedSalons?.length > 0 ? filteredFeaturedSalons : (featuredSalons || []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const salonsPromise = dispatch(fetchAllFeaturedSaloons()).unwrap();
        const categoriesPromise = dispatch(fetchAllCategories()).unwrap();

        await toast.promise(
          Promise.all([salonsPromise, categoriesPromise]),
          {
            loading: "Loading salons & categories...",
            success: "Welcome 👋",
            error: (err) =>
              err?.message || "Failed to load homepage data",
          }
        );
      } catch (error) {
        console.error("Homepage data load failed:", error);
      }
    };

    loadHomeData();
  }, [dispatch]);



  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        localStorage.setItem("lat", latitude);
        localStorage.setItem("lng", longitude);

        toast.success("Location detected 📍");
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied");
        } else {
          toast.error("Unable to detect location");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);



  useEffect(() => {
    dispatch(setSelectedCategory(gender));
  }, [gender]);

  useEffect(() => {
    if (lat && lng) {
      dispatch(setLocation({ lat, lng }));
    }
  }, [lat, lng]);



  return (
    <div className="min-h-screen bg-linear-to-r from-[#FFF7F1] to-[#FFEDE2] pb-20">
      {/* Header */}
      <Hero />
      <Services />
      <ServicesBanner />
      <GenderSwitch gender={gender} setGender={setGender} />
      <Categories categories={filteredCategories} gender={gender} />
      <HomeSaloons category={gender} lat={lat} lng={lng} fallbackSalons={fallbackSalons} />
      {/* <TopRatedSaloons salons={salons} categories={categories}/> */}
      <IndependentProfessionals />
      <SalonHomeServices category={gender} lat={lat} lng={lng} />
      <UnisexSalon lat={lat} lng={lng} />
    </div>
  );
};

export default HomePage;
