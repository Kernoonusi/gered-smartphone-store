<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Orders;
use Src\Tables\Users;

require APP_PATH . '/src/Config/Constants.php';

class OrderController extends Controller
{
    private int|null $basketId;
    private Orders $tableGateway;
    private Users $tableGatewayUsers;

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
                "status_id",
                "note"
            ],
            [
                'create' => 'createOrder',
                'me' => 'getUserOrders',
                'all' => 'getAllOrders',
                "updateStatus" => "updateStatus",
                "delete" => "deleteOrder"
            ]
        );
        $this->basketId = $formData['id'] ?? null;
        $this->tableGateway = new Orders($db);
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

    private function getUserOrders()
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

    private function getAllOrders()
    {
        $result = $this->tableGateway->findAll();
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            $result
        );
        return $response;
    }

    private function createOrder()
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
        $order = [
            'user_id' => $user['id'],
            'note' => $input['note'] ?? null,
            'products' => $input['products']
        ];
        $this->tableGateway->insert($order);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            ["message" => 'Заказ создан']
        );
        return $response;
    }

    private function updateStatus()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $this->tableGateway->updateStatus($input['status_id'], $input['id']);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            ["message" => 'Статус заказа обновлен']
        );
        return $response;
    }

    private function deleteOrder()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $this->tableGateway->delete($input['id']);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            ["message" => 'Заказ удален']
        );
        return $response;
    }
}