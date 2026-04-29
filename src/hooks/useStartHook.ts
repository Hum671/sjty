// useParticlesBackground.ts
interface ParticleOptions {
  bgColor?: string
  lineColor?: string
  dotColor?: string
  dotSize?: number
  lineWidth?: number
  particleCount?: number
  maxDistance?: number
}

export function useParticlesBackground(
  canvasRef: any,
  {
    bgColor = '#0d0d0d',
    lineColor = '#666666',
    dotSize = 2,
    lineWidth = 1,
    dotColor = '#ffffff',
    particleCount = 10,
    maxDistance = 160,
  }: ParticleOptions = {},
) {
  const particles: any[] = []
  let ctx: CanvasRenderingContext2D | null = null
  let animationId: number
  let width = 0
  let height = 0

  function initParticles() {
    particles.length = 0
    for (let i = 0; i < particleCount; i++) {
      const baseSpeed = Math.random() * 0.5 + 0.2 // 基础速度
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        baseSpeed,
        speedFreq: Math.random() * 2 + 0.5, // 速度波动频率
        speedPhase: Math.random() * Math.PI * 2, // 速度相位
      })
    }
  }

  function draw() {
    if (!ctx) return
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // 绘制点
    ctx.fillStyle = dotColor
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2)
      ctx.fill()
    }

    // 绘制线
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineWidth
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDistance) {
          ctx.globalAlpha = 1 - dist / maxDistance
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    ctx.globalAlpha = 1
  }

  function update(time: number) {
    const t = time / 1000
    for (const p of particles) {
      // 速度随时间波动
      const speedFactor = 0.5 + Math.sin(t * p.speedFreq + p.speedPhase) * 0.5
      p.x += p.dx * p.baseSpeed * speedFactor * 2
      p.y += p.dy * p.baseSpeed * speedFactor * 2

      // 边界反弹
      if (p.x <= 0 || p.x >= width) p.dx *= -1
      if (p.y <= 0 || p.y >= height) p.dy *= -1
    }
  }

  function loop(time: number) {
    update(time)
    draw()
    animationId = requestAnimationFrame(loop)
  }

  function resize() {
    if (!canvasRef.value) return
    width = canvasRef.value.width = window.innerWidth
    height = canvasRef.value.height = window.innerHeight
    initParticles()
  }

  onMounted(() => {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    animationId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })

  return {
    canvasRef,
  }
}
