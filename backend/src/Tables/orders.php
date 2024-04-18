<?php

namespace Src\Tables;

use Src\Core\Table;

class Orders extends Table
{
    private $t = 'orders';
    private $t1 = 'order_products';
    private $t2 = 'products';
    private $t3 = 'statuses';

    public function __construct(private $db)
    {
        parent::__construct($db);
    }

    public function findByUserId(int $id)
    {
        $sql = "SELECT o.id, s.name as status, o.note,
        GROUP_CONCAT(op.product_id SEPARATOR ';') as ids,
        GROUP_CONCAT(op.quantity SEPARATOR ';') as quantities,
        GROUP_CONCAT(p.nameProduct SEPARATOR ';') as nameProducts,
        GROUP_CONCAT(p.price SEPARATOR ';') as prices,
        SUM(p.price * op.quantity) as total
        FROM $this->t as o
        INNER JOIN $this->t1 as op
        INNER JOIN $this->t2 as p
        INNER JOIN $this->t3 as s
        ON o.id = op.order_id
        AND op.product_id = p.id
        AND o.status_id = s.id
        WHERE o.user_id = :id
        GROUP BY o.id";
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

    public function findAll()
    {
        $sql = "SELECT o.id, s.name as status, o.note,
        GROUP_CONCAT(op.product_id SEPARATOR ';') as ids,
        GROUP_CONCAT(op.quantity SEPARATOR ';') as quantities,
        GROUP_CONCAT(p.nameProduct SEPARATOR ';') as nameProducts,
        GROUP_CONCAT(p.price SEPARATOR ';') as prices,
        SUM(p.price * op.quantity) as total
        FROM $this->t as o
        INNER JOIN $this->t1 as op
        INNER JOIN $this->t2 as p
        INNER JOIN $this->t3 as s
        ON o.id = op.order_id
        AND op.product_id = p.id
        AND o.status_id = s.id
        GROUP BY o.id";
        return $this->fetchAll($sql);
    }
}
