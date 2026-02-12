import React, { useState, useRef, useEffect } from 'react';

type Props = {
   src: string;
   alt: string;
   width: number;
   height: number;
   className?: string;
   style?: React.CSSProperties;
   loading?: 'eager' | 'lazy';
   decoding?: 'async' | 'sync' | 'auto';
   fetchPriority?: 'high' | 'low' | 'auto';
   blurDataURL?: string;
};

const toWebpSrc = (src: string) => {
   return src.replace(/\.(png|jpe?g)$/i, '.webp');
};

const generateBlurDataURL = (width: number, height: number) => {
   // Generate a low-quality blur placeholder
   const canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;
   const ctx = canvas.getContext('2d');
   if (ctx) {
     ctx.fillStyle = '#f3f4f6';
     ctx.fillRect(0, 0, width, height);
   }
   return canvas.toDataURL('image/jpeg', 0.1);
};

export function OptimizedImage({
   src,
   alt,
   width,
   height,
   className,
   style,
   loading = 'lazy',
   decoding = 'async',
   fetchPriority,
   blurDataURL,
}: Props) {
   const [isLoaded, setIsLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);
   const imgRef = useRef<HTMLImageElement>(null);

   const isWebp = /\.webp(\?.*)?$/i.test(src);
   const webpSrc = isWebp ? src : toWebpSrc(src);
   const blurData = blurDataURL || generateBlurDataURL(width, height);

   useEffect(() => {
     const img = imgRef.current;
     if (!img) return;

     const handleLoad = () => setIsLoaded(true);
     const handleError = () => setHasError(true);

     img.addEventListener('load', handleLoad);
     img.addEventListener('error', handleError);

     // If image is already cached and loaded
     if (img.complete) {
       setIsLoaded(true);
     }

     return () => {
       img.removeEventListener('load', handleLoad);
       img.removeEventListener('error', handleError);
     };
   }, []);

   if (hasError) {
     return (
       <div 
         className={`bg-gray-200 flex items-center justify-center ${className}`}
         style={{ width, height, ...style }}
       >
         <span className="text-gray-400 text-sm">Image not available</span>
       </div>
     );
   }

   return (
     <div className={`relative ${className || ''}`} style={style}>
       {/* Blur placeholder */}
       {!isLoaded && (
         <div 
           className="absolute inset-0 blur-sm scale-110 transition-opacity duration-300"
           style={{
             backgroundImage: `url(${blurData})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}
         />
       )}
       
       {isWebp ? (
         <img
           ref={imgRef}
           src={src}
           alt={alt}
           width={width}
           height={height}
           className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
           loading={loading || 'lazy'}
           decoding={decoding}
           {...(fetchPriority ? ({ fetchpriority: fetchPriority } as any) : {})}
         />
       ) : (
         <picture>
           <source srcSet={webpSrc} type="image/webp" />
           <img
             ref={imgRef}
             src={src}
             alt={alt}
             width={width}
             height={height}
             className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
             loading={loading || 'lazy'}
             decoding={decoding}
             {...(fetchPriority ? ({ fetchpriority: fetchPriority } as any) : {})}
           />
         </picture>
       )}
     </div>
   );
 }
