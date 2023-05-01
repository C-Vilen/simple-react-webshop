import { Fragment, useEffect, useState } from "react";

//CSS
import "../../styles/styles.css";

// Components
import Footer from "../../components/Footer";
import OneProductSection from "../../components/OneProductComponent/OneProductSection";
import { useParams } from "react-router-dom";

interface ProductInterface {
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  imgSrc: string;
}

export default function OneProduct() {
  const [product, setProducts] = useState<ProductInterface | null>(null);
  //   const category = useParams();
  const { prodId: routeProdId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/products/${routeProdId}`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <Fragment>
      <main className="page-main">
        {product && (
          <OneProductSection
            prodImg={product.imgSrc}
            prodName={product.productName}
            prodPrice={product.productPrice.toString()}
            prodDescription={product.productDescription}
            // heading= "All Products"
          />
        )}
      </main>
      <Footer />
    </Fragment>
  );
}
