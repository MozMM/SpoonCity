import axios from 'axios'

export const GET_ORDERS = 'GET_ORDERS'
export const GET_CART = 'GET_CART'

export const getOrders = orders => ({
  type: GET_ORDERS,
  orders
})

export const getCart = cart => ({
  type: GET_CART,
  cart
})

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await axios.get('/api/orders/history')
      const orders = await response.data
      dispatch(getOrders(orders))
    } catch (err) {
      console.error(err)
    }
  }
}

export const fetchCart = loggedInBoolean => {
  return async dispatch => {
    if (loggedInBoolean) {
      try {
        const foundCartResponse = await axios.get('/api/orders/cart')
        const cart = foundCartResponse.data
        dispatch(getCart(cart))
      } catch (err) {
        console.error(err)
      }
    } else {
      if (localStorage.getItem('cart') === null) {
        localStorage.setItem('cart', JSON.stringify({spoons: []}))
      }
      const cart = JSON.parse(localStorage.getItem('cart'))
      dispatch(getCart(cart))
    }
  }
}

export const addToCartThunk = (itemId, loggedInBoolean) => {
  return async dispatch => {
    if (loggedInBoolean) {
      try {
        const updatedCartResponse = await axios.post(`/api/orders/${itemId}`)
        const cart = updatedCartResponse.data
        dispatch(getCart(cart))
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        const singleSpoonRes = await axios.get(`/api/spoons/${itemId}`)
        let spoon = {...singleSpoonRes.data, SpoonOrder: {quantity: 1}}
        // PUT THAT on local storage
        // hand me local storage,
        // Imma put it on State>stora>props (so I can map )
        //on localstroage: {spoons: [{...spoon, SpoonOrder: {quantitiy: 1} }, {spoon}, ] }
        let cart = JSON.parse(localStorage.getItem('cart'))
        cart.spoons.push(spoon)
        localStorage.setItem('cart', JSON.stringify(cart))
        dispatch(getCart(cart))
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export const checkoutCartThunk = () => {
  return async dispatch => {
    try {
      await axios.put('/api/orders/checkout')
      const updatedOrders = await axios.get('/api/orders/history')
      const orders = await updatedOrders.data
      dispatch(getOrders(orders))
    } catch (err) {
      console.error(err)
    }
  }
}

export const removeItem = (itemId, loggedInBoolean) => {
  return async dispatch => {
    if (loggedInBoolean) {
      try {
        const updatedCartResponse = await axios.delete(`/api/orders/${itemId}`)
        const cart = updatedCartResponse.data
        dispatch(getCart(cart))
      } catch (err) {
        console.error(err)
      }
    } else {
      let cart = JSON.parse(localStorage.getItem('cart'))
      let updatedSpoons = cart.spoons.filter(
        spoon => Number(spoon.id) !== Number(itemId)
      )
      localStorage.setItem('cart', JSON.stringify({spoons: updatedSpoons}))
      cart = JSON.parse(localStorage.getItem('cart'))
      dispatch(getCart(cart))
    }
  }
}

export const updateItem = (itemId, newQuantity) => {
  return async dispatch => {
    try {
      const updatedCartResponse = await axios.put(`/api/orders/${itemId}`, {
        newQuantity
      })
      const cart = updatedCartResponse.data
      dispatch(getCart(cart))
    } catch (err) {
      console.error(err)
    }
  }
}

const initialState = {orders: [], cart: {spoons: []}}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return {...state, orders: action.orders}
    case GET_CART:
      return {...state, cart: action.cart}
    default:
      return state
  }
}
