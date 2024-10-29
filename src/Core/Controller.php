<?php

namespace Src\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Controller
{
    public function __construct(
        public \PDO $db,
        public string $requestMethod,
        public array|null $formData = null,
        public string $route = "",
        public array $headers = [],
        public array $requiredKeys = [],
        public array $routeActions = []
    ) {
    }

    public function jwtEncode($data)
    {
        $payload = [
            "iss" => "http://104.252.127.196",
            "aud" => "http://104.252.127.196",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "data" => $data
        ];
        $encoded = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
        return $encoded;
    }

    public function badRequestResponse($error)
    {
        $response['status_code_header'] = 400;
        $response['body'] = json_encode(['error' => $error]);
        return $response;
    }

    public function unprocessableEntityResponse()
    {
        $response['status_code_header'] = 422;
        $response['body'] = json_encode([
            'error' => 'Невалидный ввод'
        ]);
        return $response;
    }

    public function notFoundResponse()
    {
        $response['status_code_header'] = 404;
        $response['body'] = null;
        return $response;
    }

    public function validateToken($jwt)
    {
        try {
            $decoded = JWT::decode($jwt, new Key($_ENV['JWT_SECRET'], 'HS256'));
            return ["data" => $decoded->data];
        } catch (\Exception $e) {
            return false;
        }
    }

    public function validate($input)
    {
        foreach ($this->requiredKeys as $key) {
            if (!isset($input[$key])) {
                return false;
            }
        }
        return true;
    }
}