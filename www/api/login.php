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

    // Get the username and password from json body
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $username = $data->username;
    $password = $data->password;

    // Check if username and password are correct
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password' LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If username and password are correct, return the user's id json encoded
    if (count($result) > 0) {
        // HTTP response code 200
        http_response_code(200);
        echo json_encode(array('id' => $result[0]['id'], 'name' => $result[0]['name']));
    } else {
        // HTTP response code 401
        http_response_code(401);
        echo json_encode(array('message' => 'Invalid username or password'));
    }

} catch(PDOException $e) {
    // HTTP response code 500
    http_response_code(500);
    echo json_encode(array('message' => 'Unable to connect to MySQL. Error:\n $e'));
}

$pdo = null;