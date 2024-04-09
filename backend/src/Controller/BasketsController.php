<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Baskets;

require APP_PATH . '/src/Config/Constants.php';

class BasketsController extends Controller
{
    private Baskets $tableGateway;
    private int|null $basketId;

    public function __construct(
        \PDO $db,
        string $requestMethod,
        array|null $formData = null,
        string $route = "",
        array $headers = []
    ) {
        parent::__construct(
            $db,
            $requestMethod,
            $formData,
            $route,
            $headers,
            [
                "user_id",
                "product_id",
                "countBasket"
            ],
            [
                'create' => 'createBasketFromRequest',
                'update' => 'updateBasketFromRequest',
                'delete' => 'deleteBasket',
                'baskets' => 'getAllBaskets',
            ]
        );
        $this->basketId = $formData['id'] ?? null;
        $this->tableGateway = new Baskets($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->route != "") {
                    $response = call_user_func([$this, $this->routeActions[$this->route]]);
                }
                break;
            case 'POST':
                if ($this->route != "") {
                    $response = $this->{$this->routeActions[$this->route]}();
                }
                break;
            // case 'PUT':
            //     $response = $this->updateUserFromRequest($this->userId);
            //     break;
            // case 'DELETE':
            //     $response = $this->deleteProduct($this->productId);
            //     break;
            // default:
            //     $response = $this->notFoundResponse();
            //     break;
        }
        http_response_code($response['status_code_header']);
        if (isset($response['body'])) {
            echo $response['body'];
        }
    }

}