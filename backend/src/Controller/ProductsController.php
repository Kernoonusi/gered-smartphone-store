<?php

namespace Src\Controller;

use Src\Tables\Products;

class ProductsController
{
    private $requestMethod;
    private int | null $productId;
    private $productGateway;
    private string $route;
    private int | null  $limit;
    private $routeActions = [
        'products' => 'getAllProducts',
        'new' => 'getNewProducts',
        'brands' => 'getBrands',
    ];

    public function __construct(\PDO $db, string $requestMethod, array $formData = null, string $route = "")
    {
        $this->requestMethod = $requestMethod;
        $this->productId = $formData['id'] ?? null;
        $this->limit = $formData['limit'] ?? null;
        $this->route = $route;
        $this->productGateway = new Products($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->route != "") {
                    if ($this->productId) {
                        $response = $this->getProduct($this->productId);
                    } else {
                        $response = call_user_func([$this, $this->routeActions[$this->route]]);
                    }
                } // else if ($this->productId) {
                //     $response = $this->getProduct($this->productId);
                // } else {
                //     $response = $this->getAllProducts();
                // }
                break;
            case 'POST':
                $response = $this->createProductFromRequest();
                break;
            case 'PUT':
                $response = $this->updateProductFromRequest($this->productId);
                break;
            case 'DELETE':
                $response = $this->deleteProduct($this->productId);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getAllProducts()
    {
        $result = $this->productGateway->findAll($this->limit);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getBrands()
    {
        $result = $this->productGateway->findAllBrands($this->limit);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getProduct($id)
    {
        $result = $this->productGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getNewProducts()
    {
        $result = $this->productGateway->findAllNew($this->limit);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createProductFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateProduct($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->productGateway->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateProductFromRequest($id)
    {
        $result = $this->productGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateProduct($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->productGateway->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteProduct($id)
    {
        $result = $this->productGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->productGateway->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateProduct($input)
    {
        if (!isset($input['firstname'])) {
            return false;
        }
        if (!isset($input['lastname'])) {
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
