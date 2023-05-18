<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dompdf\Dompdf;
use Dompdf\Options;
require 'vendor/autoload.php';
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');


    http_response_code(200);
    $subject = "subject";
    $from = "liamkenna98@gmail.com";

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

    /*
    //big letter
    $data = file_get_contents("Img/Type/".$_POST["bigLetter"].".png");
    $base64 = 'data:image/.png;base64,' . base64_encode($data);

    $html = str_replace("%bigImg%", $base64, $html);
    */

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

    $message = $request_body;
    $message .= "\n\n";
    $message .= print_r($_REQUEST, true);
    $message .= "\n\n";
    $message .= $_SERVER["DOCUMENT_ROOT"];
    $message .= "\n\n";
    $message .= $html;

    $mail = new PHPMailer();
    $mail->setFrom('liamkenna98@gmail.com', 'Name');
    $mail->addAddress('liamkenna98@gmail.com');  

    $mail->Subject = $_POST["subject"];
    $mail->Body    = $message;
    $mail->addAttachment($_POST["pdfName"], 'filename');    // Name is optional WORKS

    $mail->send();

    
    echo "PHP DUN";