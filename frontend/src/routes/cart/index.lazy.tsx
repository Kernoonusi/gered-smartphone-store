import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/cart/")({
  component: Index,
});

function Index() {
  return (
    <main className="w-full md:w-10/12 flex flex-col gap-12 mx-auto">
      
    </main>
  );
}