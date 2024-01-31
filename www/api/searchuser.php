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
$searchResults = "";
$searchCount = 0;
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$data->username]);
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    $searchCount++;
}
if($searchCount == 0){
    $retValue = '{"Error": "' . '"}';
    echo $retValue;
}else{
    $retValue = '{"Error": "' . 'Username has been taken' . '"}';
    echo $retValue;
}

$pdo = null;