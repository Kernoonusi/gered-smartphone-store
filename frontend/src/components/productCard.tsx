import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { IProduct } from "@/types";
import { Button } from "@shadcnUi/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ item }: { item: IProduct }) {
  return (
    <Card>
      <CardHeader>
        <Link to={`/`}>
          <img src="xiaomiTel.jpg" alt="" />
        </Link>
      </CardHeader>
      <CardContent>
        <Link to={`/`}>
          <p>{item.nameProduct}</p>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>{item.price}₽</p>
        <Button variant={"ghost"} className="w-fit justify-self-end rounded-full">
          <ShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
}
