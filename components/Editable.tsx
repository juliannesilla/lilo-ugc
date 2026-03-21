import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Move } from 'lucide-react';

interface EditableProps {
  id: string;
  tag?: string;
  className?: string;
  defaultContent?: string;
  placeholder?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Editable: React.FC<EditableProps> = ({ 
  id, 
  tag = 'div', 
  className = '', 
  defaultContent, 
  children,
  placeholder,
  style
}) => {
  const { isAdmin } = useAdmin();
  const [content, setContent] = useState<string>(defaultContent || (typeof children === 'string' ? children : ''));
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Load saved state on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`edit_${id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.content) setContent(parsed.content);
        if (parsed.styles) setStyles(parsed.styles);
        if (parsed.position) setPosition(parsed.position);
      } catch (e) {
        console.error("Failed to load editable content", e);
      }
    } else if (defaultContent) {
      setContent(defaultContent);
    }
  }, [id, defaultContent]);

  // Drag Event Handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault(); // Prevent text selection
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    if (!isDragging) return;

    // We need to track the position in a local variable for the cleanup save to work reliably without re-binding the listener constantly
    let currentX = position.x;
    let currentY = position.y;

    const moveHandler = (e: MouseEvent) => {
         currentX = e.clientX - dragStart.current.x;
         currentY = e.clientY - dragStart.current.y;
         setPosition({ x: currentX, y: currentY });
    }
    const upHandler = () => {
        setIsDragging(false);
        saveState(content, styles, { x: currentX, y: currentY });
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
    }

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
  }, [isDragging]); // Re-binds when dragging starts

  // Text & Resize Handlers
  const handleBlur = (e: React.FormEvent<HTMLElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    saveState(newContent, styles, position);
  };

  const handleResize = () => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.style;
      // We only want to save explicit styles
      const newStyles = { ...styles, width, height };
      setStyles(newStyles);
      saveState(content, newStyles, position);
    }
  };

  const saveState = (c: string, s: React.CSSProperties, p: {x: number, y: number}) => {
    localStorage.setItem(`edit_${id}`, JSON.stringify({ content: c, styles: s, position: p }));
  };

  const Tag = tag as any;

  // Base Content (if children provided and not string, we render children, else we use state)
  const isComplexChildren = React.Children.count(children) > 0 && typeof children !== 'string';

  if (isAdmin) {
    const adminClasses = `
      relative transition-all duration-200 min-w-[20px] min-h-[20px]
      after:content-['Edit'] after:absolute after:top-0 after:right-0 
      after:bg-[#A08E7B] after:text-white after:p-1 after:text-[8px] 
      after:uppercase after:tracking-widest after:font-bold after:z-50
      after:opacity-0 hover:after:opacity-100 after:pointer-events-none after:transition-opacity
    `;

    // Move Handle Style
    const moveHandle = (
      <span 
        onMouseDown={handleDragStart}
        className="absolute -top-3 -left-3 bg-[#A08E7B] text-white p-1 rounded-full cursor-move z-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center"
        title="Drag to move"
      >
        <Move size={10} />
      </span>
    );

    const commonProps = {
      ref: elementRef,
      contentEditable: !isComplexChildren,
      suppressContentEditableWarning: true,
      onBlur: handleBlur,
      onMouseUp: handleResize,
      className: `${className} ${adminClasses} group`,
      style: {
        ...style,
        ...styles,
        transform: (position.x || position.y) ? `translate(${position.x}px, ${position.y}px)` : undefined,
        transition: isDragging ? 'none' : undefined,
        outline: isDragging ? '2px solid #A08E7B' : '2px dashed #A08E7B',
        outlineOffset: '4px',
        cursor: isComplexChildren ? 'default' : 'text',
        resize: 'both',
        overflow: 'auto',
        display: styles.display || 'inline-block', // Ensure resize works
      }
    };

    if (!isComplexChildren) {
      const WrapperTag = ['span', 'a', 'strong', 'em', 'i', 'b'].includes(tag) ? 'span' : 'div';
      return (
        <WrapperTag style={{ display: 'inline-block', position: 'relative' }}> {/* Wrapper for absolute handles */}
            {moveHandle}
            <Tag {...commonProps} dangerouslySetInnerHTML={{ __html: content }} />
        </WrapperTag>
      );
    } else {
      return (
        <Tag {...commonProps} style={{...commonProps.style, position: 'relative'}}>
          {moveHandle}
          {children}
        </Tag>
      );
    }
  }

  // View Mode
  const viewStyles = {
      ...style,
      ...styles,
      transform: position.x || position.y ? `translate(${position.x}px, ${position.y}px)` : undefined,
      position: (position.x || position.y) ? 'relative' : undefined // Ensure transform applies correctly contextually
  } as React.CSSProperties;

  if (isComplexChildren) {
    return <Tag className={className} style={viewStyles}>{children}</Tag>;
  }

  return (
    <Tag 
      className={className} 
      style={viewStyles}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};