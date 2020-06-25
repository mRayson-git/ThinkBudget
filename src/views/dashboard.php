<?php
session_start();
if (!isset($_SESSION['iduser'])){
    header('Location: login.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <title>Dashboard</title>
</head>
<body>
    <div class="container-fluid" style="background-color: #474747; text-align:left">
        <div class="row">
            <div class="col-lg-8">
                <h4>Dashboard</h4>
            </div>
            <div class="col-lg-4">
                <button class="btn-default borderless vertical-center">Account Settings</button>
                <button class="btn-default borderless vertical-center">Import Transactions</button>
            </div>
        </div>
    </div>
    <div class="container-fluid bg-dark" style="height: 100vh;">
        <div class="row">
            <div class="col-lg-4">
                <h3>Recent Transactions</h3>
            </div>
            <div class="col-lg-4">
                <h3>Budget Overview</h3>
            </div>
            <div class="col-lg-4">
                <h3>3rd Section</h3>
            </div>
        </div>
    </div>
</body>

</html>