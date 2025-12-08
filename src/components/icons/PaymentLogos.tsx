// Wave logo - Official teal wave design
export const WaveLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="#1DC3EB"/>
    <path d="M20 20C22 15 28 15 30 20C32 25 38 25 40 20C42 15 48 15 50 20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <text x="58" y="25" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14">Wave</text>
  </svg>
);

// Orange Money logo - Official orange square design
export const OrangeMoneyLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="#FF6600"/>
    <rect x="8" y="8" width="24" height="24" rx="4" fill="white"/>
    <rect x="12" y="12" width="16" height="16" rx="2" fill="#FF6600"/>
    <text x="40" y="18" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">Orange</text>
    <text x="40" y="30" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">Money</text>
  </svg>
);

// MTN/Moov Money logo - Official yellow design
export const MoovMoneyLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="#0066B3"/>
    <circle cx="24" cy="20" r="12" fill="#FFD500"/>
    <text x="24" y="24" fill="#0066B3" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" textAnchor="middle">M</text>
    <text x="46" y="18" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">Moov</text>
    <text x="46" y="30" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">Money</text>
  </svg>
);
