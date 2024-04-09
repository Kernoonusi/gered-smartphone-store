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
}