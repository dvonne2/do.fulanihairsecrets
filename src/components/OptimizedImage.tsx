import React from 'react';

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
 };

 const toWebpSrc = (src: string) => {
   return src.replace(/\.(png|jpe?g)$/i, '.webp');
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
 }: Props) {
   const isWebp = /\.webp(\?.*)?$/i.test(src);

   if (isWebp) {
     return (
       <img
         src={src}
         alt={alt}
         width={width}
         height={height}
         className={className}
         style={style}
         loading={loading}
         decoding={decoding}
         {...(fetchPriority ? { fetchPriority } : {})}
       />
     );
   }

   const webpSrc = toWebpSrc(src);

   return (
     <picture>
       <source srcSet={webpSrc} type="image/webp" />
       <img
         src={src}
         alt={alt}
         width={width}
         height={height}
         className={className}
         style={style}
         loading={loading}
         decoding={decoding}
         {...(fetchPriority ? { fetchPriority } : {})}
       />
     </picture>
   );
 }
