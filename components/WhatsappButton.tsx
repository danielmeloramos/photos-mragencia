import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { calculatePrice, formatPrice } from 'utils/priceHelper'

type WhatsappButtonProps = {
  selectedImages: string[],
  isFullUrl: boolean
}

const WhatsappButton = ({ selectedImages, isFullUrl }: WhatsappButtonProps) => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP

  const price = calculatePrice(selectedImages.length)
  

  const message = encodeURIComponent(
    selectedImages.length > 0
      ? `Olá! Tenho interesse em comprar ${selectedImages.length} foto${selectedImages.length > 1 ? 's' : ''}.\n\n` +
        selectedImages
          .map((public_id, index) => index + 1 + '. ' + (isFullUrl ? public_id : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.webp`))
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
        className={`flex items-center gap-2 rounded-lg px-2 sm:px-6 py-2 sm:py-3 shadow-lg transition-all ${
          selectedImages.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-whatsapp hover:bg-green-900'
        }`}
        aria-label="Comprar foto via WhatsApp"
        onClick={handleClick}
      >
        <div className='m-0 p-0 overflow-ellipsis flex-nowrap overflow-hidden'>
          <span className="font-semibold text-white text-sm md:text-base whitespace-nowrap">Comprar via WhatsApp</span>
        </div>
      </a>
    </>
  )
}

export default WhatsappButton