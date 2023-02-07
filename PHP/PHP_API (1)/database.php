<?php
    //  *****************************
    //  *   Simple PHP Backend API  *
    //  *           2023.           *
    //  *****************************

    //  SET HTTP HEADER SETTINGS 
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/JSON; charset=utf-8;');

    //  SET PDO DATABASE CONNECTION
    include('adatok.php');
    $db = new PDO('mysql:dbname='.$dbname.';host='.$dbhost, $dbuser, $dbpass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec("SET NAMES utf8");
    
    //  GET PHP INPUTS
    $data = json_decode(file_get_contents("php://input"));
    $table = @$data->table;

    if ($op = @$data->op){
        $op = getOp($op);   
    }else{
        $op = '=';    
    }

    //  ************************************
    //  CRUD OPERATIONS ENDPOINTS
    //  ************************************

    //  HTTP GET METHOD
    if ($_SERVER['REQUEST_METHOD'] == 'GET'){
        // GET RECORD(S) BY FIELD
        if (isset($data->field) && isset($data->value)){
            $field = $data->field;
            $value = $data->value;
            if ($op == ' LIKE ') {
                $value = "%$value%";
            }
            try{
                $results = $db->query("SELECT * FROM $table WHERE $field $op '$value'")->fetchAll();  
            }
            catch(PDOException $Exception){
                $results = array(
                    'message' => $db->errorInfo()
                );
            }
        }else
        // GET ONE RECORD BY ID 
        if (isset($data->id)){
            $id = $data->id;
            try{
                $results = $db->query("SELECT * FROM $table WHERE ID = $id")->fetchAll();
            }
            catch(PDOException $Exception){
                $results = array(
                    'message' => $db->errorInfo()
                );
            }
        }
        else{
            // GET ALL RECORDS
            if (isset($table)){
                try{
                    $results = $db->query("SELECT * FROM $table")->fetchAll();
                }
                catch(PDOException $Exception){
                    $results = array(
                        'message' => $db->errorInfo()
                    );
                }
            }else{
                $results = array(
                    'message' => $apiname.' - '.$apiver
                );
            }
        }    
    }

    //  HTTP POST METHOD
    if ($_SERVER['REQUEST_METHOD'] == 'POST'){  
        $newrecord = $data->values;
        $fields = '';
        $values = '';

        foreach($newrecord as $key => $record){
        $fields .= ', '.$key;
        }

        foreach($newrecord as $record){
        $values .= ', "'.$record.'"';
        }
        
        try{
            $affectedRows = $db->exec("INSERT INTO $table (ID $fields) VALUES(null $values)"); 
            $results = array(
                'affectedRows' => $affectedRows,
                'message' => "A művelet végrehajtva!"
            );
        }
        catch(PDOException $Exception){
            $results = array(
                'affectedRows' => 0,
                'message' => $db->errorInfo()
            );
        } 
    }

    //  HTTP PATCH METHOD
    if ($_SERVER['REQUEST_METHOD'] == 'PATCH'){
        $field = $data->field;
        $value = $data->value;
        $newrecord = $data->values;
        $str = '';
       
        foreach($newrecord as $key => $record){
            $str .= $key.'="'.$record.'", ';
        }

        $str = rtrim($str, ', ');
        
        try{
            $affectedRows = $db->exec("UPDATE $table SET $str WHERE $field $op $value"); 
            $results = array(
                'affectedRows' => $affectedRows,
                'message' => "A művelet végrehajtva!"
            );
        }
        catch(PDOException $Exception){
            $results = array(
                'affectedRows' => 0,
                'message' => $db->errorInfo()
            );
        } 
    }

    //  DELETE METHOD
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE'){
        // DELETE RECORD BY FIELD
        if (isset($data->field) && isset($data->value)){
            $field = $data->field;
            $value = $data->value;
            if ($op == ' LIKE ') {
                $value = "%$value%";
            }
            try{
                $affectedRows = $db->exec("DELETE FROM $table WHERE $field $op '$value'"); 
                $results = array(
                    'affectedRows' => $affectedRows,
                    'message' => "A művelet végrehajtva!"
                );
            }
            catch(PDOException $Exception){
                $results = array(
                    'affectedRows' => 0,
                    'message' => $db->errorInfo()
                );
            } 
        }else
        // DELETE RECORD BY ID 
        if (isset($data->id)){
            $id = $data->id;
            try{
                $affectedRows = $db->exec("DELETE FROM $table WHERE ID = $id");
                $results = array(
                    'affectedRows' => $affectedRows,
                    'message' => "A művelet végrehajtva!"
                );
            }
            catch(PDOException $Exception){
                $results = array(
                    'affectedRows' => 0,
                    'message' => $db->errorInfo()
                );
            }
        }
        else{
            // DELETE ALL RECORDS
            try{
                $affectedRows = $db->exec("DELETE FROM $table");
                $results = array(
                    'affectedRows' => $affectedRows,
                    'message' => "A művelet végrehajtva!"
                );
            }
            catch(PDOException $Exception){
                $results = array(
                    'affectedRows' => 0,
                    'message' => $db->errorInfo()
                );
            }
        }
    }

    //  SEND HTTP RESPONSE
    echo json_encode($results);

    //  ************************************
    //  OTHER FUNCTIONS
    //  ************************************

    //  operands switcher
    function getOp($op){
        switch ($op) {
            case 'eq':
                { $op = '='; break; }
            case 'lt':
                { $op = '<'; break; }
            case 'gt':
                { $op = '>'; break; }
            case 'not':
                { $op = '!='; break; }
            case 'gte':
                { $op = '>='; break; }
            case 'lte':
                { $op = '<='; break; }
            case 'lk':
                { $op = ' LIKE '; break; }
        }
        return $op;
    }
?>
