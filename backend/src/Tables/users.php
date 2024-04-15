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

    public function findByEmail(string $email){
        $sql = "SELECT id, email, name, password
        FROM " . $this->t . "
        WHERE email = :email
        LIMIT 0,1";
        return $this->fetchOne($sql, ['email' => $email]);
    }

    public function isAdminByEmail(string $email){
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

    public function update($id, $data)
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
        $sql = rtrim($sql, ", ") . " WHERE id = $id";
        $this->execute($sql, $params);
    }
}