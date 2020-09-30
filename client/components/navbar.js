import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {fetchCart} from '../store/ordersReducer'

class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }
  // ({handleClick, isLoggedIn, isAdmin, totalItems})
  render() {
    return (
      <div>
        <h1>SPOON WEBSITE</h1>
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link to="/home">Home</Link>
              <Link to="/spoons">All Products</Link>
              <Link to="/cart">Cart({this.props.totalItems})</Link>
              <a href="#" onClick={this.props.handleClick}>
                Logout
              </a>
              {this.props.isAdmin ? <Link to="/users">Users</Link> : null}
            </div>
          ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/spoons">All Products</Link>
              <Link to="/cart">Cart({this.props.totalItems}) </Link>
            </div>
          )}
        </nav>
        <hr />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.isAdmin,
    totalItems: state.orders.cart.spoons.length
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    getCart: () => dispatch(fetchCart())
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
