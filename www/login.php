<!-- Login API using username and password with SHA256 hash password -->
<!-- 
  JSON payload:
  {
    "username": "username",
    "password": "password"
  }
  -->
<!-- 
  JSON response:
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "id": "1",
      "username": "username",
      "email": "email",
      "created_at": "2020-01-01 00:00:00",
      "updated_at": "2020-01-01 00:00:00"
    }
  }
  -->

<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

  // Include database and user model
  include_once '../config/Database.php';
  include_once '../models/User.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate user object
  $user = new User($db);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  // Set username and password
  $user->username = $data->username;
  $user->password = $data->password;

  // Login user
  if ($user->login()) {
    // Create array
    $user_arr = array(
      'id' => $user->id,
      'username' => $user->username,
      'email' => $user->email,
      'created_at' => $user->created_at,
      'updated_at' => $user->updated_at
    );

    // Set response code - 200 'OK'
    http_response_code(200);

    // Encode data to JSON
    echo json_encode(
      array(
        'status' => 'success',
        'message' => 'Login successful',
        'data' => $user_arr
      )
    );
  } else {
    // Set response code - 401 'Unauthorized'
    http_response_code(401);

    // Encode data to JSON
    echo json_encode(
      array(
        'status' => 'error',
        'message' => 'Login failed'
      )
    );
  }
