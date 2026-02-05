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

  // Fetch basket from API
  const refetchBasket = async () => {
    const response = await fetch(
      `http://localhost:3000/baskets/${customer.customerId}`
    );
    const data = await response.json();
    setProducts(data);
  };

  // Buy product
  const buyProduct = async (prodId: number) => {
    await fetch(
      `http://localhost:3000/baskets/${customer.customerId}/${prodId}`,
      {
        method: "PUT",
      }
    );
    refetchBasket();
  };

  // Remove product
  const removeProduct = async (prodId: number) => {
    await fetch(
      `http://localhost:3000/baskets/${customer.customerId}/${prodId}`,
      {
        method: "DELETE",
      }
    );
    refetchBasket();
  };

  // Buy all
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

  // Update product count in parent
  useEffect(() => {
    updateProductCount(products.length);
  }, [products.length, updateProductCount]);

  // Fetch basket on customer change
  useEffect(() => {
    refetchBasket();
  }, [customer.customerId]);

  // Build product map for efficient rendering
  const productMap = products.reduce<
    Record<number, { product: Product; count: number }>
  >((acc, product) => {
    if (!acc[product.productId]) {
      acc[product.productId] = { product, count: 1 };
    } else {
      acc[product.productId].count++;
    }
    return acc;
  }, {});

  // Total amount
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
