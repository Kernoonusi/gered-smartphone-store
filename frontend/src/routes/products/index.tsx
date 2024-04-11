import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { ProductCard } from "@/components/productCard";
import { productsService } from "@/services/products.service";
import { Suspense } from "react";

export const Route = createFileRoute("/products/")({
  loader: async () => {
    const data = productsService.getProducts(10);
    return { products: defer(data) };
  },
  component: Index,
});

export function Index() {
  const { products } = Route.useLoaderData();
  return (
    <div className="w-full md:w-10/12 mt-6 flex gap-12 mx-auto">
      <aside></aside>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        <Suspense fallback={<div>Loading...</div>}>
          <Await promise={products}>
            {(data) => {
              return data.map((product) => <ProductCard key={product.id} item={product} />);
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
