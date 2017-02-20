<?php
//require APPPATH . '/libraries/REST_Controller.php';
class REST_Middel_Controller extends REST_Controller {
    function __construct() {
        parent::__construct();
        $controller = $this->router->fetch_class();
        $action = $this->router->fetch_method();
//        if (!($controller == 'amenities' && ($action == 'index')) && !($controller == 'facility' && ($action == 'find' || $action == 'unitType' || $action == 'cityzip')) && !($controller == 'user' && ($action == 'login' || $action == 'signup')) && !($controller == 'tenants' && ($action == 'resendotp' || $action == 'forgetpassword' || $action == 'changeStatus' || $action == 'register'))) {
            $request_from = $this->input->get_request_header('requestfrom',true);
            $user_id = $this->input->get_request_header('userid',true);
            $token = $this->input->get_request_header('token',true);
           
            if($token != 'not_required'  && $token !='') {
                $this->load->model('token_model');
                $checkToken = $this->token_model->isToken($token, $request_from, $user_id);
                if (!$checkToken) {
                    $message['error'] = true;
                    $message['message'] = "Unauthorized Api Request because of Invalid Token.";
                    $this->response($message, REST_Controller::HTTP_UNAUTHORIZED);
                }
            } 
        //}
    }

}
