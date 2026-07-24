'use client';

export default function BannersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Promotional Banners</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage secondary banners across the store.</p>
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Coming Soon</h3>
        <p className="text-zinc-500 max-w-md mx-auto">This feature is currently under development. You will be able to manage mid-page and footer promotional banners here.</p>
      </div>
    </div>
  );
}
