import React from 'react';
import { Editable } from './Editable';
import { ArrowRight, Mail, Instagram, MessageSquare, Calendar, ShieldCheck } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-[#0c0a09] dark:bg-[#141210] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#A08E7B]/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#A08E7B]/10 rounded-full blur-[150px] translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
              
              {/* Left Side - Text */}
              <div className="text-white relative z-20">
                  <Editable id="contact-badge" tag="span" className="font-black text-[#A08E7B] block tracking-widest uppercase text-sm mb-6" defaultContent="<strong>LET'S TALK</strong>" />
                  <Editable id="contact-title" tag="h2" className="font-serif font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-stone-200 to-stone-400" defaultContent="<strong>READY TO</strong><br/><span class='text-[#A08E7B]'>SCALE?</span>" />
                  <Editable id="contact-desc" tag="p" className="text-stone-400 text-xl md:text-2xl font-light mb-12 max-w-xl leading-relaxed" defaultContent="Stop wasting ad spend on content that doesn't convert. Let's build a strategy that drives real revenue." />
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-12">
                      <div className="flex items-center gap-4 group p-6 rounded-2xl border border-[#A08E7B]/40 bg-white/5 hover:border-[#A08E7B] hover:bg-[#A08E7B]/10 hover:shadow-[0_0_30px_rgba(160,142,123,0.4)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-24">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#A08E7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#A08E7B]/50 flex items-center justify-center text-[#A08E7B] group-hover:bg-[#A08E7B] group-hover:text-white group-hover:scale-110 transition-all duration-500 shrink-0 relative z-10 shadow-[0_0_15px_rgba(160,142,123,0.2)]">
                              <MessageSquare size={20} />
                          </div>
                          <div className="relative z-10 overflow-hidden">
                              <Editable id="contact-step-1-title" tag="h4" className="font-bold text-white group-hover:text-[#A08E7B] transition-colors duration-500 whitespace-nowrap" defaultContent="Quick Response" />
                              <Editable id="contact-step-1-desc" tag="p" className="text-stone-400 text-xs group-hover:text-stone-300 transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis" defaultContent="We'll get back to you within 24 hours." />
                          </div>
                      </div>
                      <div className="flex items-center gap-4 group p-6 rounded-2xl border border-[#A08E7B]/40 bg-white/5 hover:border-[#A08E7B] hover:bg-[#A08E7B]/10 hover:shadow-[0_0_30px_rgba(160,142,123,0.4)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-24">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#A08E7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#A08E7B]/50 flex items-center justify-center text-[#A08E7B] group-hover:bg-[#A08E7B] group-hover:text-white group-hover:scale-110 transition-all duration-500 shrink-0 relative z-10 shadow-[0_0_15px_rgba(160,142,123,0.2)]">
                              <Calendar size={20} />
                          </div>
                          <div className="relative z-10 overflow-hidden">
                              <Editable id="contact-step-2-title" tag="h4" className="font-bold text-white group-hover:text-[#A08E7B] transition-colors duration-500 whitespace-nowrap" defaultContent="Free Strategy Call" />
                              <Editable id="contact-step-2-desc" tag="p" className="text-stone-400 text-xs group-hover:text-stone-300 transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis" defaultContent="Discuss your goals with our experts." />
                          </div>
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                      <a href="mailto:hello@julzandlilo.com" className="flex items-center gap-4 group p-6 rounded-2xl border border-[#A08E7B]/40 bg-white/5 hover:border-[#A08E7B] hover:bg-[#A08E7B]/10 hover:shadow-[0_0_30px_rgba(160,142,123,0.4)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex-1 h-24">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#A08E7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#A08E7B]/50 flex items-center justify-center text-[#A08E7B] group-hover:bg-[#A08E7B] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(160,142,123,0.2)] relative z-10 shrink-0">
                              <Mail size={20} className="group-hover:scale-90 transition-transform duration-500" />
                          </div>
                          <Editable id="contact-email" tag="span" className="font-medium tracking-wide text-stone-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 relative z-10 whitespace-nowrap overflow-hidden" defaultContent="hello@julzandlilo.com" />
                      </a>
                      <a href="#" className="flex items-center gap-4 group p-6 rounded-2xl border border-[#A08E7B]/40 bg-white/5 hover:border-[#A08E7B] hover:bg-[#A08E7B]/10 hover:shadow-[0_0_30px_rgba(160,142,123,0.4)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex-1 h-24">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#A08E7B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#A08E7B]/50 flex items-center justify-center text-[#A08E7B] group-hover:bg-[#A08E7B] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(160,142,123,0.2)] relative z-10 shrink-0">
                              <Instagram size={20} className="group-hover:scale-90 transition-transform duration-500" />
                          </div>
                          <Editable id="contact-ig" tag="span" className="font-medium tracking-wide text-stone-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 relative z-10 whitespace-nowrap overflow-hidden" defaultContent="@julzandlilo" />
                      </a>
                  </div>
              </div>

              {/* Right Side - Form */}
              <div className="bg-[#1c1917]/80 backdrop-blur-xl p-10 md:p-16 rounded-[2rem] border-2 border-[#A08E7B]/50 shadow-[0_0_40px_rgba(160,142,123,0.15)] relative group hover:border-[#A08E7B] hover:shadow-[0_0_60px_rgba(160,142,123,0.3)] hover:-translate-y-2 transition-all duration-[800ms] ease-premium z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A08E7B]/10 to-transparent opacity-50 group-hover:opacity-100 transition duration-1000 ease-premium pointer-events-none -z-10"></div>
                  
                  <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative group/input">
                              <input type="text" id="name" placeholder=" " className="peer w-full bg-black/40 border border-[#A08E7B]/30 rounded-lg px-6 pt-6 pb-2 text-white focus:outline-none focus:border-[#A08E7B] focus:shadow-[0_0_15px_rgba(160,142,123,0.3)] focus:bg-black/60 hover:border-[#A08E7B]/60 transition-all duration-300" />
                              <label htmlFor="name" className="absolute left-6 top-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#A08E7B] pointer-events-none">YOUR NAME</label>
                          </div>
                          <div className="relative group/input">
                              <input type="email" id="email" placeholder=" " className="peer w-full bg-black/40 border border-[#A08E7B]/30 rounded-lg px-6 pt-6 pb-2 text-white focus:outline-none focus:border-[#A08E7B] focus:shadow-[0_0_15px_rgba(160,142,123,0.3)] focus:bg-black/60 hover:border-[#A08E7B]/60 transition-all duration-300" />
                              <label htmlFor="email" className="absolute left-6 top-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#A08E7B] pointer-events-none">YOUR EMAIL</label>
                          </div>
                      </div>
                      
                      <div className="relative group/input">
                          <input type="text" id="brand" placeholder=" " className="peer w-full bg-black/40 border border-[#A08E7B]/30 rounded-lg px-6 pt-6 pb-2 text-white focus:outline-none focus:border-[#A08E7B] focus:shadow-[0_0_15px_rgba(160,142,123,0.3)] focus:bg-black/60 hover:border-[#A08E7B]/60 transition-all duration-300" />
                          <label htmlFor="brand" className="absolute left-6 top-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#A08E7B] pointer-events-none">BRAND / COMPANY</label>
                      </div>

                      <div className="relative group/input">
                          <select id="ad_spend" required defaultValue="" className="peer w-full bg-black/40 border border-[#A08E7B]/30 rounded-lg px-6 pt-6 pb-2 text-white focus:outline-none focus:border-[#A08E7B] focus:shadow-[0_0_15px_rgba(160,142,123,0.3)] focus:bg-black/60 hover:border-[#A08E7B]/60 transition-all duration-300 appearance-none cursor-pointer">
                              <option value="" disabled hidden></option>
                              <option value="under-10k" className="bg-[#1c1917]">UNDER $10K</option>
                              <option value="10k-50k" className="bg-[#1c1917]">$10K - $50K</option>
                              <option value="50k-plus" className="bg-[#1c1917]">$50K+</option>
                          </select>
                          <label htmlFor="ad_spend" className="absolute left-6 top-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase transition-all duration-300 peer-valid:top-2 peer-valid:text-[10px] peer-invalid:top-4 peer-invalid:text-xs peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#A08E7B] pointer-events-none">MONTHLY AD SPEND</label>
                      </div>

                      <div className="relative group/input">
                          <textarea id="message" placeholder=" " rows={4} className="peer w-full bg-black/40 border border-[#A08E7B]/30 rounded-lg px-6 pt-6 pb-4 text-white focus:outline-none focus:border-[#A08E7B] focus:shadow-[0_0_15px_rgba(160,142,123,0.3)] focus:bg-black/60 hover:border-[#A08E7B]/60 transition-all duration-300 resize-none"></textarea>
                          <label htmlFor="message" className="absolute left-6 top-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#A08E7B] pointer-events-none">MESSAGE</label>
                      </div>

                      <div className="flex items-center gap-3 text-stone-500 text-xs ml-2">
                        <ShieldCheck size={14} className="text-[#A08E7B]" />
                        <Editable id="contact-privacy-note" tag="span" defaultContent="Your data is safe with us. We never share your information." />
                      </div>

                      <button className="btn-standard w-full !bg-gradient-to-r from-[#A08E7B] to-[#8A7A6A] hover:!from-white hover:!to-stone-200 mt-4">
                          <div className="btn-standard-overlay"></div>
                          <span className="btn-standard-text group-hover:!text-[#1c1917]">
                              <Editable id="form-btn-submit" tag="span" defaultContent="SEND REQUEST" /> 
                              <ArrowRight size={20} className="btn-standard-arrow" />
                          </span>
                      </button>
                  </form>
              </div>

          </div>
      </div>
    </section>
  );
};

export default Contact;
