import React from 'react'
import {connect} from 'react-redux'
import {fetchCart, fetchOrders, removeItem} from '../store/ordersReducer'

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleRemove = this.handleRemove.bind(this)
  }

  componentDidMount() {
    // where we have a switch case for signed in or not (local state stuff)??

    this.props.getCart()
    this.props.getHistory()
  }

  handleRemove(e) {
    this.props.removeItem(e.target.value)
  }

  render() {
    let cart = this.props.cart
    let history = this.props.history
    return (
      <div className="sideby">
        <div className="halfWidth medLeftMargin">
          <h1>Cart</h1>
          <h4>You have {cart.spoons.length} in your cart.</h4>
          {cart.spoons.length ? (
            <div>
              {cart.spoons.map(spoon => {
                return (
                  <div key={spoon.id} className="bottomMargin">
                    <div>
                      {spoon.imageUrl ? (
                        <img className="spoon-img" src={spoon.imageUrl} />
                      ) : (
                        <h2>No image</h2>
                      )}
                    </div>
                    <p>Price: ${spoon.price}</p>
                    <button
                      className="space"
                      onClick={this.handleRemove}
                      value={spoon.id}
                      type="button"
                    >
                      Remove Item
                    </button>
                  </div>
                )
              })}
              <div className="justifySelfRight row">
                <button className="largeRightMargin" type="submit">
                  Checkout
                </button>
              </div>
            </div>
          ) : (
            <h4>Your cart is empty!</h4>
          )}
        </div>
        <div className="halfWidth smLeftMargin">
          <h2>Order History</h2>
          {history.map(order => {
            return (
              <div key={'order' + order.id}>
                <h4>Date: {order.dateCreated}</h4>
                <div className="history-spoons-container">
                  {order.spoons.map(spoon => {
                    return (
                      <div key={spoon.id}>
                        <div>
                          {spoon.imageUrl ? (
                            <img
                              className="spoon-img-thumbnail"
                              src={spoon.imageUrl}
                            />
                          ) : (
                            <h2>No image</h2>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    cart: state.orders.cart,
    user: state.user,
    history: state.orders.orders
  }
}

const mapDispatch = dispatch => {
  return {
    getCart: () => dispatch(fetchCart()),
    getHistory: () => dispatch(fetchOrders()),
    removeItem: itemId => dispatch(removeItem(itemId))
  }
}

export default connect(mapState, mapDispatch)(Cart)
