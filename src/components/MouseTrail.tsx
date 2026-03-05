import { useEffect, useRef, useCallback } from 'react'

interface TrailParticle {
  x: number
  y: number
  opacity: number
  createdAt: number
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<TrailParticle[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const dx = e.clientX - lastPositionRef.current.x
    const dy = e.clientY - lastPositionRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 8) {
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 0.3,
        createdAt: Date.now(),
      })

      if (particlesRef.current.length > 50) {
        particlesRef.current.shift()
      }

      lastPositionRef.current = { x: e.clientX, y: e.clientY }
    }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const now = Date.now()
    const lifetime = 600

    particlesRef.current = particlesRef.current.filter((p) => {
      const age = now - p.createdAt
      if (age > lifetime) return false

      const progress = age / lifetime
      const opacity = p.opacity * (1 - progress)
      const radius = 2.5 * (1 - progress * 0.5)

      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(100, 149, 237, ${opacity})`
      ctx.fill()

      return true
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [handleMouseMove, animate])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  )
}
