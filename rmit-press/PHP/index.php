<?php
include_once('sendmail.php');
include_once('config.php');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

/*
if( empty($_POST['firstName']) && empty($_POST['email']) ) {
    echo json_encode(
        [
           "sent" => false,
           "message" => $SendMailEmptyerrorMessage
        ]
    ); 
    http_response_code(400);
    exit();
}*/
/*
if ($_POST){
    //@important: Please change this before using
    http_response_code(200);
    $subject = "subject";
    $from = "liamkenna98@gmail.com";
    $message = "message";  
        //$subject = 'Contact from: ' . $_POST['firstName'];
        //$from = $_POST['email'];
        //$message = $_POST['msg'];       
    //Actual sending email
    $sendEmail = new Sender($adminEmail, $from, $subject, $message);
    $sendEmail->send();
} else {
 // tell the user about error
 echo json_encode(
     [
        "sent" => false,
        "message" => $SendMailFailederrorMessage
     ]
 );
}
*/

    http_response_code(200);
    $subject = "subject";
    $from = "liamkenna98@gmail.com";
    //$message = "message";  
        //$subject = 'Contact from: ' . $_POST['firstName'];
        //$from = $_POST['email'];
        //$message = $_POST['msg'];       
    $message = $_POST['msg'];       
    $pdfAttachment = $_POST['pdf'];       
    //Actual sending email
    $sendEmail = new Sender($adminEmail, $from, $subject, $message, $pdfAttachment);
    $sendEmail->send();