import React from 'react';
import { CopyRatingItem } from '../types';
import { X } from 'lucide-react';
import { Editable } from './Editable';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ratings: CopyRatingItem[] = [
  {
    section: "Hero / Hook",
    rating: 9,
    reason: "Strong value prop, immediately identifies niche (Pet UGC) and outcome (Sales).",
    improvement: "Changed 'I am a marketer' to 'UGC That Stops The Scroll' for faster impact."
  },
  {
    section: "About (Julz + Lilo)",
    rating: 10,
    reason: "Value prop is now instant. Distinct separation of Strategist vs Talent roles strengthens authority.",
    improvement: "Refined typography hierarchy and split bio into clear, punchy roles."
  },
  {
    section: "Niches & Deliverables",
    rating: 8,
    reason: "Clean grid layout is easy to scan.",
    improvement: "Grouped into 'Video' and 'Photo' clearly instead of a mixed list."
  },
  {
    section: "AI Labs (New)",
    rating: 10,
    reason: "Innovative differentiator. Shows future-forward thinking unlike standard portfolios.",
    improvement: "Added interactive demos for clients to 'play' with the creative process."
  },
  {
    section: "CTA / Contact",
    rating: 9,
    reason: "Direct and low-friction.",
    improvement: "Changed generic 'Contact' to 'Book Your Campaign' for action-orientation."
  }
];

const CopyRatingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f5f2eb] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-[#A08E7B]">
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <Editable id="modal-title" tag="h2" className="text-3xl font-serif font-black text-stone-900 mb-2 uppercase tracking-widest">Copy Audit Report</Editable>
              <Editable id="modal-sub" tag="p" className="text-stone-600">A transparent breakdown of the portfolio's conversion strength.</Editable>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition">
              <X className="w-6 h-6 text-stone-600" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#A08E7B] text-stone-900 font-serif font-bold text-lg uppercase tracking-wider">
                  <th className="py-4 pr-4"><Editable id="tbl-hdr-sec" tag="span">Page / Section</Editable></th>
                  <th className="py-4 px-4 text-center"><Editable id="tbl-hdr-score" tag="span">Score</Editable></th>
                  <th className="py-4 px-4"><Editable id="tbl-hdr-why" tag="span">Why it scored that</Editable></th>
                  <th className="py-4 pl-4"><Editable id="tbl-hdr-imp" tag="span">What was improved</Editable></th>
                </tr>
              </thead>
              <tbody className="font-sans text-stone-700 text-sm">
                {ratings.map((item, idx) => (
                  <tr key={idx} className="border-b border-stone-300 hover:bg-stone-100/50 transition">
                    <td className="py-4 pr-4 font-bold"><Editable id={`rate-sec-${idx}`} tag="span">{item.section}</Editable></td>
                    <td className="py-4 px-4 text-center font-black text-[#A08E7B] text-xl font-serif tracking-widest"><Editable id={`rate-score-${idx}`} tag="span">{item.rating}/10</Editable></td>
                    <td className="py-4 px-4"><Editable id={`rate-reason-${idx}`} tag="span">{item.reason}</Editable></td>
                    <td className="py-4 pl-4 text-stone-500 italic"><Editable id={`rate-imp-${idx}`} tag="span">{item.improvement}</Editable></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-[#A08E7B]/10 rounded-lg text-center">
            <Editable id="modal-quote" tag="p" className="font-serif italic text-stone-800 text-lg tracking-wider font-bold">
              "This portfolio is optimized for speed, clarity, and authority. No fluff, just results."
            </Editable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyRatingModal;