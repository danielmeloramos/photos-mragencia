interface SocialLinksProps {
  className?: string
}

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={className}>
      <a
        href="https://yourwebsite.com" // Replace with your site URL
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        Website
      </a>
      <a
        href="https://instagram.com/mr.fotografias__" // Replace with your Instagram URL
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Instagram
      </a>
    </div>
  )
}