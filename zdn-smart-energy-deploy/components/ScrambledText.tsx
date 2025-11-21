'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

interface ScrambledTextProps {
  children: string
  className?: string
  radius?: number
  duration?: number
  speed?: number
  scrambleChars?: string
}

export default function ScrambledText({
  children,
  className,
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
}: ScrambledTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!textRef.current || hasAnimated) return

    const text = textRef.current
    const originalText = children.trim()
    const chars = originalText.split('')
    const scrambleCharsArray = scrambleChars.split('')

    // Create spans for each character
    text.innerHTML = chars
      .map((char, i) => {
        if (char === ' ') return '<span class="whitespace">&nbsp;</span>'
        if (char === '\n') return '<br>'
        return `<span data-index="${i}" style="display: inline-block;">${char}</span>`
      })
      .join('')

    const spans = Array.from(text.querySelectorAll('span[data-index]')) as HTMLElement[]

    if (spans.length === 0) return

    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animate()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(text)

    function getRandomChar() {
      return scrambleCharsArray[Math.floor(Math.random() * scrambleCharsArray.length)]
    }

    function animate() {
      const tl = gsap.timeline()

      spans.forEach((span, i) => {
        const originalChar = chars[i]
        if (originalChar === ' ' || originalChar === '\n') return

        // Calculate position for circular reveal
        const angle = (i / spans.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        // Set initial state
        gsap.set(span, {
          opacity: 0,
          x,
          y,
          rotation: angle * (180 / Math.PI),
        })

        // Scramble animation
        const scrambleCount = Math.floor(Math.random() * 5) + 3
        let scrambleProgress = 0

        const scrambleInterval = setInterval(() => {
          scrambleProgress += 1 / scrambleCount
          if (scrambleProgress < 1) {
            span.textContent = getRandomChar()
          } else {
            clearInterval(scrambleInterval)
          }
        }, (speed * 1000) / scrambleCount)

        // Reveal animation
        tl.to(
          span,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration,
            ease: 'back.out(1.7)',
            onComplete: () => {
              span.textContent = originalChar
              clearInterval(scrambleInterval)
            },
          },
          i * 0.02
        )
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [children, radius, duration, speed, scrambleChars, hasAnimated])

  return (
    <div
      ref={textRef}
      className={cn('scrambled-text', className)}
      style={{ whiteSpace: 'pre-wrap' }}
    />
  )
}

