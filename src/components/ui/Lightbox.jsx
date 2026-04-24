import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import './Lightbox.css';

/**
 * Lightbox — fullscreen image viewer for FSO survey media.
 * 
 * Usage:
 *   <Lightbox src={imageUrl} alt="Survey photo" onClose={() => setOpen(false)} />
 */
const Lightbox = ({ src, alt = 'Image', onClose }) => {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose} aria-label="Close">
                <X size={24} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} className="lightbox-image" />
                {alt && <p className="lightbox-caption">{alt}</p>}
            </div>
        </div>
    );
};

/**
 * LightboxTrigger — wraps an image thumbnail and opens Lightbox on click.
 */
export const LightboxTrigger = ({ src, alt }) => {
    const [open, setOpen] = React.useState(false);
    if (!src) return <span className="no-image">No image</span>;
    return (
        <>
            <button className="lightbox-trigger" onClick={() => setOpen(true)}>
                <img src={src} alt={alt} className="lightbox-thumb" />
                <span className="lightbox-zoom"><ZoomIn size={14} /></span>
            </button>
            {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
        </>
    );
};

export default Lightbox;
