<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';
include_once('sendmail.php');
include_once('config.php');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');

//$rest_json = file_get_contents("php://input");
//$_POST = json_decode($rest_json, true);

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
        
        /*
    $message = $_POST['msg'];       */
    //$pdfAttachment = $_POST['pdf'];  
    //$encoded_content = chunk_split(base64_encode($pdfAttachment));
/*
    $message = "--asasdsda\r\n";
    //$message = "--$boundary\r\n";
    $message .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($_POST['msg']));
         
    //attachment
    $message .= "--$boundary\r\n";
    //$message .= "--$boundary\r\n";
    $message .="INCOMING MESSAGE: \r\n";
    $message .="Content-Type: asd; name=asdasd\r\n";
    //$message .="Content-Type: $type; name=".$name."\r\n";
    $message .="Content-Disposition: attachment; filename=aasdasd\r\n";
    //$message .="Content-Disposition: attachment; filename=".$name."\r\n";
    $message .="Content-Transfer-Encoding: base64\r\n";
    $message .="X-Attachment-Id: ".rand(1000, 99999)."\r\n\r\n";
    $message .= $encoded_content; // Attaching the encoded file with email
    */
//$message = $_POST['msg'];
//$pdfAttachment = $_POST['msg'];
    /*$message .= "\n";
    $message .= $_POST['pdf'];
    $message .= "\n";
    $message .= $pdfAttachment['error'];
    $message .= "\n";
    $message .= $_FILES['attachment']['size'];

    $message .= "\n";*/
    
    /*----------------------------------------------
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);
    
    $message = $request_body;
    $message .= "\n\n";
    $message .= print_r($_REQUEST, true);
    $message .= "\n\n";
    $message .= $_POST["msg"];
    //$message = $data['msg'];


    $pdfAttachment = base64_decode ($_POST["pdf"]);
    $myfile = fopen("text.txt", "w");
    $txt = "Hello World";
    fwrite($myfile, $txt);

    //Actual sending email
    $sendEmail = new Sender($adminEmail, $from, $subject, $message, $pdfAttachment);
    $sendEmail->send();
    //-------------------------------------------------------*/

    file_put_contents($_POST["pdfName"], $_POST["pdf"]);


    $message = $request_body;
    $message .= "\n\n";
    $message .= print_r($_REQUEST, true);
    $message .= "\n\n";
    $message .= $_POST["msg"];

    $mail = new PHPMailer();
    $mail->setFrom('liamkenna98@gmail.com', 'Name');
    $mail->addAddress('liamkenna98@gmail.com');  

    //$mail->isHTML(true);                                  
    $mail->Subject = 'Subject';
    $mail->Body    = $message;
    $mail->addAttachment($_POST["pdfName"], 'filename');    // Name is optional WORKS
    //$mail->addAttachment('somename.pdf', 'filename');    // Name is optional WORKS

    /*$mail->Body    = 'HTML message body in <b>bold</b>!';
    $mail->AltBody = 'Body in plain text for non-HTML mail clients';*/
    $mail->send();