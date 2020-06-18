<?php
require_once('AbstractDAO.php');

class UserDAO extends AbstractDAO{
    function __construct(){
        try{
            parent::__construct();
        } catch (Exception $e){
            throw $e;
        }
    }

    public function validate($username, $password){
        $query = 'SELECT iduser FROM user WHERE username = ? AND password = ?';
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        $result = $result->fetch_all();
        if ($stmt->error){
            return $stmt->error;
        }
        return (count($result) == 1);

    }
    public function checkUsername($username){
        $query = 'SELECT iduser FROM user WHERE username = ?';
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all();
        if ($stmt->error){
            return $stmt->error;
        }
        if (count($result) == 0){
            return false;
        }
        return true;
    }

    public function addUser($username, $password){
        $query = 'INSERT INTO user (username, password) VALUES (?,?)';
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
    }

    public function getUserId($username){
        $query = 'SELECT iduser FROM user WHERE username = ?';
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($stmt->error){
            return $stmt->error;
        }
        return $result->fetch_assoc()['iduser'];
    }
}

?>