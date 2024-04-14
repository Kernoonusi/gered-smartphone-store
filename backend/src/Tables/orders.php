<?php

namespace Src\Tables;

use Src\Core\Table;

class Orders extends Table
{
    private $t = 'orders';
    private $t1 = 'order_products';
    private $t2 = 'products';

    public function __construct(private $db)
    {
        parent::__construct($db);
    }

    public function findByUserId(int $id)
    {
        $sql = "SELECT o.user_id, o.status_id, o.note, op.quantity, p.nameProduct, p.price FROM $this->t as o
        INNER JOIN $this->t1 as op
        INNER JOIN $this->t2 as p
        ON o.id = op.order_id
        AND op.product_id = p.id
        WHERE o.user_id = :id";
        return $this->fetchAll($sql, ['id' => $id]);
    }

    public function insert($data)
    {
        $sql = "INSERT INTO $this->t (user_id";
        if (isset($data['note'])) {
            $sql .= ', note';
        }
        $sql .= ") VALUES (:user_id";
        if (isset($data['note'])) {
            $sql .= ', :note';
        }
        $sql .= ")";
        $params = ['user_id' => $data['user_id'],];
        if (isset($data['note'])) {
            $params['note'] = $data['note'];
        }
        $this->execute($sql, $params);
        $order_id = $this->getLastIdByUserId($data['user_id'])['id'];
        foreach ($data['products'] as $product) {
            $sql = "INSERT INTO $this->t1 (order_id, product_id, quantity) VALUES (:order_id, :product_id, :quantity)";
            $this->execute($sql, ['order_id' => $order_id, 'product_id' => $product['id'], 'quantity' => $product['count']]);
        }
    }

    public function getLastIdByUserId(int $id)
    {
        $sql = "SELECT id FROM $this->t WHERE user_id = :id ORDER BY id DESC LIMIT 1";
        return $this->fetchOne($sql, ['id' => $id]);
    }
}