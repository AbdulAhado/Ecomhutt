export default function Logo({ className = '', style = {}, lightMode = false }) {
  return (
    <svg 
      viewBox="0 0 500 120" 
      className={className} 
      style={{ height: '40px', width: 'auto', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold Shape */}
      <path 
        d="M 20 100 L 20 50 L 70 10 L 125 55" 
        stroke="#C39023" 
        strokeWidth="10" 
        fill="none" 
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <line 
        x1="20" y1="100" x2="145" y2="100" 
        stroke="#C39023" 
        strokeWidth="10" 
      />

      {/* Black/White Shape */}
      <path 
        d="M 45 100 L 45 60 L 80 30 L 145 85" 
        stroke={lightMode ? "#ffffff" : "#111111"} 
        strokeWidth="10" 
        fill="none" 
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <line 
        x1="45" y1="100" x2="110" y2="100" 
        stroke={lightMode ? "#ffffff" : "#111111"} 
        strokeWidth="10" 
      />
      
      {/* Text Elements */}
      <text 
        x="160" y="70" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="800" 
        fontSize="48" 
        fill={lightMode ? "#ffffff" : "#111111"} 
        letterSpacing="2"
      >
        ECOM HUTT
      </text>
      <text 
        x="163" y="100" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="500"
        fontSize="16" 
        fill="#C39023" 
        letterSpacing="4"
      >
        E-COMMERCE STORE
      </text>
    </svg>
  );
}
