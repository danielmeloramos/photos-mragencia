const calculatePrice = (quantity: number): number => {
    if (quantity === 0) return 0
    if (quantity === 1) return Number(process.env.NEXT_PUBLIC_PRICE)
    return Number(process.env.NEXT_PUBLIC_PRICE) + (quantity - 1) * 5
}

const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace('.', ',')}`

export { calculatePrice, formatPrice }