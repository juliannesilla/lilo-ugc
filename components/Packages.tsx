import React from 'react';
import { Editable } from './Editable';
import { Check, Sparkles, TrendingUp, Zap } from 'lucide-react';

const Packages: React.FC = () => {
  return (
    <section id="packages" className="py-32 px-6 md:px-12 bg-[#1c1917] dark:bg-[#141210] text-stone-100 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A08E7B]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A08E7B]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
            <Editable id="pkg-badge" tag="span" className="font-black text-[#A08E7B] block tracking-widest uppercase text-sm mb-4" defaultContent="<strong>PARTNERSHIP PACKAGES</strong>" />
            <Editable id="pkg-title" tag="h2" className="font-serif font-black text-white uppercase text-5xl md:text-7xl" defaultContent="<strong>INVEST IN</strong> <span class='text-[#A08E7B]'>PERFORMANCE</span>" />
            <Editable id="pkg-subtitle" tag="p" className="text-stone-400 mt-6 max-w-2xl mx-auto text-lg" defaultContent="Choose the partnership level that matches your brand's growth stage. No hidden fees, just high-converting content." />
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch mt-14">
            
            {/* Starter Bundle */}
            <Editable id="pkg-card-1" className="bg-gradient-to-b from-[#292524]/90 to-[#1c1917]/90 dark:from-[#1c1917] dark:to-[#141210] hover:from-[#1c1917] hover:to-[#0c0a09] backdrop-blur-md p-10 lg:p-12 rounded-2xl border border-white/5 flex flex-col relative hover:-translate-y-4 transition-all duration-[800ms] ease-premium h-full z-10 hover:border-[#A08E7B]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group overflow-hidden cursor-pointer animate-in fade-in duration-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#A08E7B]/20 transition-colors duration-500 relative z-10">
                    <Zap className="text-[#A08E7B]" size={28} />
                </div>
                <Editable id="pkg-1-title" tag="h3" className="font-serif font-black text-3xl text-white mb-2 group-hover:text-[#A08E7B] transition-colors duration-500 relative z-10" defaultContent="STARTER" />
                <div className="relative z-10 mb-8 flex items-baseline gap-3">
                    <Editable id="pkg-1-price" tag="div" className="text-5xl font-bold text-white tracking-tight" defaultContent="$1,500<span class='text-xl text-stone-500 font-medium ml-1'>/mo</span>" />
                    <span className="text-xl line-through text-red-500/90 font-bold">$2,200</span>
                </div>
                <Editable id="pkg-1-desc" tag="p" className="text-stone-400 mb-8 leading-relaxed relative z-10" defaultContent="Perfect for testing the waters with high-quality UGC." />
                
                <div className="w-full h-px bg-[#A08E7B]/30 mb-8 relative z-10"></div>

                <ul className="space-y-3 mb-12 flex-grow relative z-10">
                    {[
                        "5 High-Converting UGC Videos",
                        "Direct Response Scripting",
                        "Professional Editing & Color",
                        "1 Round of Revisions"
                    ].map((feat, item) => (
                        <li key={item} className="flex items-start gap-4 text-stone-300 group/item hover:text-white transition-colors duration-300 p-2 -mx-2 rounded-lg hover:bg-white/5">
                            <div className="w-6 h-6 rounded border border-[#A08E7B]/50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-[#A08E7B] transition-colors">
                                <Check size={14} className="text-[#A08E7B] group-hover/item:scale-110 transition-transform duration-300" />
                            </div>
                            <Editable id={`pkg-1-feat-${item}`} tag="span" className="group-hover/item:translate-x-1 transition-transform duration-300 block text-sm lg:text-base" defaultContent={feat} />
                        </li>
                    ))}
                </ul>

                <button className="btn-standard w-full !bg-transparent border-white/20">
                    <div className="btn-standard-overlay"></div>
                    <span className="btn-standard-text !text-white group-hover:!text-stone-900">
                        <Editable id="pkg-1-btn" tag="span" defaultContent="GET STARTED" />
                    </span>
                </button>
            </Editable>

            {/* Growth Bundle (Featured) */}
            <Editable id="pkg-card-2" className="bg-gradient-to-b from-[#F5F2EB] to-[#E5E2DB] hover:from-[#E5E2DB] hover:to-[#D6D3CC] dark:from-[#292524] dark:to-[#1c1917] dark:hover:from-[#1c1917] dark:hover:to-[#0c0a09] p-10 lg:p-12 rounded-2xl border-4 border-[#A08E7B] flex flex-col relative transform md:-translate-y-8 shadow-[0_0_60px_rgba(160,142,123,0.15)] hover:shadow-[0_0_100px_rgba(160,142,123,0.4)] hover:-translate-y-12 transition-all duration-[800ms] ease-premium h-full z-20 group overflow-hidden cursor-pointer animate-in fade-in duration-1000">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
                
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#A08E7B] text-white font-black px-8 py-3 rounded-sm shadow-lg border-4 border-[#1c1917] dark:border-[#0c0a09] whitespace-nowrap tracking-widest uppercase text-sm group-hover:scale-105 transition-transform duration-500 z-30">
                    <Editable id="pkg-2-badge" tag="span" defaultContent="<strong>MOST POPULAR</strong>" />
                </div>
                
                <div className="w-16 h-16 bg-[#A08E7B]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#A08E7B]/20 transition-colors duration-500 relative z-10">
                    <TrendingUp className="text-[#A08E7B]" size={32} />
                </div>
                <Editable id="pkg-2-title" tag="h3" className="font-serif font-black text-4xl text-[#1c1917] dark:text-white mb-2 mt-2 relative z-10" defaultContent="GROWTH" />
                <div className="relative z-10 mb-8 flex items-baseline gap-3">
                    <Editable id="pkg-2-price" tag="div" className="text-6xl font-bold text-[#A08E7B] tracking-tight drop-shadow-sm" defaultContent="$3,500<span class='text-xl text-stone-500 dark:text-stone-400 font-medium ml-1'>/mo</span>" />
                    <span className="text-2xl line-through text-red-500/90 font-bold">$4,800</span>
                </div>
                <Editable id="pkg-2-desc" tag="p" className="text-stone-600 dark:text-stone-300 mb-8 font-medium leading-relaxed relative z-10" defaultContent="The sweet spot for brands ready to scale their ad spend." />
                
                <div className="w-full h-px bg-stone-300 dark:bg-stone-700 mb-8 relative z-10"></div>

                <ul className="space-y-3 mb-12 flex-grow relative z-10">
                    {[
                        "12 High-Converting UGC Videos",
                        "A/B Hook Testing (3 per video)",
                        "Strategic Content Planning",
                        "Dedicated Account Manager",
                        "Unlimited Revisions"
                    ].map((feat, item) => (
                        <li key={item} className="flex items-start gap-4 text-stone-800 dark:text-stone-200 font-medium group/item hover:text-black dark:hover:text-white transition-colors duration-300 p-2 -mx-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                            <div className="w-6 h-6 rounded border border-[#A08E7B]/50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-[#A08E7B] transition-colors">
                                <Check size={14} className="text-[#A08E7B] group-hover/item:scale-110 transition-transform duration-300" />
                            </div>
                            <Editable id={`pkg-2-feat-${item}`} tag="span" className="group-hover/item:translate-x-1 transition-transform duration-300 block text-sm lg:text-base" defaultContent={feat} />
                        </li>
                    ))}
                </ul>

                <button className="btn-standard w-full bg-[#1c1917] dark:bg-white border-transparent">
                    <div className="btn-standard-overlay !bg-[#A08E7B]"></div>
                    <span className="btn-standard-text !text-white dark:!text-[#1c1917] group-hover:!text-white">
                        <Editable id="pkg-2-btn" tag="span" defaultContent="GET GROWTH BUNDLE" />
                    </span>
                </button>
            </Editable>

            {/* Premium Bundle */}
            <Editable id="pkg-card-3" className="bg-gradient-to-b from-[#292524]/90 to-[#1c1917]/90 dark:from-[#1c1917] dark:to-[#141210] hover:from-[#1c1917] hover:to-[#0c0a09] backdrop-blur-md p-10 lg:p-12 rounded-2xl border border-white/5 flex flex-col relative hover:-translate-y-4 transition-all duration-[800ms] ease-premium h-full z-10 hover:border-[#A08E7B]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group overflow-hidden cursor-pointer animate-in fade-in duration-1000">
                <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#A08E7B]/20 transition-colors duration-500 relative z-10">
                    <Sparkles className="text-[#A08E7B]" size={28} />
                </div>
                <Editable id="pkg-3-title" tag="h3" className="font-serif font-black text-3xl text-white mb-2 group-hover:text-[#A08E7B] transition-colors duration-500 relative z-10" defaultContent="PREMIUM" />
                <div className="relative z-10 mb-8 flex items-baseline gap-3">
                    <Editable id="pkg-3-price" tag="div" className="text-5xl font-bold text-white tracking-tight" defaultContent="$6,000<span class='text-xl text-stone-500 font-medium ml-1'>/mo</span>" />
                    <span className="text-xl line-through text-red-500/90 font-bold">$8,500</span>
                </div>
                <Editable id="pkg-3-desc" tag="p" className="text-stone-400 mb-8 leading-relaxed relative z-10" defaultContent="Full-service content engine for established brands." />
                
                <div className="w-full h-px bg-[#A08E7B]/30 mb-8 relative z-10"></div>

                <ul className="space-y-3 mb-12 flex-grow relative z-10">
                    {[
                        "25+ High-Converting UGC Videos",
                        "Whitelisting & Spark Ads Support",
                        "Competitor Ad Analysis",
                        "Monthly Strategy Workshops",
                        "Priority Turnaround (48h)",
                        "Custom Asset Library"
                    ].map((feat, item) => (
                        <li key={item} className="flex items-start gap-4 text-stone-300 group/item hover:text-white transition-colors duration-300 p-2 -mx-2 rounded-lg hover:bg-white/5">
                            <div className="w-6 h-6 rounded border border-[#A08E7B]/50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-[#A08E7B] transition-colors">
                                <Check size={14} className="text-[#A08E7B] group-hover/item:scale-110 transition-transform duration-300" />
                            </div>
                            <Editable id={`pkg-3-feat-${item}`} tag="span" className="group-hover/item:translate-x-1 transition-transform duration-300 block text-sm lg:text-base" defaultContent={feat} />
                        </li>
                    ))}
                </ul>

                <button className="btn-standard w-full !bg-transparent border-white/20">
                    <div className="btn-standard-overlay"></div>
                    <span className="btn-standard-text !text-white group-hover:!text-stone-900">
                        <Editable id="pkg-3-btn" tag="span" defaultContent="GET PREMIUM" />
                    </span>
                </button>
            </Editable>

        </div>
      </div>
    </section>
  );
};

export default Packages;
