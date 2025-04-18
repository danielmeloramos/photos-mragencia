// components/WhatsappButton.tsx
const WhatsappButton = () => {
  const phoneNumber = '554991636022' // Substitui pelo teu número
  const message = encodeURIComponent('Olá! Tenho interesse em comprar uma foto.')
  const link = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white shadow-lg hover:bg-blue-600 transition-all"
      aria-label="Comprar foto via WhatsApp"
    >
      {/* Ícone de carrinho (opcional: pode usar também um de WhatsApp) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path d="M7 4h-2l-3 9v2h2l3-9zm16 1h-14l-1.2 3h13.4l-1.5 4h-11l-1.2 3h12.9l3.5-10h-1zm-4 15c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"/>
      </svg>
      <span className="font-semibold">Comprar foto</span>
    </a>
  )
}

export default WhatsappButton
