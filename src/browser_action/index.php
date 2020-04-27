<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 22-10-2019
 * Time: 15:28
 */

$cookie_name = "user" ;

if(!isset($_COOKIE[$cookie_name])) {
    echo "Cookie named '" . $cookie_name . "' is not set!";
    header("Location: SignIn.html");
} else {
    //echo "Cookie '" . $cookie_name . "' is set!<br>";
    //echo "Value is: " . $_COOKIE[$cookie_name];
    header("Location:index/dashboard.php");
}
?>