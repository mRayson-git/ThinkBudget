<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../../assets/css/login.css">
    <title>Login-Page</title>

    <script type="text/javascript">
      function validateFailed(){
        alert("Login credentials incorrect");
      }
      function usernameInUse(){
        alert("Username is already in use");
      }
    </script>
  </head>
  <body>
    <?php
    ini_set('display_errors', 1);
    session_start();
    include('../models/UserDAO.php');
    $userDAO = new UserDAO();
    
    $hasError = false;
    $errorMessages = array();
    if ((isset($_POST['username'])) && (isset($_POST['password']))){
      if ($_POST['username'] == ""){
        $errorMessages['usernameError'] = "Field cannot be blank";
        $hasError = true;
      }
      if (strpos($_POST['username'], ';') !== false){
        $errorMessages['usernameError'] = "Username cannot contain invalid charaters";
        $hasError = true;
      }
      if ((isset($_POST['signUp'])) && ($userDAO->checkUsername($_POST['username']))){
        $errorMessages['usernameError'] = "Username already in use";
        $hasError = true;
      }
      if ((isset($_POST['signIn'])) && (!$userDAO->checkUsername($_POST['username']))){
        $errorMessages['usernameError'] = "Username not on file";
        $hasError = true;
      }
      if ($_POST['password'] == ""){
        $errorMessages['passwordError'] = "Field cannot be blank";
        $hasError = true;
      }
      if (strpos($_POST['username'], ';') !== false){
        $errorMessages['passwordError'] = "Password cannot contain invalid charaters";
        $hasError = true;
      }
      if ((isset($_POST['signIn'])) && (!$userDAO->validate($_POST['username'],$_POST['password']))){
        $errorMessages['passwordError'] = "Incorrect password";
        $hasError = true;
      }
      if (!$hasError){
        if (isset($_POST['signUp'])){
          $userDAO->addUser($_POST['username'], $_POST['password']);
        }
        $_SESSION['iduser'] = $userDAO->getUserId($_POST['username']);
        header('Location: dash.php');
      }
    }?>
    <div class="container center">
      <h1>Think <span class="empower">Budget</span></h1>
      <p>think money.</p>
      <form method="POST" action="">
        <fieldset>
          <table>
            <tr>
              <td colspan="2"><input type="text" id="username" name="username" placeholder="Username" autofocus></td>
              <td><?php if (isset($errorMessages['usernameError'])){echo "<span style='color: red;'>" . $errorMessages['usernameError'] . "</span>";}?></td>
            </tr>
            <tr>
              <td colspan="2"><input type="password" id="password" name="password" placeholder="Password"></td>
              <td><?php if (isset($errorMessages['passwordError'])){echo "<span style='color: red;'>" . $errorMessages['passwordError'] . "</span>";}?></td>
            </tr>
            <tr>
              <td><button type="submit" name="signIn">Login</button></td>
              <td><button type="submit" name="signUp">Create Account</button></td>
            </tr>
          </table>
        </fieldset>
      </form>
    </div>
  </body>
</html>