import { useState, useEffect } from 'react';
import axios from 'axios';

function CartItem(props) {
    
    const [product, setProduct] = useState("");
    const [error, setError] = useState("");
    const [cartItem, setCartItem] = useState("");
    
    const fetchProduct = async(id) => {
        try {      
          const response = await axios.get("/api/products/" + id);
          console.log("put this in cart == " + JSON.stringify(response.data));
          response.data.forEach((arrObj) => {
              setProduct(arrObj);
            });
        } catch(error) {
          setError("error retrieving product: " + error);
        }
    }
    
    const subOneFromCart = async(id, quant) => {
        try {
            var val = parseInt(quant) - 1
            const response = await axios.put("/api/cart/" + id + "/" + val);
            console.log(response.data);
            fetchProduct(response.data.id);
            props.fetchCart();
        } catch(error) {
          setError("error subbing one from cart: " + error);
        }
    }
    
    const addOneToCart = async(id, quant) => {
        try {
            var val = parseInt(quant) + 1
            const response = await axios.put("/api/cart/" + id + "/" + val);
            console.log(response.data);
            fetchProduct(response.data.id);
            props.fetchCart();
        } catch(error) {
          setError("error subbing one from cart: " + error);
        }
    }
    
    const removeItemFromCart = async(id) => {
        try {
            const response = await axios.delete("/api/cart/" + id);
            console.log(response.data);
             props.fetchCart();
        } catch (error) {
            setError("error deleting from cart: " + error);
        }
    }
    
    useEffect(() => {
        fetchProduct(props.product.id);
    },[]);
    
    return(
        <div className="product">
            <p>{product.name} ,{props.product.quantity}</p>
            <button className="btn" onClick={e => subOneFromCart(props.product.id, props.product.quantity)}>-</button>
            <button className="btn" onClick={e => addOneToCart(props.product.id, props.product.quantity)}>+</button>
            <button className="btn" onClick={e => removeItemFromCart(props.product.id)}>Remove from Cart</button>
          </div>
        );
}

export default CartItem;
