'use client'

import { useEffect, useState } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  glow: boolean
}

interface ShootingStar {
  x: number
  y: number
  delay: number
  duration: number
}

export function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [shooting, setShooting] = useState<ShootingStar[]>([])

  useEffect(() => {
    const s: Star[] = Array.from({ length: 220 }, () => {
      const size = Math.random() < 0.85
        ? Math.random() * 1.2 + 0.4   // tiny
        : Math.random() * 2 + 1.5     // bigger
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: Math.random() * 0.55 + 0.15,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 10,
        glow: size > 2,
      }
    })
    setStars(s)

    const sh: ShootingStar[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * 60 + 10,
      y: Math.random() * 35 + 5,
      delay: Math.random() * 20,
      duration: Math.random() * 3 + 4,
    }))
    setShooting(sh)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">

      {/* ── Nebula blobs ── */}
      <div
        className="absolute rounded-full blur-[130px]"
        style={{
          width: '65%', height: '65%',
          top: '-15%', left: '-15%',
          background: 'radial-gradient(circle, #5c0000 0%, #2a0000 45%, transparent 70%)',
          animation: 'nebula-pulse 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[110px]"
        style={{
          width: '55%', height: '55%',
          bottom: '-20%', right: '-15%',
          background: 'radial-gradient(circle, #4a0000 0%, #1f0000 50%, transparent 70%)',
          animation: 'nebula-pulse-alt 15s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: '35%', height: '45%',
          top: '35%', right: '15%',
          background: 'radial-gradient(circle, #380000 0%, transparent 70%)',
          animation: 'nebula-pulse 18s ease-in-out infinite 3s',
        }}
      />
      {/* Faint blue-purple far galaxy */}
      <div
        className="absolute rounded-full blur-[160px]"
        style={{
          width: '40%', height: '35%',
          top: '10%', right: '-10%',
          background: 'radial-gradient(circle, #0d0020 0%, transparent 70%)',
          opacity: 0.6,
        }}
      />

      {/* ── Stars ── */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.glow
              ? 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.4) 70%)'
              : '#ffffff',
            opacity: star.opacity,
            boxShadow: star.glow
              ? `0 0 ${star.size * 3}px ${star.size}px rgba(255,255,255,0.25)`
              : 'none',
            animation: `${star.glow ? 'twinkle' : 'twinkle-slow'} ${star.duration}s ease-in-out infinite ${star.delay}s`,
          }}
        />
      ))}

      {/* ── Shooting stars ── */}
      {shooting.map((s, i) => (
        <div
          key={`sh-${i}`}
          className="absolute h-px origin-left"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: '160px',
            transform: 'rotate(-40deg)',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.4) 70%, transparent 100%)',
            animation: `shoot ${s.duration}s ease-in infinite ${s.delay}s`,
          }}
        />
      ))}

      {/* ── Subtle vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  )
}
