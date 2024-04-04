<?php

namespace Src\Core;

class Table
{
    public function __construct(private \PDO $db)
    {
    }

    public function fetchAll(string $query, array $params = []): array
    {
        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function fetchOne(string $query, array $params = []): array
    {
        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            return $stmt->fetch();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function execute(string $query, array $params = []): void
    {
        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}
