<?php

namespace Src\Tables;

use Src\Core\Table;

class Products extends Table
{
    private $t = 'products';

    public function __construct(private $db)
    {
        parent::__construct($db);
    }

    public function findAll($limit = 0)
    {
        $sql = "SELECT * FROM $this->t ORDER BY id ASC";
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function findAllNew($limit)
    {
        $sql = "SELECT * FROM $this->t ORDER BY releaseYear DESC";
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function findAllBrands($limit = 0)
    {
        $sql = "SELECT brand FROM $this->t group by brand";
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function findProductsWithFilters($filters, $filter_params, $limit = 0)
    {
        $sql = "SELECT * FROM $this->t";
        if (!empty($filters)) {
            $sql .= " WHERE ";
            $sql .= implode(" AND ", $filters);
        }
        $sql = rtrim($sql, " AND ");
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }
        $params = [
            'minPrice' => $filter_params['minPrice'],
            'maxPrice' => $filter_params['maxPrice'],
            'minRam' => $filter_params['minRam'],
            'maxRam' => $filter_params['maxRam'],
            'minStorage' => $filter_params['minStorage'],
            'maxStorage' => $filter_params['maxStorage'],
            'minSize' => $filter_params['minSize'] - 0.1,
            'maxSize' => $filter_params['maxSize'] + 0.1,
            'minWeight' => $filter_params['minWeight'],
            'maxWeight' => $filter_params['maxWeight']
        ];
        return $this->fetchAll($sql, $params);
    }

    public function find($id)
    {
        $sql = "SELECT * FROM $this->t WHERE id = $id";
        return $this->fetchOne($sql);
    }

    public function findAllFilters()
    {
        $sql = "SELECT 
        min(price) as minPrice, max(price) as maxPrice,
        min(ram) as minRam, max(ram) as maxRam,
        min(storage) as minStorage, max(storage) as maxStorage, 
        min(size) as minSize, max(size) as maxSize, 
        min(weight) as minWeight, max(weight) as maxWeight
        FROM $this->t";
        return $this->fetchOne($sql);
    }

    public function delete($id)
    {
        $sql = "DELETE FROM $this->t WHERE id = $id";
        $this->execute($sql);
    }

    public function insert($data)
    {
        $sql = "INSERT INTO $this->t 
        (nameProduct, price, description, ram, storage, soc, weight, size, brand, releaseYear, count) 
        VALUES (:nameProduct, :price, :description, :ram, :storage, :soc, :weight, :size, :brand, :releaseYear, :count)";
        $this->execute($sql, [
            'nameProduct' => $data['nameProduct'],
            'price' => $data['price'],
            'description' => $data['description'],
            'ram' => $data['ram'],
            'storage' => $data['storage'],
            'soc' => $data['soc'],
            'weight' => $data['weight'],
            'size' => $data['size'],
            'brand' => $data['brand'],
            'releaseYear' => $data['releaseYear'],
            'count' => $data['count']
        ]);
    }

    public function update($id, $data)
    {
        $sql = "UPDATE $this->t SET 
        name = :name, price = :price, description = :description,
        ram = :ram, storage = :storage, soc = :soc,
        weight = :weight, size = :size, brand = :brand,
        releaseYear = :releaseYear, count = :count WHERE id = :id";
        $this->execute($sql, [
            'nameProduct' => $data['nameProduct'],
            'price' => $data['price'],
            'description' => $data['description'],
            'ram' => $data['ram'],
            'storage' => $data['storage'],
            'soc' => $data['soc'],
            'weight' => $data['weight'],
            'size' => $data['size'],
            'brand' => $data['brand'],
            'releaseYear' => $data['releaseYear'],
            'count' => $data['count'],
            'id' => $id
        ]);
    }
}
