<?php

// Basic example of PHP script to handle with jQuery-Tabledit plug-in.
// Note that is just an example. Should take precautions such as filtering the input data.

header('Content-Type: application/json');

$mysqli = new mysqli('localhost', 'user', 'password', 'database');

if (mysqli_connect_errno()) {
  echo json_encode(array('mysqli' => 'Failed to connect to MySQL: ' . mysqli_connect_error()));
  exit;
}

if ($_POST['action'] == 'edit') {
    $mysqli->query("UPDATE users SET nickname='" . $_POST['nickname'] . "', firstname='" . $_POST['firstname'] . "', lastname='" . $_POST['lastname'] . "' WHERE id='" . $_POST['id'] . "'");
} else if ($_POST['action'] == 'delete') {
    $mysqli->query("UPDATE users SET deleted=1 WHERE id='" . $_POST['id'] . "'");
} else if ($_POST['action'] == 'restore') {
    $mysqli->query("UPDATE users SET deleted=0 WHERE id='" . $_POST['id'] . "'");
}

mysqli_close($mysqli);

echo json_encode($_POST);

?>