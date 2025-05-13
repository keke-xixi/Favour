<!-- 背景动画 -->
<template>
    <div class="dynamic-background" ref="canvasContainer">
      <canvas ref="canvas"></canvas>
      <div class="gradient-overlay"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const canvas = ref(null)
  const canvasContainer = ref(null)
  let ctx = null
  let particles = []
  let mousePos = { x: 0, y: 0, active: false }
  
  // 配置参数
  const config = {
    particleCount: 300,          // 粒子数量
    baseSpeed: 2,              // 基础移动速度
    mouseRadius: 150,            // 鼠标影响半径
    lineDistance: 100,           // 连线距离
    colorPalette: ['#4FACFE', '#00F2FE', '#FE5196', '#FEE140'], // 颜色配置
    particleConfig: {
      size: [1, 5],              // 粒子尺寸范围
      opacity: [0.2, 0.8]        // 透明度范围
    }
  }
  
  class Particle {
    constructor() {
      this.reset(true)
    }
  
    reset(initial = false) {
      this.x = initial ? Math.random() * ctx.canvas.width : -50
      this.y = Math.random() * ctx.canvas.height
      this.vx = (Math.random() - 0.5) * config.baseSpeed
      this.vy = (Math.random() - 0.5) * config.baseSpeed
      this.size = Math.random() * (config.particleConfig.size[1] - config.particleConfig.size[0]) + config.particleConfig.size[0]
      this.opacity = Math.random() * (config.particleConfig.opacity[1] - config.particleConfig.opacity[0]) + config.particleConfig.opacity[0]
      this.color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)]
    }
  
    update() {
      // 鼠标交互
      if (mousePos.active) {
        const dx = this.x - mousePos.x
        const dy = this.y - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < config.mouseRadius) {
          const angle = Math.atan2(dy, dx)
          const force = (config.mouseRadius - distance) / config.mouseRadius
          this.vx += Math.cos(angle) * force * 0.1
          this.vy += Math.sin(angle) * force * 0.1
        }
      }
  
      // 边界处理
      if (this.x < -50 || this.x > ctx.canvas.width + 50 || 
          this.y < -50 || this.y > ctx.canvas.height + 50) {
        this.reset()
      }
  
      this.x += this.vx
      this.y += this.vy
    }
  
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.fill()
    }
  }
  
  const initCanvas = () => {
    const container = canvasContainer.value
    const dpr = window.devicePixelRatio || 1
    
    canvas.value.width = container.clientWidth * dpr
    canvas.value.height = container.clientHeight * dpr
    canvas.value.style.width = '100%'
    canvas.value.style.height = '100%'
    
    ctx = canvas.value.getContext('2d')
    ctx.scale(dpr, dpr)
  }
  
  const createParticles = () => {
    particles = Array.from({ length: config.particleCount }, () => new Particle())
  }
  
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
  
        if (distance < config.lineDistance) {
          const opacity = 1 - distance / config.lineDistance
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = p1.color
          ctx.globalAlpha = opacity * 0.2
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
    particles.forEach(particle => {
      particle.update()
      particle.draw()
    })
  
    drawLines()
    requestAnimationFrame(animate)
  }
  
  const handleResize = () => {
    initCanvas()
    createParticles()
  }
  
  const handleMouseMove = (e) => {
    const rect = canvas.value.getBoundingClientRect()
    mousePos.x = (e.clientX - rect.left) * (canvas.value.width / rect.width) / (window.devicePixelRatio || 1)
    mousePos.y = (e.clientY - rect.top) * (canvas.value.height / rect.height) / (window.devicePixelRatio || 1)
  }
  
  onMounted(() => {
    initCanvas()
    createParticles()
    animate()
  
    window.addEventListener('resize', handleResize)
    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('mouseenter', () => mousePos.active = true)
    canvas.value.addEventListener('mouseleave', () => mousePos.active = false)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    canvas.value?.removeEventListener('mousemove', handleMouseMove)
  })
  </script>
  
  <style scoped>
  .dynamic-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    /* background: linear-gradient(
      45deg,
      hsl(240, 50%, 8%),
      hsl(260, 40%, 12%)
    ); */
    /* 调试背景色 */
      background: linear-gradient(
      45deg,
      hsl(0, 58%, 66%),
      hsl(0, 29%, 80%)
    ) !important;  
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(100, 100, 255, 0.1) 0%,
      rgba(0, 0, 20, 0.8) 70%
    );
    pointer-events: none;
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  </style>