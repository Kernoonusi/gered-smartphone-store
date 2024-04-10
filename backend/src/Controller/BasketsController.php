<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Baskets;
use Src\Tables\Users;

require APP_PATH . '/src/Config/Constants.php';

class BasketsController extends Controller
{
    private Baskets $tableGateway;
    private Users $tableGatewayUsers;
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
                'add' => 'addProductToBasket',
                'delete' => 'deleteProductFromBasket',
                'me' => 'getUserBasket',
            ]
        );
        $this->basketId = $formData['id'] ?? null;
        $this->tableGateway = new Baskets($db);
        $this->tableGatewayUsers = new Users($db);
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
                    $response = call_user_func([$this, $this->routeActions[$this->route]]);
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

    public function getUserBasket()
    {
        $token = explode(' ', $this->headers['Authorization'])[1];
        $decoded = $this->validateToken($token);
        if (!$decoded) {
            return $this->unprocessableEntityResponse();
        }
        $user = $this->tableGatewayUsers->findByEmail($decoded['data']->email);
        if (!$user) {
            return $this->notFoundResponse();
        }
        $result = $this->tableGateway->findByUserId($user['id']);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            $result
        );
        return $response;
    }

    public function addProductToBasket()
    {
        $token = explode(' ', $this->headers['Authorization'])[1];
        $decoded = $this->validateToken($token);
        if (!$decoded) {
            return $this->unprocessableEntityResponse();
        }
        $user = $this->tableGatewayUsers->findByEmail($decoded['data']->email);
        if (!$user) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $product = [
            "user_id" => $user['id'],
            "product_id" => $input['product_id'],
            "countBasket" => $input['countBasket']
        ];
        if (!$this->validate($product)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->insert($product);
        $response['status_code_header'] = 201;
        $response['body'] = json_encode(
            array(
                "message" => "Продукт добавлен в корзину",
            )
        );
        return $response;
    }
}
