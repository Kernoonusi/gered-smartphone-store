<?php

namespace Src\Core;

class DatabaseConnector
{

    private \PDO $pdo;

    public function __construct()
    {
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $db = $_ENV['DB_DATABASE'];
        $user = $_ENV['DB_USERNAME'];
        $pass = $_ENV['DB_PASSWORD'];

        try {
            $this->pdo = new \PDO(
                "mysql:host=$host:$port;dbname=$db",
                $user,
                $pass
            );
        } catch (\PDOException $e) {
            exit("Connection failed: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
