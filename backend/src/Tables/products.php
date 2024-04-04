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

    public function findAll($limit)
    {
        $sql = "SELECT * FROM $this->t ORDER BY id ASC";
        if($limit > 0){
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function findAllNew($limit){
        $sql = "SELECT * FROM $this->t ORDER BY releaseYear DESC";
        if($limit > 0){
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function findAllBrands($limit){
        $sql = "SELECT brand FROM $this->t group by brand";
        if($limit > 0){
            $sql .= " LIMIT $limit";
        }
        return $this->fetchAll($sql);
    }

    public function find($id)
    {
        $sql = "SELECT * FROM $this->t WHERE id = $id";
        return $this->fetchOne($sql);
    }

    public function delete($id)
    {
        $sql = "DELETE FROM $this->t WHERE id = $id";
        $this->execute($sql);
    }

    public function insert($data)
    {
        $sql = "INSERT INTO $this->t (name, price) VALUES (:name, :price)";
        $this->execute($sql, $data);
    }

    public function update($id, $data)
    {
        $sql = "UPDATE $this->t SET name = :name, price = :price WHERE id = $id";
        $this->execute($sql, $data);
    }
}
