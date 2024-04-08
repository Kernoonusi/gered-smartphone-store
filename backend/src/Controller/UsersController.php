<?php

namespace Src\Controller;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Src\Tables\Users;

require APP_PATH . '/src/Config/Constants.php';

class UsersController
{
    private $requestMethod;
    private int|null $userId;
    private $tableGateway;
    private string $route;
    // private int | null  $limit;
    private $routeActions = [
        'login' => 'login',
    ];
    private array $formData;

    public function __construct(\PDO $db, string $requestMethod, array $formData = null, string $route = "")
    {
        $this->requestMethod = $requestMethod;
        $this->formData = $formData;
        $this->userId = $formData['id'] ?? null;
        $this->limit = $formData['limit'] ?? null;
        $this->route = $route;
        $this->tableGateway = new Users($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->route != "") {
                    if ($this->userId) {
                        $response = $this->getUser($this->userId);
                    } else {
                        $response = call_user_func([$this, $this->routeActions[$this->route]]);
                    }
                }
                break;
            case 'POST':
                $response = $this->createUserFromRequest();
                break;
            case 'PUT':
                $response = $this->updateUserFromRequest($this->userId);
                break;
            // case 'DELETE':
            //     $response = $this->deleteProduct($this->productId);
            //     break;
            // default:
            //     $response = $this->notFoundResponse();
            //     break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getUser($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function login()
    {
        $input = json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateUser($input)) {
            return $this->unprocessableEntityResponse();
        }
        $result = $this->tableGateway->findByEmail($input['email']);
        if (!$result) {
            return $this->notFoundResponse();
        }
        if (!password_verify($input['password'], $result['password'])) {
            return $this->unprocessableEntityResponse();
        }
        $key = "secret_key";
        $payload = [
            "iss" => "http://gered-store-back.lndo.site/",
            "aud" => "http://gered-store-back.lndo.site/",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "data" => $result
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(
            array(
                "message" => "Success login",
                "jwt" => $jwt
            )
        );
        return $response;
    }

    private function updateUserFromRequest($id)
    {
        $input = json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateUser($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->update($input, $id);
        $updatedUser = $this->tableGateway->find($id);
        $key = "secret_key";
        $payload = [
            "iss" => "http://gered-store-back.lndo.site/",
            "aud" => "http://gered-store-back.lndo.site/",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "data" => $updatedUser
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(
            array(
                "message" => "Success update user",
                "jwt" => $jwt
            )
        );
        return $response;
    }

    private function createUserFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateUser($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->insert($input);
        $key = "secret_key";
        $payload = [
            "iss" => "http://gered-store-back.lndo.site/",
            "aud" => "http://gered-store-back.lndo.site/",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "data" => $input
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');
        $response['body'] = json_encode(
            array(
                "jwt" => $jwt
            )
        );
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = json_encode(
            array(
                "message" => "Success create user",
                "jwt" => $jwt
            )
        );
        return $response;
    }

    public function validateToken($jwt)
    {
        try {
            $key = "secret_key";
            $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
            return ["data" => $decoded->data];
        } catch (\Exception $e) {
            return false;
        }
    }

    private function validateUser($input)
    {
        if (!isset($input['email'])) {
            return false;
        }
        if (!isset($input['password'])) {
            return false;
        }
        if (!isset($input['name'])) {
            return false;
        }
        return true;
    }

    private function unprocessableEntityResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode([
            'error' => 'Invalid input'
        ]);
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = null;
        return $response;
    }
}