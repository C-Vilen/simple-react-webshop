import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BasketItem from "./BasketItem";

// CSS
import "./Basket.css";
import { CustomerContext } from "../../App";

interface BasketItemContainerProps {
  customerName: String;
  basketAmount: number;
  updateProductCount: (count: number) => void;
}
interface Product {
  productName: string;
  productPrice: number;
  imgSrc: string;
  productId: number;
}

export default function BasketItemContainer({
  customerName,
  updateProductCount,
}: BasketItemContainerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const context = useContext(CustomerContext);
  if (!context) throw new Error("customer context is undefined");
  const { customer } = context;

  // Output name
  const outputName = customerName || `${customer.firstName}'s basket`;

  const refetchBasket = async () => {
    const response = await fetch(
      `http://localhost:3000/baskets/${customer.customerId}`
    );
    const data = await response.json();
    setProducts(data);
  };

  const buyProduct = async (prodId: number) => {
    await fetch(
      `http://localhost:3000/baskets/${customer.customerId}/${prodId}`,
      {
        method: "PUT",
      }
    );
    refetchBasket();
  };

  const removeProduct = async (prodId: number) => {
    await fetch(
      `http://localhost:3000/baskets/${customer.customerId}/${prodId}`,
      {
        method: "DELETE",
      }
    );
    refetchBasket();
  };

  const buyAll = async () => {
    if (products.length === 0) {
      toast.error("You have no products in the basket", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await fetch(`http://localhost:3000/baskets/${customer.customerId}`, {
        method: "DELETE",
      });
      await refetchBasket();
      toast.success("You just bought all your products in the basket", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Something went wrong while buying products", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    updateProductCount(products.length);
  }, [products.length, updateProductCount]);

  useEffect(() => {
    refetchBasket();
  }, [customer.customerId]);

  const productMap = products.reduce<
    Map<number, { product: Product; count: number }>
  >((acc, product) => {
    if (!acc.has(product.productId)) {
      acc.set(product.productId, { product, count: 1 });
    } else {
      const existing = acc.get(product.productId)!;
      existing.count++;
      acc.set(product.productId, existing);
    }
    return acc;
  }, new Map());

  const totalAmount = products.reduce(
    (acc, product) => acc + product.productPrice,
    0
  );

  return (
    <>
      <div className="row cart-box">
        <div className="col-xl-6 order-xs-10 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">{outputName}</span>
          </h4>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between cart-title-header">
              <span>Product</span>
              <span>Price</span>
            </li>

            {/* Render basket items efficiently */}
            {Object.values(productMap).map(({ product, count }) => (
              <BasketItem
                key={product.productId}
                prodName={product.productName}
                prodAmount={count}
                prodPrice={product.productPrice}
                prodImg={`./assets/images${product.imgSrc}`}
                prodId={product.productId}
                buyProduct={buyProduct}
                removeProduct={removeProduct}
              />
            ))}

            <li className="list-group-item d-flex justify-content-between">
              <span>Total</span>
              <strong id="totalAmount">{totalAmount} DKK</strong>
            </li>
            <li className="buy-li">
              <button className="buy-btn btn BlackButton" onClick={buyAll}>
                Buy
              </button>
            </li>
          </ul>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
