export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2L2 26H10L16 15.5L22 26H30L16 2Z" fill="url(#paint0_linear)" />
    <path d="M16 22C17.6569 22 19 20.6569 19 19C19 17.3431 17.6569 16 16 16C14.3431 16 13 17.3431 13 19C13 20.6569 14.3431 22 16 22Z" fill="white" />
    <defs>
      <linearGradient id="paint0_linear" x1="16" y1="2" x2="16" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#D946EF" />
      </linearGradient>
    </defs>
  </svg>
);
