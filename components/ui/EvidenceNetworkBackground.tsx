'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  ox: number
  oy: number
  vx: number
  vy: number
  accent?: boolean
}

// ponytail: minimal 2D canvas particle-net replacing 814 lines of over-engineered BFS simulation.
export default function EvidenceNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let nodes: Node[] = []
    let mouse = { x: -9999, y: -9999, active: false }
    let pulse: { x: number; y: number; r: number; alpha: number } | null = null
    let raf = 0
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function init() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
      const isMobile = w < 768
      const count = isMobile ? 28 : 58
      nodes = []

      // Seed nodes along bottom arc and right ridge, keeping center & top-left quiet
      let attempts = 0
      while (nodes.length < count && attempts++ < 300) {
        const isRight = Math.random() < 0.42
        const x = isRight
          ? w * (0.72 + Math.random() * 0.26)
          : w * (0.04 + Math.random() * 0.92)
        const y = isRight
          ? h * (0.08 + Math.random() * 0.82)
          : h * (0.62 + Math.random() * 0.34)

        // Quiet zone rejection
        if (x < w * 0.48 && y < h * 0.52) continue
        if (x > w * 0.28 && x < w * 0.62 && y > h * 0.28 && y < h * 0.68) continue

        const accent = isRight && Math.random() < 0.16 && nodes.filter((n) => n.accent).length < 4
        nodes.push({
          x,
          y,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          accent,
        })
      }
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }
    const onClick = (e: MouseEvent) => {
      pulse = { x: e.clientX, y: e.clientY, r: 0, alpha: 1 }
    }

    window.addEventListener('resize', init)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('click', onClick, { passive: true })
    init()

    const maxDist = 135
    const hoverRadius = 150

    function loop() {
      ctx!.clearRect(0, 0, w, h)

      // Animate ripple pulse
      if (pulse) {
        pulse.r += 6
        pulse.alpha -= 0.02
        ctx!.beginPath()
        ctx!.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(225, 38, 55, ${Math.max(0, pulse.alpha * 0.5)})`
        ctx!.lineWidth = 1.5
        ctx!.stroke()
        if (pulse.alpha <= 0) pulse = null
      }

      // Update node positions and pointer reaction
      for (const n of nodes) {
        if (!prefersReduced) {
          n.ox += n.vx
          n.oy += n.vy
          if (n.ox < 0 || n.ox > w) n.vx *= -1
          if (n.oy < 0 || n.oy > h) n.vy *= -1
        }

        // Pointer hover repulsion & spring-back
        let targetX = n.ox
        let targetY = n.oy
        if (mouse.active) {
          const dx = n.ox - mouse.x
          const dy = n.oy - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < hoverRadius && dist > 0) {
            const push = ((hoverRadius - dist) / hoverRadius) * 22
            targetX += (dx / dist) * push
            targetY += (dy / dist) * push
          }
        }
        n.x += (targetX - n.x) * 0.1
        n.y += (targetY - n.y) * 0.1
      }

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDist) {
            const nearMouse =
              mouse.active &&
              (Math.hypot(a.x - mouse.x, a.y - mouse.y) < hoverRadius ||
                Math.hypot(b.x - mouse.x, b.y - mouse.y) < hoverRadius)

            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            const alpha = (1 - dist / maxDist) * (nearMouse ? 0.6 : 0.22)
            ctx!.strokeStyle = nearMouse
              ? `rgba(225, 38, 55, ${alpha})`
              : `rgba(216, 205, 187, ${alpha * 0.7})`
            ctx!.lineWidth = nearMouse ? 1.2 : 0.75
            ctx!.stroke()
          }
        }
      }

      // Draw mouse cursor interactive connections
      if (mouse.active) {
        for (const n of nodes) {
          const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y)
          if (dist < hoverRadius) {
            const alpha = (1 - dist / hoverRadius) * 0.75
            ctx!.beginPath()
            ctx!.moveTo(mouse.x, mouse.y)
            ctx!.lineTo(n.x, n.y)
            ctx!.strokeStyle = `rgba(225, 38, 55, ${alpha})`
            ctx!.lineWidth = 1
            ctx!.stroke()
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const mouseDist = mouse.active ? Math.hypot(n.x - mouse.x, n.y - mouse.y) : 999
        const isHovered = mouseDist < hoverRadius

        let r = n.accent ? 3.5 : 2.2
        if (isHovered) r += (1 - mouseDist / hoverRadius) * 2.8

        // Node glow when hovered or accent
        if (n.accent || isHovered) {
          const glowAlpha = n.accent ? 0.45 : (1 - mouseDist / hoverRadius) * 0.7
          const grad = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
          grad.addColorStop(0, `rgba(225, 38, 55, ${glowAlpha})`)
          grad.addColorStop(1, 'rgba(225, 38, 55, 0)')
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
          ctx!.fillStyle = grad
          ctx!.fill()
        }

        ctx!.beginPath()
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = n.accent || isHovered ? '#E12637' : '#D8CDBB'
        ctx!.fill()
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', init)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="evidence-network-container" aria-hidden="true">
      <canvas ref={canvasRef} className="evidence-network-canvas" />
    </div>
  )
}
