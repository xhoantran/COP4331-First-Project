<?php

header('Content-type: application/json');

// Make sure request is a POST request
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    // HTTP response code 405
    http_response_code(405);
    echo json_encode(array('message' => 'Invalid request method'));
    exit;
}

// DB credentials
$DBuser = 'root';
$DBpass = $_ENV['MYSQL_ROOT_PASSWORD'];
$DBdatabase = 'contact_manager';
$pdo = null;

try{
    $database = "mysql:host=database:3306;dbname=$DBdatabase";
    $pdo = new PDO($database, $DBuser, $DBpass);
}catch(PDOException $e){
    http_response_code(500);
    echo json_encode(array('message' => 'Unable to connect to MySQL. Error:\n $e'));
    exit();
}

$data = json_decode(file_get_contents("php://input"));
$stmt = $pdo->prepare("INSERT INTO contacts (name , phone, email, user_id) VALUES(?,?,?,?)");
if($stmt->execute([$data->name, $data->phone, $data->email, $data->user_id])){
    http_response_code(201);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["message" => "Contact added successfully", "id" => $pdo->lastInsertId()]);
}else{
    http_response_code(401);
    echo json_encode(array("message"=> "Failed to Add Contact"));
}

$pdo = null;