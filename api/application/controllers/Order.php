<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once $_SERVER['DOCUMENT_ROOT'].'/aws/api/application/libraries/MarketplaceWebServiceOrders/Client.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/aws/api/application/libraries/MarketplaceWebServiceOrders/Model/ListOrdersRequest.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/aws/api/application/libraries/MarketplaceWebServiceOrders/Model/ListOrderItemsRequest.php';
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
require_once 'http://103.239.146.250:898/amazon_local/api/application/libraries/MarketplaceWebServiceOrders/Client.php';
class Order extends REST_Middel_Controller {
    function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }
     public function getOrder_get(){
      $this->user_model()->getOrder();
    }
}
