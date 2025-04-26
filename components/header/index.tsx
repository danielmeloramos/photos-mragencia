import SocialLinks from 'components/SocialLinks'
import { ThemeToggle } from 'components'
import GoBackButton from 'components/go-back'

export default function Header({showGoBack}: {showGoBack: boolean}) {
  return (
    <header className="sticky top-0 z-50 flex flex-row justify-between w-full bg-background-light dark:bg-background-dark">
      <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-start gap-4">
        {showGoBack && <GoBackButton />}
      </div>
      <div className="px-4 py-4 flex flex-row sm:flex-row items-center justify-end gap-4">
        <SocialLinks className="flex" />
        <ThemeToggle />
      </div>
    </header>
  )
}
