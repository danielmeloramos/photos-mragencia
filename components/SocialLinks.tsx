import { useEffect, useState } from 'react'
import { Instagram } from './Icons'

interface SocialLinksProps {
  className?: string
}

export default function SocialLinks({ className }: SocialLinksProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={className}>
      <a
        href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram />
      </a>
    </div>
  )
}
