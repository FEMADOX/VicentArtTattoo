interface PortfolioProps {
  image: string
  alt?: string
}

const PortfolioCard = ({ image, alt }: PortfolioProps) => (
  <div className="bg-white min-h-50 flex items-center justify-center mb-10 hover:scale-105 transition-transform duration-300 rounded-3xl">
    <a href={image} target="_blank" rel="noopener noreferrer">
      <img
        className="w-80 h-80 object-cover rounded-2xl"
        src={image}
        alt={alt || 'Portfolio image'}
      />
    </a>
  </div>
)

export default PortfolioCard
