export type CartFly = {
  id: number
  image: string
  x: number
  y: number
  dx: number
  dy: number
}

export const useCartFx = () => {
  const flies = useState<CartFly[]>('cart-flies', () => [])
  const pop = useState('cart-pop', () => 0)

  const flyToCart = (image: string, source: HTMLElement) => {
    const from = source.getBoundingClientRect()
    const target = document.getElementById('cart-button')?.getBoundingClientRect()
    const startX = from.left + from.width / 2 - 28
    const startY = from.top + from.height / 2 - 28
    const endX = target ? target.left + target.width / 2 : window.innerWidth - 40
    const endY = target ? target.top + target.height / 2 : 28
    const id = Date.now() + Math.random()
    flies.value = [...flies.value, { id, image, x: startX, y: startY, dx: endX - startX - 28, dy: endY - startY - 28 }]
    window.setTimeout(() => {
      flies.value = flies.value.filter((fly) => fly.id !== id)
      pop.value += 1
    }, 680)
  }

  return { flies, pop, flyToCart }
}
