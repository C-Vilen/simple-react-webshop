//import
import Carousel from 'react-bootstrap/Carousel';

//Components import
import { CarouselProductCard, CarouselProductCardProps } from "./CarouselProductCard";
import { Fragment } from 'react';

interface CardCarrouselProps {
    items: CarouselProductCardProps[];
}

export default function CardCarousel({ items }: CardCarrouselProps) {
    return (
        <Fragment>
            <h2 className="category-heading text-center">Newly added</h2>
            <Carousel variant="dark">
                {items.map((item, i) => (
                    <Carousel.Item>
                        <CarouselProductCard key={i} prodImg={item.prodImg} prodName={item.prodName} prodPrice={item.prodPrice} />
                    </Carousel.Item>
                ))}
            </Carousel>
        </Fragment>
    );
}
