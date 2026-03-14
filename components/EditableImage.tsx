import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Image as ImageIcon, Video, Upload, Link, Move, Maximize, Minimize, ArrowUp, ArrowDown, AlignCenter, AlertCircle, Loader2, Check, Save } from 'lucide-react';

// --- IndexedDB Utilities ---
const DB_NAME = 'JulzLiloPortfolioDB';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 5; // Incremented for new persistence engine

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
        reject('IndexedDB not supported');
        return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
};

const saveBlobToDB = async (blob: Blob, slotId: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(blob, slotId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
};

const getBlobFromDB = async (slotId: string): Promise<Blob | null> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(slotId);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        return null;
    }
};

// Process Image (Resize & Compress)
const processImageFile = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            reject(new Error("HEIC files are not supported. Please use JPG or PNG."));
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const MAX_EDGE = 2400; // Professional high-res limit
            
            if (width > height && width > MAX_EDGE) {
                height *= MAX_EDGE / width;
                width = MAX_EDGE;
            } else if (height > MAX_EDGE) {
                width *= MAX_EDGE / height;
                height = MAX_EDGE;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error("Canvas failure")); return; }
            
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Compression failure"));
            }, 'image/jpeg', 0.92);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Image processing failure"));
        };
        img.src = url;
    });
};

interface EditableImageProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
  onUpdate?: (newSrc: string) => void;
  onBatchUpload?: (urls: string[]) => void;
  defaultObjectFit?: 'cover' | 'contain';
  defaultObjectPosition?: 'center' | 'top' | 'bottom';
  forceCover?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({ 
  id, 
  src: defaultSrc, 
  alt, 
  className = '', 
  onUpdate,
  onBatchUpload,
  defaultObjectFit = 'cover',
  defaultObjectPosition = 'center',
  forceCover = false
}) => {
  const { isAdmin } = useAdmin();
  const [currentSrc, setCurrentSrc] = useState(defaultSrc);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>(defaultObjectFit);
  const [objectPosition, setObjectPosition] = useState<'center' | 'top' | 'bottom'>(defaultObjectPosition);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const isInitialLoad = useRef(true);

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Persistence Key Helpers
  const keys = {
    map: `media_v5_${id}`,
    style: `style_${id}`,
    pos: `pos_${id}`,
    fit: `fit_${id}`,
    objpos: `objpos_${id}`
  };

  // Sync state with reliable IndexedDB storage on mount
  useEffect(() => {
    let isMounted = true;
    const initMedia = async () => {
        try {
            const sStyles = localStorage.getItem(keys.style);
            const sPos = localStorage.getItem(keys.pos);
            const sFit = localStorage.getItem(keys.fit);
            const sObjPos = localStorage.getItem(keys.objpos);
            
            if (sStyles) setStyles(JSON.parse(sStyles));
            if (sPos) setPosition(JSON.parse(sPos));
            if (sFit) setObjectFit(sFit as 'cover' | 'contain');
            if (sObjPos) setObjectPosition(sObjPos as 'center' | 'top' | 'bottom');

            // Load Atomic Mapping
            const mappingType = localStorage.getItem(keys.map);
            if (mappingType === 'external') {
                const externalUrl = localStorage.getItem(`${keys.map}_url`);
                if (externalUrl && isMounted) setCurrentSrc(externalUrl);
            } else if (mappingType === 'idb') {
                const blob = await getBlobFromDB(id);
                if (blob && isMounted) {
                    const url = URL.createObjectURL(blob);
                    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
                    blobUrlRef.current = url;
                    setCurrentSrc(url);
                    onUpdate?.(url);
                } else if (isMounted) {
                    setCurrentSrc(defaultSrc);
                }
            } else if (isMounted) {
                setCurrentSrc(defaultSrc);
            }
        } catch (e) {
            console.error("Media restoration failed", e);
        } finally {
            isInitialLoad.current = false;
        }
    };
    initMedia();
    return () => { isMounted = false; };
  }, [id, defaultSrc]);

  // Reactive update for parent-controlled source changes
  useEffect(() => {
    if (isInitialLoad.current) return;
    const mappingType = localStorage.getItem(keys.map);
    if (!mappingType) {
        setCurrentSrc(defaultSrc);
    }
  }, [defaultSrc]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessing(true);
    setSaveStatus('saving');
    setError(false);

    try {
        // Process sequentially or in parallel
        const processedBlobs = await Promise.all(files.map(async (file: File) => {
            const isVideo = file.type.startsWith('video/');
            return isVideo ? file : await processImageFile(file);
        }));
        
        // Generate URLs for all blobs
        const previewUrls = processedBlobs.map(blob => URL.createObjectURL(blob));
        
        // For the current component, we just take the first one
        const processedBlob = processedBlobs[0];
        const previewUrl = previewUrls[0];
        
        // Instant Preview
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = previewUrl;
        setCurrentSrc(previewUrl);
        
        // Permanent Persistence
        await saveBlobToDB(processedBlob, id);
        localStorage.setItem(keys.map, 'idb');
        
        onUpdate?.(previewUrl);
        
        // If batch upload handler is provided, pass all URLs
        if (onBatchUpload && previewUrls.length > 1) {
            onBatchUpload(previewUrls);
        }
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err: any) {
        console.error("Critical upload failure", err);
        setSaveStatus('error');
        setError(true);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.prompt("Enter external media URL:", currentSrc);
    if (url) {
        setCurrentSrc(url);
        localStorage.setItem(keys.map, 'external');
        localStorage.setItem(`${keys.map}_url`, url);
        onUpdate?.(url);
    }
  };

  const handleResize = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.style;
      const newStyles = { ...styles, width, height };
      setStyles(newStyles);
      localStorage.setItem(keys.style, JSON.stringify(newStyles));
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const moveHandler = (e: MouseEvent) => {
         const nx = e.clientX - dragStart.current.x;
         const ny = e.clientY - dragStart.current.y;
         setPosition({ x: nx, y: ny });
    }
    const upHandler = () => {
        setIsDragging(false);
        localStorage.setItem(keys.pos, JSON.stringify(position));
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
    }
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
  }, [isDragging, position, keys.pos]);

  const RenderMedia = ({ customClass }: { customClass: string }) => {
      const style = { 
          objectFit: forceCover ? 'cover' : objectFit,
          objectPosition: objectPosition === 'top' ? 'top center' : objectPosition === 'bottom' ? 'bottom center' : 'center center'
      } as React.CSSProperties;

      if (error) {
          return (
            <div className={`w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 text-center ${customClass}`}>
                <AlertCircle size={32} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Persistence Slot Failed</span>
            </div>
          );
      }

      const isVid = currentSrc?.match(/\.(mp4|webm|ogg|mov|blob)$/i) || currentSrc?.startsWith('blob:video') || (currentSrc?.startsWith('blob:') && !currentSrc?.includes('image'));
      
      if (isVid) {
          return (
            <video 
                key={currentSrc}
                src={currentSrc} 
                className={`${customClass} bg-black`} 
                style={style}
                autoPlay loop muted playsInline 
                onError={() => setError(true)}
            />
          );
      }
      return (
        <img 
            key={currentSrc}
            src={currentSrc} 
            alt={alt} 
            className={customClass} 
            style={style} 
            onError={() => setError(true)}
        />
      );
  };

  if (isAdmin) {
    return (
      <div 
        ref={containerRef}
        className={`${className} group relative bg-stone-100 overflow-hidden`} 
        style={{ 
          ...styles, 
          transform: `translate(${position.x}px, ${position.y}px)`,
          outline: isDragging ? '3px solid #A08E7B' : '3px dashed #A08E7B', 
          outlineOffset: '-3px', 
          resize: 'both', 
          display: 'block' 
        }}
        onMouseUp={handleResize}
      >
        <div className="w-full h-full pointer-events-none" style={{ opacity: isProcessing ? 0.3 : 1 }}>
            <RenderMedia customClass="w-full h-full" />
        </div>
        
        {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-50 backdrop-blur-sm">
                <Loader2 className="animate-spin text-white mb-2" size={32} />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Processing Media...</span>
            </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-2 z-50">
            {saveStatus === 'saved' && (
                <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-lg animate-in fade-in zoom-in duration-300">
                    <Check size={12} /> <span className="text-[10px] font-bold uppercase">Stored</span>
                </div>
            )}
        </div>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-40 p-2 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
                <button onClick={() => fileInputRef.current?.click()} className="bg-[#A08E7B] text-white px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition">
                    <Upload size={12} /> Replace
                </button>
                <button onClick={handleLinkClick} className="bg-stone-800 text-white px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition">
                    <Link size={12} /> URL
                </button>
            </div>

            <div className="flex gap-1 bg-black/60 p-1 rounded-lg backdrop-blur-sm pointer-events-auto">
                {!forceCover && (
                <>
                    <button onClick={() => { 
                        const nextFit = objectFit === 'cover' ? 'contain' : 'cover';
                        setObjectFit(nextFit);
                        localStorage.setItem(keys.fit, nextFit);
                    }} className="p-1.5 text-white hover:text-[#A08E7B] transition">
                        {objectFit === 'cover' ? <Minimize size={14} /> : <Maximize size={14} />}
                    </button>
                    <div className="w-px bg-white/20 mx-1"></div>
                </>
                )}
                <button onClick={() => { setObjectPosition('top'); localStorage.setItem(keys.objpos, 'top'); }} className={`p-1.5 transition ${objectPosition === 'top' ? 'text-[#A08E7B]' : 'text-white hover:text-[#A08E7B]'}`}><ArrowUp size={14} /></button>
                <button onClick={() => { setObjectPosition('center'); localStorage.setItem(keys.objpos, 'center'); }} className={`p-1.5 transition ${objectPosition === 'center' ? 'text-[#A08E7B]' : 'text-white hover:text-[#A08E7B]'}`}><AlignCenter size={14} /></button>
                <button onClick={() => { setObjectPosition('bottom'); localStorage.setItem(keys.objpos, 'bottom'); }} className={`p-1.5 transition ${objectPosition === 'bottom' ? 'text-[#A08E7B]' : 'text-white hover:text-[#A08E7B]'}`}><ArrowDown size={14} /></button>
            </div>

            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        <div 
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
                dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            }} 
            className="absolute top-2 left-2 bg-[#A08E7B] text-white p-2 rounded-full cursor-move z-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-auto hover:scale-110 active:scale-95"
        >
            <Move size={14} />
        </div>
      </div>
    );
  }

  return (
      <div className={`${className} bg-stone-100 overflow-hidden`} style={{ ...styles, transform: (position.x || position.y) ? `translate(${position.x}px, ${position.y}px)` : undefined, position: (position.x || position.y) ? 'relative' : undefined }}>
        <RenderMedia customClass="w-full h-full" />
      </div>
  );
};