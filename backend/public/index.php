<?php
use Src\Router\Router;

define('APP_PATH', dirname(__DIR__));

require APP_PATH . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Src\Core\DatabaseConnector;

require APP_PATH . '/src/Config/Constants.php';

$dotenv = Dotenv::createImmutable(APP_PATH);
$dotenv->load();
$dbConnection = (new DatabaseConnector())->getConnection();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function getFormData($method)
{

    // GET или POST: данные возвращаем как есть
    if ($method === 'GET')
        return $_GET;
    if ($method === 'POST')
        return $_POST;

    // PUT, PATCH или DELETE
    $data = array();
    $exploded = explode('&', file_get_contents('php://input'));

    foreach ($exploded as $pair) {
        $item = explode('=', $pair);
        if (count($item) == 2) {
            $data[urldecode($item[0])] = urldecode($item[1]);
        }
    }

    return $data;
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
$formData = getFormData($requestMethod);
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$headers = getallheaders();

$router = new Router($dbConnection);
$router->route($requestMethod, $uri, $formData, $headers);