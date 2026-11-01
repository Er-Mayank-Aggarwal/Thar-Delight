export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-brand-cream"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-gold animate-spin"
            aria-hidden="true"
          />
        </div>

        {/* Shimmer text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-brand-brown/60 font-serif text-lg">Loading…</p>
          <div className="w-48 h-1 rounded-full overflow-hidden bg-brand-cream">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent bg-[length:200%_100%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
