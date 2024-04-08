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
        'me' => 'getUser',
    ];
    private array $formData;
    private array $headers;

    public function __construct(\PDO $db, string $requestMethod, array $formData = null, string $route = "", array $headers = [])
    {
        $this->requestMethod = $requestMethod;
        $this->formData = $formData;
        $this->userId = $formData['id'] ?? null;
        // $this->limit = $formData['limit'] ?? null;
        $this->route = $route;
        $this->headers = $headers;
        $this->tableGateway = new Users($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->route != "") {
                    if ($this->userId) {
                        $response = $this->getUserById($this->userId);
                    } else {
                        $response = call_user_func([$this, $this->routeActions[$this->route]]);
                    }
                }
                break;
            case 'POST':
                if ($this->route != "") {
                    if (array_key_exists($this->route, $this->routeActions)) {
                        $response = $this->{$this->routeActions[$this->route]}();
                    } else {
                        $response = call_user_func([$this, $this->routeActions[$this->route]]);
                    }
                } else {
                    $response = call_user_func([$this, $this->routeActions[$this->route]]);
                }
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
        http_response_code($response['status_code_header']);
        if (isset($response['body'])) {
            echo $response['body'];
        }
    }

    private function getUserById($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getUser()
    {
        $decoded = $this->validateToken(str_split($this->headers['Authorization'])[2]);
        var_dump($this->headers['Authorization'][2]);
        if (!$decoded) {
            return $this->unprocessableEntityResponse();
        }
        $result = $this->tableGateway->findByEmail($decoded['data']['email']);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function login()
    {
        $input = json_decode(file_get_contents('php://input'), TRUE);
        $result = $this->tableGateway->findByEmail($input['email']);
        if (!$result) {
            return $this->notFoundResponse();
        }
        if (!password_verify($input['password'], $result['password'])) {
            return $this->badRequestResponse('Неправильный пароль');
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
        $response['status_code_header'] = 200;
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
        $response['status_code_header'] = 200;
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
        $response['status_code_header'] = 201;
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

    private function badRequestResponse($error)
    {
        $response['status_code_header'] = 400;
        $response['body'] = json_encode(['error' => $error]);
        return $response;
    }

    private function unprocessableEntityResponse()
    {
        $response['status_code_header'] = 422;
        $response['body'] = json_encode([
            'error' => 'Невалидный ввод'
        ]);
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 404;
        $response['body'] = null;
        return $response;
    }
}
