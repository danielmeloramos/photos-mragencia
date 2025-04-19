import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type WhatsappButtonProps = {
  selectedImages: string[] // Recebe apenas os public_ids
}

const calculatePrice = (quantity: number): number => {
  if (quantity === 0) return 0
  if (quantity === 1) return 8
  return 8 + (quantity - 1) * 5
}

const WhatsappButton = ({ selectedImages }: WhatsappButtonProps) => {
  const phoneNumber = '554991636022'

  const price = calculatePrice(selectedImages.length)
  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace('.', ',')}`

  const message = encodeURIComponent(
    selectedImages.length > 0
      ? `Olá! Tenho interesse em comprar ${selectedImages.length} foto${selectedImages.length > 1 ? 's' : ''}.\n\n` +
        selectedImages
          .map((public_id, index) => `${index + 1}. https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.webp`)
          .join('\n') +
        `\n\nValor total: ${formatPrice(price)}`
      : 'Olá! Tenho interesse em comprar uma foto.'
  )

  const link = `https://wa.me/${phoneNumber}?text=${message}`

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (selectedImages.length === 0) {
      e.preventDefault()
      toast.warn('Por favor, selecione ao menos uma imagem para continuar.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <>
      <a
        href={selectedImages.length > 0 ? link : undefined}
        target={selectedImages.length > 0 ? '_blank' : undefined}
        rel={selectedImages.length > 0 ? 'noopener noreferrer' : undefined}
        className={`flex items-center gap-2 rounded-full px-6 py-3 text-white shadow-lg transition-all ${
          selectedImages.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label="Comprar foto via WhatsApp"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M7 4h-2l-3 9v2h2l3-9zm16 1h-14l-1.2 3h13.4l-1.5 4h-11l-1.2 3h12.9l3.5-10h-1zm-4 15c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z" />
        </svg>
        <span className="font-semibold">Comprar foto</span>
      </a>
    </>
  )
}

export default WhatsappButton