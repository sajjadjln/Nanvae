import React from "react";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import agent from "../../App/api/agent";
import LoadingComponent from "../../App/layout/LoadingComponent";

export default function Catalog() {
  const [products, setProducts] = useState([]
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.catalog.list().then((response) => {
      setProducts(response);
    }).catch(error => console.log(error)).finally(() => setLoading(false));
    // fetch("https://localhost:5002/api/Product")
    //   .then(response => response.json())
    //   .then(data => setProducts(data))
    //promise , callback function,
    // dependency of empty array(only getting called once other wise it will keep calling products)
  }, []);
  if (loading) {
    return (<LoadingComponent message="Loading products"/>)
  }
  return (
    <>
      <ProductList products={products} />
    </>
  );
}