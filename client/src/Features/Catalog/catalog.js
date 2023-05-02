import React from "react";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
export default function Catalog() {
  const [products, setProducts] = useState([]
    );
    useEffect(() => {
      fetch("https://localhost:5002/api/Product")
        .then(response => response.json())
        .then(data => setProducts(data))
      //promise , callback function,
      // dependency of empty array(only getting called once other wise it will keep calling products)
    }, []);
  return (
    <>
      <ProductList products={products} />
    </>
  );
}