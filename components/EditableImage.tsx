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
  lazyLoad?: boolean;
  controlsPosition?: 'center' | 'top';
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
  forceCover = false,
  lazyLoad = false,
  controlsPosition = 'center'
}) => {
  const { isAdmin } = useAdmin();
  const [currentSrc, setCurrentSrc] = useState(defaultSrc);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'saving' | 'success' | 'error'>('idle');
  const [isPersisted, setIsPersisted] = useState(false);
  
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
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

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
                if (externalUrl && isMounted) {
                    setCurrentSrc(externalUrl);
                    setIsPersisted(false);
                }
            } else if (mappingType === 'idb') {
                const blob = await getBlobFromDB(id);
                if (blob && isMounted) {
                    const isVideo = blob.type.startsWith('video/');
                    const url = URL.createObjectURL(blob) + (isVideo ? '#video' : '#image');
                    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current.split('#')[0]);
                    blobUrlRef.current = url;
                    setCurrentSrc(url);
                    setIsPersisted(true);
                    onUpdate?.(url);
                } else if (isMounted) {
                    setCurrentSrc(defaultSrc);
                    setIsPersisted(false);
                }
            } else if (isMounted) {
                setCurrentSrc(defaultSrc);
                setIsPersisted(false);
            }
        } catch (e) {
            console.error("Media restoration failed", e);
        } finally {
            isInitialLoad.current = false;
        }
    };
    initMedia();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Reactive update for parent-controlled source changes
  useEffect(() => {
    if (isInitialLoad.current) return;
    const mappingType = localStorage.getItem(`media_v5_${id}`);
    if (!mappingType) {
        setCurrentSrc(defaultSrc);
    }
  }, [defaultSrc, id]);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFiles = async (files: File[]) => {
    if (!files.length) return;

    setUploadState('uploading');
    setError(false);

    try {
        // Small delay to show uploading state smoothly
        await new Promise(resolve => setTimeout(resolve, 400));
        setUploadState('processing');

        // Process sequentially or in parallel
        const processedBlobs = await Promise.all(files.map(async (file: File) => {
            const isVideo = file.type.startsWith('video/');
            const blob = isVideo ? file : await processImageFile(file);
            return { blob, isVideo };
        }));
        
        // Generate URLs for all blobs
        const previewUrls = processedBlobs.map(({blob, isVideo}) => URL.createObjectURL(blob) + (isVideo ? '#video' : '#image'));
        
        // For the current component, we just take the first one
        const processedBlob = processedBlobs[0].blob;
        const previewUrl = previewUrls[0];
        
        // Instant Preview
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current.split('#')[0]);
        blobUrlRef.current = previewUrl;
        setCurrentSrc(previewUrl);
        
        setUploadState('saving');
        
        // Permanent Persistence
        await saveBlobToDB(processedBlob, id);
        localStorage.setItem(keys.map, 'idb');
        setIsPersisted(true);
        
        onUpdate?.(previewUrl);
        
        // If batch upload handler is provided, pass all URLs
        if (onBatchUpload && previewUrls.length > 1) {
            onBatchUpload(previewUrls);
        }
        
        setUploadState('success');
        setTimeout(() => setUploadState('idle'), 2500);
    } catch (err: any) {
        console.error("Critical upload failure", err);
        setUploadState('error');
        setError(true);
        setTimeout(() => setUploadState('idle'), 3500);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    await processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    const validFiles = files.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    await processFiles(validFiles);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.prompt("Enter external media URL:", currentSrc);
    if (url) {
        setCurrentSrc(url);
        localStorage.setItem(keys.map, 'external');
        localStorage.setItem(`${keys.map}_url`, url);
        setIsPersisted(false);
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
         positionRef.current = { x: nx, y: ny };
    }
    const upHandler = () => {
        setIsDragging(false);
        localStorage.setItem(keys.pos, JSON.stringify(positionRef.current));
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
    }
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
  }, [isDragging, keys.pos]);

  const mediaStyle = { 
      objectFit: forceCover ? 'cover' : objectFit,
      objectPosition: objectPosition === 'top' ? 'top center' : objectPosition === 'bottom' ? 'bottom center' : 'center center'
  } as React.CSSProperties;

  const renderMediaContent = (customClass: string) => {
      if (error) {
          return (
            <div className={`w-full h-full bg-stone-200 flex flex-col items-center justify-center text-stone-500 p-6 text-center ${customClass}`}>
                <AlertCircle size={40} className="mb-3 text-red-400" />
                <span className="text-sm font-bold uppercase tracking-widest leading-tight text-stone-800 mb-2">Upload Failed</span>
                <p className="text-xs max-w-[200px] leading-relaxed">We couldn't save your media. Please check your connection and try dropping the file again.</p>
            </div>
          );
      }

      const isVid = currentSrc?.match(/\.(mp4|webm|ogg|mov)(\?.*)?(#.*)?$/i) || currentSrc?.endsWith('#video');
      
      if (isVid) {
          return (
            <video 
                ref={videoRef}
                key={currentSrc}
                src={currentSrc} 
                className={`${customClass} bg-black`} 
                style={mediaStyle}
                loop muted playsInline controls
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
            style={mediaStyle} 
            loading={lazyLoad ? 'lazy' : undefined}
            onError={() => setError(true)}
        />
      );
  };

  if (isAdmin) {
    return (
      <div 
        ref={containerRef}
        className={`${className} group relative bg-stone-100 overflow-hidden ${isDraggingOver ? 'ring-4 ring-[#A08E7B] ring-inset' : ''}`} 
        style={{ 
          ...styles, 
          transform: (position.x || position.y) ? `translate(${position.x}px, ${position.y}px)` : undefined,
          transition: isDragging ? 'none' : undefined,
          outline: isDragging ? '3px solid #A08E7B' : '3px dashed #A08E7B', 
          outlineOffset: '-3px', 
          resize: 'both'
        }}
        onMouseUp={handleResize}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`w-full h-full pointer-events-none transition-all duration-700 ease-in-out ${uploadState !== 'idle' && uploadState !== 'success' && uploadState !== 'error' ? 'opacity-40 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'}`}>
            {renderMediaContent("w-full h-full")}
        </div>

        {isDraggingOver && (
          <div className="absolute inset-0 bg-[#A08E7B]/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <Upload size={20} className="text-[#A08E7B] animate-bounce" />
              <span className="text-[#1c1917] font-bold tracking-widest uppercase text-sm">Drop to replace</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex items-center gap-2 z-50">
            <div className={`transition-all duration-500 ease-in-out overflow-hidden rounded-md shadow-lg flex items-center ${
                uploadState === 'idle' && isPersisted ? 'bg-stone-800/60 backdrop-blur-md text-white/90 border border-white/10 opacity-100' :
                uploadState === 'idle' && !isPersisted ? 'opacity-0 scale-95 pointer-events-none' :
                uploadState === 'success' ? 'bg-emerald-500/90 backdrop-blur-md text-white border border-emerald-400/50 opacity-100 scale-100' :
                uploadState === 'error' ? 'bg-red-500/90 backdrop-blur-md text-white border border-red-400/50 opacity-100 scale-100' :
                'bg-blue-500/90 backdrop-blur-md text-white border border-blue-400/50 opacity-100 scale-100'
            }`}>
                <div className="px-3 py-1.5 flex items-center gap-2">
                    {uploadState === 'uploading' && <Upload size={12} className="animate-bounce" />}
                    {uploadState === 'processing' && <Loader2 size={12} className="animate-spin" />}
                    {uploadState === 'saving' && <Save size={12} className="animate-pulse" />}
                    {uploadState === 'success' && <Check size={12} />}
                    {uploadState === 'error' && <AlertCircle size={12} />}
                    {uploadState === 'idle' && isPersisted && <Save size={10} />}
                    
                    <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {uploadState === 'uploading' && 'Uploading...'}
                        {uploadState === 'processing' && 'Processing...'}
                        {uploadState === 'saving' && 'Saving...'}
                        {uploadState === 'success' && 'Stored in DB'}
                        {uploadState === 'error' && 'Error'}
                        {uploadState === 'idle' && isPersisted && 'In DB'}
                    </span>
                </div>
            </div>
        </div>

        <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center ${controlsPosition === 'top' ? 'justify-start pt-32' : 'justify-center'} gap-2 z-40 p-2 pointer-events-none`}>
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
        {renderMediaContent("w-full h-full")}
      </div>
  );
};