<?php

namespace Src\Tables;

use Src\Core\Table;

class Users extends Table
{
    private $t = 'users';

    public function __construct(private $db)
    {
        parent::__construct($db);
    }

    public function find(int $id)
    {
        $sql = "SELECT * FROM $this->t WHERE id = :id";
        return $this->fetchOne($sql, ['id' => $id]);
    }

    public function findAll()
    {
        $sql = "SELECT u.id, u.name, u.email, u.address, r.name_role as role FROM $this->t u INNER JOIN roles r ON u.role = r.id";
        return $this->fetchAll($sql);
    }

    public function delete(int $id)
    {
        $sql = "DELETE FROM $this->t WHERE id = :id";
        $this->execute($sql, ['id' => $id]);
    }

    public function findByEmail(string $email)
    {
        $sql = "SELECT *
        FROM " . $this->t . "
        WHERE email = :email
        LIMIT 0,1";
        return $this->fetchOne($sql, ['email' => $email]);
    }

    public function isAdminByEmail(string $email)
    {
        $sql = "SELECT role
        FROM " . $this->t . "
        WHERE email = :email";
        return $this->fetchOne($sql, ['email' => $email]);
    }

    public function insert($data)
    {
        $sql = "INSERT INTO $this->t (name, email, password) VALUES (:name, :email, :password)";
        $password = $data['password'];
        $name = $data['name'];
        $email = $data['email'];
        $hashed_pass = password_hash($password, PASSWORD_BCRYPT);
        $this->execute($sql, [
            'name' => $name,
            'email' => $email,
            'password' => $hashed_pass
        ]);
    }

    public function update($data, $id)
    {
        $sql = "UPDATE $this->t SET ";
        $params = [];
        if (isset($data['name'])) {
            $sql .= 'name = :name, ';
            $params['name'] = $data['name'];
        }
        if (isset($data['email'])) {
            $sql .= 'email = :email, ';
            $params['email'] = $data['email'];
        }
        if (isset($data['password'])) {
            $password = $data['password'];
            $hashed_pass = password_hash($password, PASSWORD_BCRYPT);
            $sql .= 'password = :password, ';
            $params['password'] = $hashed_pass;
        }
        if (isset($data['address'])) {
            $sql .= 'address = :address, ';
            $params['address'] = $data['address'];
        }
        $sql = rtrim($sql, ", ") . " WHERE id = :id";
        $params['id'] = $id;
        $this->execute($sql, $params);
    }

    public function updateRole($role_id, $id)
    {
        $sql = "UPDATE $this->t SET role = :role WHERE id = :id";
        $this->execute($sql, ['role' => $role_id, 'id' => $id]);
    }
}