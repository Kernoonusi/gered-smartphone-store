<?php

namespace Src\Router;

use Src\Controller\ProductsController;
use Src\Controller\UsersController;

class Router
{
    private $routes = ["products" => ProductsController::class, "users" => UsersController::class];

    public function __construct(private $db)
    {
        $this->db = $db;
    }

    public function route(string $method, string $uri, array $formData = null, array $headers = [])
    {
        $urls = explode("/", $uri);
        if (array_key_exists($urls[1], $this->routes)) {
            $controller = new $this->routes[$urls[1]]($this->db, $method, $formData, $urls[array_key_last($urls)], $headers);
            $controller->processRequest();
        }
    }
}