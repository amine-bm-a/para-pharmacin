import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  const buttonStyle = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    padding: '7px 14px',
    border: isDark ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid rgba(13, 60, 38, 0.12)',
    background: isDark ? '#1a1a2e' : '#ffffff',
    cursor: 'pointer',
    color: isDark ? '#ffffff' : '#0d3c26',
    fontSize: '0.72rem',
    fontWeight: 700,
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(13, 60, 38, 0.04)',
    minWidth: '72px',
    outline: 'none',
    userSelect: 'none'
  };

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? '#23233c' : '#eef9f4';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(13, 60, 38, 0.25)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDark ? '0 6px 15px rgba(0,0,0,0.4)' : '0 6px 15px rgba(13,60,38,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark ? '#1a1a2e' : '#ffffff';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(13, 60, 38, 0.12)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(13, 60, 38, 0.04)';
      }}
    >
      {isDark ? (
        <Sun size={19} strokeWidth={2.2} style={{ color: '#C9A96A' }} />
      ) : (
        <Moon size={19} strokeWidth={2.2} style={{ color: '#1a8f5c' }} />
      )}
      <span>{isDark ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}
