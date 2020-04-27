<?php
/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 23-10-2019
 * Time: 18:34
 */

class UserService
{
    protected $_username;    // using protected so they can be accessed
    protected $_password; // and overidden if necessary

    protected $_db;       // stores the database handler
    protected $_user;     // stores the user data

    public function __construct($db, $username, $password)
    {
        $this->_db = $db;
        $this->_username = $username;
        $this->_password = $password;
    }

    public function login()
    {
        $user = $this->_checkCredentials();
        if ($user) {
            $this->_user = $user; // store it so it can be accessed later
            return $user['name'];
        }
        die ("Username doesn't exist");
    }

    protected function _checkCredentials()
    {
        $stmt = $this->_db->prepare('SELECT * FROM log WHERE username=?');
        $stmt->execute(array($this->_username));
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $submitted_pass = sha1($this->_password);
            if ($submitted_pass == $user['password']) {
                return $user;
            }
            else{
                die ("Password is incorrect");
            }
        }
        return false;
    }
    public function userData(){
        $stmt = $this->_db->prepare('SELECT * FROM log WHERE username=?');
        $stmt->execute(array($this->_username));
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->_user=$user;
            return $user;
        }
        else{
            die("Cannot Retrive Data ");
        }
    }
    public function getUser()
    {
        return $this->_user;
    }
}