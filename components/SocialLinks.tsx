import { Instagram, Twitter, Camera, Computer } from 'components/Icons'

function SocialLinks() {
  return (
    <div className="mt-2 flex items-center justify-center gap-3">
      <a
        href="https://mragencia.com.br"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Computer />
      </a>
      <a
        href="https://www.instagram.com/mr.fotografias__"
        target="_blank"
        className="font-semibold text-white/90 hover:text-white"
        rel="noreferrer"
      >
        <Instagram />
      </a>
    </div>
  )
}

export default SocialLinks
