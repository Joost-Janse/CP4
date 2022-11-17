import { useState, useEffect } from 'react';
import axios from 'axios';
import CartItem from './CartItem'
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [update, setUpdate] = useState(false);
  
  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products/");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch(error) {
      setError("error retrieving cart: " + error);
    }
  }
  
  const addToCart = async(p_id) => {
    try {
      const response = await axios.post("/api/cart/" + p_id);
      console.log(response.data);
      fetchCart();
    } catch (error) {
      setError("error retrieving products: " + error);
    }
  }
  
  useEffect(() => {
    fetchProducts();
    fetchCart();
  },[]);
  
  
  return (
    <div className="App">
      {error}
      <div className="productList">
      <h1>Products</h1>
      {products.map( item => (
          <div className="product">
            <p>{item.name} , {item.price}</p>
            <button className="btn" onClick={e => addToCart(item.id)}>Add to Cart</button>
          </div>
      ))}
      </div>
      <div className="cartList">
        <h1>Cart</h1>
        {cart.map( item => (
        <CartItem product={item} key={item.id} fetchCart={fetchCart}/>
      ))}
      </div>
    </div>
  );
  
}

export default App;
