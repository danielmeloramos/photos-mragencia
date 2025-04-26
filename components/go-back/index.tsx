import { useEffect, useState } from 'react'
import { GoBack } from '../Icons'
import { useRouter } from 'next/router'

export default function GoBackButton() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='cursor-pointer' onClick={() => router.back()}>
        <GoBack />
    </div>
  )
}
