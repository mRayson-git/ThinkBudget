<?php
abstract class AbstractDAO{
    protected $mysqli;
    protected static $SERVERNAME = "localhost";
    protected static $USERNAME = "budgetAdmin";
    protected static $PASSWORD = "JaKcKdKqGoGvVj84";
    protected static $DATABASE = "budgetapp";

    public function __construct(){
        try{
            $this->mysqli = new mysqli(self::$SERVERNAME, self::$USERNAME, self::$PASSWORD, self::$DATABASE);
        } catch (mysqli_sql_exception $e){
            throw $e;
        }
    }

    public function getMysqli(){
        return $this->mysqli;
    }
}

?>