<?php

//для json;
// $_POST = json_decode(file_get_contents("php://input"), true);

echo var_dump($_POST);
// берет данные, которые пришли из клиента, превращает в строку и показывает
// на клиенте - это response от сервера