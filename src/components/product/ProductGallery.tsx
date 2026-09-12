import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="glass-card mb-3 flex aspect-square items-center justify-center overflow-hidden">
        {hasImages ? (
          <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-ink-subtle">
            <ImageOff className="h-10 w-10" />
            <span className="text-sm">تصویری موجود نیست</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                active === i ? 'border-brand-400' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
