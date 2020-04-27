<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 22-10-2019
 * Time: 15:01
 */
require_once "UserService.php";
require_once "connect.php";
$username=$_POST['username'];
$password=$_POST['password'];


    $userService = new UserService($pdo, $username, $password);
    if ($user_name = $userService->login()) {
        echo 'Logged it as user id: '.$user_name;
        $userData = $userService->getUser();

        setcookie("user", $userData["username"], time() + 3600);
        header ("Location:index.php");
        exit;
        // do stuff
    } else {
        die( 'Invalid login');
    }
    /*$query = "SELECT * FROM log WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if (!mysqli_num_rows($result)) {
        die ("Username doesn't exist");
    }
    $row = mysqli_fetch_assoc($result);
    if ($row["password"] != $password) {
        die ("Password is incorrect");
    }
    $SELECT = "select * from log where username = '$username' ";

    //echo $row["name"];
    setcookie("user", $row["username"], time() + 3600);
    header("location:index.php");*/

//login.php

/*
if(isset($_COOKIE["type"]))
{
 header("location:index.php");
}

$message = '';

if(isset($_POST["login"]))
{
 if(empty($_POST["user_email"]) || empty($_POST["user_password"]))
 {
  $message = "<div class='alert alert-danger'>Both Fields are required</div>";
 }
 else
 {
  $query = "
  SELECT * FROM user_details 
  WHERE user_email = :user_email
  ";
  $statement = $connect->prepare($query);
  $statement->execute(
   array(
    'user_email' => $_POST["user_email"]
   )
  );
  $count = $statement->rowCount();
  if($count > 0)
  {
   $result = $statement->fetchAll();
   foreach($result as $row)
   {
    if(password_verify($_POST["user_password"], $row["user_password"]))
    {
     setcookie("type", $row["user_type"], time()+3600);
     header("location:index.php");
    }
    else
    {
     $message = '<div class="alert alert-danger">Wrong Password</div>';
    }
   }
  }
  else
  {
   $message = "<div class='alert alert-danger'>Wrong Email Address</div>";
  }
 }
}


?>

}
*/
