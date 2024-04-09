<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Products;

class ProductsController extends Controller
{
    private Products $tableGateway;
    private int|null $productId;
    private $limit;

    public function __construct(\PDO $db, string $requestMethod, array $formData = null, string $route = "", array $headers = [])
    {
        parent::__construct(
            $db,
            $requestMethod,
            $formData,
            $route,
            $headers,
            [
                'nameProduct',
                'price',
                'description',
                'ram',
                'storage',
                'soc',
                'weight',
                'size',
                'brand',
                'releaseYear',
                'count'
            ],
            [
                'create' => 'createProductFromRequest',
                'update' => 'updateProductFromRequest',
                'delete' => 'deleteProduct',
                'products' => 'getAllProducts',
                'new' => 'getNewProducts',
                'brands' => 'getBrands',
            ]
        );
        $this->productId = $formData['id'] ?? null;
        $this->limit = $formData['limit'] ?? null;
        $this->tableGateway = new Products($db);
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
        http_response_code($response['status_code_header']);
        if (isset($response['body'])) {
            echo $response['body'];
        }
    }

    private function getAllProducts()
    {
        $result = $this->tableGateway->findAll($this->limit);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getBrands()
    {
        $result = $this->tableGateway->findAllBrands($this->limit);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getProduct($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getNewProducts()
    {
        $result = $this->tableGateway->findAllNew($this->limit);
        $response['status_code_header'] = 200;
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createProductFromRequest()
    {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validate($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->insert($input);
        $response['status_code_header'] = 201;
        $response['body'] = null;
        return $response;
    }

    private function updateProductFromRequest($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validate($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->tableGateway->update($id, $input);
        $response['status_code_header'] = 200;
        $response['body'] = null;
        return $response;
    }

    private function deleteProduct($id)
    {
        $result = $this->tableGateway->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->tableGateway->delete($id);
        $response['status_code_header'] = 200;
        $response['body'] = null;
        return $response;
    }
}
