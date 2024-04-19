/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { ProductCard } from "@/components/productCard";
import { productsService } from "@/services/products.service";
import { Suspense, useState, useTransition } from "react";
import { Card, CardContent, CardFooter } from "@shadcnUi/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcnUi/form";
import { Input } from "@shadcnUi/input";
import { Button } from "@/components/ui/button";
import { Slider2thumb } from "@/components/ui/slider2thumb";
import { Loader2 } from "lucide-react";
import { IProduct } from "@/types";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const searchSchema = z.object({
  brandSearch: z.string().optional(),
});

type BrandSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/products/")({
  validateSearch: (search) => {
    return searchSchema.parse(search);
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: search }) => {
    const filters = await productsService.getFilters();
    const newFilters = {
      ...filters,
      brands: filters.brands.map((brand) => ({
        label: brand.brand,
        value: brand.brand,
      })) as Option[],
    };
    let products: Promise<IProduct[]>;
    if (search.search.brandSearch !== undefined) {
      products = productsService.getProducts(20, {
        filters: filters.filters,
        brands: [{ brand: search.search.brandSearch }],
      });
    } else {
      products = productsService.getProducts(20);
    }
    return { products: defer(products), filters: newFilters };
  },
  component: Index,
});

export function Index() {
  const { brandSearch }: BrandSearch = Route.useSearch();
  const {
    products,
    filters: { filters, brands },
  } = Route.useLoaderData();
  const [filteredProducts, setProducts] = useState<IProduct[]>([]);
  const [ram, setRam] = useState([filters.minRam, filters.maxRam]);
  const [storage, setStorage] = useState([filters.minStorage, filters.maxStorage]);
  const [size, setSize] = useState([filters.minSize, filters.maxSize]);
  const [weight, setWeight] = useState([filters.minWeight, filters.maxWeight]);
  const [brandIsOpen, setBrandIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    minPrice: z.coerce.number().min(Math.floor(filters.minPrice)).max(Math.round(filters.maxPrice)),
    maxPrice: z.coerce.number().min(Math.floor(filters.minPrice)).max(Math.round(filters.maxPrice)),
    brand: z.array(z.object({ value: z.string(), label: z.string() })),
    ram: z.array(z.coerce.number().min(filters.minRam).max(filters.maxRam)),
    storage: z.array(z.coerce.number().min(filters.minStorage).max(filters.maxStorage)),
    size: z.array(z.coerce.number().min(filters.minSize).max(filters.maxSize)),
    weight: z.array(z.coerce.number().min(0).max(1000000)),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minPrice: Math.floor(filters.minPrice),
      maxPrice: Math.round(filters.maxPrice),
      brand: brandSearch ? [{ value: brandSearch, label: brandSearch }] : [],
      ram: [filters.minRam, filters.maxRam],
      storage: [filters.minStorage, filters.maxStorage],
      size: [filters.minSize, filters.maxSize],
      weight: [filters.minWeight, filters.maxWeight],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      productsService
        .getProducts(20, {
          brands: values.brand.map((brand) => {
            return { brand: brand.value };
          }),
          filters: {
            minPrice: values.minPrice,
            maxPrice: values.maxPrice,
            minRam: values.ram[0],
            maxRam: values.ram[1],
            minStorage: values.storage[0],
            maxStorage: values.storage[1],
            minSize: values.size[0],
            maxSize: values.size[1],
            minWeight: values.weight[0],
            maxWeight: values.weight[1],
          },
        })
        .then((data) => {
          setProducts(data);
        });
    });
  }
  return (
    <div className="w-full md:w-10/12 mt-6 flex flex-col lg:grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-6 mx-auto">
      <h2 className="text-3xl col-span-2">Товары</h2>
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Фильтры</AccordionTrigger>
          <AccordionContent>
            <Card className="pt-6 ld:max-w-[240px] h-fit">
              <CardContent>
                <Form {...form}>
                  <form
                    name="filterForm"
                    id="filterForm"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                    <div className="grid grid-cols-2">
                      <FormLabel className="col-span-2 mb-3">Цена</FormLabel>
                      <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="rounded-r-none content"
                                type="number"
                                placeholder="От"
                                min={Math.floor(filters.minPrice)}
                                max={Math.round(filters.maxPrice)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="rounded-l-none"
                                type="number"
                                placeholder="До"
                                min={Math.floor(filters.minPrice)}
                                max={Math.round(filters.maxPrice)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Бренды</FormLabel>
                          <FormControl>
                            <div
                              onFocus={() => setBrandIsOpen(true)}
                              onBlur={() => setBrandIsOpen(false)}>
                              <MultipleSelector
                                onChange={field.onChange}
                                value={field.value}
                                defaultOptions={brands}
                                emptyIndicator={
                                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                  </p>
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className={`transition-all ${brandIsOpen ? "h-64" : "h-0"} w-1`} />
                    <FormField
                      control={form.control}
                      name="ram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Оперативная память <br /> {ram[0]}гб - {ram[1]}гб
                          </FormLabel>
                          <FormControl>
                            <Slider2thumb
                              onValueChange={(e) => {
                                field.onChange(e), setRam(e);
                              }}
                              value={field.value}
                              min={filters.minRam}
                              max={filters.maxRam}
                              step={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="storage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Встроенная память <br /> {storage[0]}гб - {storage[1]}гб
                          </FormLabel>
                          <FormControl>
                            <Slider2thumb
                              onValueChange={(e) => {
                                field.onChange(e), setStorage(e);
                              }}
                              value={field.value}
                              min={filters.minStorage}
                              max={filters.maxStorage}
                              step={64}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Размер экрана <br /> {size[0]}&quot; - {size[1]}&quot;
                          </FormLabel>
                          <FormControl>
                            <Slider2thumb
                              onValueChange={(e) => {
                                field.onChange(e), setSize(e);
                              }}
                              value={field.value}
                              min={+filters.minSize}
                              max={+filters.maxSize}
                              step={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Вес <br /> {weight[0]}г - {weight[1]}г
                          </FormLabel>
                          <FormControl>
                            <Slider2thumb
                              onValueChange={(e) => {
                                field.onChange(e), setWeight(e);
                              }}
                              value={field.value}
                              min={+filters.minWeight}
                              max={+filters.maxWeight}
                              step={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="filterForm" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Применить
                </Button>
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="grid gap-4 auto-rows-min grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredProducts.length === 0 ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Await promise={products}>
              {(data) => {
                return data.map((product) => <ProductCard key={product.id} item={product} />);
              }}
            </Await>
          </Suspense>
        ) : (
          filteredProducts.map((product) => <ProductCard key={product.id} item={product} />)
        )}
      </div>
    </div>
  );
}
