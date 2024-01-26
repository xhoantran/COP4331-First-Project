<?php

header('Content-type: application/json');

// Make sure request is a PUT request
if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
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
$stmt = $pdo->prepare("UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?");
if($stmt->execute([$data->name, $data->phone, $data->email, $data->id])){
    http_response_code(200);
    echo json_encode(["message" => "Contact updated successfully"]);
}else{
    http_response_code(401);
    echo json_encode(array("message"=> "Failed to Update Contact!"));
}

$pdo = null;