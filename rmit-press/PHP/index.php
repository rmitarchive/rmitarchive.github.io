<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dompdf\Dompdf;
use Dompdf\Options;
require 'vendor/autoload.php';
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');

    http_response_code(200);

    $html = str_replace("%src%", $_SERVER["DOCUMENT_ROOT"], $_POST["pdfHTML"]);

    $imgPaths = $_POST["imgPaths"];
    if($imgPaths != null){
        for ($i = 0; $i < count($imgPaths); $i++) {
            $type = pathinfo($imgPaths[$i], PATHINFO_EXTENSION);
            $data = file_get_contents("Img/".$imgPaths[$i]);
            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
    
            $html = str_replace("%img".$i."%", $base64, $html);
        }
    }

    $options = new Options();
    $options->set('isRemoteEnabled', true);
    $options->set('chroot', __DIR__);

    $dompdf = new Dompdf($options);
    $dompdf->set_paper('A4', 'landscape');
    $dompdf->set_base_path( __DIR__ );
    $dompdf->load_html($html);
    $dompdf->render();
    $output = $dompdf->output();
    file_put_contents($_POST["pdfName"], $output);

    //test
    //file_put_contents("test.html", $html);

    $message = "Please find attached.";
    /*$message = $request_body;
    $message .= "\n\n";
    $message .= print_r($_REQUEST, true);
    $message .= "\n\n";
    $message .= $_SERVER["DOCUMENT_ROOT"];
    $message .= "\n\n";
    $message .= $html;*/

    $printMail = new PHPMailer();
    $printMail->setFrom('noreply@p-r-e-s-s.com', 'Name');
    $printMail->addAddress('print@p-r-e-s-s.com');  

    $printMail->Subject = $_POST["pdfName"]." From: ".$_POST["userEmail"];
    $printMail->Body    = $message;
    $printMail->addAttachment($_POST["pdfName"], 'filename');    // Name is optional WORKS

    $printMail->send();

    
    $userMail = new PHPMailer();
    $userMail->setFrom('noreply@p-r-e-s-s.com', 'Name');
    $userMail->addAddress($_POST["userEmail"]);  

    $userMail->Subject = "P-R-E-S-S GENERATED ARTEFACT";
    $userMail->Body    = $message;
    $userMail->addAttachment($_POST["pdfName"], 'filename');    // Name is optional WORKS

    $userMail->send();
    
    echo $_POST["pdfName"]." has been generated, uploaded, and transfered to ".$_POST["userEmail"];