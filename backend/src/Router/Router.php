<?php

namespace Src\Router;

use Src\Controller\ProductsController;

class Router
{
    private $routes = ["products" => ProductsController::class];

    public function __construct(private $db)
    {
        $this->db = $db;
    }

    public function route(string $method, string $uri, array $formData = null)
    {
        $urls = explode("/", $uri);
        if (array_key_exists($urls[1], $this->routes)) {
            $controller = new $this->routes[$urls[1]]($this->db, $method, $formData, $urls[array_key_last($urls)]);
            $controller->processRequest();
        }
    }
}