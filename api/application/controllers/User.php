<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */


use \Stripe\Stripe;
use \Stripe\Charge;
use \Stripe\Customer;
use \Stripe\Plan;
use \Stripe\Subscription;
use \DigitalOcean\DigitalOcean;
use \DigitalOcean\Credentials;
class User extends REST_Middel_Controller {
    
    function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
       
    }
    public function inventoryDetail_get(){
     $getData=$this->get();
     if($getData['role_id']!='1' && $getData['role_id'] !='2')      {
        $getData['user_id']=$getData['created_by'];
      }
     //$destroyedByAmazonData=$this->user_model->destroyedByAmazon($getData); 
     
     $inventoryDetailData=$this->user_model->inventoryDetail($getData);
     
     //$misplacedData=$this->user_model->misplaced($getData);
     if(!empty($inventoryDetailData)){
       $message['error']=false;
       $message['data']=$inventoryDetailData;
//       $message['total_page']=$inventoryDetailData['count'];
//       $message['total_record']=$inventoryDetailData['total_record'];
//       $message['current_page'] = $getData['page'];
     }else {
       $message['error'] = true;
       $message['data'] = $inventoryDetailData;
//       $message['current_page'] = $getData['page'];
//       $message['total_page']=1;
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function orderDetail_get(){
     $getData=$this->get();
     if($getData['role_id']!='1' && $getData['role_id'] !='2'){
        $getData['user_id']=$getData['created_by'];
      }
     $data=$this->user_model->orderDetail($getData);
     $result=$data['result'];
      if(!empty($result)){
            $message['error'] = false;
            $message['message'] = "Order Data.";
            $message['data'] = $result;
            $message['total_page']=$data['count'];
            $message['total_record']=$data['total_record'];
            $message['current_page'] = $getData['page'];
        }else{
            $message['error'] = true;
            $message['data'] = $result;
            $message['current_page'] = $getData['page'];
            $message['total_page']=1;
        }
        $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function recvEmail_post(){
      $data = file_get_contents('php://input');
      $maildata=json_decode($data,true);
      if(preg_match('/Invitation/',$maildata['Subject'])){
         $user = $this->user_model->invitationrecvEmail($data);
         $cookiefileName='cookie'.$user[0]['user_id'].'.txt';
         $resultFilename='code'.$user[0]['user_id'].'.txt';
         //$ip=$this->user_model->getDigitalOcean(); 
         //$userIp=$this->user_model->updateUserip($ip,$user[0]['user_id']); 

         $link=$user[0]['recvData'];
         $var1='/invitation/';
         $var2='?mcid';
         $pool=$link;
         $temp1 = strpos($pool,$var1)+strlen($var1);
         $result = substr($pool,$temp1,strlen($pool));
         $dd = strpos($result,$var2);
         if($dd == 0){
           $dd = strlen($result);
         }
         $link1= substr($result,0,$dd); 

         $var3='?mcid=';
         $var4='&mk=';
         $pool1=$link;
         $temp2 = strpos($pool1,$var3)+strlen($var3);
         $result1 = substr($pool1,$temp2,strlen($pool1));
         $dd1=strpos($result1,$var4);
         if($dd1 == 0){
          $dd1 = strlen($result1);
         }

          $link2= substr($result1,0,$dd1); 


         $path=$_SERVER["DOCUMENT_ROOT"]. '/js/aa.js --email='.$user[0]['user_email'].' --password='.$user[0]['user_password']. '  --link='.$link1.' --link2='. $link2.' --cookieFilename='.$cookiefileName.' --resultFilename='.$resultFilename; 

          $scraperData=shell_exec('casperjs '.$path);
          $filesname=$_SERVER['DOCUMENT_ROOT'].'/js/'.$resultFilename;
          if(file_exists($filesname)){
           $fileData=file_get_contents($filesname); 
           if(!empty($fileData)){
           $token=$this->user_model->updateToken($user,$fileData); 
           if($token){
             unlink($filesname);
             $message['error'] = false;
             $message['message'] = "Code get.";
             $message['ip'] = $ip;
             $message['data'] = $scraperData;
           }
          }
         }else{
             $message['error'] = true;
             $message['message'] = "Code not get.";
         }
       }else if(preg_match('/Customers/',$maildata['Subject']))        {
          $user = $this->user_model->caserecvEmail($data);
          
          if(!empty($user)){
             if(isset($maildata['HtmlBody']) && !empty($maildata['HtmlBody'])){
              $content = html_entity_decode($maildata['HtmlBody'], ENT_NOQUOTES);
             }
             
             if(isset($maildata['TextBody']) && !empty($maildata['TextBody'])){
              $removen= str_replace('\n', PHP_EOL, $maildata['TextBody']);
              $remover= str_replace('\r', '', $removen);
              $content=$remover;
             }
             
             $this->load->library('mailsend');
             $this->mailsend->mail('joelk@wizardofamz.com', '', '', $maildata['Subject'], $content, '');
             $message['error'] = false;
             $message['message'] = "get submited issuse mail";
          }else {
             $message['error'] = true;
             $message['message'] = "Mail not get.";
          }
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function ValidateEmail_get() {
        $getData = $this->get();
        if (isset($getData['email_id']) && $getData['email_id'] != '')     {
            $user = $this->user_model->ValidateEmail($getData);
        }
        if ($user > 0) {
            $message['error'] = false;
            $message['message'] = "Email already in use.";
            $message['data'] = $user;
        }else {
            $message['error'] = true;
            $message['message'] = "Error in fething Data.";
            $message['data'] = '';
        }
        $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    

    
    //This method is used to user login process
    public function login_post() {
      	$postData = $this->post();
        $postData['password'] = md5($postData['password']);

      	$alluserdata = $this->user_model->checkLogin($postData);
        if(!empty($alluserdata)) {
            $activation = $this->user_model->checkActivation($postData);
            if(!empty($activation)){
                    $message['error'] = false;
                    $message['message'] = "Login successfully.";
                    $message['data'] = $activation;
                }else {
                    
                    $message['error'] = true;
                    $message['login_token'] = '0';
                    $message['message'] = "Please activate your account by clicking on the link in confirmation email.";
                    $message['data'] = $activation;
                }
            
            
//            if(!empty($activation)){
//                  $payment = $this->user_model->checkPayment($postData); 
//                if(!empty($payment)){
//                    $message['error'] = false;
//                    $message['message'] = "Login successfully.";
//                    $message['data'] = $payment;
//                }else {
//                    $message['login_token']='1';
//                    $message['error'] = true;
//                    $message['message'] = "You have not entered your payment details. Please proceed for adding your card details.";
//                    $message['data'] = $activation;
//                }
//            }else {
//                $message['login_token']='0';
//                $message['error'] = true;
//            	 $message['message'] = "Please activate your account by clicking on the link in confirmation email.";
//            }
        }else {
         $message['login_token']='0'; 
         $message['error'] = true;
         $message['message'] = "Invalid email address or password.";
      }
  	$this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function activation_get(){
      $getData=$this->get();
      $token= $this->user_model->activation($getData);
      if($token){
        $message['error'] = false;
        $message['message'] = "your account is activated.";
      }else {
        $message['error'] = true;
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function resetPassword_post() {
     $postData=$this->post();
     $postData['modifyDate']=date('Y-m-d H:i:s');
     $userPass=$this->user_model->updatePassword($postData);
     if($userPass){
        $message['error'] = false;
        $message['message'] = "Password reset successfully.";
     }else {
        $message['error'] = true;
        $message['message'] = "Password not reset.";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function sendPassword_post(){
     $postData=$this->post();
     $userEmail=$this->user_model->ValidateEmail($postData);
     if($userEmail>0){
        $userData=$this->user_model->getUserDataByEmail($postData);
        $token=$this->user_model->tokenGenerate();
        if(!empty($userData)){
         
         $changeToken=$this->user_model->changeToken($userData[0]['user_id'],$token);
         
        }
       
         $url = 'http://'.$_SERVER['HTTP_HOST']."/amazon_local/#/resetPassword/".$token."/".$userData[0]['user_id'];
        if($changeToken){
          $message['error'] = false;
           $message['message'] = "Reset password link sent in your mail-id.";
           $content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                 <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>Demystifying Email Design</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                  <body style="font-family:Verdana,Helvetica;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <td align="center" bgcolor="#008ACA" style="padding: 40px 0 30px 0;">
                              <img src="http://icons.iconarchive.com/icons/double-j-design/origami-colored-pencil/256/blue-mail-icon.png" alt="Creating Email Magic" height="100" style="display: block;" />
                            </td>
                            <tr>
                              <td bgcolor="#ffffff">
                                <table border="0" cellpadding="7" cellspacing="5" width="100%">
                                  <tr>
                                    <td>
                                      Hello John Carter,
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Click on the  below link and activate your account.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Url :"'.$url.'"
                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td>
                                      Thanks & Regards<br />Minton Team
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="75%">
                                      &reg; Someone, somewhere 2016<br/>
                                      Unsubscribe to this newsletter instantly
                                    </td>
                                    <td>
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://www.2care2teach4kids.com/images/icons/google-plus-icon-png-transparent.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://startupfocus.saphana.com/wp-content/uploads/2015/12/twitter-icon.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>';
                
             $this->load->library('mailsend');
            //$this->mailsend->mail($postData['email_id'], '', '', 'Your new password', $content, '');
            $this->mailsend->mail($userData[0]['email'], '', '', 'Your reset password link', $content, '');
        }else {
           $message['error'] = true;
           $message['message'] = "Something wrong in api.";
        }
     }else{
        $message['error'] = true;
        $message['message'] = "Invalid mail-id.";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function signup_post(){
      $postData = $this->post();
      $password=$postData['password'];
      $token= $this->user_model->tokenGenerate();
      $postData['userStatus']='Inactive';
      $postData['token']=$token;
      $postData['password'] = md5($postData['password']);
      $postData['createdDate']=date('Y-m-d H:i:s');
      $postData['modifyDate']=date('Y-m-d H:i:s');
      $user_id = $this->user_model->signup($postData);
      //$ip=$this->user_model->getDigitalOcean(); 
      //$userIp=$this->user_model->updateUserip($ip,$user_id);
      $url = 'http://'.$_SERVER['HTTP_HOST']."/amazon_local/#/account_activation/".$token."/".$user_id;
      

                $content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                 <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>Demystifying Email Design</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                  <body style="font-family:Verdana,Helvetica;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <td align="center" bgcolor="#008ACA" style="padding: 40px 0 30px 0;">
                              <img src="http://icons.iconarchive.com/icons/double-j-design/origami-colored-pencil/256/blue-mail-icon.png" alt="Creating Email Magic" height="100" style="display: block;" />
                            </td>
                            <tr>
                              <td bgcolor="#ffffff">
                                <table border="0" cellpadding="7" cellspacing="5" width="100%">
                                  <tr>
                                    <td>
                                      Hello '.$postData['firstName'].',
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Thank you for registering on Wizard of AMZ to be a Wizard. Please click on the link below to activate your account. After login you will be guided with the further process.

                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td>
                                      <a href="'.$url.'">'.$url.'</a>
                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td>
                                      Best Regards, <br />
Team WizardofAMZ
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="75%">
                                      &reg; Someone, somewhere 2016<br/>
                                      Unsubscribe to this newsletter instantly
                                    </td>
                                    <td>
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://www.2care2teach4kids.com/images/icons/google-plus-icon-png-transparent.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://startupfocus.saphana.com/wp-content/uploads/2015/12/twitter-icon.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>';
                
             $this->load->library('mailsend');
            $this->mailsend->mail($postData['email'], '', '', 'Please verify your email address to be a Wizard ', $content, '');
      if(!empty($user_id)) {
          $message['error'] = false;
          $message['message'] = "Please click on 'Activate Your account' link in email sent to you to complete sign up process.";
      }else {
         $message['error'] = true;
         $message['message'] = "Registered not  .";
      }
    $this->set_response($message, REST_Controller::HTTP_CREATED);  
    }
    public function casperDataRange_get(){
     $getData=$this->get();
      $filesname = $_SERVER['DOCUMENT_ROOT'] . '/js/data.csv';
       if (($handle = fopen($filesname, "r")) !== FALSE) {
           fgetcsv($handle);   
           while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
               $num = count($data); 
               for ($c=0; $c < $num; $c++) {
                 $col[$c] = $data[$c];
               }; 
              if(isset($col[2])){
               if($col[2]=='Order'){
               $this->user_model->dataRange($col,$getData['user_id']);  
               }else if($col[2]=='Refund'){
                 $this->user_model->dataRangeRefund($col,$getData['user_id']);  
               }
             }
           }
      }
    }
    public function dataRange_get() {
      $this->set_response($this->user_model->getdataRange(), REST_Controller::HTTP_CREATED);
    }
    public function cusrtomerReportCasper_get(){
     $fileName=$_SERVER["DOCUMENT_ROOT"]. '/js/customerReport.txt';
     $getData=$this->get();
     $result=$this->user_model->addCustomerReport($fileName,$getData['user_id']);
     if(!empty($result)){
        $message['message']='Customer report inserted.';
        $message['error']=false;
      }else {
        $message['message']=$result;
        $message['error']=true;
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
     
//    $current_date=date('Y-m-d H:i:s');
//      $userData=$this->db->select('*')->from('user_email')->where('user_status','3')->where ('execution_time >',$current_date)->get()->result_array();
//      if(!empty($userData)){
//          for($i=0;$i<count($userData);$i++){
//           // $fileName='customerReport'.$userData[$i]['count'].'.txt';
//            $fileName='3678276444017151.txt';
//            
//           // $a=shell_exec('casperjs /var/www/html/amazon_local/js/customer.js --email='.$userData[$i]['user_email'].' --password='.$userData[$i]['user_password'].' --resultFilename='.$fileName.' --execution_time='.$userData[$i]['count'].'');
//          $this->user_model->addCustomerReport($fileName,$userData[$i]['user_id']);
//          $this->user_model->changeTime($userData[$i]['user_email_id'],$userData[$i]['count']);
//        }
//      }
    }
    public function chekToken_get(){
      $getData=$this->get();
      $userData=$this->user_model->checkToken($getData);
      if(!empty($userData)){
        $message['data']=$userData;
        $message['error']=false;
      }else {
        $message['data']=$userData;
        $message['error']=true;
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function user_get() {
      $getData=$this->get();
        $this->set_response($this->user_model->user($getData), REST_Controller::HTTP_CREATED);
      
    }
    public function refundManager_get() {
      $getData=$this->get();
      $this->set_response($this->user_model->refundManager($getData), REST_Controller::HTTP_CREATED);
    }
    public function customerReports_get() {
      $this->set_response($this->user_model->customerReports(), REST_Controller::HTTP_CREATED);
    }
    public function inventoryCasper_get(){
     $getData=$this->get();
      $fileName=$_SERVER["DOCUMENT_ROOT"]. '/js/inventory.txt';
      $result=$this->user_model->addInventoryReport($fileName,$getData['user_id']);
      if(!empty($result)){
        $message['message']='inventory report inserted.';
        $message['error']=false;
      }else{
        $message['message']=$result;
        $message['error']=true;
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function inventory_get() {
      $this->set_response($this->user_model->inventory(), REST_Controller::HTTP_CREATED);
    }
    public function rembCasper_get(){
      $getData=$this->get();
      $fileName=$_SERVER["DOCUMENT_ROOT"]. '/js/remb.txt';
      $result=$this->user_model->addRemb($fileName,$getData['user_id']);
      if(!empty($result)){
        $message['message']='Reimbursements report inserted.';
        $message['error']=false;
      }else{
        $message['message']=$result;
        $message['error']=true;
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED); 
    }
    public function remb_get() {
     $this->set_response($this->user_model->remb(), REST_Controller::HTTP_CREATED);
    }
    public function getUserProfile_get(){
     $getData=$this->get();
     $userdata = $this->user_model->getUserProfile($getData);
     if(!empty($userdata)){
      $message['data']=$userdata;
      $message['error']=false;
     }else {
      $message['error']= true;
      $message['message']='User data not avilable';
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function update_post(){
     $postData=$this->post();
     $userdata = $this->user_model->update($postData);
     if(!empty($userdata)){
      $message['data']=$postData;
      $message['error']=false;
      $message['message']='User profile updated successfully';
     }else {
      $message['error']= true;
      $message['message']='User data not avilable';
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function checkpassword_get(){
     
     $getData=$this->get();
     $userdata = $this->user_model->checkpassword($getData);
     if(!empty($userdata)){
      $message['error']=false;
     }else {
      $message['error']= true;
      $message['message']='Invalid your old password';
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function resetP_post(){
     $postData=$this->post();
     $userdata = $this->user_model->resetP($postData);
     if($userdata){
      $message['error']=false;
      $message['message']='Password reset successfully';
     }else {
      $message['error']= true;
      $message['message']='Password not reset';
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function checkpostEmail_get(){
      $getData=$this->get();
      $userdata = $this->user_model->checkpostEmail($getData);
      if(!empty($userdata)){
        $message['error']=false;
        $message['message']='User Email';  
        $message['data']=$userdata;  
      }else {
        $message['error']= true;
        $message['message']='Email id not avilable'; 
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function createPlan_post(){
       try {
                 require_once('vendor/autoload.php');
                 Stripe::setApiKey(STRIPE_SECRET_KEY);

                 $customer = Plan::create(array(
                           'amount' =>  '5000' ,
                           'interval' => 'month',
                           "name" => "Bronze essentials",
                           "currency" => "usd",
                           "id" => "bronze-essentials"
                  ));
                 $message['message']=$customer; 
           } catch(\Stripe\Error\Card $e) {
                 $message['error']= true;
                 $message['message']=$e; 
           }
            $this->set_response($message, REST_Controller::HTTP_CREATED);
     
    }
    public function getPlan_get(){
       try {
                 require_once('vendor/autoload.php');
                 Stripe::setApiKey(STRIPE_SECRET_KEY);
                 $planData = Plan::all(array("limit" => 2));
                 $plan_array = $planData->__toArray(true);
                 if(!empty($plan_array)){
                   $message['error']=false;
                   $message['data']=$plan_array;
                 }else {
                   $message['error']=true;
                   $message['message']='Sorry you have not create account, because no any plan availabe';
                 }
                  
//                 $plan=$this->user_model->addPlan($customer_array['data']);
//                 if(!empty($plan)){
//                  $message['error']=false;
//                  $message['message']='Plan inserted';
//                 }else {
//                   $message['error']=true;
//                  $message['message']='Plan not inserted';
//                 }
                  
           } catch(\Stripe\Error\Card $e) {
                 $message['error']= true;
                 $message['message']=$e; 
           }
            $this->set_response($message, REST_Controller::HTTP_CREATED);
     
    }
    public function createSubscription_post(){
       try {
                 require_once('vendor/autoload.php');
                 Stripe::setApiKey(STRIPE_SECRET_KEY);

                 $subscription = Subscription::create(array(
                     "customer" => "cus_9n6RrTEDMGDGFG",
                     "plan" => "bronze-essentials"
                  ));
                 $message['message']=$subscription; 
           } catch(\Stripe\Error\Card $e) {
                 $message['error']= true;
                 $message['message']=$e; 
           }
            $this->set_response($message, REST_Controller::HTTP_CREATED);
     
    }
    public function stripePayments_post(){
     $postData=$this->post();
           $cardname   = $this->post('cardname');   
           $cardnumber = $this->post('cardnumber'); 
           $exp_month  = $this->post('exp_month'); 
           $exp_year   = $this->post('exp_year');
           $cvc        = $this->post('cvc');        
           $token      = $this->post('token');
           $uname      = $this->post('uname');
           $plan      = $this->post('plan');
           try {

                 require_once('vendor/autoload.php');
                 Stripe::setApiKey(STRIPE_SECRET_KEY);

                 $customer = Customer::create(array(
                      'email' =>  $uname ,
                      'source' => $token
                  ));
                 
                 $subscription = Subscription::create(array(
                     "customer" => $customer->id,
                     "plan" => $plan
                  ));
                 
                 $postData['customer_id']=$customer->id;
                 $postData['paymentDate']=date('Y-m-d h:i:s');
                 if(!empty($subscription) && !empty($customer)){
                  
                    if($this->user_model->updatePayment($postData)){
                        $userData=$this->user_model->getUserData($postData);
                       $message['error']= false;
                       $message['data']= $userData;
                       $message['message']='Your Payment successfully added'; 
                    }else {
                       $message['error']= true;
                       $message['message']='Payment not added.'; 
                    } 
              }else {
                    $message['message']='Something wrong in stripe api.'; 
              }
           } catch(\Stripe\Error\Card $e) {
                 $message['error']= true;
                 $message['message']=$e; 
           }
            $this->set_response($message, REST_Controller::HTTP_CREATED);
                         
   }
   public function addUser_post(){
    $postData=$this->post();
    $postData['createdDate']= date('Y-m-d h:i:s');
    $postData['userStatus']= 'Inactive';
    $token=$this->user_model->tokenGenerate();
    if(!empty($token)){
       $postData['token']= $token;
       $subUserId=$this->user_model->addUser($postData);
       if($subUserId){
         $url = 'http://'.$_SERVER['HTTP_HOST']."/amazon_local/#/addPassword/".$token."/".$subUserId;
      
                $content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                 <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>Demystifying Email Design</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                  <body style="font-family:Verdana,Helvetica;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                            <td align="center" bgcolor="#008ACA" style="padding: 40px 0 30px 0;">
                              <img src="http://icons.iconarchive.com/icons/double-j-design/origami-colored-pencil/256/blue-mail-icon.png" alt="Creating Email Magic" height="100" style="display: block;" />
                            </td>
                            <tr>
                              <td bgcolor="#ffffff">
                                <table border="0" cellpadding="7" cellspacing="5" width="100%">
                                  <tr>
                                    <td>
                                      Hello John Carter,
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Click on the  below link and activate your account.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <a href="'.$url.'">'.$url.'</a>
                                    </td>
                                  </tr>
                                 
                                  <tr>
                                    <td>
                                      Thanks & Regards<br />Minton Team
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="75%">
                                      &reg; Someone, somewhere 2016<br/>
                                      Unsubscribe to this newsletter instantly
                                    </td>
                                    <td>
                                      <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://www.2care2teach4kids.com/images/icons/google-plus-icon-png-transparent.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                          <td>
                                            <a href="http://www.twitter.com/">
                                              <img src="http://startupfocus.saphana.com/wp-content/uploads/2015/12/twitter-icon.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                            </a>
                                          </td>
                                          
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>';
                
            $this->load->library('mailsend');
            $this->mailsend->mail($postData['email'], '', '', 'Set Your Password ', $content, '');
        $message['error']=false;
        $message['message']='User add successfully';
       }else {
        $message['error']=true;
        $message['message']='User not added successfully';
       }
    }
    $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   public function subUserData_get(){
    $getData=$this->get();
    $subUserData=$this->user_model->subUserData($getData);
    if(!empty($subUserData)){
      $message['error']= false;
      $message['data']=$subUserData;
    }else {
       $message['error']= true;
       $message['message']='Your are not added in this system';
    }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   public function addSubUserPass_post(){
    $postData=$this->post();
    $postData['userStatus']='Active';
    $postData['modifyDate']=date('Y-m-d H:i:s');
    $postData['password']=  md5($postData['password']);
    $subUserPass=$this->user_model->addSubUserPass($postData);
    if($subUserPass){
      $message['error']= false;
      $message['data']=$subUserPass;
      $message['message']='your Password added successfully';
    }else {
       $message['error']= true;
       $message['message']='your Password not added successfully';
    }
    $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   public function subUser_get() {
      $getData=$this->get();
     $this->set_response($this->user_model->subUser($getData), REST_Controller::HTTP_CREATED);
    }
   public function allRefund_get() {
     $getData=$this->get();
    $this->set_response($this->user_model->allRefund($getData), REST_Controller::HTTP_CREATED);
   }
   public function submittedCase_get(){
     $getData=$this->get();
    $this->set_response($this->user_model->allsubmittedcCase($getData), REST_Controller::HTTP_CREATED);
   }
   public function resolvedCase_get(){
    $getData=$this->get();
    $this->set_response($this->user_model->allresolvedCase($getData), REST_Controller::HTTP_CREATED);
   }
   
   public function markresolvedescrepency_post(){
    $postData=$this->post();
    $subUserPass=$this->user_model->updateOrderStatus($postData);
    if($subUserPass){
      $message['error']= false;
      $message['message']='you have successfully update status of selected orders as resolve';
    }else {
       $message['error']= true;
       $message['message']='we are not able to change the status of your selected order';
    }
    $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   
   public function reimbursementEligible_get() {
     $getData=$this->get();
    $this->set_response($this->user_model->reimbursementEligible($getData), REST_Controller::HTTP_CREATED);
   }
   public function fullyReimbursement_get() {
     $getData=$this->get();
    $this->set_response($this->user_model->fullyReimbursement($getData), REST_Controller::HTTP_CREATED);
   }
   public function discrepency_get() {
     $getData=$this->get();
    $this->set_response($this->user_model->discrepency($getData), REST_Controller::HTTP_CREATED);
   }
   public function refundOrderDetail_get(){
    $getData=$this->get();
    $orderDetail=$this->user_model->refundOrderDetail($getData);
    if(!empty($orderDetail)){
      $message['error']= false;
      $message['data']=$orderDetail;
    }else{
      $message['error']= true;
      $message['message']='No record avilable';
    }
    $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   public function stest_post(){
    echo $afterdate=date('Y-m-d', strtotime("+3 days")); die;
    echo $sql="select user_id from user_email where deq6_time < '".$currentDate."' limit 1 "; die;
    echo $latestTime = date("Y-m-d H:i:s",strtotime(date("Y-m-d H:i:s")." +15 minutes")); die;
    $a= $this->user_model->newUser();
    print_r($a); die;
   }
    public function getUserData_get(){
     $getData=$this->get();
     $userData=$this->user_model->getUserDataByUserId($getData);
     if(!empty($userData)){
       $message['error']= false;
       $message['data']=$userData; 
     }else {
       $message['error']= true;
       $message['message']='No data avilable'; 
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function getUserToken_get(){
       $getData=$this->get();
       $userToekn=$this->user_model->getUserDataByUserId($getData);
       
       if(!empty($userToekn[0]['token'])){
         $message['error']= false;
         $message['data']=$userToekn; 
       }else {
         $message['error']= true;
         $message['message']='Token not avilable'; 
       }
       $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function clickCustomerReport_get(){
     $addtime=$this->user_model->addTime();
     $userData=$this->user_model->getUserList();
     if(!empty($userData)){
       $path=$_SERVER["DOCUMENT_ROOT"]. '/js/customerClick.js';
       $data=shell_exec('casperjs '.$path.' --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password'].' --customer_count='.$userData[0]['customer_count'].' --rem_count='.$userData[0]['remb_count'].' --inventory_count='.$userData[0]['inventory_count'].'');
       if(!empty($data)){
         $changetime=$this->user_model->changeTime($userData);
       }
     }else {
       $message['message']='No any user';
       $message['error']=false;
     }
     $addtime=$this->user_model->addTime($message['message']);
    }
    public function customerCasperClick_get(){
     $addtime=$this->user_model->addTime();
     //----customer casper
       $customerData=$this->user_model->getCustomerStatus();
       
       if(!empty($customerData)){
        $downloadpath=$_SERVER["DOCUMENT_ROOT"]. '/js/downloadCustomerReport.js';
	
       $downloadData=shell_exec('casperjs '.$downloadpath.' --email='.$customerData[0]['user_email'].' --password='.$customerData[0]['user_password'].' --customer_count='.$customerData[0]['customer_count']);
       
        if(!empty($downloadData)){
         $fileName=$_SERVER["DOCUMENT_ROOT"]. '/js/customer_'.$customerData[0]['customer_count'].'.txt';
         if(file_exists($fileName)){
         
         $result=$this->user_model->addCustomerReport($fileName,$customerData[0]['user_id']);
         if($result){
            unlink($fileName);
            $changeStatus=$this->user_model->changeCustomerClick($customerData);
            $message['message']='Customer report inserted.';
            $message['error']=false;
          }else {
            $message['message']='customer data empty';
            $message['error']=true;
          }
          $changeStatus=$this->user_model->changeCustomerClick($customerData);
         }else{
          $changeStatus=$this->user_model->changeCustomerClick($customerData);
              $message['message']='customer file not exists.';
              $message['error']=false;
          }
       }else {
           $message['message']='Some error in customer download scrper.';
           $message['error']=false;
       }
       
      }else {
         $message['message']='No any status true';
           $message['error']=true;
      } 
      $addtime=$this->user_model->addTime($message['message']);
    }
    public function rembCasperClick_get(){
     $addtime=$this->user_model->addTime();
     //----remb scraper
       $rembData=$this->user_model->getrembStatus();
       if(!empty($rembData)){
        $downloadrpath=$_SERVER["DOCUMENT_ROOT"].'/js/downloadRem.js';
	
       $downloadremData=shell_exec('casperjs '.$downloadrpath.' --email='.$rembData[0]['user_email'].' --password='.$rembData[0]['user_password'].' --rem_count='.$rembData[0]['remb_count']);
        if(!empty($downloadremData)){
         $rfileName=$_SERVER["DOCUMENT_ROOT"]. '/js/rembData_'.$rembData[0]['remb_count'].'.txt';
         if(file_exists($rfileName)){
         
         $rresult=$this->user_model->addRemb($rfileName,$rembData[0]['user_id']);
         unlink($rfileName);
         if($rresult){
            $changeStatus=$this->user_model->changeRemClick($rembData);
            $message['message']='Rem report inserted.';
            $message['error']=false;
          }else {
            $message['message']='rem data empty';
            $message['error']=true;
          }
          $changeStatus=$this->user_model->changeRemClick($rembData);
         }else{
          $changeStatus=$this->user_model->changeRemClick($rembData);
              $message['message']='rem file not exists.';
              $message['error']=true;
          }
       }else {
           $message['message']='Some error in rem scrper.';
           $message['error']=true;
       }
       
      }else {
        $message['message']='No true status of remb.';
        $message['error']=true;
      }
      $this->user_model->addTime($message['message']);
    }
    public function inventoryCasperClick_get(){
     $addtime=$this->user_model->addTime();
     //----inventory scraper
       $inventoryData=$this->user_model->getinventoryStatus();
          
       if(!empty($inventoryData)){
        $downloadrpath=$_SERVER["DOCUMENT_ROOT"].'/js/downloadInventoryReport.js';
	
       $downloadinventoryData=shell_exec('casperjs '.$downloadrpath.' --email='.$inventoryData[0]['user_email'].' --password='.$inventoryData[0]['user_password'].' --inventory_count='.$inventoryData[0]['inventory_count']);
        if(!empty($downloadinventoryData)){
         $ifileName=$_SERVER["DOCUMENT_ROOT"]. '/js/inventoryData_'.$inventoryData[0]['inventory_count'].'.txt';
         if(file_exists($ifileName)){
         
         $rresult=$this->user_model->addInventoryReport($ifileName,$inventoryData[0]['user_id']);
         if($rresult){
            unlink($ifileName);
            $changeStatus=$this->user_model->changeInventoryClick($inventoryData);
            $message['message']='inventory report inserted.';
            $message['error']=false;
          }else {
            $message['message']='inventory data empty';
            $message['error']=true;
          }
          $changeStatus=$this->user_model->changeInventoryClick($inventoryData);
         }else{
          $changeStatus=$this->user_model->changeInventoryClick($inventoryData);
              $message['message']='inventory file not exists.';
              $message['error']=true;
          }
       }else {
           $message['message']='Some error in inventory scrper.';
           $message['error']=true;
       }
       
      }else {
        $message['message']='No true status of inventory status.';
        $message['error']=true;
      }
      $this->user_model->addTime($message['message']);
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function dataRangeCasperClick_get(){
     $addtime=$this->user_model->addTime();
     //----datarange scraper
       $rangeData=$this->user_model->getdataRangeStatus();
       if(!empty($rangeData)){
       
        $downloaddpath=$_SERVER["DOCUMENT_ROOT"].'/js/datarange.js';
	
       $downloadDatarangData=shell_exec('casperjs '.$downloaddpath.' --email='.$rangeData[0]['user_email'].' --password='.$rangeData[0]['user_password'].' --datarange_count='.$rangeData[0]['datarange_count']);
       
        if(!empty($downloadDatarangData)){
         $dfileName=$_SERVER["DOCUMENT_ROOT"]. '/js/datarange_'.$rangeData[0]['datarange_count'].'.csv';
         if(file_exists($dfileName)){
          $rresult=false;
          if (($handle = fopen($dfileName, "r")) !== FALSE) {
           fgetcsv($handle);   
           while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
               $num = count($data); 
               for ($c=0; $c < $num; $c++) {
                 $col[$c] = $data[$c];
               }; 
              if(isset($col[2])){
               if($col[2]=='Order'){
               $rresult=$this->user_model->dataRange($col,$rangeData[0]['user_id']);  
               }else if($col[2]=='Refund'){
                $rresult= $this->user_model->dataRangeRefund($col,$rangeData[0]['user_id']);  
               }
              
               $changeStatus=$this->user_model->changeDatarangeClick($rangeData);
                unlink($dfileName);
            $message['message']='datarange report inserted.';
            $message['error']=false;
               
             }
           }
      }
           $changeStatus=$this->user_model->changeDatarangeClick($rangeData);
         }else{
           $changeStatus=$this->user_model->changeDatarangeClick($rangeData);
              $message['message']='datarange file not exists.';
              $message['error']=true;
          }
       }else {
           $message['message']='Some error in datarange scrper.';
           $message['error']=true;
       }
      }else {
        $message['message']='No true status of datarange status.';
        $message['error']=true;
      }
      $this->user_model->addTime($message['message']);
    }
    public function caselog_get(){
     $caseLogData=$this->user_model->caselog();
     if($caseLogData){
         $message['error']= false;
         $message['message']='inserted caselog data'; 
     }else{
         $message['error']= true;
         $message['message']='Data not inserted'; 
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function caselogmessage_get(){
     $caseLogmessageData=$this->user_model->caselogmessage();
     if($caseLogmessageData){
         $message['error']= false;
         $message['message']='Inserted caselog message data'; 
     }else{
         $message['error']= true;
         $message['message']='Data not inserted'; 
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    
    public function getcaselog_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->getcaselog($getData), REST_Controller::HTTP_CREATED);
    }
    public function caselogDetail_get(){
     $getData= $this->get();
     $result=$this->user_model->caselogDetail($getData);
     if(!empty($result['caseLog'])){
         $message['error']= false;
         $message['message']='Log detail'; 
         $message['data']=$result;
     }else{
         $message['error']= true;
         $message['message']='Data not inserted'; 
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function customerIssue_post(){
     $postData=$this->post();
     
     if(isset($postData['note'])){
      unset($postData['note']);
     }
     if(isset($postData['issue_id'])){
      unset($postData['issue_id']);
     }
     if(isset($postData['issuse_status'])){
      unset($postData['issuse_status']);
     }
     if(isset($postData['createdDate'])){
      unset($postData['createdDate']);
     }
     if(isset($postData['caseId'])){
      unset($postData['caseId']);
     }
     if(isset($postData['rembId'])){
      unset($postData['rembId']);
     }
     if(isset($postData['total'])){
      unset($postData['total']);
     }
     $result=$this->user_model->customerIssue($postData);
     if($result){
         $message['error']= false;
         $message['message']='Your mail successfully send.'; 

     }else{
         $message['error']= true;
         $message['message']='It seems that you have requested a lot of information from Amazon. Please wait for a few hours to submit your case again.'; 
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function getCustomerissue_get(){
     $getData=$this->get();
     $customerData=$this->user_model->getCustomerissue($getData);
     if(!empty($customerData)){
         $message['error']= false;
         $message['data']= $customerData;
         $message['message']='get customer issue data.'; 
     }else{
         $message['error']=true;
         $message['message']="no data avialble";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function degital_get(){
    
    }
    
    public function recvdegital_get(){
     
    }
    public function allUserList_get(){
     $userData=$this->user_model->allUserList();
     if(!empty($userData)){
         $message['error']= false;
         $message['data']= $userData;
         $message['message']='User data.'; 
     }else{
         $message['error']=true;
         $message['message']="no data avialble";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function caseLogData_get(){
     $getData=$this->get();
     $caseLogData=$this->user_model->caseLogData($getData);
     if(!empty($caseLogData)){
         $message['error']= false;
         $message['data']= $caseLogData;
         $message['message']='case Log data.'; 
     }else{
         $message['error']=true;
         $message['message']="no data avialble";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function editCase_post(){
     $postData=$this->post();
     $caseLogData=$this->user_model->editCase($postData);
     if($caseLogData){
         $message['error']= false;
         $message['data']= $caseLogData;
         $message['message']='Case updated successfully'; 
     }else{
         $message['error']=true;
         $message['message']="Case not updated";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function changesubmitedcase_get(){
     $getData=$this->get();
     $resolvedData=$this->user_model->changesubmitedcase($getData);
     if($resolvedData){
         $message['error']= false;
         $message['data']= $resolvedData;
         $message['message']='Case reolved successfully'; 
     }else{
         $message['error']=true;
         $message['message']="Case not updated";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function saveCaseData_post(){
     $postData=$this->post();
     $caseData=$this->user_model->saveCaseData($postData);
     if($caseData){
         $message['error']= false;
         $message['message']='Data updated successfully'; 
     }else{
         $message['error']=true;
         $message['message']="Data not updated";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function getIssueId_get(){
      $getData=$this->get();
      $caseData=$this->user_model->getIssueId($getData);
      if(!empty($caseData)){
          $message['error']= false;
          $message['data']= $caseData[0];
      }else{
          $message['error']=true;
          $message['message']="Data not available";
      }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function firstTimeLogin_get(){
     $userData=$this->user_model->newUser();
     if(!empty($userData)){
       $downloadpath=$_SERVER["DOCUMENT_ROOT"]. '/js/newUser.js';
	
       $downloadData=shell_exec('casperjs '.$downloadpath.' --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password']);
       
        if(!empty($downloadData)){
         $Data=$this->user_model->chnageFirtTimeLoginStatus($userData);
         if($Data){
           $message['error']=false;
           $message['message']="Change first time user staus";
         }else {
           $message['error']=true;
           $message['message']="No any chnages first time user staus";
         }
        }else {
          $message['error']=true;
          $message['message']="Some error in new user scraper";
        }
     }else {
       $message['error']=true;
       $message['message']="No any new user";
     }
     $addtime=$this->user_model->addTime($message['message']);
    }
    public function draft_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->draft($getData), REST_Controller::HTTP_CREATED);
    }
//    public function sendDraftCase_post(){
//     $postData=$this->post();
//     $data=$this->user_model->sendDraftCase($postData);
//     if($data){
//       $message['error']=false;
//       $message['message']="Your case submited";
//     }else{
//       $message['error']=true;
//       $message['message']="Your case not  submited";
//     }
//     $this->set_response($message, REST_Controller::HTTP_CREATED);
//    }
    public function submitedInventory_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->submitedInventory($getData), REST_Controller::HTTP_CREATED);
    }
    public function resolvedInventory_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->resolvedInventory($getData), REST_Controller::HTTP_CREATED);
    }
    public function getInventoryCaselog_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->getInventoryCaselog($getData), REST_Controller::HTTP_CREATED);
    }
    public function getInventoryDraft_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->getInventoryDraft($getData), REST_Controller::HTTP_CREATED);
    }
    public function addinventoryIssue_post(){
     $postData=$this->post();
     //print_r($postData); die;
     if(isset($postData['issue_id'])){
      unset($postData['issue_id']);
     }
     if(isset($postData['caseId'])){
      unset($postData['caseId']);
     }
     if(isset($postData['rembId'])){
      unset($postData['rembId']);
     }
     if(isset($postData['total'])){
      unset($postData['total']);
     }
     if(isset($postData['note'])){
      unset($postData['note']);
     }
     if(isset($postData['createdDate'])){
      unset($postData['createdDate']);
     }
     if(isset($postData['modifyDate'])){
      unset($postData['modifyDate']);
     }
     if(isset($postData['issuse_status'])){
      unset($postData['issuse_status']);
     }
     $data=$this->user_model->addinventoryIssue($postData);
     if(!empty($data)){
       $message['error']=false;
       $message['message']="Your case submited";
     }else {
       $message['error']=true;
       $message['message']="Your case not submited";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function getInventoryissue_get(){
     $getData=$this->get();
     $inventoryData=$this->user_model->getInventoryissue($getData);
     if(!empty($inventoryData)){
         $message['error']= false;
         $message['data']= $inventoryData;
         $message['message']='get inventory issue data.'; 
     }else{
         $message['error']=true;
         $message['message']="no data avialble";
     }
      $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function sendDraftInventoryCase_post(){
     $postData=$this->post();
     $data=$this->user_model->sendDraftInventoryCase($postData);
     if($data){
       $message['error']=false;
       $message['message']="Your case submited";
     }else{
       $message['error']=true;
       $message['message']="Your case not  submited";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function inventoryCaseData_get(){
     $getData=$this->get();
     $data=$this->user_model->inventoryCaseData($getData);
     if(!empty($data)){
       $message['error']=false;
       $message['data']=$data;
       $message['message']="Get inventory case data";
     }else{
       $message['error']=true;
       $message['message']="Inventory case not avilable";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
   }
   public function editInventoryCase_post(){
     $postData=$this->post();
     $inventoryLogData=$this->user_model->editInventoryCase($postData);
     if($inventoryLogData){
         $message['error']= false;
         $message['message']='Case updated successfully'; 
     }else{
         $message['error']=true;
         $message['message']="Case not updated";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function fileUpload_post() {
       $output_dir = $_SERVER['DOCUMENT_ROOT'].'/amazon_local/uploads/';
       if(isset($_FILES["myfile"]))
       {
            $error =$_FILES["myfile"]["error"];
            //You need to handle  both cases
            //If Any browser does not support serializing of multiple files using FormData() 
            if(!is_array($_FILES["myfile"]["name"])) //single file
            {
            $fileName = md5($_FILES["myfile"]["name"]).'_'.$_FILES["myfile"]["name"];
            move_uploaded_file($_FILES["myfile"]["tmp_name"],$output_dir.$fileName);
            $ret[]= $fileName;
            } else  //Multiple files, file[]
            {
              $fileCount = count($_FILES["myfile"]["name"]);
              for($i=0; $i < $fileCount; $i++)
              {
                    $fileName = md5($_FILES["myfile"]["name"]).'_'.$_FILES["myfile"]["name"][$i];
                    move_uploaded_file($_FILES["myfile"]["tmp_name"][$i],$output_dir.$fileName);
                    $ret[]= $fileName;
              }
            }
            echo json_encode($ret);
         }
    }
    public function saveMailReply_post(){
     $postData=$this->post();
     $replyData=$this->user_model->saveMailReply($postData);
     if($replyData){
         $message['error']= false;
         $message['message']='Mail sent successfully'; 
     }else{
         $message['error']=true;
         $message['message']="Mail not sent";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function updateDEQ6_get(){
     $data=$this->user_model->getDEQ6user();
     if(!empty($data)){
       $deqdata=$this->user_model->addDEQ6RembId($data[0]);
       if($deqdata){
         $updatetime=$this->user_model->updateDEQ6user($data[0]);
         if($updatetime){
           $message['error']=FALSE;
           $message['message']="user deq6 time update ";
         }else {
           $message['error']=true;
           $message['message']="user deq6 time not update ";
         }
         
       }else {
         $message['error']=false;
         $message['message']="DEQ6 update remb id";
       }
       
     }else {
         $message['error']=true;
         $message['message']="DEQ6 no user";
     }
     $addtime=$this->user_model->addTime($message['message']);
    }
    public function updateMf_get(){
      //$deqdata=$this->user_model->addMfRembId();
      $data=$this->user_model->getMfuser();
     if(!empty($data)){
       $deqdata=$this->user_model->addMfRembId($data[0]);
       if($deqdata){
         $updatetime=$this->user_model->updateMfuser($data[0]);
         if(!empty($updatetime)){
           $message['error']=FALSE;
           $message['message']="user mf time update ";
         }else {
           $message['error']=true;
           $message['message']="user mf time not update ";
         }
         
       }else {
         $message['error']=false;
         $message['message']="mf update remb id";
       }
       
     }else {
         $message['error']=true;
         $message['message']="mf no user";
     }
     $addtime=$this->user_model->addTime($message['message']);
    }
    public function skuHistory_get(){
      $getData=$this->get();
      $this->set_response($this->user_model->skuHistory($getData), REST_Controller::HTTP_CREATED);
    }
    public function checkRembId_post(){
     $postData=$this->post();
     $data=$this->user_model->checkRembId($postData);
     $message['error']=false;
     $message['message']="inventory and remb data";
     $message['data']=$data;
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function assignRembId_post(){
     $postData=$this->post();
     $data=$this->user_model->assignRembId($postData);
     if($data){
      $message['error']=false;
      $message['message']="Reimbursement  id updated";
     }else {
      $message['error']=true;
      $message['message']="These Inventory reason and Reimbursement reason does not match.";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function saveTempRembid_post(){
     $postData=$this->post();
     
     $data=$this->user_model->saveTempRembid($postData);
     if($data){
      $message['error']=false;
      $message['message']="Reimbursement id inserted in teamp table";
    }else {
      $message['error']=true;
      $message['message']="Some error";
    }
    $this->set_response($message, REST_Controller::HTTP_CREATED);       
    }
    public function updateRembId_post(){
     $postData=$this->post();
     $data=$this->user_model->updateRembId($postData);
     if($data){
      $message['error']=false;
      $message['message']="Reimbursement id updated";
     }else {
      $message['error']=true;
      $message['message']="These Inventory reason and Reimbursement reason does not match.";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
     
    }
    public function getDashboardData_get(){
     $getData=$this->get();
     $data=$this->user_model->getDashboardData($getData);
     if(!empty($data)){
       $message['error']=FALSE;
       $message['message']="Dashboard Data";
       $message['data']=$data;
     }else{
       $message['error']=true;
       $message['message']="Dashboard Data not avilable";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
    }
    public function scheduleIssue_post(){
     $postData=$this->post();
     $data=$this->user_model->scheduleIssue($postData);
     if(!empty($data)){
       $message['error']=FALSE;
       $message['message']="Your case save but it sent after some days";
       $message['data']=$data;
     }else{
       $message['error']=true;
       $message['message']="Your case not save";
     }
     $this->set_response($message, REST_Controller::HTTP_CREATED);
     
    }
    
}
