<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 23-10-2019
 * Time: 01:46
 */
//echo "log";
// set the expiration date to one hour ago
setcookie("user", "", time() - 1);

//echo "Cookie 'user' is deleted.";
//session_start(); //to ensure you are using same session
//session_destroy(); //destroy the session
header("location:SignIn.html"); //to redirect back to "index.php" after logging out
//exit();
?>