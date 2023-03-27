import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {quantity: 1, details: '', similarProducts: [], status: 'loading'}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const convert = data => ({
        id: data.id,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      })
      const convertedData = convert(fetchedData)
      const similarProducts = fetchedData.similar_products
      const convertedSimilarProducts = similarProducts.map(each =>
        convert(each),
      )
      this.setState({
        details: convertedData,
        similarProducts: convertedSimilarProducts,
        status: 'success',
      })
    } else {
      this.setState({status: 'failure'})
    }
  }

  onClickMinus = () => {
    const {quantity} = this.state
    if (quantity !== 1) {
      this.setState(prev => ({
        quantity: prev.quantity - 1,
      }))
    }
  }

  onClickPlus = () => {
    this.setState(prev => ({
      quantity: prev.quantity + 1,
    }))
  }

  renderProductDetails = () => {
    const {quantity, details} = this.state
    return (
      <div className="details-container">
        <div>
          <img className="details-image" src={details.imageUrl} alt="product" />
        </div>
        <div className="details-inner-container">
          <h1 className="details-heading">{details.title}</h1>
          <p className="details-price">Rs ${details.price}</p>
          <div className="rating-card">
            <p className="rating-text">
              {details.rating} <BsStarFill />
            </p>
            <p className="reviews">{details.totalReviews} Reviews</p>
          </div>

          <p className="details-description description">
            {details.description}
          </p>
          <div className="inner-card">
            <p className="details-style">Available:</p>
            <p className="details-description">{details.availability}</p>
          </div>
          <div className="inner-card">
            <p className="details-style">Brand:</p>
            <p className="details-description">{details.brand}</p>
          </div>
          <hr className="line" />
          <div className="plus-minus">
            <button
              className="plus-minus-button"
              type="button"
              onClick={this.onClickMinus}
              data-testid="minus"
            >
              <BsDashSquare />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              className="plus-minus-button"
              type="button"
              onClick={this.onClickPlus}
              data-testid="plus"
            >
              <BsPlusSquare />
            </button>
          </div>
          <br />
          <button type="button" className="add-to-cart-button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProduct = () => {
    const {similarProducts} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-list">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} item={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickButton = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderFailure = () => (
    <div className="failure-card">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-text">Product Not Found</h1>
      <button
        className="failure-button"
        type="button"
        onClick={this.onClickButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProducts = () => {
    const {status} = this.state
    switch (status) {
      case 'loading':
        return this.renderLoader()
      case 'success':
        return (
          <div>
            {this.renderProductDetails()}
            {this.renderSimilarProduct()}
          </div>
        )
      case 'failure':
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="details-bg-container">
        <Header />
        {this.renderProducts()}
      </div>
    )
  }
}

export default ProductItemDetails
