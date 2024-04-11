import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cartService } from "@/services/cart.service";
import { IProduct } from "@/types";
import { Button } from "@shadcnUi/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ item }: { item: IProduct }) {
  const addCart = (item: IProduct) => {
    cartService.addToCart(item);
  };
  return (
    <Card>
      <CardHeader>
        <Link to={`/`}>
          <img src="xiaomiTel.jpg" alt="" />
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
