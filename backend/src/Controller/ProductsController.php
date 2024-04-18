<?php

namespace Src\Controller;

use Src\Core\Controller;
use Src\Tables\Products;

require APP_PATH . '/src/Config/Constants.php';

class ProductsController extends Controller
{
    private Products $tableGateway;
    private int|null $productId;
    private $limit;
    private $filters = [
        "minPrice" => 0,
        "maxPrice" => 0,
        "minRam" => 0,
        "maxRam" => 0,
        "minStorage" => 0,
        "maxStorage" => 0,
        "minSize" => 0,
        "maxSize" => 0,
        "minWeight" => 0,
        "maxWeight" => 0,
        "brand" => "",
    ];

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
                'create' => 'createProduct',
                'update' => 'updateProduct',
                'delete' => 'deleteProduct',
                'products' => 'getAllProducts',
                'new' => 'getNewProducts',
                'brands' => 'getBrands',
                'filters' => 'getFilters'
            ]
        );
        $this->filters['brand'] = $formData['brand'] ?? $this->filters['brand'];
        $this->filters['minPrice'] = $formData['minPrice'] ?? $this->filters['minPrice'];
        $this->filters['maxPrice'] = $formData['maxPrice'] ?? $this->filters['maxPrice'];
        $this->filters['minRam'] = $formData['minRam'] ?? $this->filters['minRam'];
        $this->filters['maxRam'] = $formData['maxRam'] ?? $this->filters['maxRam'];
        $this->filters['minStorage'] = $formData['minStorage'] ?? $this->filters['minStorage'];
        $this->filters['maxStorage'] = $formData['maxStorage'] ?? $this->filters['maxStorage'];
        $this->filters['minSize'] = $formData['minSize'] ?? $this->filters['minSize'];
        $this->filters['maxSize'] = $formData['maxSize'] ?? $this->filters['maxSize'];
        $this->filters['minWeight'] = $formData['minWeight'] ?? $this->filters['minWeight'];
        $this->filters['maxWeight'] = $formData['maxWeight'] ?? $this->filters['maxWeight'];
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
                if ($this->route != "") {
                    $response = call_user_func([$this, $this->routeActions[$this->route]]);
                }
                break;
            case 'PUT':
                $response = $this->updateProduct($this->productId);
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
        if ($this->limit) {
            if ($this->filters['brand'] != "") {
                $prepared_filters = [
                    "price" => "price BETWEEN :minPrice AND :maxPrice",
                    "ram" => "ram BETWEEN :minRam and :maxRam",
                    "storage" => "storage BETWEEN :minStorage and :maxStorage",
                    "size" => "size BETWEEN :minSize and :maxSize",
                    "weight" => "weight BETWEEN :minWeight and :maxWeight"
                ];
                if ($this->filters['brand'] != "all") {
                    $filter_brands = explode("_", $this->filters['brand']);
                    $prepared_filters['brand'] = "brand IN ('" . implode("', '", $filter_brands) . "')";
                }
                $result = $this->tableGateway->findProductsWithFilters($prepared_filters, $this->filters, $this->limit);
            } else {
                $result = $this->tableGateway->findAll($this->limit);
            }
        } else {
            $result = $this->tableGateway->findAll();
        }
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

    private function getFilters()
    {
        $filters = $this->tableGateway->findAllFilters();
        $brands = $this->tableGateway->findAllBrands();
        $result = ["filters" => $filters, "brands" => $brands];
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

    private function createProduct()
    {
        $input = [
            "nameProduct" => $_POST["nameProduct"],
            "brand" => $_POST["brand"],
            "price" => $_POST["price"],
            "ram" => $_POST["ram"],
            "soc" => $_POST["soc"],
            "storage" => $_POST["storage"],
            "size" => $_POST["size"],
            "weight" => $_POST["weight"],
            "releaseYear" => $_POST["releaseYear"],
            "description" => $_POST["description"],
            "count" => $_POST["count"]
        ];
        if (!$this->validate($input)) {
            return $this->unprocessableEntityResponse();
        }
        $images = $_FILES['images'];
        $targetDirectory = APP_PATH . '/public/smartphones/';
        $view_of_image = ["", "2", "Front", "LeftSide", "RightSide", "Side", "UpSide"];
        $i = 0;
        foreach ($images['tmp_name'] as $key => $tmpName) {
            if ($tmpName == '') {
                continue;
            }
            $targetFile = $targetDirectory . $_POST["brand"] . '_' . implode('_', explode(' ', $_POST["nameProduct"])) . "Tel" . $view_of_image[$i] . ".jpg";
            // $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
            if (!getimagesize($tmpName)) {
                $result = "Файл " . htmlspecialchars(basename($images['name'][$key])) . " не является изображением.\n";
                $response['status_code_header'] = 400;
                $response['body'] = json_encode(
                    [
                        'message' => $result,
                    ]
                );
                return $response;
            }
            if (!move_uploaded_file($tmpName, $targetFile)) {
                $result = "Произошла ошибка при загрузке файла " . htmlspecialchars(basename($images['name'][$key])) . ".\n";
                $response['status_code_header'] = 400;
                $response['body'] = json_encode(
                    [
                        'message' => $result,
                    ]
                );
                return $response;
            }
            $i++;
        }
        $this->tableGateway->insert($input);
        $response['status_code_header'] = 201;
        $response['body'] = json_encode(
            [
                'message' => 'Продукт создан',
            ]
        );
        return $response;
    }

    private function updateProduct($id)
    {
        if ($_POST["nameProduct"] == "" && $_FILES['images']['tmp_name']) {
            $images = $_FILES['images'];
            $targetDirectory = APP_PATH . '/public/smartphones/';
            $view_of_image = ["", "2", "Front", "LeftSide", "RightSide", "Side", "UpSide"];
            $product = $this->tableGateway->find($id);
            $i = 0;
            foreach ($images['tmp_name'] as $key => $tmpName) {
                if ($tmpName == '') {
                    continue;
                }
                $targetFile = $targetDirectory . $product["brand"] . '_' . implode('_', explode(' ', $product["nameProduct"])) . "Tel" . $view_of_image[$i] . ".jpg";
                // $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
                if (!getimagesize($tmpName)) {
                    $result = "Файл " . htmlspecialchars(basename($images['name'][$key])) . " не является изображением.\n";
                    $response['status_code_header'] = 400;
                    $response['body'] = json_encode(
                        [
                            'message' => $result,
                        ]
                    );
                    return $response;
                }
                if (!move_uploaded_file($tmpName, $targetFile)) {
                    $result = "Произошла ошибка при загрузке файла " . htmlspecialchars(basename($images['name'][$key])) . ".\n";
                    $response['status_code_header'] = 400;
                    $response['body'] = json_encode(
                        [
                            'message' => $result,
                        ]
                    );
                    return $response;
                }
                $i++;
            }
        } else {
            $input = [
                "nameProduct" => $_POST["nameProduct"],
                "brand" => $_POST["brand"],
                "price" => $_POST["price"],
                "ram" => $_POST["ram"],
                "soc" => $_POST["soc"],
                "storage" => $_POST["storage"],
                "size" => $_POST["size"],
                "weight" => $_POST["weight"],
                "releaseYear" => $_POST["releaseYear"],
                "description" => $_POST["description"],
                "count" => $_POST["count"]
            ];
            if (!$this->validate($input)) {
                return $this->unprocessableEntityResponse();
            }
            $this->tableGateway->update($input, $id);
            $response['status_code_header'] = 200;
            $response['body'] = null;
            return $response;
        }
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
