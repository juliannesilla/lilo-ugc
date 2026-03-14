import React, { useState } from 'react';
import { Check, Plus, Clock, Sparkles, Camera, MousePointerClick, Video, TrendingUp, HelpCircle, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Editable } from './Editable';

const Services: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openAddon, setOpenAddon] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleAddon = (index: number) => {
    setOpenAddon(openAddon === index ? null : index);
  };

  return (
    <>
      {/* SECTION 1: THE PROCESS (Clean Stone/Off-White) */}
      <section id="services" className="py-32 px-6 md:px-12 bg-stone-50 dark:bg-[#0c0a09] text-stone-900 dark:text-white relative transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-32">
              <Editable id="process-badge" tag="span" className="font-black text-[#A08E7B] block t-eyebrow" defaultContent="<strong>THE PROCESS</strong>" />
              <Editable id="process-title" tag="h2" className="font-serif font-black text-stone-900 dark:text-white uppercase drop-shadow-[0_6px_0_rgba(28,25,23,0.15)] mt-3 md:mt-4 t-h2 transition-colors duration-500" defaultContent="<strong>FROM CONCEPT TO</strong> <span class='font-accent font-normal text-[5rem] md:text-[7rem] text-[#A08E7B] ml-4 capitalize tracking-normal whitespace-nowrap drop-shadow-none'>Conversion</span>" />
          </div>

          {/* Process Grid - Content alignment spacing */}
          <div className="grid md:grid-cols-3 gap-12 relative items-stretch mt-10 md:mt-14">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-28 left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-[#A08E7B]/30 to-transparent -z-0"></div>
              
              {/* Step 1 */}
              <Editable id="process-card-1" className="relative z-10 group h-full block">
                  <div className="bg-[#1c1917] border border-[#A08E7B]/30 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-[700ms] ease-premium h-full flex flex-col items-center cursor-pointer overflow-hidden hover:bg-[#1c1917]/90">
                      <div className="bg-transparent w-full flex flex-col items-center p-10 pb-6 shrink-0 text-[#A08E7B] transition-transform duration-[700ms] ease-premium group-hover:scale-95">
                        <div className="w-28 h-28 bg-[#292524] border-2 border-white rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition duration-[700ms] ease-premium">
                            <TrendingUp size={40} />
                        </div>
                        <Editable id="process-1-title" tag="h3" className="text-center font-serif font-black text-4xl mb-0 text-[#A08E7B] tracking-widest uppercase drop-shadow-sm" defaultContent="<strong>STRATEGY</strong>" />
                      </div>
                      
                      {/* Beige Overlay Text Box */}
                      <div className="bg-[#F5F2EB] dark:bg-[#292524] w-full rounded-2xl p-12 flex-grow flex flex-col items-center justify-between border-2 border-[#A08E7B] shadow-inner transition-colors duration-[700ms] ease-premium group-hover:bg-white dark:group-hover:bg-[#1c1917]">
                          <Editable 
                            id="process-1-desc" 
                            tag="p" 
                            className="text-center text-stone-900 dark:text-stone-100 mb-10 font-medium tracking-wide t-body"
                            defaultContent="Generic ads get skipped. We use <strong>AI + human taste</strong> to identify <strong>winning hooks</strong>, so your <strong>first 3 seconds</strong> hold attention."
                          />
                          <Editable id="process-1-problem" tag="span" className="block text-[#1c1917] font-black bg-[#A08E7B] py-5 px-10 rounded-sm shadow-lg border border-[#1c1917]/20 whitespace-nowrap t-button hover:scale-105 active:scale-95 transition-all duration-500 cursor-default" defaultContent="<strong>FIXES: WASTED AD SPEND</strong>" />
                      </div>
                  </div>
              </Editable>

               {/* Step 2 */}
              <Editable id="process-card-2" className="relative z-10 group h-full block">
                  <div className="bg-[#1c1917] border border-[#A08E7B]/30 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-[700ms] ease-premium h-full flex flex-col items-center cursor-pointer overflow-hidden hover:bg-[#1c1917]/90">
                      <div className="bg-transparent w-full flex flex-col items-center p-10 pb-6 shrink-0 text-[#A08E7B] transition-transform duration-[700ms] ease-premium group-hover:scale-95">
                        <div className="w-28 h-28 bg-[#292524] border-2 border-white rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition duration-[700ms] ease-premium">
                            <Camera size={40} />
                        </div>
                        <Editable id="process-2-title" tag="h3" className="text-center font-serif font-black text-4xl mb-0 text-[#A08E7B] tracking-widest uppercase drop-shadow-sm" defaultContent="<strong>PRODUCTION</strong>" />
                      </div>

                      <div className="bg-[#F5F2EB] dark:bg-[#292524] w-full rounded-2xl p-12 flex-grow flex flex-col items-center justify-between border-2 border-[#A08E7B] shadow-inner transition-colors duration-[700ms] ease-premium group-hover:bg-white dark:group-hover:bg-[#1c1917]">
                          <Editable 
                            id="process-2-desc" 
                            tag="p" 
                            className="text-center text-stone-900 dark:text-stone-100 mb-10 font-medium tracking-wide t-body"
                            defaultContent="Shaky footage kills trust. We shoot <strong>4K editorial-style content</strong> with lighting and composition that positions your brand as the <strong>market leader</strong>."
                          />
                          <Editable id="process-2-problem" tag="span" className="block text-[#1c1917] font-black bg-[#A08E7B] py-5 px-10 rounded-sm shadow-lg border border-[#1c1917]/20 whitespace-nowrap t-button hover:scale-105 active:scale-95 transition-all duration-500 cursor-default" defaultContent="<strong>FIXES: LOW BRAND TRUST</strong>" />
                      </div>
                  </div>
              </Editable>

              {/* Step 3 */}
              <Editable id="process-card-3" className="relative z-10 group h-full block">
                  <div className="bg-[#1c1917] border border-[#A08E7B]/30 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-[700ms] ease-premium h-full flex flex-col items-center cursor-pointer overflow-hidden hover:bg-[#1c1917]/90">
                      <div className="bg-transparent w-full flex flex-col items-center p-10 pb-6 shrink-0 text-[#A08E7B] transition-transform duration-[700ms] ease-premium group-hover:scale-95">
                        <div className="w-28 h-28 bg-[#292524] border-2 border-white rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition duration-[700ms] ease-premium">
                            <MousePointerClick size={40} />
                        </div>
                        <Editable id="process-3-title" tag="h3" className="text-center font-serif font-black text-4xl mb-0 text-[#A08E7B] tracking-widest uppercase drop-shadow-sm" defaultContent="<strong>CONVERSION</strong>" />
                      </div>

                      <div className="bg-[#F5F2EB] dark:bg-[#292524] w-full rounded-2xl p-12 flex-grow flex flex-col items-center justify-between border-2 border-[#A08E7B] shadow-inner transition-colors duration-[700ms] ease-premium group-hover:bg-white dark:group-hover:bg-[#1c1917]">
                          <Editable 
                            id="process-3-desc" 
                            tag="p" 
                            className="text-center text-stone-900 dark:text-stone-100 mb-10 font-medium tracking-wide t-body"
                            defaultContent="Pretty videos aren't enough. We edit for <strong>retention</strong>, add <strong>native text</strong>, and deliver assets ready to <strong>scale your campaigns</strong>."
                          />
                          <Editable id="process-3-problem" tag="span" className="block text-[#1c1917] font-black bg-[#A08E7B] py-5 px-10 rounded-sm shadow-lg border border-[#1c1917]/20 whitespace-nowrap t-button hover:scale-105 active:scale-95 transition-all duration-500 cursor-default" defaultContent="<strong>FIXES: LOW CONVERSION</strong>" />
                      </div>
                  </div>
              </Editable>
          </div>
        </div>
      </section>
    </>
  );
};
export default Services;