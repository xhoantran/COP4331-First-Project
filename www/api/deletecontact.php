<?php

header('Content-type: application/json');

// Make sure request is a DELETE request
if ($_SERVER['REQUEST_METHOD'] != 'DELETE') {
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
<<<<<<< HEAD
$stmt = $pdo->prepare("INSERT INTO contacts (name , phone, email, user_id) VALUES(?,?,?,?)");
=======
$stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
>>>>>>> fa9499b66447b9ad316275dad5b9a2566bb6e460
$stmt->execute([$data->id]);
if ($stmt->rowCount() > 0) {
    http_response_code(201);
    echo json_encode(["message" => "Contact successfully Deleted!"]);
}else{
    http_response_code(401);
    echo json_encode(array("message"=> "Failed to Delete Contact"));
}

$pdo = null;