import { useState, useRef } from 'react'
import { Filter } from 'components/Icons'
import useClickOutside from 'hooks/useClickOutside'

interface MenuProps {
  folders: string[]
  selectedFolder: string
  setSelectedFolder: (folder: string) => void
}

export default function Menu({ folders, selectedFolder, setSelectedFolder }: MenuProps) {
  const $menu = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useClickOutside($menu, () => setMenuOpen(false))

  const handleClick = (folder: string) => {
    setSelectedFolder(folder)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={$menu} className="fixed bottom-24 right-4 z-50 sm:right-6">
      {/* Arrow Image (visible only on ultrawide screens) */}
      <img
        src="arrow.png"
        alt="Filter by place"
        className="fixed bottom-32 right-8 hidden h-40 w-auto ultrawide:block"
      />

      {/* Filter Button */}
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md transition-colors hover:bg-blue-700 sm:h-14 sm:w-14"
        onClick={() => setMenuOpen(!menuOpen)}
        title="Filter by place"
      >
        <Filter className="h-6 w-6 text-white sm:h-7 sm:w-7" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute bottom-16 right-0 w-48 rounded-lg bg-gray-800 p-4 shadow-lg transition-all duration-200 ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {folders?.map((folder) => (
          <button
            key={folder}
            className={`block w-full rounded-full px-3 py-2 text-left text-sm transition-colors ${
              selectedFolder === folder
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => handleClick(folder)}
          >
            {folder.includes('-') ? folder.split('-')[1] : folder}
          </button>
        ))}
        <div className="my-2 h-px bg-gray-600" />
        <button
          className={`block w-full rounded-full px-3 py-2 text-left text-sm transition-colors ${
            selectedFolder === 'All'
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          onClick={() => handleClick('All')}
        >
          All photos
        </button>
      </div>
    </div>
  )
}