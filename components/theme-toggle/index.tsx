import { Moon, Sun } from 'components/Icons'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      className="p-2"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
        
      {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} /> }
    </button>
  )
}
