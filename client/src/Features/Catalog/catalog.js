import React from "react";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import agent from "../../App/api/agent";

export default function Catalog() {
  const [products, setProducts] = useState([]
    );
    useEffect(() => {
      agent.catalog.list().then((response) => {
        setProducts(response);
      });
      // fetch("https://localhost:5002/api/Product")
      //   .then(response => response.json())
      //   .then(data => setProducts(data))
      //promise , callback function,
      // dependency of empty array(only getting called once other wise it will keep calling products)
    }, []);
  return (
    <>
      <ProductList products={products} />
    </>
  );
}