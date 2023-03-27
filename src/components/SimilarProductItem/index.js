import {BsStarFill} from 'react-icons/bs'
import './index.css'

const SimilarProductItem = props => {
  const {item} = props

  return (
    <li className="similar-card">
      <img
        className="similar-image"
        src={item.imageUrl}
        alt={`similar product ${item.title}`}
      />
      <h1 className="similar-heading2">{item.title}</h1>
      <p className="similar-by">by {item.brand}</p>
      <div className="rate-card">
        <p className="rate">Rs {item.price}/-</p>
        <p className="rating-text">
          {item.rating} <BsStarFill />
        </p>
      </div>
    </li>
  )
}
export default SimilarProductItem
