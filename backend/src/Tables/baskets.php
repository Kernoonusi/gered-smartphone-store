<?php

namespace Src\Tables;

use Src\Core\Table;

class Baskets extends Table
{
    private $t = 'baskets';

    public function __construct(private $db)
    {
        parent::__construct($db);
    }

    public function insert($data)
    {
        $sql = "INSERT INTO $this->t (user_id, product_id, countBasket) VALUES (:user_id, :product_id, :countBasket)";
        $this->execute($sql, $data);
    }

    public function findByUserId(int $id)
    {
        $sql = "SELECT p.*, b.countBasket
                FROM $this->t b
                RIGHT JOIN products p ON p.id = b.product_id
                WHERE b.user_id = :id";
        return $this->fetchAll($sql, ['id' => $id]);
    }

    public function remove(int $user_id, int $product_id){
        $sql = "DELETE FROM $this->t WHERE user_id = :user_id AND product_id = :product_id";
        $this->execute($sql, ['user_id' => $user_id, 'product_id' => $product_id]);
    }
}