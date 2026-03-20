import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, Mail, ArrowRight, Play, CheckCircle2, ChevronRight, ChevronLeft, Menu, X, Download, PenTool, PawPrint, Trophy, Heart, Clock, Zap, Sparkles, BrainCircuit, TrendingUp, BarChart3, LineChart, Bone, Hand, Activity, Sun, Moon, Aperture, FileText } from 'lucide-react';
import CopyRatingModal from './components/CopyRatingModal';
import Services from './components/Services';
import Packages from './components/Packages';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { useTheme } from './context/ThemeContext';
import { Editable } from './components/Editable';
import { EditableImage } from './components/EditableImage';

// Deployment-safe default for Hero Background - High-End Editorial Pet Lifestyle
const HERO_BG_DEFAULT = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2670&auto=format&fit=crop";

const AdminControls = () => {
  const { isAdmin, toggleAdmin } = useAdmin();
  return (
    <>
      {/* Floating Indicator when Admin is Active */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#A08E7B] text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <PenTool size={18} />
          <span className="t-eyebrow font-bold">Editor Active</span>
          <button onClick={toggleAdmin} className="ml-2 bg-white/20 rounded-full p-1 hover:bg-white/40">
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
};

const AppContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [treats, setTreats] = useState(142); // Initial treat count
  const [boops, setBoops] = useState(84); // Initial boop count
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { toggleAdmin, isAdmin } = useAdmin();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Scroll Progress Effect
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScrollProgress);
    
    const handleOpenReport = () => setReportOpen(true);
    window.addEventListener('open-report', handleOpenReport);
    
    return () => {
      window.removeEventListener('scroll', handleScrollProgress);
      window.removeEventListener('open-report', handleOpenReport);
    };
  }, []);

  // Gallery State (Moved to state so Lightbox updates when edited)
  const [galleryImages, setGalleryImages] = useState([
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1000&q=80", 
      title: "The Pack",
      align: 'top' as const 
    },
    {
      id: 2,
      // REPLACED: Updated with high-quality Border Collie + Shih Tzu "Product Haul" image
      src: "https://images.unsplash.com/photo-1554692998-0425582740f2?auto=format&fit=crop&w=1000&q=80", 
      title: "Product Haul",
      align: 'top' as const 
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=1000&q=80", 
      title: "Aesthetic B-Roll",
      align: 'top' as const 
    }
  ]);

  const handleGalleryUpdate = (id: number, newSrc: string) => {
    setGalleryImages(prev => prev.map(img => img.id === id ? { ...img, src: newSrc } : img));
  };

  const handleBatchUpload = (startIndex: number, urls: string[]) => {
    setGalleryImages(prev => {
      const newGallery = [...prev];
      urls.forEach((url, i) => {
        const targetIndex = startIndex + i;
        if (targetIndex < newGallery.length) {
          newGallery[targetIndex] = { ...newGallery[targetIndex], src: url };
        } else {
          // If we want to add new images beyond the current length
          newGallery.push({
            id: Date.now() + i,
            src: url,
            title: `Uploaded Image ${i + 1}`,
            align: 'center'
          });
        }
      });
      return newGallery;
    });
  };

  const handleTreat = () => {
    setTreats(prev => prev + 1);
  };

  const handleBoop = () => {
    setBoops(prev => prev + 1);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  // Smooth scroll with offset for fixed header
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Handle Scroll to Top
    if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
        return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100; // 80px header + 20px padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'ABOUT', label: '<strong>ABOUT</strong>', href: '#about' },
    { name: 'PORTFOLIO', label: '<strong>PORTFOLIO</strong>', href: '#portfolio' },
    { name: 'SERVICES', label: '<strong>SERVICES</strong>', href: '#services' },
    { name: 'CONTACT', label: '<strong>CONTACT</strong>', href: '#contact' },
  ];

  return (
    <div className="min-h-screen font-sans text-stone-900 dark:text-white selection:bg-[#A08E7B] selection:text-white overflow-x-hidden w-full t-body transition-colors duration-500">
      <div className="fixed top-0 left-0 h-1.5 bg-[#A08E7B] z-[100] transition-all duration-75" style={{ width: `${scrollProgress * 100}%` }}></div>
      <AdminControls />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-premium">
        {/* Gradient backdrop for better legibility without full block */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none h-40"></div>
        
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-28 flex items-center justify-between relative z-10">
          <a 
            href="#" 
            onClick={(e) => handleScroll(e, '#')}
            className="font-serif font-black text-4xl tracking-widest uppercase text-white flex items-center gap-1 hover:text-[#A08E7B] transition-colors duration-500 ease-premium drop-shadow-md"
          >
            <Editable id="nav-logo" tag="span" defaultContent="<strong>JULZ</strong>" /> <span className="text-[#A08E7B]">+</span> <Editable id="nav-logo-2" tag="span" defaultContent="<strong>LILO</strong>" />
          </a>
          
          <div className="hidden md:flex gap-14 items-center">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleScroll(e, link.href)}
                className="t-nav font-bold text-white/90 hover:text-white transition-colors duration-500 ease-premium relative group drop-shadow-sm"
              >
                <Editable id={`nav-${link.name}`} tag="span" defaultContent={link.label} />
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#A08E7B] transition-all duration-500 ease-premium group-hover:w-full"></span>
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={(e) => handleScroll(e, '#contact')}
              className="btn-standard !px-8 !py-3 !min-h-[auto] bg-white/10 backdrop-blur-md border border-white/30"
            >
              <div className="btn-standard-overlay"></div>
              <span className="btn-standard-text">
                <Editable id="nav-book-btn" tag="span" defaultContent="<strong>BOOK NOW</strong>" />
              </span>
            </a>
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-stone-900 transition-all duration-500 ease-premium hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-stone-900 transition-all duration-500 ease-premium shadow-lg"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="text-white w-10 h-10" /> : <Menu className="text-white w-10 h-10" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#1c1917] flex flex-col items-center justify-center gap-12 md:hidden text-white animate-premium">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleScroll(e, link.href)} 
              className="font-serif font-black text-6xl text-white hover:text-[#A08E7B] transition-colors duration-500 ease-premium tracking-widest uppercase"
            >
              <Editable id={`mobile-nav-${link.name}`} tag="span" defaultContent={link.label} />
            </a>
          ))}
        </div>
      )}

      {/* Hero Section - REDESIGNED: Modern Editorial Layout */}
      <section className="relative w-full h-screen flex items-end pb-12 md:pb-24 px-6 md:px-20 overflow-hidden">
        
        {/* Layer 1: Background Image */}
        <div className="absolute inset-0 z-0">
            <EditableImage 
                id="hero-bg-modern" 
                src={HERO_BG_DEFAULT} 
                alt="Hero Background" 
                className="w-full h-full object-cover"
                defaultObjectFit="cover"
                controlsPosition="top"
            />
            {/* Gradient Overlay for Readability (Bottom Up) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-transparent opacity-90 pointer-events-none"></div>
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Layer 2: Editorial Content - OVERLAP FIX via Grid Column Padding and Constraints */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-16 xl:gap-24 items-end pointer-events-none">
            
            {/* Left Column: Text Content - Restricted Width to prevent overlap */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-[1200ms] ease-premium relative z-20 max-w-3xl pointer-events-auto">
                <div className="flex flex-wrap gap-4 items-center">
                    <Editable 
                        id="hero-badge" 
                        tag="span" 
                        className="inline-block px-6 py-2 border border-white/20 text-white font-bold bg-white/5 backdrop-blur-md rounded-sm shadow-lg t-eyebrow"
                        defaultContent="<strong>EST. 2022</strong>"
                    />
                     <Editable 
                        id="hero-badge-loc" 
                        tag="span" 
                        className="inline-block px-6 py-2 border border-white/20 text-[#A08E7B] font-bold bg-black/40 backdrop-blur-md rounded-sm shadow-lg t-eyebrow"
                        defaultContent="<strong>LAS VEGAS + WORLDWIDE</strong>"
                    />
                </div>
                
                <div>
                    <Editable 
                    id="hero-title" 
                    tag="h1" 
                    className="font-serif font-black text-white uppercase drop-shadow-2xl t-h1 whitespace-nowrap"
                    defaultContent={`<span class="block text-white">CHARM THAT STOPS THE SCROLL.</span><span class="block text-[#A08E7B]">STRATEGY THAT DRIVES REVENUE.</span>`}
                    />
                </div>

                <div className="max-w-2xl">
                    <Editable 
                        id="hero-desc-main" 
                        tag="p"
                        className="text-stone-300 font-light drop-shadow-md border-l-2 border-[#A08E7B] pl-6 t-subtag"
                        defaultContent={`We turn passive scrollers into loyal customers with <strong>high-converting, authentic content</strong> built for <strong>premium pet brands</strong>.`}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                    <a 
                        href="#portfolio" 
                        onClick={(e) => handleScroll(e, '#portfolio')}
                        className="btn-standard"
                    >
                        <div className="btn-standard-overlay"></div>
                        <span className="btn-standard-text">
                        <Editable id="hero-btn-view" tag="span" defaultContent="<strong>VIEW WORK</strong>" />
                        </span>
                    </a>
                    <a 
                        href="#contact" 
                        onClick={(e) => handleScroll(e, '#contact')}
                        className="btn-standard !bg-transparent !border-white/30"
                    >
                        <div className="btn-standard-overlay"></div>
                        <span className="btn-standard-text !text-white">
                        <Editable id="hero-btn-talk" tag="span" defaultContent="<strong>LET'S TALK</strong>" />
                        </span>
                    </a>
                </div>
            </div>

            {/* Right Column: Social Proof / Metrics (Floating Glass Card) - In Flow */}
            <div className="lg:col-span-5 xl:col-span-4 hidden lg:block pb-4 relative z-20 pointer-events-auto">
                 <div className="bg-gradient-to-br from-[#1c1917]/95 to-[#292524]/95 backdrop-blur-xl border border-[#A08E7B]/30 p-10 rounded-2xl flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-[#A08E7B]/60 transition-all duration-700 ease-premium group relative overflow-hidden">
                    {/* Subtle glow inside the box */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A08E7B]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#A08E7B]/30 transition-colors duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#A08E7B]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#A08E7B]/20 transition-colors duration-700"></div>

                    <div className="relative z-10">
                        <Editable id="hero-metric-val" tag="p" className="text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-300 tracking-tighter group-hover:from-[#A08E7B] group-hover:to-white transition-all duration-700 ease-premium drop-shadow-sm" defaultContent="<strong>4.5X</strong>" />
                        <Editable id="hero-metric-sub" tag="span" className="font-bold text-[#A08E7B] block mt-3 tracking-widest text-sm uppercase" defaultContent="<strong>AVG. CLIENT ROAS</strong>" />
                    </div>
                    
                    <div className="w-full h-px bg-gradient-to-r from-[#A08E7B]/50 via-white/10 to-transparent relative z-10"></div>
                    
                    <div className="relative z-10">
                        <div className="flex -space-x-3 mb-6">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-14 h-14 rounded-xl border-2 border-[#1c1917] bg-stone-800 overflow-hidden relative transition-transform duration-700 ease-premium group-hover:scale-110 shadow-lg group-hover:-translate-y-1">
                                    <img src={`https://images.unsplash.com/photo-15${i}7849845537-4d257902454a?w=100&h=100&fit=crop`} className="w-full h-full object-cover opacity-90" alt="Client" loading="lazy" />
                                </div>
                            ))}
                            <div className="w-14 h-14 rounded-xl border-2 border-[#1c1917] bg-gradient-to-br from-[#A08E7B] to-[#8a7968] flex items-center justify-center text-sm font-black text-white z-10 transition-transform duration-700 ease-premium group-hover:scale-110 shadow-lg group-hover:-translate-y-1">
                                40+
                            </div>
                        </div>
                        <Editable id="hero-social-proof" tag="p" className="text-base font-medium text-stone-300 leading-relaxed" defaultContent="Trusted by <strong class='text-white'>40+ premium brands</strong> across the globe." />
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* About Section - RESTRUCTURED */}
      <section id="about" className="py-32 px-6 md:px-12 bg-white dark:bg-[#141210] transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Main Landscape Team Photo */}
          <div className="mb-24 relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
             <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-[1000ms] ease-premium z-10 pointer-events-none"></div>
            <EditableImage 
              id="team-main-img"
              // STATIC IMAGE
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80" 
              alt="The Team - Julz and Lilo" 
              className="relative w-full aspect-[21/9] object-cover hover:scale-[1.01] transition-transform duration-[2000ms] ease-premium grayscale hover:grayscale-0"
              defaultObjectPosition="center"
              forceCover={true}
            />
          </div>

          {/* Section Header - Centered & Big */}
          <div className="text-center mb-32 max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-6">
                  <div className="h-[2px] w-20 bg-[#A08E7B]"></div>
                  <Editable id="about-label" tag="span" className="font-bold text-[#A08E7B] t-eyebrow" defaultContent="<strong>THE POWER DUO</strong>" />
                  <div className="h-[2px] w-20 bg-[#A08E7B]"></div>
              </div>
              
              <Editable id="about-heading" tag="h2" className="font-serif text-stone-900 dark:text-white uppercase drop-shadow-[0_6px_0_rgba(28,25,23,0.15)] mt-3 md:mt-4 t-h2 transition-colors duration-500" defaultContent={`<span class="font-light block mb-6"><strong>STRATEGIST BRAIN.</strong></span><span class="font-accent text-[#A08E7B] block font-normal lowercase tracking-normal drop-shadow-none"><strong>puppy charm.</strong></span>`} />
              
              <Editable 
                id="about-intro" 
                tag="p" 
                className="text-stone-700 dark:text-stone-300 font-light mt-4 max-w-5xl mx-auto t-subtag transition-colors duration-500"
                defaultContent="We bridge the gap between <strong>&quot;cute dog video&quot;</strong> and <strong>performance creative</strong> that <strong>actually moves revenue</strong>."
              />
          </div>

          {/* The Duo Grid - Side by Side */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-12">
              
               {/* JULZ CARD (Left) */}
               <div className="bg-[#1c1917] p-10 md:p-16 rounded-2xl border border-[#A08E7B]/30 shadow-2xl relative overflow-hidden group hover:shadow-[0_30px_70px_-15px_rgba(160,142,123,0.3)] hover:-translate-y-2 transition-all duration-700 ease-premium h-full flex flex-col">
                  <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#A08E7B]/5 rounded-full blur-[120px] pointer-events-none"></div>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-[1000ms] ease-premium transform scale-150 origin-top-right pointer-events-none">
                      <BrainCircuit size={400} className="text-white" />
                  </div>

                  <div className="relative z-10 flex flex-col flex-grow text-white">
                       {/* UPDATED: Dominant Avatar Image - STATIC */}
                      <div className="w-full h-[30rem] rounded-2xl p-3 bg-stone-800 shrink-0 shadow-2xl border-2 border-[#A08E7B] mb-12 overflow-hidden">
                           <EditableImage 
                              id="julz-avatar" 
                              // STATIC IMAGE
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                              alt="Julz" 
                              className="w-full h-full rounded-xl object-cover transition-transform duration-[2000ms] ease-premium group-hover:scale-105" 
                              defaultObjectPosition="top"
                              forceCover={true}
                           />
                      </div>

                      <div className="mb-12">
                             <div className="flex flex-wrap gap-4 mb-6 items-center">
                               <Editable id="julz-profile-name" tag="h3" className="font-serif font-black text-white uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] t-h2" defaultContent="<strong>JULZ</strong>" />
                               <span className="font-bold bg-white text-[#1c1917] px-5 py-3 rounded-sm border border-transparent t-eyebrow"><strong>CREATIVE STRATEGIST</strong> · <strong>DATA NERD</strong></span>
                             </div>
                             
                             <Editable 
                                id="julz-profile-desc" 
                                tag="p" 
                                className="text-stone-300 font-['Aileron',_sans-serif] font-light border-l-2 border-[#A08E7B]/50 pl-8 mb-10 t-body"
                                defaultContent="I don’t just shoot. I <strong class='text-[#A08E7B]'>research</strong> your niche and trends, then <strong class='text-[#A08E7B]'>script</strong> and <strong class='text-[#A08E7B]'>structure</strong> content to <strong class='text-[#A08E7B]'>convert</strong>."
                             />
                             
                             {/* Expertise Grid - Updated to 4 items in 2 cols */}
                             <div className="grid grid-cols-2 gap-6">
                                {/* Skill 1 */}
                                <div className="flex flex-col p-6 bg-white/5 rounded-xl border border-[#A08E7B]/20 hover:border-[#A08E7B]/50 transition-all duration-500 ease-premium group/skill">
                                    <div className="p-2 border border-white/20 rounded-lg w-fit mb-4 group-hover/skill:border-white transition-colors duration-500 ease-premium">
                                      <TrendingUp className="text-[#A08E7B]" size={24} />
                                    </div>
                                    <span className="font-bold text-white t-eyebrow"><strong>DIRECT RESPONSE</strong></span>
                                    <span className="text-xs font-mono text-[#A08E7B] mt-2 opacity-80">EXPERT</span>
                                </div>
                                {/* Skill 2 */}
                                <div className="flex flex-col p-6 bg-white/5 rounded-xl border border-[#A08E7B]/20 hover:border-[#A08E7B]/50 transition-all duration-500 ease-premium group/skill">
                                    <div className="p-2 border border-white/20 rounded-lg w-fit mb-4 group-hover/skill:border-white transition-colors duration-500 ease-premium">
                                      <BarChart3 className="text-[#A08E7B]" size={24} />
                                    </div>
                                    <span className="font-bold text-white t-eyebrow"><strong>TREND ANALYSIS</strong></span>
                                    <span className="text-xs font-mono text-[#A08E7B] mt-2 opacity-80">ADVANCED</span>
                                </div>
                             </div>
                      </div>

                   {/* Stats Strip */}
                   <div className="grid grid-cols-3 gap-0 border-t border-[#A08E7B]/30 relative z-10 bg-black/40 backdrop-blur-sm mt-auto -mx-10 -mb-10 md:-mx-16 md:-mb-16">
                      <div className="text-center py-10 border-r border-[#A08E7B]/30 group/stat hover:bg-white/5 transition-colors duration-500 ease-premium">
                          <Editable id="julz-stat-1-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter group-hover/stat:text-white transition-colors duration-500 ease-premium" defaultContent="<strong>$500K+</strong>" />
                          <Editable id="julz-stat-1-lbl" tag="p" className="text-stone-400 font-bold mt-3 t-eyebrow" defaultContent="<strong>AD SPEND</strong>" />
                      </div>
                      <div className="text-center py-10 border-r border-[#A08E7B]/30 group/stat hover:bg-white/5 transition-colors duration-500 ease-premium">
                          <Editable id="julz-stat-2-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter group-hover/stat:text-white transition-colors duration-500 ease-premium" defaultContent="<strong>4+</strong>" />
                          <Editable id="julz-stat-2-lbl" tag="p" className="text-stone-400 font-bold mt-3 t-eyebrow" defaultContent="<strong>YRS EXP</strong>" />
                      </div>
                      <div className="text-center py-10 group/stat hover:bg-white/5 transition-colors duration-500 ease-premium">
                          <Editable id="julz-stat-3-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter group-hover/stat:text-white transition-colors duration-500 ease-premium" defaultContent="<strong>3.5X</strong>" />
                          <Editable id="julz-stat-3-lbl" tag="p" className="text-stone-400 font-bold mt-3 t-eyebrow" defaultContent="<strong>ROAS</strong>" />
                      </div>
                  </div>
                  </div>
              </div>

              {/* LILO CARD (Right) */}
              <div className="bg-[#F5F2EB] p-10 md:p-16 rounded-2xl border border-[#A08E7B]/30 shadow-2xl relative overflow-hidden group hover:shadow-[0_30px_70px_-15px_rgba(160,142,123,0.3)] hover:-translate-y-2 transition-all duration-700 ease-premium h-full flex flex-col">
                  <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#A08E7B]/10 rounded-full blur-[120px] pointer-events-none"></div>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-[1000ms] ease-premium transform scale-150 origin-top-right pointer-events-none">
                      <PawPrint size={400} className="text-[#A08E7B]" />
                  </div>

                  <div className="relative z-10 flex flex-col flex-grow text-stone-900">
                       {/* Dominant Avatar Image - STATIC */}
                      <div className="w-full h-[30rem] rounded-2xl p-3 bg-white shrink-0 shadow-2xl border-2 border-[#1c1917] mb-12 overflow-hidden">
                           <EditableImage 
                              id="about-lilo-img-avatar" 
                              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80" 
                              alt="Lilo" 
                              className="w-full h-full rounded-xl object-cover transition-transform duration-[2000ms] ease-premium group-hover:scale-105" 
                              defaultObjectPosition="top"
                              forceCover={true}
                           />
                      </div>
                      
                      <div className="mb-12">
                             <div className="flex flex-wrap gap-4 mb-6 items-center">
                               <Editable id="lilo-card-title" tag="h3" className="font-serif font-black text-stone-900 uppercase drop-shadow-[0_4px_0_rgba(160,142,123,0.2)] t-h2" defaultContent="<strong>LILO</strong>" />
                               <span className="font-bold bg-[#1c1917] text-white px-5 py-3 rounded-sm border border-transparent t-eyebrow"><strong>CHIEF MORALE OFFICER</strong> · <strong>TREAT EXPERT</strong></span>
                             </div>
                             
                             <Editable 
                                id="lilo-subtitle" 
                                tag="p" 
                                className="text-stone-700 font-['Aileron',_sans-serif] font-light border-l-2 border-[#A08E7B]/50 pl-8 mb-10 t-body"
                                defaultContent="His secret is simple: <strong class='text-[#A08E7B]'>treats</strong>, <strong class='text-[#A08E7B]'>routine</strong>, and <strong class='text-[#A08E7B]'>unwavering confidence</strong>. Same for your <strong class='text-[#A08E7B]'>ads</strong>."
                             />
                             
                             {/* Expertise Grid - Lilo Version */}
                             <div className="grid grid-cols-2 gap-6">
                                {/* Skill 1 */}
                                <div className="flex flex-col p-6 bg-white/40 rounded-xl border border-[#A08E7B]/20 hover:border-[#A08E7B]/50 transition-all duration-500 ease-premium group/skill">
                                    <div className="p-2 border border-stone-300 rounded-lg w-fit mb-4 group-hover/skill:border-[#A08E7B] transition-colors duration-500 ease-premium">
                                      <Bone className="text-[#A08E7B]" size={24} />
                                    </div>
                                    <span className="font-bold text-stone-900 t-eyebrow"><strong>TREAT ACQUISITION</strong></span>
                                    <span className="text-xs font-mono text-[#A08E7B] mt-2 opacity-80">MASTER</span>
                                </div>
                                {/* Skill 2 */}
                                <div className="flex flex-col p-6 bg-white/40 rounded-xl border border-[#A08E7B]/20 hover:border-[#A08E7B]/50 transition-all duration-500 ease-premium group/skill">
                                    <div className="p-2 border border-stone-300 rounded-lg w-fit mb-4 group-hover/skill:border-[#A08E7B] transition-colors duration-500 ease-premium">
                                      <Clock className="text-[#A08E7B]" size={24} />
                                    </div>
                                    <span className="font-bold text-stone-900 t-eyebrow"><strong>NAP OPTIMIZATION</strong></span>
                                    <span className="text-xs font-mono text-[#A08E7B] mt-2 opacity-80">ELITE</span>
                                </div>
                             </div>
                      </div>

                      {/* Stats Strip - Lilo Version */}
                      <div className="grid grid-cols-3 gap-0 border-t border-[#A08E7B]/30 relative z-10 bg-white/60 backdrop-blur-sm mt-auto -mx-10 -mb-10 md:-mx-16 md:-mb-16">
                          <div className="text-center py-10 border-r border-[#A08E7B]/30 group/stat hover:bg-[#A08E7B]/5 transition-colors duration-500 ease-premium cursor-pointer" onClick={handleTreat}>
                              <Editable id="lilo-stat-1-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter group-hover/stat:scale-110 transition-transform duration-500" defaultContent={`<strong>${treats}</strong>`} />
                              <Editable id="lilo-stat-1-lbl" tag="p" className="text-stone-500 font-bold mt-3 t-eyebrow" defaultContent="<strong>TREATS GIVEN</strong>" />
                          </div>
                          <div className="text-center py-10 border-r border-[#A08E7B]/30 group/stat hover:bg-[#A08E7B]/5 transition-colors duration-500 ease-premium">
                              <Editable id="lilo-stat-2-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter" defaultContent="<strong>14H</strong>" />
                              <Editable id="lilo-stat-2-lbl" tag="p" className="text-stone-500 font-bold mt-3 t-eyebrow" defaultContent="<strong>DAILY SLEEP</strong>" />
                          </div>
                          <div className="text-center py-10 group/stat hover:bg-[#A08E7B]/5 transition-colors duration-500 ease-premium">
                              <Editable id="lilo-stat-3-val" tag="p" className="text-5xl font-serif font-black text-[#A08E7B] tracking-tighter" defaultContent="<strong>100%</strong>" />
                              <Editable id="lilo-stat-3-lbl" tag="p" className="text-stone-500 font-bold mt-3 t-eyebrow" defaultContent="<strong>GOOD BOY</strong>" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Logic vs Magic - Side by Side Below Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-stone-200 rounded-2xl overflow-hidden shadow-2xl animate-premium">
            
            {/* Logic Side (Direct Response) - Editorial Dark */}
            <div className="group bg-[#1c1917] p-20 flex flex-col justify-between min-h-[400px] relative overflow-hidden text-white border-r border-stone-800 hover:border-[#A08E7B] transition-all duration-[800ms] ease-premium hover:scale-[1.005] z-0 hover:z-10">
                <div className="absolute -top-12 -right-12 text-[250px] font-serif font-black text-white/5 leading-none select-none group-hover:text-[#A08E7B]/10 transition-colors duration-[800ms] ease-premium">01</div>
                <div>
                    <Editable id="feat-1-sub" tag="span" className="text-[#A08E7B] font-bold block t-eyebrow">THE LOGIC</Editable>
                    <Editable id="feat-1-title" tag="h4" className="font-serif font-black text-5xl md:text-6xl uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] mt-3 md:mt-4 t-h2">DIRECT RESPONSE</Editable>
                </div>
                <div className="relative z-10 border-l border-[#A08E7B]/30 pl-10 mt-10 md:mt-14 transition-all duration-[800ms] ease-premium group-hover:pl-12">
                    <Editable 
                        id="feat-1-desc" 
                        tag="p" 
                        className="text-stone-300 font-light group-hover:text-stone-200 transition-colors duration-500 max-w-xl t-body"
                        defaultContent="We don't guess. We use <b>data-backed hooks</b> and <b>psychological triggers</b> to <b>stop the scroll</b> and <b>drive immediate action</b>."
                    />
                </div>
            </div>

            {/* Magic Side (Aesthetic) - Editorial Light */}
            <div className="group bg-[#F5F2EB] dark:bg-[#1c1917] p-20 flex flex-col justify-between min-h-[400px] relative overflow-hidden text-stone-900 dark:text-white hover:border-[#A08E7B] transition-all duration-[800ms] ease-premium hover:scale-[1.005] z-0 hover:z-10">
                <div className="absolute -top-12 -right-12 text-[250px] font-serif font-black text-stone-900/5 dark:text-white/5 leading-none select-none group-hover:text-[#A08E7B]/10 transition-colors duration-[800ms] ease-premium">02</div>
                <div>
                    <Editable id="feat-2-sub" tag="span" className="text-stone-400 dark:text-stone-500 font-bold block t-eyebrow">THE MAGIC</Editable>
                    <Editable id="feat-2-title" tag="h4" className="font-serif font-black text-5xl md:text-6xl uppercase drop-shadow-[0_2px_0_rgba(28,25,23,0.1)] dark:drop-shadow-none mt-3 md:mt-4 t-h2">AESTHETIC B-ROLL</Editable>
                </div>
                <div className="relative z-10 border-l border-[#A08E7B]/30 pl-10 mt-10 md:mt-14 transition-all duration-[800ms] ease-premium group-hover:pl-12">
                    <Editable 
                        id="feat-2-desc" 
                        tag="p" 
                        className="text-stone-700 dark:text-stone-300 font-light group-hover:text-stone-900 dark:group-hover:text-white transition-colors duration-500 max-w-xl t-body"
                        defaultContent="<b>Cinema-grade visuals</b> that <b>elevate your brand perception</b>. Content so beautiful it <b>looks native to the feed</b>, never like an ad."
                    />
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* Portfolio Section - VIDEO (Beige) */}
      <section id="portfolio" className="py-32 px-6 md:px-12 bg-[#F5F2EB] dark:bg-[#0c0a09] transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-28">
            <Editable id="portfolio-video-title" tag="h2" className="font-serif font-black text-stone-900 dark:text-white uppercase drop-shadow-[0_6px_0_rgba(28,25,23,0.15)] t-h2 transition-colors duration-500" defaultContent="<strong>SELECTED WORK</strong>" />
            <Editable id="portfolio-video-sub" tag="p" className="text-stone-500 dark:text-stone-400 font-light mt-4 t-subtag transition-colors duration-500" defaultContent="Video & photography that <strong>converts</strong>." />
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-3 gap-12 items-center">
            {[
              { title: "<strong>UNBOXING + FIRST IMPRESSIONS</strong>", type: "<strong>AWARENESS</strong>", src: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80", aspect: "aspect-[9/16]" },
              { title: "<strong>PROBLEM / SOLUTION</strong>", type: "<strong>CONVERSION</strong>", src: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=400&q=80", aspect: "aspect-[9/16]" },
              { title: "<strong>AESTHETIC ROUTINE</strong>", type: "<strong>RETENTION</strong>", src: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&w=400&q=80", aspect: "aspect-[9/16]" }
            ].map((item, idx) => (
              <div key={idx} className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-2xl ${item.aspect} border border-[#1c1917] hover:border-[#A08E7B] transition-all duration-[800ms] ease-premium hover:scale-[1.02]`}>
                <EditableImage 
                  id={`portfolio-vid-${idx}`} 
                  src={item.src} 
                  alt="Portfolio Video" 
                  className="w-full h-full transition duration-[2000ms] ease-premium group-hover:scale-110" 
                  defaultObjectFit="cover"
                  lazyLoad={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-has-[video:not(:paused)]:!opacity-0 group-has-[video:not(:paused)]:pointer-events-none transition-all duration-700 ease-premium flex flex-col items-center justify-center backdrop-blur-[2px] pointer-events-none">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transform scale-50 group-hover:scale-100 transition-transform duration-700 ease-premium delay-100 shadow-2xl">
                    <Play fill="white" className="text-white w-12 h-12 ml-1" />
                  </div>
                  <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-premium delay-200">
                    <Editable id={`portfolio-vid-title-${idx}`} tag="h4" className="text-white font-serif font-black text-xl uppercase tracking-widest text-center px-6" defaultContent={item.title} />
                    <Editable id={`portfolio-vid-type-${idx}`} tag="p" className="text-[#A08E7B] font-bold text-xs tracking-[0.3em] uppercase text-center mt-2" defaultContent={item.type} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section - PHOTOGRAPHY (Off-White) */}
      <section className="py-32 px-6 md:px-12 bg-stone-50 dark:bg-[#141210] transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {galleryImages.map((img, i) => (
              <div 
                  key={img.id} 
                  onClick={() => !isAdmin && openLightbox(i)}
                  className={`aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-[800ms] ease-premium group border border-transparent ${isAdmin ? '' : 'hover:border-[#A08E7B] cursor-zoom-in hover:-translate-y-2'} relative`}
              >
                <EditableImage 
                  id={`portfolio-photo-${img.id}`}
                  src={img.src} 
                  className="w-full h-full group-hover:scale-125 group-hover:translate-y-4 transition-all duration-[3000ms] ease-premium" 
                  alt="Portfolio"
                  onUpdate={(newSrc) => handleGalleryUpdate(img.id, newSrc)}
                  onBatchUpload={(urls) => handleBatchUpload(i, urls)}
                  defaultObjectFit="cover"
                  defaultObjectPosition={img.align}
                  forceCover={true}
                  lazyLoad={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-premium flex flex-col items-center justify-center pointer-events-none">
                    <div className="transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-premium flex flex-col items-center">
                        <span className="text-white font-black bg-white/10 px-10 py-5 rounded-sm backdrop-blur-xl t-button border border-white/20 shadow-2xl uppercase tracking-[0.2em] text-xs">View Gallery</span>
                        <div className="mt-6 text-center px-8">
                            <Editable id={`photo-title-${img.id}`} tag="h4" className="text-white font-serif font-bold text-2xl uppercase tracking-tight" defaultContent={img.title} />
                            <div className="h-[1px] w-12 bg-[#A08E7B] mx-auto mt-4 opacity-50"></div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Packages Section */}
      <Services />
      <Packages />

      {/* Contact Form Section */}
      <Contact />

      {/* Footer Section */}
      <Footer />

      {/* Modals */}
      <CopyRatingModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>
          
          <div className="relative w-full max-w-5xl max-h-[85vh] px-16 flex items-center justify-center">
            {galleryImages[currentImageIndex].src.match(/\.(mp4|webm|ogg|mov)(\?.*)?(#.*)?$/i) || galleryImages[currentImageIndex].src.endsWith('#video') ? (
              <video 
                src={galleryImages[currentImageIndex].src} 
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
                autoPlay loop muted playsInline controls
              />
            ) : (
              <img 
                src={galleryImages[currentImageIndex].src} 
                alt={galleryImages[currentImageIndex].title}
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
              />
            )}
            <div className="absolute bottom-[-40px] left-0 right-0 text-center">
              <span className="text-white font-serif tracking-widest uppercase text-sm">
                {galleryImages[currentImageIndex].title}
              </span>
            </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <AdminProvider>
    <AppContent />
  </AdminProvider>
);

export default App;