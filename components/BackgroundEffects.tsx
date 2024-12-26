'use client'

import { useEffect, useRef } from 'react'

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  type BlackHoleType = {
    update: () => void;
    draw: () => void;
    setTarget: (x: number, y: number) => void;
  }
  const blackHoleRef = useRef<BlackHoleType | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class ParticleSpark {
      x: number
      y: number
      size: number
      angle: number
      speed: number
      opacity: number
      rotationRadius: number
      rotationAngle: number
      centerX: number
      centerY: number

      constructor(centerX: number, centerY: number) {
        this.centerX = centerX
        this.centerY = centerY
        this.rotationRadius = Math.random() * 100 + 50
        this.rotationAngle = Math.random() * Math.PI * 2
        this.x = centerX
        this.y = centerY
        this.size = Math.random() * 2 + 0.5
        this.angle = Math.random() * Math.PI * 2
        this.speed = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.5
      }

      update(blackHoleX: number, blackHoleY: number) {
        this.centerX = blackHoleX
        this.centerY = blackHoleY
        
        this.rotationAngle += 0.02
        this.rotationRadius -= 0.5
        
        this.x = this.centerX + Math.cos(this.rotationAngle) * this.rotationRadius
        this.y = this.centerY + Math.sin(this.rotationAngle) * this.rotationRadius
        
        this.opacity = Math.max(0, this.rotationRadius / 100)
        
        if (this.rotationRadius < 10) {
          this.reset()
        }
      }

      reset() {
        this.rotationRadius = Math.random() * 100 + 50
        this.rotationAngle = Math.random() * Math.PI * 2
        this.opacity = Math.random() * 0.5 + 0.5
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(138, ${43 + Math.random() * 50}, 226, ${this.opacity})`
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Star {
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random()
        this.twinkleSpeed = Math.random() * 0.02
      }

      update() {
        this.opacity += Math.sin(Date.now() * this.twinkleSpeed) * 0.02
        this.opacity = Math.max(0, Math.min(1, this.opacity))
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(138, 43, 226, ${this.opacity})` 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Comet {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
      canvas: HTMLCanvasElement

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.x = 0
        this.y = 0
        this.length = 0
        this.speed = 0
        this.angle = 0
        this.opacity = 1
        this.reset()
      }

      reset() {
        this.x = Math.random() * this.canvas.width
        this.y = 0
        this.length = Math.random() * 80 + 20
        this.speed = Math.random() * 2 + 1
        this.angle = 70 + Math.random() * 20
        this.opacity = 1
      }

      update() {
        const angleRad = (this.angle * Math.PI) / 180
        this.x += Math.cos(angleRad) * this.speed
        this.y += Math.sin(angleRad) * this.speed

        if (this.y > this.canvas.height || this.x > this.canvas.width) {
          this.reset()
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x - Math.cos((this.angle * Math.PI) / 180) * this.length,
          this.y - Math.sin((this.angle * Math.PI) / 180) * this.length
        )

        gradient.addColorStop(0, `rgba(138, 43, 226, ${this.opacity})`) 
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)') 

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(
          this.x - Math.cos((this.angle * Math.PI) / 180) * this.length,
          this.y - Math.sin((this.angle * Math.PI) / 180) * this.length
        )
        ctx.stroke()
      }
    }

    class BlackHole {
      x: number
      y: number
      targetX: number
      targetY: number
      radius: number
      angle: number
      rotationSpeed: number
      lastFlareTime: number
      flareIntensity: number
      flareAngle: number
      flareBranches: Array<{angle: number, length: number, width: number}>
      sparks: ParticleSpark[]
      ctx: CanvasRenderingContext2D

      constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
        this.x = window.innerWidth / 2
        this.y = window.innerHeight / 2
        this.targetX = this.x
        this.targetY = this.y
        this.radius = 80
        this.angle = 0
        this.rotationSpeed = 0.001
        this.lastFlareTime = Date.now()
        this.flareIntensity = 0
        this.flareAngle = 0
        this.flareBranches = []
        this.sparks = Array(100).fill(null).map(() => new ParticleSpark(this.x, this.y))
      }

      update() {
        this.angle += this.rotationSpeed

        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.x += dx * 0.05
        this.y += dy * 0.05

        const currentTime = Date.now()
        if (currentTime - this.lastFlareTime > 30000) {
          this.triggerFlare()
          this.lastFlareTime = currentTime
        }

        if (this.flareIntensity > 0) {
          this.flareIntensity -= 0.02
          this.flareAngle += 0.05
        }

        this.sparks.forEach(spark => spark.update(this.x, this.y))
      }

      triggerFlare() {
        this.flareIntensity = 1
        this.flareAngle = Math.random() * Math.PI * 2
        this.flareBranches = []
        
        const numBranches = Math.floor(Math.random() * 3) + 3
        for (let i = 0; i < numBranches; i++) {
          this.flareBranches.push({
            angle: this.flareAngle + (Math.random() - 0.5) * Math.PI / 2,
            length: this.radius * (2 + Math.random() * 2),
            width: 10 + Math.random() * 10
          })
        }
      }

      drawFlare() {
        if (this.flareIntensity <= 0) return

        this.flareBranches.forEach(branch => {
          const gradient = this.ctx.createLinearGradient(
            this.x,
            this.y,
            this.x + Math.cos(branch.angle) * branch.length,
            this.y + Math.sin(branch.angle) * branch.length
          )

          gradient.addColorStop(0, `rgba(138, 43, 226, ${this.flareIntensity})`) 
          gradient.addColorStop(0.3, `rgba(138, 43, 226, ${this.flareIntensity * 0.7})`) 
          gradient.addColorStop(1, 'rgba(138, 43, 226, 0)') 

          this.ctx.beginPath()
          this.ctx.strokeStyle = gradient
          this.ctx.lineWidth = branch.width * this.flareIntensity
          this.ctx.lineCap = 'round'
          this.ctx.moveTo(this.x, this.y)
          
          const cp1x = this.x + Math.cos(branch.angle - 0.2) * branch.length * 0.5
          const cp1y = this.y + Math.sin(branch.angle - 0.2) * branch.length * 0.5
          const cp2x = this.x + Math.cos(branch.angle + 0.2) * branch.length * 0.7
          const cp2y = this.y + Math.sin(branch.angle + 0.2) * branch.length * 0.7
          const endX = this.x + Math.cos(branch.angle) * branch.length
          const endY = this.y + Math.sin(branch.angle) * branch.length
          
          this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
          this.ctx.stroke()

          this.ctx.lineWidth = branch.width * this.flareIntensity * 2
          this.ctx.strokeStyle = `rgba(138, 43, 226, ${this.flareIntensity * 0.3})` 
          this.ctx.stroke()
        })
      }

      setTarget(x: number, y: number) {
        this.targetX = x
        this.targetY = y
      }

      draw() {
        this.sparks.forEach(spark => spark.draw(this.ctx))
        this.drawFlare()

        const coreGradient = this.ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius * 1.5
        )
        coreGradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)') 
        coreGradient.addColorStop(0.4, 'rgba(138, 43, 226, 0.5)') 
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        this.ctx.beginPath()
        this.ctx.fillStyle = coreGradient
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.ellipse(
          this.x,
          this.y,
          this.radius * 1.8,
          this.radius * 0.3,
          this.angle,
          0,
          Math.PI * 2
        )
        this.ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)' 
        this.ctx.lineWidth = 4
        this.ctx.stroke()

        const glowColors = [
          'rgba(138, 43, 226, 0.2)', 
          'rgba(138, 43, 226, 0.15)', 
          'rgba(138, 43, 226, 0.1)' 
        ]

        glowColors.forEach((color, index) => {
          this.ctx.beginPath()
          this.ctx.ellipse(
            this.x,
            this.y,
            this.radius * (1.8 + index * 0.1),
            this.radius * (0.3 + index * 0.05),
            this.angle,
            0,
            Math.PI * 2
          )
          this.ctx.strokeStyle = color
          this.ctx.lineWidth = 8 + index * 4
          this.ctx.stroke()
        })
      }
    }

    const stars = Array(100).fill(null).map(() => new Star(canvas))
    const comets = Array(5).fill(null).map(() => new Comet(canvas))
    const blackHole = new BlackHole(ctx)
    blackHoleRef.current = blackHole

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      blackHole.setTarget(x, y)
    }

    let startY = 0
    let isDragging = false
    let isScrolling = false
    const scrollThreshold = 10

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      isDragging = true
      isScrolling = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const currentY = e.touches[0].clientY
      const deltaY = Math.abs(currentY - startY)

      if (!isScrolling && deltaY > scrollThreshold) {
        isScrolling = true
      }

      if (!isScrolling) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
      isScrolling = false
    }

    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY))
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.update()
        star.draw(ctx)
      })

      comets.forEach(comet => {
        comet.update()
        comet.draw(ctx)
      })

      blackHole.update()
      blackHole.draw()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY))
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 0
      }}
    />
  )
}

