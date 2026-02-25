function LanguageRing({ language, percentage, color }) {
  const size = 64
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="lang-ring-item">
      <svg className="lang-ring-svg" width={size} height={size}>
        <circle className="lang-ring-bg" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="lang-ring-fill"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x="50%" y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '0.7rem', fontWeight: 700, fill: color,
            transform: 'rotate(90deg)', transformOrigin: 'center',
          }}
        >
          {percentage}%
        </text>
      </svg>
      <span className="lang-ring-label">{language}</span>
    </div>
  )
}

export default function TopLanguages({ langData }) {
  return (
    <div className="bento-4 card card-padded">
      <h2 className="section-title" style={{ marginBottom: '4px' }}>Top Languages</h2>
      <p className="section-subtitle" style={{ marginBottom: '8px' }}>By repository count</p>
      <div className="lang-ring-list">
        {langData.map((lang) => (
          <LanguageRing
            key={lang.language}
            language={lang.language}
            percentage={lang.pct}
            color={lang.color}
          />
        ))}
      </div>
    </div>
  )
}
