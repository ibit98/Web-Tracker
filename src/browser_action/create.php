<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 01-10-2019
 * Time: 16:50
 */

$username=$_POST['username'];
$password=sha1($_POST['password']);
$name=$_POST["name"];

$conn=new mysqli('localhost','btech2017','btech2017','btech2017');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query = "SELECT * FROM log WHERE username = '$username'";
$result = mysqli_query($conn, $query);
//echo $result;
if(mysqli_num_rows($result)){
	die ("Username already exists");
}

$INSERT = "insert into log values ('$name','$username','$password')";


if($conn->query($INSERT) == true){
    echo '<script type="text/javascript">alert("You have Succesfully Registered\nRedirect to Log In page");</script>';
    echo '<script type="text/javascript">window.location.href="SignIn.html";</script>';
    die();
}
else {
    echo "Error: " . $INSERT . "<br>" . $conn->error;
}

$conn->close();

?>

