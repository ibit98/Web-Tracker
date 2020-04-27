<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 23-10-2019
 * Time: 20:34
 */
try{
    //$conn=new mysqli('localhost','btech2017','btech2017','btech2017');
    $pdo = new PDO("mysql:host=localhost;dbname=btech2017", 'btech2017', 'btech2017');
}
catch (PDOException $e) {
    die ('Connection failed: ' . $e->getMessage());
}
?>