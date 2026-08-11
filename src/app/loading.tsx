'use client';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-colors"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="relative flex flex-col items-center justify-center space-y-4 max-w-sm w-full text-center">
        {/* Video Animation Player — Clean transparent float without container card/border */}
        <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Loading Indicator Text */}
        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Mortgage<span className="text-emerald-500">Calculator</span> Pro
          </h3>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Calculating loan analytics &amp; real-time rates…
          </p>
        </div>
      </div>
    </div>
  );
}
