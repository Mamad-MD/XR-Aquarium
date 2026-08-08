export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 py-8 text-sm text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© {new Date().getFullYear()} XR Lab Aquarium. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">آزمایشگاه واقعیت توسعه‌یافته - فضای آموزشی آکواریوم</p>
        </div>

        <div className="flex gap-">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
