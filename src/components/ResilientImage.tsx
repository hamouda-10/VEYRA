import { useState, type ImgHTMLAttributes } from 'react'
import { Car } from 'lucide-react'

interface ResilientImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string
}

export default function ResilientImage({
  src,
  alt = '',
  className = '',
  fallbackTitle,
  ...rest
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#12161f] text-[#a6a095] p-6 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'صورة السيارة'}
      >
        <Car size={32} strokeWidth={1.3} className="text-[#d4af70] mb-2 opacity-80" />
        <span className="font-ruqaa text-lg text-[#f5f2eb]">{fallbackTitle || alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
