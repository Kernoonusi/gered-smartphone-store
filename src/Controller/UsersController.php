<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Users;

require APP_PATH . '/src/Config/Constants.php';

class UsersController extends Controller
{
    private Users $tableGateway;
    public function __construct(
        \PDO $db,
        string $requestMethod,
        array|null $formData = null,
        string $route = "",
        array $headers = [],
    ) {
        parent::__construct(
            $db,
            $requestMethod,
            $formData,
            $route,
            $headers,
            [
                'name',
                'email',
                'password'
            ],
            [
                'login' => 'login',
                'create' => 'createUserFromRequest',
                'me' => 'getUser',
                'admin' => 'isAdminByEmail',
                'getAll' => 'getAllUsers',
                'delete' => 'deleteUser',
                'updateRole' => 'updateRole',
                'update' => 'updateUserFromRequest',
            ]
        );
        $this->tableGateway = new Users($db);
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

    private function getUserById($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
    }

    private function getUser()
    {
        $token = explode(' ', $this->headers['Authorization'])[1];
        $decoded = $this->validateToken($token);
        if (!$decoded) {
            return $this->unprocessableEntityResponse();
        }
        $result = $this->tableGateway->findByEmail($decoded['data']->email);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getAllUsers()
    {
        $result = $this->tableGateway->findAll();
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function isAdminByEmail()
    {
        $token = explode(' ', $this->headers['Authorization'])[1];
        $decoded = $this->validateToken($token);
        if (!$decoded) {
            return $this->unprocessableEntityResponse();
        }
        $result = $this->tableGateway->isAdminByEmail($decoded['data']->email);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function login()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $result = $this->tableGateway->findByEmail($input['email']);
        if (!$result) {
            return $this->badRequestResponse('Нет пользователя с данным email');
        }
        if (!password_verify($input['password'], $result['password'])) {
            return $this->badRequestResponse('Неправильный пароль');
        }
        $jwt = $this->jwtEncode($result);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            array(
                "message" => "Вход выполнен",
                "jwt" => $jwt
            )
        );
        return $response;
    }

    private function updateRole()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $this->tableGateway->updateRole($input['role_id'], $input['id']);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode(
            array(
                "message" => "Успешное обновление роли",
            )
        );
        return $response;
    }

    private function updateUserFromRequest()
    {
        $id = "";
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (isset($this->headers['Authorization']) ) {
            $token = explode(' ', $this->headers['Authorization'])[1];
            $decoded = $this->validateToken($token);
            if (!$decoded) {
                return $this->unprocessableEntityResponse();
            }
            $result = $this->tableGateway->findByEmail($decoded['data']->email);
            if (!$result) {
                return $this->notFoundResponse();
            }
            $input['id'] = $result['id'];
            $id = $input['id'];
        } else if (isset($input['email'])) {
            $result = $this->tableGateway->findByEmail($input['email']);
            if (!$result) {
                return $this->notFoundResponse();
            }
            $input['id'] = $result['id'];
            $id = $input['id'];
        }
        $this->tableGateway->update($input, $id);
        if (isset($this->headers['Authorization'])) {
            $updatedUser = $this->tableGateway->find($id);
            $jwt = $this->jwtEncode($updatedUser);
        }
        $response['status_code_header'] = 200;
        $result = ["message" => "Success update user"];
        if (isset($jwt)) {
            $result['jwt'] = $jwt;
        }
        $response['body'] = json_encode($result);
        return $response;
    }

    private function deleteUser()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $this->tableGateway->delete($input['id']);
        $response['status_code_header'] = 204;
        $response['body'] = json_encode(
            [
                "message" => "Успешное удаление пользователя"
            ]
        );
        return $response;
    }

    private function createUserFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validate($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->insert($input);
        $jwt = $this->jwtEncode($input);
        $response['body'] = json_encode(
            array(
                "jwt" => $jwt
            )
        );
        $response['status_code_header'] = 201;
        $response['body'] = json_encode(
            array(
                "message" => "Успешное создание пользователя",
                "jwt" => $jwt
            )
        );
        return $response;
    }
}
