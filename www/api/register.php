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
if(empty($data->username) || empty($data->password) || empty($data->fname) || empty($data->lname)){
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

// Check if the username is already taken
$query = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$query->execute([$data->username]);

if ($query->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Username is already taken!"]);
    exit();
}

$stmt = $pdo->prepare("INSERT INTO users (username, password, name) VALUES(?,?,?)");
$stmt->execute([$data->username, $data->password, $data->fname . " " . $data->lname]);
http_response_code(201);
echo json_encode(["message" => "User registered successfully"]);

$pdo = null;

?>