import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cartService } from "@/services/cart.service";
import { imagesService } from "@/services/images.service";
import { IProduct } from "@/types";
import { Button } from "@shadcnUi/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ item }: { item: IProduct }) {
  const addCart = (item: IProduct) => {
    cartService.addToCart(item);
  };
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <Link to={`/products/$productId`} params={{ productId: item.id.toString() }}>
          <img src={imagesService.getFrontImage(item)} alt="" />
        </Link>
      </CardHeader>
      <CardContent>
        <Link to={`/products/$productId`} params={{ productId: item.id.toString() }}>
          <p>Смартфон {item.brand} {item.nameProduct} {item.ram}гб + {item.storage}гб</p>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>{item.price}₽</p>
        <Button variant={"ghost"} onClick={() => addCart(item)} className="w-fit justify-self-end rounded-full">
          <ShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
}
