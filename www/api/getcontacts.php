<?php

header('Content-type: application/json');

// Make sure request is a GET request
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
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

$page = 1;
if(isset($_GET['page'])){
    $page = $_GET['page'];
}
$offset = ($page - 1) * 20;

// Order by last_updated so that the most recently updated contacts are shown first
$stmt = $pdo->prepare("SELECT * FROM Contacts WHERE user_id = ? ORDER BY last_updated DESC LIMIT 20 OFFSET $offset");
if($stmt->execute([$_GET['user_id']])){
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    http_response_code(200);
    echo json_encode($contacts);
}else{
    http_response_code(401);
    echo json_encode(array("message"=> "Failed to get Contacts"));
}


$pdo = null;