import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductSlider from '../components/home/ProductSlider';
import CircularCategories from '../components/home/CircularCategories';
import PromoBanners from '../components/home/PromoBanners';
import BrandsStrip from '../components/home/BrandsStrip';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import ClientReviews from '../components/home/ClientReviews';
import Newsletter from '../components/home/Newsletter';
import BlogGrid from '../components/home/BlogGrid';
import { HomeLoadingSkeleton } from '../components/LoadingSkeleton';

const Home = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (user.role === 'pharmacien' || user.role === 'employe') {
        navigate('/pharmacien', { replace: true });
      }
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      const cached = localStorage.getItem('cached_settings');
      if (cached) {
        setSections(JSON.parse(cached));
        setLoading(false);
      }

      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.settings?.sections) {
          const freshSections = res.data.settings.sections;
          localStorage.setItem('cached_settings', JSON.stringify(freshSections));
          setSections(freshSections);
        }
      } catch (err) {
        console.error("Home: Error loading settings", err);
        if (!cached) {
          const defaults = [
            { id: 'hero', is_visible: true },
            { id: 'categories', is_visible: true },
            { id: 'promotions', is_visible: true },
            { id: 'new_arrivals', is_visible: true },
            { id: 'best_sellers', is_visible: true },
            { id: 'brands', is_visible: true },
            { id: 'blog', is_visible: true },
            { id: 'testimonials', is_visible: true },
            { id: 'newsletter', is_visible: true }
          ];
          setSections(defaults);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (user && (isAdmin || user.role === 'pharmacien' || user.role === 'employe')) {
    return null;
  }

  if (loading) {
    return <HomeLoadingSkeleton />;
  }

  const renderSection = (id) => {
    switch (id) {
      case 'hero':
        return <HeroCarousel key="hero" />;
      case 'categories':
        return <CircularCategories key="categories" />;
      case 'promotions':
        return (
          <React.Fragment key="promotions">
            <PromoBanners />
            <ProductSlider />
          </React.Fragment>
        );
      case 'featured':
        return null;
      case 'new_arrivals':
        return <NewArrivals key="new_arrivals" />;
      case 'best_sellers':
        return <BestSellers key="best_sellers" />;
      case 'brands':
        return <BrandsStrip key="brands" />;
      case 'blog':
        return <BlogGrid key="blog" />;
      case 'testimonials':
        return <ClientReviews key="testimonials" />;
      case 'newsletter':
        return <Newsletter key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <main className="fade-in">
      {sections
        .filter((sec) => sec.is_visible)
        .map((sec) => renderSection(sec.id))}
      <div style={{ height: '40px' }}></div>
    </main>
  );
};

export default Home;
