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
$stmt = $pdo->prepare("SELECT * FROM Contacts WHERE name like ? AND user_id = ?");
$colorName = "%" . $data->search . "%";
$stmt->execute([$colorName, $data->user_id]);
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    if($searchCount > 0){
        $searchResults .= ",";
    }
    $searchCount++;
    $searchResults .= '{"Name" : "' . $row["name"]. '", "PhoneNumber" : "' . $row["phone"]. '", "EmailAddress" : "' . $row["email"]. '", "UserID" : "' . $row["user_id"].'", "ID" : "' . $row["id"]. '"}';
}
if($searchCount == 0){
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . 'No Records found' . '"}';
    echo $retValue;
}else{
    returnWithInfo($searchResults);
}

function returnWithInfo( $searchResults )
{
	$retValue = '{"results":[' . $searchResults . '],"error":""}';
	echo $retValue;
}

$pdo = null;
