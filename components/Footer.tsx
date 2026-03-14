import React from 'react';
import { Editable } from './Editable';
import { Instagram, Mail, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Footer: React.FC = () => {
  const { toggleAdmin, isAdmin } = useAdmin();
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'about', label: 'ABOUT', href: '#about' },
    { name: 'portfolio', label: 'PORTFOLIO', href: '#portfolio' },
    { name: 'services', label: 'SERVICES', href: '#services' },
    { name: 'contact', label: 'CONTACT', href: '#contact' }
  ];

  return (
    <footer className="py-20 px-6 md:px-12 bg-[#F5F2EB] dark:bg-[#0c0a09] border-t border-[#1c1917]/10 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <a 
                  href="#" 
                  onClick={(e) => handleScroll(e, '#')}
                  className="font-serif font-black text-4xl tracking-widest uppercase text-[#1c1917] dark:text-white flex items-center gap-1 hover:text-[#A08E7B] dark:hover:text-[#A08E7B] transition-colors duration-500"
              >
                  <Editable id="footer-logo" tag="span" defaultContent="<strong>JULZ</strong>" /> <span className="text-[#A08E7B]">+</span> <Editable id="footer-logo-2" tag="span" defaultContent="<strong>LILO</strong>" />
              </a>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {navLinks.map(link => (
                      <a 
                          key={link.name} 
                          href={link.href} 
                          onClick={(e) => handleScroll(e, link.href)}
                          className="font-bold text-stone-500 dark:text-stone-400 hover:text-[#1c1917] dark:hover:text-white transition-colors duration-500 tracking-widest uppercase text-sm"
                      >
                          <Editable id={`footer-nav-${link.name}`} tag="span" defaultContent={link.label} />
                      </a>
                  ))}
              </div>

              <div className="flex gap-8">
                  <a href="#" className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-[#1c1917]/10 dark:border-white/10 flex items-center justify-center text-[#1c1917] dark:text-white hover:bg-[#A08E7B] dark:hover:bg-[#A08E7B] hover:text-white transition-all duration-500 shadow-sm hover:shadow-[0_0_20px_rgba(160,142,123,0.4)] hover:-translate-y-1 hover:scale-110 active:scale-95">
                      <Instagram size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-[#1c1917]/10 dark:border-white/10 flex items-center justify-center text-[#1c1917] dark:text-white hover:bg-[#A08E7B] dark:hover:bg-[#A08E7B] hover:text-white transition-all duration-500 shadow-sm hover:shadow-[0_0_20px_rgba(160,142,123,0.4)] hover:-translate-y-1 hover:scale-110 active:scale-95">
                      <Mail size={20} />
                  </a>
              </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-[#1c1917]/10 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <Editable id="footer-copy" tag="p" className="text-stone-500 dark:text-stone-400 text-xs tracking-widest uppercase font-bold" defaultContent="&copy; 2024 JULZ + LILO. ALL RIGHTS RESERVED." />
                <button 
                  onClick={toggleAdmin}
                  className="text-stone-400 dark:text-stone-500 hover:text-[#A08E7B] dark:hover:text-[#A08E7B] transition-colors flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold"
                >
                  <Lock size={10} />
                  {isAdmin ? 'Exit Admin' : 'Admin Login'}
                </button>
              </div>
              <div className="flex gap-8">
                  <Editable id="footer-policy" tag="a" className="text-stone-500 dark:text-stone-400 text-xs tracking-widest uppercase font-bold hover:text-[#1c1917] dark:hover:text-white transition-colors cursor-pointer" defaultContent="PRIVACY POLICY" />
                  <Editable id="footer-terms" tag="a" className="text-stone-500 dark:text-stone-400 text-xs tracking-widest uppercase font-bold hover:text-[#1c1917] dark:hover:text-white transition-colors cursor-pointer" defaultContent="TERMS OF SERVICE" />
              </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
