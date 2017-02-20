<?php
require APPPATH . '/libraries/REST_Controller.php';
class Token extends REST_Controller
{
    protected $CI;
    function __construct()
    {
       $this->CI =& get_instance();
       $header =  apache_request_headers();
       $this->CI->load->model("token_model");
       //print_r($header);
       if(!empty($header)) {
          $check_token = $this->CI->token_model->checkTokenAvailable($header['token']); 
          if($check_token == 0) {
            $message['error'] = true;
	    $message['message'] = "Unauthorized Api Request because of Invalid Token.";
	    $this->response($message, REST_Controller::HTTP_UNAUTHORIZED);
          }
       }
    }
}

?>