<?php
class User_model extends CI_Model {

    public $table;
    protected $_sql_details = array(
        'user' => DB_USERNAME,
        'pass' => DB_PASSWORD,
        'db' => DATABASE_NAME,
        'host' => DB_HOST
    );
    
    protected $_config = array(
        'ServiceURL' => 'https://mws.amazonservices.com/Orders/2016-2-1',
        'UserAgent' => 'MarketplaceWebServiceOrders PHP5 Library',
        'ProxyHost' => null,
        'ProxyPort' => -1,
        'MaxErrorRetry'=>3,
    );
    function __construct() {
        $this->table = "user";
        $this->load->library('ssp');
        parent::__construct();
   }
   public function activation($data){
    if(!empty($data)){
     $userData=$this->db->select('*')->from('user')->where('user_id',$data['user_id'])->where('token',$data['token'])->where('userStatus','Inactive')->get()->result_array();
     if(!empty($userData)){
       $upData=array('userStatus'=>'Active');
       $this->db->where('user_id',$data['user_id']);
       $this->db->update('user',$upData);
       return $this->db->affected_rows();
     }
    }
   }
   public function updatePayment($data){
       $upData=array('is_payment'=>'1');
       $this->db->where('user_id',$data['user_id']);
       $this->db->update('user',$upData);
       return $this->db->affected_rows();
   }
   public function getUserDataByEmail($data){
    return $this->db->select('*')->from('user')->where('email',$data['email_id'])->get()->result_array();
   }
   public function changeToken($userId,$token){
    $updateToken=array('token'=>$token);
    $this->db->where('user_id',$userId);
    $this->db->update('user',$updateToken);
    return $this->db->affected_rows();
   }
   public function getUserData($data){
       return $this->db->select('*')->from('user')->where('user_id',$data['user_id'])->get()->result_array();
   }
   
//    public function destroyedByAmazon($data){
//      $userId=$data['user_id'];
//      $sql='select date,quantity,msku,transactionId,reason,CASE WHEN quantity <0 THEN quantity*-1  ELSE quantity END AS quantity    from inventory_adjustments where (reason in("D","E","Q","6" )) AND (user_id='.$userId.')'; 
//      return $this->db->query($sql)->result_array();
//      $finalArray=[];
//      for($i=0;$i<count($limitData); $i++){
//        if($limitData[$i]['quantity']<0){
//          $limit=($limitData[$i]['quantity']) * -1;
//          $query="select date,quantity,msku,transactionId,reason from inventory_adjustments where (reason in('D','E','Q','6' )) AND (user_id=".$userId.") AND (msku='".$limitData[$i]['msku']."')  ORDER BY inventory_id DESC  limit ".$limit." ";
//          $data= $this->db->query($query)->result_array();
//          for($j=0;$j<count($data);$j++){
//            array_push($finalArray,$data[$j]);
//          }
//        }
//      }
//      return $finalArray;
//   }
    
    public function inventoryDetail($data){
      $userId=$data['user_id'];
       $DEQ6sql="select t.rembId as temprembid ,a.*,IFNULL(b.total,0) as total from (select i.msku,i.transactionId,CASE WHEN i.quantity<0 THEN i.quantity * (-1) ELSE i.quantity END AS quantity,i.date,i.reason,i.inventory_id from inventory_adjustments as i where i.reason in ('D','E','Q','6','M') AND i.user_id=".$userId." AND i.update_status='0' AND (i.inventory_status='0' || i.inventory_status='5') AND (i.rembId = '0' || i.rembId = '' )) as a left join (select data_range_report_order.product_sales as total,data_range_report_order.sku,data_range_report_order.datetime from data_range_report_order where data_range_report_order.data_id in (select max(data_range_report_order.data_id) from data_range_report_order where data_range_report_order.product_sales!=0 AND data_range_report_order.product_sales >0 AND  data_range_report_order.sku in (select i.msku FROM inventory_adjustments as i where (i.reason in('D','E','Q','6')) AND (i.user_id=".$userId." AND i.update_status='0' AND (i.inventory_status='0' || i.inventory_status='5') AND (i.rembId = '0' || i.rembId = '' )) group by i.msku ) group by data_range_report_order.sku)) as b on a.msku=b.sku left join temprembid as t on t.inventory_id=a.inventory_id order by a.date DESC"; 
      $finalArray=  $this->db->query($DEQ6sql)->result_array();
      $automatchsql="select t.rembId as temprembid ,a.*,IFNULL(b.total,0) as total from (select i.msku,i.rembId,i.transactionId,CASE WHEN i.quantity<0 THEN i.quantity * (-1) ELSE i.quantity END AS quantity,i.date,i.reason,i.inventory_id from inventory_adjustments as i where i.reason in ('D','E','Q','6','M') AND i.user_id=".$userId." AND (i.inventory_status='0' || i.inventory_status='5') AND i.update_status='1' AND (i.rembId != '0' || i.rembId != '' )) as a left join (select data_range_report_order.product_sales as total,data_range_report_order.sku,data_range_report_order.datetime from data_range_report_order where data_range_report_order.data_id in (select max(data_range_report_order.data_id) from data_range_report_order where data_range_report_order.product_sales!=0 AND data_range_report_order.product_sales >0 AND  data_range_report_order.sku in (select i.msku FROM inventory_adjustments as i where (i.reason in('D','E','Q','6')) AND (i.user_id=".$userId." AND (i.inventory_status='0' || i.inventory_status='5') AND i.update_status='1' AND (i.rembId != '0' || i.rembId != '' )) group by i.msku ) group by data_range_report_order.sku)) as b on a.msku=b.sku left join temprembid as t on t.inventory_id=a.inventory_id order by a.date DESC"; 
      $automatchdata=  $this->db->query($automatchsql)->result_array();
      $res['result']=$finalArray;
      $res['automatchdata']=$automatchdata;
      return $res;
  }
  
   public function misplaced($data){
      $userId=$data['user_id'];
      $sql='select i.inventory_id,i.msku , sum(i.quantity) as quantity from inventory_adjustments as i where (i.reason in("M","F")) AND (i.user_id='.$userId.') '.$wh.' group by i.msku,i.inventory_id'; 
      $limitData=$this->db->query($sql)->result_array();
      $finalArray=[];
      for($i=0;$i<count($limitData); $i++){
        if($limitData[$i]['quantity']<0){
          $limit=($limitData[$i]['quantity']) * -1;
          $query="select date,quantity,msku,transactionId,reason from inventory_adjustments where (reason in('M')) AND (user_id=".$userId.") AND (msku='".$limitData[$i]['msku']."') ".$wh." ORDER BY inventory_id DESC  limit ".$limit."  ";
          $data= $this->db->query($query)->result_array();
          for($j=0;$j<count($data);$j++){
            if($data[$j]['quantity']<0){
             $data[$j]['quantity']=($data[$j]['quantity'])*(-1);
            }
            array_push($finalArray,$data[$j]);
          }
        }
      }
      return $finalArray;
   }
   
   public function checkToken($data){
    return $this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
   }
   public function invitationrecvEmail($datas){
     $data=json_decode($datas,true);
     
     $textBody= $data['TextBody']; 
     $urlStart = substr($textBody, strpos($textBody, "\nh") + 1);
     $cleanUrl = substr($urlStart, 0, strpos($urlStart, "\r\n\r\n2"));
     $updateData=array(
          'recvData'=>$cleanUrl,
          'user_status'=>'1'
     );

     $this->db->where('user_email', $data['OriginalRecipient']);
     $this->db->update('user_email', $updateData);


     return $this->db->select('*')->from('user_email')->where('user_email',$data['OriginalRecipient'])->get()->result_array();
     
  }
  
  public function caserecvEmail($datas)
  {
    $data=json_decode($datas,true);
    $a=$data['Subject'];
    $order_id = substr($a, strpos($a, "Order ID:") + 9);    
    $var1='/[CASE /';
    $var2=']';
    $pool=$a;
    $temp1 = strpos($pool,$var1)+strlen($var1);
    $result = substr($pool,$temp1,strlen($pool));
    $dd = strpos($result,$var2);
    if($dd == 0){
      $dd = strlen($result);
    }
    $caseId= substr($result,0,$dd); 
            if(isset($data['HtmlBody']) && !empty($data['HtmlBody'])){
              $content = html_entity_decode($data['HtmlBody'], ENT_NOQUOTES);
             }
             
             if(isset($data['TextBody']) && !empty($data['TextBody'])){
              //$content = html_entity_decode($maildata['TextBody'], ENT_NOQUOTES);
              $content=$data['TextBody'];
             }
    $caseData=array('caseId'=>trim($caseId),'des'=>$content,'createdDate'=>date('Y-m-d H:i:s'),'order_id'=>$order_id);
       $this->db->insert('case_log_msg', $caseData);
       return $this->db->insert_id();
     
  }

   public function ValidateEmail($data) {
      if(!empty($data['rowId'])){
       $this->db->where('user_id !=', $data['rowId']); 
      }
      $this->db->where('email', $data['email_id']);
      $this->db->where('userStatus !=', 'Deleted');
      $user_cnt = $this->db->get('user')->result_array();        
      return count($user_cnt);
    }
    
    //--check login
    public function checkLogin($data) {
        $this->db->where('email', $data['email']);
        $this->db->where('password', $data['password']);
        return $this->db->get($this->table)->result_array();
    }
    public function checkActivation($data){
        $this->db->where('email', $data['email']);
        $this->db->where('password', $data['password']);
        $this->db->where('userStatus','Active');
        return $this->db->get($this->table)->result_array();
    }
    public function checkPayment($data){
        $this->db->where('email', $data['email']);
        $this->db->where('password', $data['password']);
        $this->db->where('is_payment','1');
        return $this->db->get($this->table)->result_array();
    }
    
    public function dataRange($data,$userId){
      $userId=$userId;
      if(count($data)>1){
        
            if($data[0] !='date/time' &&  $data[1] !='settlement id'){
              $orderId=$data[3];
              
              $date=date('Y-m-d',strtotime($data[0]));
             if($data[8]!='Seller'){
              
                    $importData=array(
                      'datetime'=>$date,
                      'user_id'=>$userId,
                      'settlement_id'=>$data[1],
                      'type'=>$data[2],
                      'order_id'=>$data[3],
                      'sku'=>$data[4],
                      'description'=>$data[5],
                      'quantity'=>$data[6],
                      'marketplace'=>$data[7],
                      'fulfillment'=>$data[8],
                      'order_city'=>$data[9],
                      'order_state'=>$data[10],
                      'order_postal'=>$data[11],
                      'product_sales'=>$data[12],
                      'shipping_credits'=>$data[13],
                      'gift_wrap_credits'=>$data[14],
                      'promotional_rebates'=>$data[15],
                      'sales_tax_collected'=>$data[16],
                      'selling_fees'=>$data[17],
                      'fba_fees'=>$data[18],
                      'other_transaction_fees'=>$data[19],
                      'other'=>$data[20],
                      'total'=>$data[21],
                      'oorderStatus'=>'0',
                      'createdDate'=>date('Y-m-d H:i:s')
                      );
                   
                    $this->db->insert('data_range_report_order', $importData);
                    $this->db->insert_id();
             }
            }
               return true;
          }else {
           return false;
          }
      
      }
      public function dataRangeRefund($data,$userId){
      $userId=$userId;
      if(count($data)>1){
        if($data[0] !='date/time' &&  $data[1] !='settlement id'){
         if($data[8]!='Seller'){
           $orderId=$data[3];
           $alredyOrder=$this->db->select('*')->from('data_range_report_refund')->where('order_id',$orderId)->get()->result_array();
           if($data[21]<0){
            $t=$data[21]*(-1);
           }else {
            $t=$data[21];
           }
           if(!empty($alredyOrder)){
            if($alredyOrder[0]['total']<0){
             
              $total=$t+($alredyOrder[0]['total'])*(-1);
             
            }else {
             $total=$t+$alredyOrder[0]['total'];
            }
            $updatearray=array('total'=>$total);
            $this->db->where('data_id',$alredyOrder[0]['data_id']);
            $this->db->update('data_range_report_refund',$updatearray);
            
           }else {
            $total=$t;
            $date=date('Y-m-d',strtotime($data[0]));
                $importData=array(
                  'datetime'=>$date,
                  'user_id'=>$userId,
                  'settlement_id'=>$data[1],
                  'type'=>$data[2],
                  'order_id'=>$data[3],
                  'sku'=>$data[4],
                  'description'=>$data[5],
                  'quantity'=>$data[6],
                  'marketplace'=>$data[7],
                  'fulfillment'=>$data[8],
                  'order_city'=>$data[9],
                  'order_state'=>$data[10],
                  'order_postal'=>$data[11],
                  'product_sales'=>$data[12],
                  'shipping_credits'=>$data[13],
                  'gift_wrap_credits'=>$data[14],
                  'promotional_rebates'=>$data[15],
                  'sales_tax_collected'=>$data[16],
                  'selling_fees'=>$data[17],
                  'fba_fees'=>$data[18],
                  'other_transaction_fees'=>$data[19],
                  'other'=>$data[20],
                  'total'=>$total,
                  'orderStatus'=>'0',
                  'createdDate'=>date('Y-m-d H:i:s')
                  );

                $this->db->insert('data_range_report_refund', $importData);
                $this->db->insert_id();
           }
         }
        }
              return true;
             }else {
             return false;
            }
      
      }
    
    public function getdataRange()
    {
      $table = 'data_range_report';
      $primaryKey = 'data_id';
      
      $columns = array(
          array('db' => 'datetime', 'dt' => 0,'searchable'=>'datetime'),
          array('db' => 'type','dt' => 1, 'searchable'=>'type'),
          array('db' => 'order_id','dt' => 2, 'searchable'=>'order_id'),
          array('db' => 'quantity','dt' => 3,'searchable'=>'quantity'),
          array('db' => 'marketplace','dt' => 4,'searchable'=>'marketplace'),
          array('db' => 'order_city','dt' => 5,'searchable'=>'order_city'),
          array('db' => 'order_postal','dt' => 6, 'searchable'=>'order_postal'),
          array('db' => 'product_sales','dt' => 7, 'searchable'=>'product_sales'),
          array('db' => 'total','dt' => 8, 'searchable'=>'total'),
      );
      $order='ORDER BY data_range_report.data_id DESC';
      $sql = 'select * from data_range_report $where $order $limit '; 
      
      $extraWhere ='';
      
      SSP::totalCondition($extraWhere,'');
      
      $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
      return $data;
    }
    public function addCustomerReport($fileName,$userId){
      $filesname = $fileName;
      $csv = array_map(function ($value) {
                    return str_getcsv($value, "\t");
                }, file($filesname));
                array_walk($csv, function (&$a) use ($csv) {
                    $a = array_combine($csv[0], $a);
                });
                array_shift($csv);
   
      if(!empty($csv)){
           for($i=0;$i<count($csv);$i++){
            $orderId=$csv[$i]['order-id'];
            $date=date('Y-m-d',strtotime($csv[$i]['return-date']));
            $insertData=array(
              'asin'=>$csv[$i]['asin'],
              'date'=>$date,
              'disposition'=>$csv[$i]['detailed-disposition'],
              'fc'=>$csv[$i]['fulfillment-center-id'],
              'fnsku'=>$csv[$i]['fnsku'],
              'orderId'=>$csv[$i]['order-id'],
              'quantity'=>$csv[$i]['quantity'],
              'reason'=>$csv[$i]['reason'],
              'sku'=>$csv[$i]['sku'],
              'status'=>$csv[$i]['status'],
              'title'=>$csv[$i]['product-name'],
              'user_id'=>$userId,
              'corder_status'=>'0',
              'createdDate'=>date('Y-m-d H:i:s')
            );
            $this->db->insert('customer_report', $insertData);
            $customerReportId = $this->db->insert_id();
           }
           return true;
       }else {
        return false;
       }
     
    }
    public function changeTime($data){
      $afterdate=date('Y-m-d', strtotime("+3 days"));
      $updateArray=array(
          'customer_execution_time'=>$afterdate,
          'customer_click_status'=>'1',
          'remb_click_status'=>'1',
          'datarange_click_status'=>'1',
          'inventory_click_status'=>'1',
          'remb_count'=>$data[0]['remb_count']+1,
          'inventory_count'=>$data[0]['inventory_count']+1,
          'customer_count'=>$data[0]['customer_count']+1,
          'datarange_count'=>$data[0]['datarange_count']+1);
      $this->db->where('user_email',$data[0]['user_email']);
      $this->db->update('user_email',$updateArray);
      return $this->db->affected_rows();
    }
    public function changeCustomerClick($data){
     $updateArray=array('customer_click_status'=>'0');
     $this->db->where('user_email',$data[0]['user_email']);
     $this->db->update('user_email',$updateArray);
      return $this->db->affected_rows();
    }
    public function changeRemClick($data){
     $updateArray=array('remb_click_status'=>'0');
     $this->db->where('user_email',$data[0]['user_email']);
     $this->db->update('user_email',$updateArray);
      return $this->db->affected_rows();
    }
    public function changeInventoryClick($data){
     $updateArray=array('inventory_click_status'=>'0');
     $this->db->where('user_email',$data[0]['user_email']);
     $this->db->update('user_email',$updateArray);
      return $this->db->affected_rows();
    }
    public function changeDatarangeClick($data){
     $updateArray=array('datarange_click_status'=>'0');
     $this->db->where('user_email',$data[0]['user_email']);
     $this->db->update('user_email',$updateArray);
      return $this->db->affected_rows();
    }
    public function customerReports(){
      $table = 'customer_report';
      $primaryKey = 'creport_id';
      
      $columns = array(
          array('db' => 'asin', 'dt' => 0),
          array('db' => 'date','dt' => 1),
          array('db' => 'fc','dt' => 2),
          array('db' => 'fnsku','dt' => 3),
          array('db' => 'orderId','dt' => 4),
          array('db' => 'quantity','dt' => 5),
          array('db' => 'status','dt' => 6, 'searchable'=>'status'),
      );
     
          $sql = 'select * from customer_report $where $limit '; 
          $extraWhere ='';
          SSP::totalCondition($extraWhere,'');
          $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
          return $data;
    }
    
    public function refundManager($data){

      $table = 'data_range_report_refund';
      $primaryKey = 'data_range_report_refund.data_id';
      if($data['role_id']!='1' && $data['role_id'] !='2'){
        $data['user_id']=$data['created_by'];
      }
      $columns = array(
          array('db' => 'order_id', 'dt' => 0,'searchable'=>'data_range_report_refund.order_id'),
          array('db' => 'datetime','dt' => 1,'searchable'=>'data_range_report_refund.datetime'),
          array('db' => 'sku','dt' => 2,'searchable'=>'data_range_report_refund.sku'),
          array('db' => 'DiffDate','dt' => 3),
          array('db' => 'total','dt' => 4,'searchable'=>'data_range_report_order.total'),
          array('db' => 'sku', 'dt' => 5,'formatter' => function( $d, $row ){
              $str='<a class="btn btn-border btn-alt border-primary font-primary" href="javascript:void(0)" ng-click="openIssue(\''.$d.'\')" title="Add issue"><span>Submit Case</span></a>';
              return $str;
          }),
      );
     
          $order = 'order by data_range_report_refund.data_id desc';
          $sql = 'select  data_range_report_refund.datetime,data_range_report_refund.data_id,DATEDIFF(data_range_report_refund.datetime,data_range_report_order.datetime) AS DiffDate,data_range_report_refund.sku,data_range_report_refund.order_id, CAST(data_range_report_order.total AS DECIMAL(10,2)) as total  from data_range_report_refund left join  data_range_report_order on data_range_report_order.order_id= data_range_report_refund.order_id  $where $order $limit '; 
          $extraWhere =' data_range_report_refund.order_id Not in (select customer_report.orderId from customer_report ) AND data_range_report_refund.order_id Not in (select payment_reimburs.amazonOrderId from payment_reimburs) AND data_range_report_refund.user_id='.$data['user_id'].'';
          SSP::totalCondition($extraWhere,'left join  data_range_report_order on data_range_report_order.order_id= data_range_report_refund.order_id');
          $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
          return $data;
    }
    
    public function addInventoryReport($fileName,$userId){
       $filesname = $fileName;
    
      $csv = array_map(function ($value) {
                    return str_getcsv($value, "\t");
                }, file($filesname));
                array_walk($csv, function (&$a) use ($csv) {
                    $a = array_combine($csv[0], $a);
                });
                array_shift($csv);
      if(!empty($csv)){
           for($i=0;$i<count($csv);$i++){
            $orderId=$csv[$i]['transaction-item-id'];
            $date=date('Y-m-d',strtotime($csv[$i]['adjusted-date']));
            $insertData=array(
              'date'=>$date,
              'disposition'=>$csv[$i]['disposition'],
              'fc'=>$csv[$i]['fulfillment-center-id'],
              'fnsku'=>$csv[$i]['fnsku'],
              'msku'=>$csv[$i]['sku'],
              'quantity'=>$csv[$i]['quantity'],
              'reason'=>$csv[$i]['reason'],
              'title'=>$csv[$i]['product-name'],
              'transactionId'=>$csv[$i]['transaction-item-id'],
              'user_id'=>$userId,
              'createdDate'=>date('Y-m-d H:i:s')
            );
              $this->db->insert('inventory_adjustments', $insertData);
              $customerReportId = $this->db->insert_id();
           }
           return true;
     }else {
      return false;
     }
    }
    public function inventory(){
     $table = 'inventory_adjustments';
      $primaryKey = ' inventory_id';
      
      $columns = array(
          array('db' => 'date', 'dt' => 0,'searchable'=>'date'),
          array('db' => 'transactionId','dt' => 1, 'searchable'=>'transactionId'),
          array('db' => 'fc','dt' => 2,'searchable'=>'fc'),
          array('db' => 'fnSku','dt' => 3, 'searchable'=>'fnSku'),
          array('db' => 'quantity','dt' => 4, 'searchable'=>'quantity'),
          array('db' => 'reason','dt' => 5, 'searchable'=>'reason'),
          array('db' => 'disposition','dt' => 6, 'searchable'=>'disposition')
      );
      $sql = 'select * from inventory_adjustments $where $limit '; 
      
      $extraWhere ='';
      
      SSP::totalCondition($extraWhere,'');
      
      $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
      return $data;
    }
    public function addRemb($fileName,$userId){
    
     $filesname = $fileName;
      $csv = array_map(function ($value) {
                    return str_getcsv($value, "\t");
                }, file($filesname));
                array_walk($csv, function (&$a) use ($csv) {
                    $a = array_combine($csv[0], $a);
                });
                array_shift($csv);
      if(!empty($csv)){
           for($i=0;$i<count($csv);$i++){
            $orderId=$csv[$i]['reimbursement-id'];
            $date=date('Y-m-d',strtotime($csv[$i]['approval-date']));
            $insertData=array(
              'date'=>$date,
              'remId'=>$csv[$i]['reimbursement-id'],
              'caseId'=>$csv[$i]['case-id'],
              'amazonOrderId'=>$csv[$i]['amazon-order-id'],
              'reason'=>$csv[$i]['reason'],
              'msku'=>$csv[$i]['sku'],
              'fnskus'=>$csv[$i]['fnsku'],
              'asin'=>$csv[$i]['asin'],
              'title'=>$csv[$i]['product-name'],
              'recondition'=>$csv[$i]['condition'],
              'currency-unit'=>$csv[$i]['currency-unit'],
              'amountPerUnit'=>$csv[$i]['amount-per-unit'],
              'amountTotal'=>$csv[$i]['amount-total'],
              'quantityCase'=>$csv[$i]['quantity-reimbursed-cash'],
              'quantityReimInventry'=>$csv[$i]['quantity-reimbursed-inventory'],
              'quantityReimTotal'=>$csv[$i]['quantity-reimbursed-total'],
              'originalId'=>$csv[$i]['original-reimbursement-id'],
              'originalType'=>$csv[$i]['original-reimbursement-type'],
              'user_id'=>$userId,
              'porder_status'=>'0',
              'createdDate'=>date('y-m-d H:i:s')
            );
            $this->db->insert('payment_reimburs', $insertData);
            $customerReportId = $this->db->insert_id();
           
           }
           return true;
       }else {
        return false;
       }
       
    }
    public function remb(){
     
          $table = 'payment_reimburs';
          $primaryKey = 'payment_reimbur_id';
          $columns = array(
              array('db' => 'date', 'dt' => 0,'searchable'=>'date'),
              array('db' => 'caseId', 'dt' => 1,'searchable'=>'caseId'),
              array('db' => 'reason','dt' => 2, 'searchable'=>'reason'),
              array('db' => 'fnskus','dt' => 3, 'searchable'=>'fnskus'),
              array('db' => 'asin','dt' => 4, 'searchable'=>'asin'),
          );
     
          $sql = 'select * from payment_reimburs $where $limit '; 
          
          $extraWhere ='';
          
          SSP::totalCondition($extraWhere,'');
          
          $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
        return $data;
    }
    public function getUserProfile($data){
     if(!empty($data['user_id'])){
      return $this->db->select('*')->from('user')->where('user_id',$data['user_id'])->get()->result_array();
     }
    }
     public function update($data) {
      $updateData=array(
       'firstName'=>$data['firstName'],
       'lastName'=>$data['lastName'],
       'email'=>$data['email'],
       'modifyDate'=>date('Y-m-d H:i:s'),
       );
      $this->db->where('user_id', $data['user_id']);
      $this->db->update($this->table, $updateData);
      return true;
    }
    public function checkpassword($data){
     $this->db->select('*')->from('user');
     $this->db->where('password',md5($data['password']));
     $this->db->where('user_id',$data['user_id']);
     return $this->db->get()->result_array();
    }
    public function resetP($data){
      $updateData=array(
       'password'=>md5($data['password']),
       'modifyDate'=>date('Y-m-d H:i:s'),
       );
      $this->db->where('user_id', $data['user_id']);
      $this->db->update('user', $updateData);
      return true;
    }
     public function tokenGenerate() {
        do {
            $token = md5(generateRandom(rand(4, 10)));
        } while ($this->checkTokenAvailable($token) > 0);
        return $token;
    }

    public function checkTokenAvailable($token) {
        $this->db->where('token', $token);
        return $this->db->get('user')->num_rows();
    }
    
  
    public function updatePassword($data){
     $updateData=array('password'=>md5($data['password']), 'modifyDate'=>$data['modifyDate']);
     $this->db->where('user_id',$data['user_id']);
     $this->db->update('user',$updateData);
     return true;
    }   
    public function signup($data){
      $data['plan']='white_service';
      $this->db->insert('user', $data);
      $userId= $this->db->insert_id();
      $userEmail=$this->db->select('*')->from('user_email')->where('user_id',$userId)->get()->result_array();
      if(empty($userEmail)){
        $insertData=array('user_email'=>md5(time()).POSTMARKDOMAIN,
          'user_password'=>md5(time()),
          'user_id'=>$userId,
          'first_time_status'=>0,
          'created_date'=>date('Y-m-d H:i:s')
          );
          $this->db->insert('user_email', $insertData);
          $this->db->insert_id();
      }
      return $userId;
    }
    public function user($data){
          $table = 'user';
          $primaryKey = 'user_id';
          $columns = array(
              array('db' => 'firstName', 'dt' => 0,'searchable'=>'firstName'),
              array('db' => 'lastName','dt' => 1, 'searchable'=>'lastName'),
              array('db' => 'email','dt' => 2, 'searchable'=>'email'),
          );
     
          $sql = 'select * from user $where $limit '; 
          
          $extraWhere ='user.user_id !='.$data['user_id'].'';
          
          SSP::totalCondition($extraWhere,'');
          
          $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
        return $data;
    }
    public function checkpostEmail($data){
      $userEmail=$this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
      if(empty($userEmail)){
        $insertData=array('user_email'=>md5(time()).'@inbound.postmarkapp.com',
          'user_password'=>md5(time()),
          'user_id'=>$data['user_id'],
          'created_date'=>date('Y-m-d H:i:s')
          );
          $this->db->insert('user_email', $insertData);
          $this->db->insert_id();
      }
      return $this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
    }
    public function addPlan($data){
    for($i=0;$i<count($data);$i++){
     $insertData=array(
         'id'=>$data[$i]['id'],
         'object'=>$data[$i]['object'],
         'amount'=>$data[$i]['amount'],
         'created'=>$data[$i]['created'],
         'currency'=>$data[$i]['currency'],
         'interval'=>$data[$i]['interval'],
         'interval_count'=>$data[$i]['interval_count'],
         'livemode'=>$data[$i]['livemode'],
         'name'=>$data[$i]['name'],
         'statement_descriptor'=>$data[$i]['statement_descriptor'],
         'trial_period_days'=>$data[$i]['trial_period_days'],
         'created_date'=>date('y-m-d H:i:s')
             );
             $this->db->insert('plan',$insertData);
             $id=$this->db->insert_id();
    }
    return $id;
    }
    
    public function addUser($data){
     $this->db->insert('user',$data);
     return $this->db->insert_id();
    }
    public function subUserData($data){
      return $this->db->select('*')->from('user')->where('user_id',$data['user_id'])->where('token',$data['token'])->get()->result_array();
    }
    public function addSubUserPass($data){
     $this->db->where('user_id',$data['user_id']);
     $this->db->update('user',$data);
     return $this->db->affected_rows();
    }
    public function updateOrderStatus($data){
    
     $updateData=array('orderStatus'=>'2');
     $this->db->where_in("order_id", $data);
     $this->db->update("data_range_report_refund",$updateData);

     $cupdateData=array('corder_status'=>'2');
     $this->db->where_in("orderId", $data);
     $this->db->update("customer_report",$cupdateData);

//     $pupdateDatas=array('porder_status'=>'2');
//     $this->db->where_in("amazonOrderId", $data);
//     $this->db->update("payment_reimburs",$pupdateDatas);


     $pupdateData=array('oorderStatus'=>'2');
     $this->db->where_in("order_id", $data);
     $this->db->update("data_range_report_order",$pupdateData);
     return true;
    }
    public function subUser($data){
      $table = 'user';
          $primaryKey = 'user_id';
          $extraWhere='';
          $columns = array(
              array('db' => 'firstName', 'dt' => 0,'searchable'=>'firstName'),
              array('db' => 'email','dt' => 1, 'searchable'=>'email'),
              array('db' => 'role_id','dt' => 2,'formatter' => function( $d, $row ) {
                    if($d=='1'){ return 'Admin'; }
                    else if($d=='2'){ return 'Sadmin'; }
                    else if($d=='3'){ return 'Worker level 1'; }
                    else if($d=='4'){ return 'Worker level 2'; }
                    else if($d=='5'){ return 'Worker level 3'; }
            },'searchable'=>'role_id'),
              array('db' => 'phone','dt' => 3, 'searchable'=>'phone'),
              array('db' => 'userStatus','dt' => 4, 'searchable'=>'userStatus')
          );
          if($data['search']['value']=='Admin')
          {
            $data['search']['value']=='1';
             $extraWhere .='user.role_id ="1" AND ';
          }
          $order='ORDER BY user.user_id DESC';
          $sql = 'select * from user $where $order $limit '; 
         
          $extraWhere .='user.created_by ='.$data['user_id'].'';
          
          SSP::totalCondition($extraWhere,'');
          
          $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
        return $data;
    }
    public function refundOrderDetail($data){
      $sql="select  DATEDIFF(now(),d.datetime) as currentRefundDate,pr.date as remDate,pr.amountTotal,DATEDIFF(c.date,d.datetime) as returnRefundDate,DATEDIFF(d.datetime,do.datetime) AS DiffOrderRefund,d.sku,do.total,do.quantity,do.total as orderTotal, DATEDIFF(c.date,do.datetime) AS DiffOrderReturn ,d.order_id,d.datetime as refund_date,d.total as refund_amount,do.datetime as order_date ,c.date as return_date from data_range_report_refund as d left join customer_report as c on c.orderId=d.order_id left join data_range_report_order as do on do.order_id=d.order_id left join payment_reimburs as pr on pr.amazonOrderId=d.order_id   where  d.order_id='".$data['order_id']."' AND d.user_id=".$data['user_id']."  "; 
     return $this->db->query($sql)->result_array();
    }
    public function allRefund($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'order_id', 'dt' => 0,'searchable'=>'data_range_report_refund.order_id'),
         array('db' => 'order_date','dt' => 1, 'searchable'=>'data_range_report_order.datetime'),
         array('db' => 'refund_date','dt' => 2,'searchable'=>'data_range_report_refund.datetime'),
          array('db' => 'total','dt' => 3,'searchable'=>'data_range_report_refund.total','formatter'=>function($d,$row){
          if($d<0){
           return $d * (-1);
          }else {
           return $d;
          }
          
          }),
          array('db' => 'order_id', 'dt' => 4,'formatter' => function( $d, $row ){
              $str='<a class="btn btn-border btn-alt" href="#/refundManager/view/'.$d.'" title="View"><i class="glyph-icon tooltip-button icon-eye" title="View" data-original-title=".icon-eye"></i></a>';
          return $str;
          })
     );
     
     $order= 'ORDER BY data_range_report_refund.data_id DESC';
     $sql= 'select data_range_report_refund.total,data_range_report_refund.order_id,data_range_report_refund.datetime as refund_date,data_range_report_order.datetime as order_date from data_range_report_refund left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id $where $order $limit '; 

     $extraWhere .='data_range_report_refund.user_id ='.$data['user_id'].'';

     SSP::totalCondition($extraWhere,'left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   
   public function allsubmittedcCase($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'order_id', 'dt' => 0,'searchable'=>'data_range_report_refund.order_id'),
         array('db' => 'order_date','dt' => 1, 'searchable'=>'data_range_report_order.datetime'),
         array('db' => 'refund_date','dt' => 2,'searchable'=>'data_range_report_refund.datetime'),
          array('db' => 'order_id', 'dt' => 3,'formatter' => function( $d, $row ){
              $str='<button class="btn btn-primary" title="resolve this case" ng-click="resolvedcase(\''.$d.'\')">Resolve</button>';
              $str .='&nbsp; <button class="btn btn-primary" title="resolve this case"  ng-click="viewCase(\''.$d.'\')">View Case</button>';
          return $str;
          })
     );
     
     $order= 'ORDER BY data_range_report_refund.data_id DESC';
     $sql= 'select data_range_report_refund.total,data_range_report_refund.order_id,data_range_report_refund.datetime as refund_date,data_range_report_order.datetime as order_date from data_range_report_refund left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id $where $order $limit '; 

     $extraWhere .='data_range_report_refund.orderStatus="1" AND data_range_report_refund.user_id ='.$data['user_id'].'';

     SSP::totalCondition($extraWhere,'left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   
   public function allresolvedCase($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'order_id', 'dt' => 0,'searchable'=>'data_range_report_refund.order_id'),
         array('db' => 'order_date','dt' => 1, 'searchable'=>'data_range_report_order.datetime'),
         array('db' => 'refund_date','dt' => 2,'searchable'=>'data_range_report_refund.datetime'),
          array('db' => 'order_id', 'dt' => 3,'formatter' => function( $d, $row ){
              $str='<button class="btn btn-primary" title="resolve this case"  ng-click="viewCase(\''.$d.'\')">View Case</button>';
          return $str;
          })
     );
     
     $order= 'ORDER BY data_range_report_refund.data_id DESC';
     $sql= 'select customerissue.caseId,data_range_report_refund.total,data_range_report_refund.order_id,data_range_report_refund.datetime as refund_date,data_range_report_order.datetime as order_date from data_range_report_refund left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id left join customerissue on customerissue.order_id=data_range_report_refund.order_id $where $order $limit '; 

     $extraWhere .='data_range_report_refund.orderStatus="2" AND data_range_report_refund.user_id ='.$data['user_id'].'';

     SSP::totalCondition($extraWhere,'left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id left join customerissue on customerissue.order_id=data_range_report_refund.order_id');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   
    public function reimbursementEligible($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
                array('db' => 'data_id', 'dt' => 0,'formatter' => function( $d, $row ){
                
                $str='<input type="checkbox"  name="order_id" ng-model="reimeli.order_id['.$d.']"  data-orderRefundDays="'.$row['orderRefundDays'].'"  data-noreturn="'.$row['customerReturnId'].'" data-total="'.$row['total'].'" class="check" id='.$d.' ng-true-value='.$d.'  data-refundreturn="'.$row['refundreturn'].'" data-orderid="'.$row['order_id'].'"  data-orderDate="'.$row['order_date'].'" data-refundDate="'.$row['refund_date'].'" />';
                return $str;
                }),
               array('db' => 'order_id', 'dt' => 1,'searchable'=>'g.order_id'),
               array('db' => 'order_date','dt' => 2, 'searchable'=>'g.order_date'),
               array('db' => 'refund_date','dt' => 3,'searchable'=>'g.refund_date'),
               array('db' => 'total','dt' => 4,'searchable'=>'g.total','formatter'=>function($d,$row){
                if($d<0){
                 return $d * (-1);
                }else {
                 return $d;
                }
                }),
                array('db' => 'order_id', 'dt' => 5,'formatter' => function( $d, $row ){
                    $str='<a class="btn btn-border btn-alt" href="#/refundManager/view/'.$d.'" title="View"><i class="glyph-icon tooltip-button icon-eye" title="View" data-original-title=".icon-eye"></i></a>';
                return $str;
                })
           );
          $order='';
          $sql='select * from (select c.orderId as customerReturnId,c.corder_status, CASE WHEN c.date !="" THEN DATEDIFF(c.date,b.refund_date) ELSE DATEDIFF(CURDATE(),b.refund_date) END as refundreturn, b.* from (select pr.porder_status,pr.amazonOrderId,a.* from (select dr.data_id,dr.order_id,dr.orderStatus,DATEDIFF(dr.datetime,do.datetime) as orderRefundDays,do.oorderStatus,do.datetime as order_date,dr.datetime as refund_date ,dr.total from data_range_report_refund as dr left join data_range_report_order as do on do.order_id=dr.order_id   where DATEDIFF(dr.datetime,do.datetime) < 31 AND (dr.orderStatus="0" || dr.orderStatus="5") AND (do.oorderStatus="0" || do.oorderStatus="5") AND dr.user_id='.$data['user_id'].') as a left join  payment_reimburs as pr on pr.amazonOrderId= a.order_id where pr.amazonOrderId IS NULL ) as b left join  customer_report as c on c.orderId=b.order_id where c.orderId IS NULL OR DATEDIFF(c.date,b.refund_date) >=31

UNION select  c.orderId as customerReturnId,c.corder_status,CASE WHEN c.date !="" THEN DATEDIFF(c.date,b.refund_date) ELSE DATEDIFF(CURDATE(),b.refund_date) END as refundreturn ,b.* from (select pr.porder_status,pr.amazonOrderId,a.* from (select dr.data_id,dr.order_id, dr.orderStatus, DATEDIFF(dr.datetime,do.datetime) as orderRefundDays,do.oorderStatus,do.datetime as order_date,dr.datetime as refund_date ,dr.total from data_range_report_refund as dr left join data_range_report_order as do on do.order_id=dr.order_id   where DATEDIFF(dr.datetime,do.datetime) >=31 AND (dr.orderStatus="0" || dr.orderStatus="5") AND (do.oorderStatus="0" || do.oorderStatus="5" ) AND dr.user_id='.$data['user_id'].') as a left join  payment_reimburs as pr on pr.amazonOrderId= a.order_id where pr.amazonOrderId IS NULL ) as b left join  customer_report as c on c.orderId=b.order_id where c.orderId IS NULL OR DATEDIFF(c.date,b.refund_date) >=31  ) as g where g.total !=0.00 ORDER BY g.order_date DESC $where  $limit';
          
           $total_record ='select count(*) from (select  c.corder_status,c.orderId as customerReturnId,DATEDIFF(c.date,b.refund_date)asrefundreturn ,b.* from (select pr.porder_status,pr.amazonOrderId,a.* from (select dr.data_id,dr.order_id,dr.orderStatus,DATEDIFF(dr.datetime,do.datetime) as orderRefundDays,do.oorderStatus,do.datetime as order_date,dr.datetime as refund_date ,dr.total from data_range_report_refund as dr left join data_range_report_order as do on do.order_id=dr.order_id   where DATEDIFF(dr.datetime,do.datetime) < 31 AND (dr.orderStatus="0" || dr.orderStatus="5")  AND (do.oorderStatus="0" || do.oorderStatus="5")  AND dr.user_id='.$data['user_id'].') as a left join  payment_reimburs as pr on pr.amazonOrderId= a.order_id where pr.amazonOrderId IS NULL ) as b left join  customer_report as c on c.orderId=b.order_id where c.orderId IS NULL OR DATEDIFF(c.date,b.refund_date) >=31   UNION select c.corder_status,c.orderId as customerReturnId,DATEDIFF(c.date,b.refund_date)as refundreturn , b.* from (select pr.porder_status,pr.amazonOrderId,a.* from (select  dr.data_id,dr.order_id,dr.orderStatus,DATEDIFF(dr.datetime,do.datetime) as orderRefundDays,do.datetime as order_date,do.oorderStatus,dr.datetime as refund_date ,dr.total from data_range_report_refund as dr left join data_range_report_order as do on do.order_id=dr.order_id   where DATEDIFF(dr.datetime,do.datetime) >=31 AND (dr.orderStatus="0" || dr.orderStatus="5") AND (do.oorderStatus="0" || do.oorderStatus="5")  AND dr.user_id='.$data['user_id'].') as a left join  payment_reimburs as pr on pr.amazonOrderId= a.order_id where pr.amazonOrderId IS NULL ) as b left join  customer_report as c on c.orderId=b.order_id where c.orderId IS NULL OR DATEDIFF(c.date,b.refund_date) >=31 AND c.user_id='.$data['user_id'].' ) as g where g.total !=0.00';
     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere,$total_record);

   return $data;
    
   }
   public function fullyReimbursement($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'order_id', 'dt' => 0,'searchable'=>'data_range_report_refund.order_id'),
         array('db' => 'order_date','dt' => 1, 'searchable'=>'data_range_report_order.datetime'),
         array('db' => 'refund_date','dt' => 2,'searchable'=>'data_range_report_refund.datetime'),
         array('db' => 'total','dt' => 3,'searchable'=>'data_range_report_refund.total','formatter'=>function($d,$row){
          if($d<0){
           return $d * (-1);
          }else {
           return $d;
          }
          
          }),
          array('db' => 'order_id', 'dt' => 4,'formatter' => function( $d, $row ){
              $str='<a class="btn btn-border btn-alt" href="#/refundManager/view/'.$d.'" title="View"><i class="glyph-icon tooltip-button icon-eye" title="View" data-original-title=".icon-eye"></i></a>';
          return $str;
          })
     );
     
     $order= 'ORDER BY data_range_report_refund.data_id DESC';
     $sql= 'select data_range_report_refund.total,data_range_report_refund.order_id,data_range_report_refund.datetime as refund_date,data_range_report_order.datetime as order_date from data_range_report_refund left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id left join payment_reimburs  on payment_reimburs.amazonOrderId=data_range_report_refund.order_id $where $order $limit '; 

     $extraWhere .='( payment_reimburs.amountTotal=(data_range_report_refund.total) * (-1)) AND data_range_report_refund.user_id ='.$data['user_id'].'';

     SSP::totalCondition($extraWhere,'left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id left join payment_reimburs  on payment_reimburs.amazonOrderId=data_range_report_refund.order_id ');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   public function discrepency($data){
     $table = 'data_range_report_refund';
     $primaryKey = 'data_range_report_refund.data_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'data_id', 'dt' => 0,'formatter' => function( $d, $row ){
              $str='<input type="checkbox" name="order_id" ng-model="dis.order_id['.$d.']"  data-total="'.$row['total'].'" class="check" id='.$d.' ng-true-value='.$d.' data-orderid="'.$row['order_id'].'" />';
          return $str;
          }),
         array('db' => 'order_id', 'dt' => 1,'searchable'=>'data_range_report_refund.order_id'),
         array('db' => 'order_date','dt' => 2, 'searchable'=>'data_range_report_order.datetime'),
         array('db' => 'refund_date','dt' => 3,'searchable'=>'data_range_report_refund.datetime'),
         array('db' => 'total','dt' => 4,'searchable'=>'data_range_report_refund.total','formatter'=>function($d,$row){
          if($d<0){ return $d * (-1);  }else {  return $d;  }
         }),
         array('db' => 'total','dt' => 5,'searchable'=>'data_range_report_refund.total','formatter'=>function($d,$row){
          if($row['amountTotal']<0){ 
           $rembtotal =  $row['amountTotal'] * (-1);  
          }else {
           $rembtotal =  $row['amountTotal'];
          }
          if($row['total']<0) {  
          $refundtotal = $row['total'] * (-1);  
          }else {
           $refundtotal = $row['total'];
          }
         return $diff = $refundtotal - $rembtotal;
         
         }),
         array('db' => 'order_id', 'dt' => 6,'formatter' => function( $d, $row ){
              $str='<a class="btn btn-border btn-alt" href="#/refundManager/view/'.$d.'" title="View"><i class="glyph-icon tooltip-button icon-eye" title="View" data-original-title=".icon-eye"></i></a>';
          return $str;
          })
     );
     
     $order= 'ORDER BY data_range_report_refund.data_id DESC';
     $sql= 'select  payment_reimburs.amountTotal,data_range_report_refund.data_id,data_range_report_refund.total,data_range_report_refund.order_id,data_range_report_refund.datetime as refund_date,data_range_report_order.datetime as order_date from data_range_report_refund left join data_range_report_order  on data_range_report_order.order_id=data_range_report_refund.order_id left join payment_reimburs  on payment_reimburs.amazonOrderId=data_range_report_refund.order_id $where $order $limit '; 

     $extraWhere .='( payment_reimburs.amountTotal< (data_range_report_refund.total)* (-1)) AND data_range_report_refund.orderStatus="0" AND data_range_report_refund.user_id ='.$data['user_id'].'';

     SSP::totalCondition($extraWhere,'left join data_range_report_order on data_range_report_order.order_id=data_range_report_refund.order_id left join payment_reimburs  on payment_reimburs.amazonOrderId=data_range_report_refund.order_id ');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   public function addTest(){
    $data=array('time'=>date('Y-m-d H:i:s'));
    $this->db->insert('test',$data);
    return $this->db->insert_id();
   }
   public function getUserDataByUserId($data){
    return $this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
   }
   
   public function clickCustomerReport(){
     $currrentDate=date('Y-m-d H:i:s');
     $userData=$this->db->select('*')->from('user_email')->where('customer_execution_time <',$currrentDate)->limit(2)->get()->result_array();
     
     for($i=0;$i<count($userData);$i++){
      shell_exec('casperjs customerClick/js --email='.$userData[$i]['user_email'].'--password='.$userData[$i]['user_password'].' --customer_count='.$userData[$i]['customer_count']);
     }
   }
   public function updateToken($user,$fileData){
    $updateArray=array('token'=>$fileData,'user_status'=>'1');
    $this->db->where('user_email',$user[0]['user_email']);
    $this->db->update('user_email',$updateArray);

    $userRecord=array('amazon_token'=>'3','modifyDate'=>date('Y-m-d H:i:s'));
    $this->db->where('user_id',$user[0]['user_id']);
    $this->db->update('user',$userRecord);
    return true;
   }
   
   public function caselog(){
    $user_id=1;
     $filesname = $_SERVER['DOCUMENT_ROOT'].'/fileFolder/caselog.txt';
     $data=file_get_contents($filesname);
     $caseLog = json_decode($data); 
     if(!empty($caseLog)){
      for($i=0;$i<count($caseLog);$i++){
       $insertData=array(
           'caseCreation'=>$caseLog[$i]->caseCreation,
           'caseId'=>$caseLog[$i]->caseId,
           'caseStatus'=>$caseLog[$i]->caseStatus,
           'des'=>$caseLog[$i]->des,
           'link'=>$caseLog[$i]->link,
           'primaryEmail'=>$caseLog[$i]->primaryEmail,
           'createdDate'=>date('Y-m-d H:i:s'),
           'user_id'=>$user_id);
       $this->db->insert('case_log',$insertData);
      }
     }
     return true;
   }
   public function caselogmessage(){
     $filesname = $_SERVER['DOCUMENT_ROOT'].'/amazon_local/fileFolder/messagedata.txt';
     $data=file_get_contents($filesname);
     $caseLog = json_decode($data); 
      
     if(!empty($caseLog)){
       for($i=0;$i<count($caseLog);$i++){
         for($j=0;$j<$i;$j++){
         
          if(!empty($caseLog[$i][$j]->date)){
             $insertData=array(
                'caseID'=>$caseLog[$i][$j]->caseID,
                'date'=>$caseLog[$i][$j]->date,
                'des'=>$caseLog[$i][$j]->des,
                'createdDate'=>date('Y-m-d H:i:s')
                );
             $this->db->insert('case_log_msg',$insertData);
          } 
         }
       }
      }
      return true;
   }
   public function getcaselog($data){
    $table = 'customerissue';
     $primaryKey = 'customerissue.issue_id';
     $extraWhere='';
     $columns = array(
        array('db' => 'date', 'dt' => 0,'searchable'=>'customerissue.createdDate'),
        array('db' => 'caseId', 'dt' => 1,'searchable'=>'caseId'),
        array('db' => 'order_id', 'dt' => 2,'searchable'=>'order_id'),
        
        array('db' => 'caseId', 'dt' => 3,'formatter' => function( $d, $row ){
              $str='<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY customerissue.issue_id DESC';
     $sql= 'select  DATE_FORMAT(customerissue.createdDate, "%Y-%m-%d") as date,customerissue.* from customerissue $where $order $limit '; 

     $extraWhere .='customerissue.user_id ='.$data['user_id'].' AND customerissue.issuse_status="1"';

     SSP::totalCondition($extraWhere,'');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
   public function caselogDetail($data){
    $result=[];
//    $result['caseLog']=$this->db->select('*')->from('customerissue')->where('issue_id',$data['issue_id'])->get()->result_array();
    $result['userData']=$this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
    $query="select DATE_FORMAT(customerissue.createdDate, '%Y-%m-%d') as issueDate,customerissue.* from customerissue where customerissue.issue_id= ".$data['issue_id']."";
     $result['caseLog']=$this->db->query($query)->result_array();
    if(!empty($result['caseLog'][0]['caseId'])){
    $sql="select DATE_FORMAT(case_log_msg.createdDate, '%Y-%m-%d') as caseDate,case_log_msg.* from case_log_msg where case_log_msg.caseID= ".$result['caseLog'][0]['caseId']."";
     $result['caseLogMesgDetail']=$this->db->query($sql)->result_array();
    }else {
     $result['caseLogMesgDetail']='';
    }
    return $result;
   }
   public function customerIssue($data){
    
    if(!empty($data['user_id'])){
      $userData=$this->db->select('*')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
      
    }
    $data['createdDate']=date('Y-m-d H:i:s');
    $type=$data['type'];
    if($type=='draft'){
     $data['issuse_status']='5';
    }else {
     $data['issuse_status']='1';
    }
    unset($data['type']);
    $this->db->insert('customerissue',$data);
    $issueId=$this->db->insert_id();
    if($issueId){
     $orderId=trim($data['order_id']);
     $oneOrederId=explode("|",$orderId);
    // $finalOrderId=trim($oneOrederId[0]);
     if($type=='submit'){
     //$path=$_SERVER["DOCUMENT_ROOT"]. '/js/contact.js --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password'].' --issueId='.$issueId;
     $screperData= shell_exec('casperjs '.$path); 
     $filesname=$_SERVER['DOCUMENT_ROOT'].'/js/message_'.$issueId.'.txt';
          if(file_exists($filesname)){
//           $fileData=file_get_contents($filesname);
//           if (preg_match('/orders/',$fileData)){
            $updateData=array('orderStatus'=>'1');
            $trimmed_array=array_map('trim',$oneOrederId);
      
            $this->db->where_in("order_id", $trimmed_array);
            $this->db->update("data_range_report_refund",$updateData);
            $cupdateData=array('corder_status'=>'1');
            $this->db->where_in("orderId", $trimmed_array);
            $this->db->update("customer_report",$cupdateData);

//            $pupdateDatas=array('porder_status'=>'1');
//            $this->db->where_in("amazonOrderId", $trimmed_array);
//            $this->db->update("payment_reimburs",$pupdateDatas);


            $pupdateData=array('oorderStatus'=>'1');
            $this->db->where_in("order_id", $trimmed_array);
            $this->db->update("data_range_report_order",$pupdateData);
        
             return true;
//           }
//           else {
//            return false;
//           }
     }else {
         return false;
      }
     }else if($type=='draft'){
         $updateData=array('orderStatus'=>'5');
         $trimmed_array=array_map('trim',$oneOrederId);

         $this->db->where_in("order_id", $trimmed_array);
         $this->db->update("data_range_report_refund",$updateData);
         $cupdateData=array('corder_status'=>'5');
         $this->db->where_in("orderId", $trimmed_array);
         $this->db->update("customer_report",$cupdateData);

//         $pupdateDatas=array('porder_status'=>'5');
//         $this->db->where_in("amazonOrderId", $trimmed_array);
//         $this->db->update("payment_reimburs",$pupdateDatas);


         $pupdateData=array('oorderStatus'=>'5');
         $this->db->where_in("order_id", $trimmed_array);
         $this->db->update("data_range_report_order",$pupdateData);

         return true;
     }
    }
   }
   public function getCustomerissue($data){
    return $this->db->select('*')->from('customerissue')->where('issue_id',$data['issue_id'])->get()->result_array();
   }
   public function getDigitalOcean(){
    $proxyPassword=substr(md5($this->password),1,10);
    $user_data = <<<EOD
#cloud-config
packages:
  - nginx
EOD;
     $data = array("name" => "Droplet11", "region" => "nyc3", "size" => "512mb", "image" => "ubuntu-14-04-x64", "user_data"=>$user_data);
$data_string = json_encode($data);

     $ch = curl_init('https://api.digitalocean.com/v2/droplets');
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
     curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
     curl_setopt($ch, CURLOPT_HTTPHEADER, array(
         'Authorization: Bearer 580aae8e12beefc1ad8610671bda1faecb01a06ee1d1f78ab58464361fcb6899',
         'Content-Type: application/json',
         'Content-Length: ' . strlen($data_string))
     );
     
     $result = curl_exec($ch);
     $result1 = json_decode($result);
     $createarray = json_decode(json_encode($result1), True);

     $droplate=$createarray['droplet'];
     $droplateid=$droplate['id']; 
     return $ipData=$this->getDroplet($droplateid);
   }
   public function getDroplet($id){
    $ch = curl_init('https://api.digitalocean.com/v2/droplets/'.$id);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
     curl_setopt($ch, CURLOPT_HTTPHEADER, array(
         'Authorization: Bearer 580aae8e12beefc1ad8610671bda1faecb01a06ee1d1f78ab58464361fcb6899',
         'Content-Type: application/json'
         )
     );
     
     $result = curl_exec($ch);
    $result1 = json_decode($result);
    $createarray = json_decode(json_encode($result1), True);
    
    $droplate=$createarray['droplet'];
    
    return $finalipAddress= $droplateid=$droplate['networks']['v4'][0]['ip_address']; 
   }
   public function updateUserip($ip,$user){
    $updateip=array('user_ip'=>$ip);
    $this->db->where('user_id',$user);
    $this->db->update('user_email',$updateip);
    return $this->db->affected_rows();
   }
   public function allUserList(){
     return $this->db->select('user.*')->from('user')->join('user_email','user_email.user_id=user.user_id')->where('firstName !=','super')->where('user_status','3')->get()->result_array();
   }
   public function caseLogData($data){
     return $this->db->select('*')->from('customerissue')->where('issue_id',$data['issue_id'])->get()->result_array();
   }
   public function editCase($data){
    $this->db->where('issue_id',$data['issue_id']);
    $this->db->update('customerissue',$data);
    return true;
   }
   public function changesubmitedcase($data){
     $updateData=array('orderStatus'=>'2');
     $trimmed_array=$data['order_id'];

     $this->db->where_in("order_id", $trimmed_array);
     $this->db->update("data_range_report_refund",$updateData);
     $cupdateData=array('corder_status'=>'2');
     $this->db->where_in("orderId", $trimmed_array);
     $this->db->update("customer_report",$cupdateData);

//     $pupdateDatas=array('porder_status'=>'2');
//     $this->db->where_in("amazonOrderId", $trimmed_array);
//     $this->db->update("payment_reimburs",$pupdateDatas);


     $pupdateData=array('oorderStatus'=>'2');
     $this->db->where_in("order_id", $trimmed_array);
     $this->db->update("data_range_report_order",$pupdateData);

     return true;
   }
   public function saveCaseData($data){
    
    if(isset($data['issuse_status']) && ($data['issuse_status']=='1' || $data['issuse_status']=='2')){
    
      $updateData=array('orderStatus'=>$data['issuse_status']);
      $trimmed_array=$data['order_id'];

      $this->db->where_in("order_id", $trimmed_array);
      $this->db->update("data_range_report_refund",$updateData);
      
      $cupdateData=array('corder_status'=>$data['issuse_status']);
      $this->db->where_in("orderId", $trimmed_array);
      $this->db->update("customer_report",$cupdateData);

//      $pupdateDatas=array('porder_status'=>$data['issuse_status']);
//      $this->db->where_in("amazonOrderId", $trimmed_array);
//      $this->db->update("payment_reimburs",$pupdateDatas);


      $pupdateData=array('oorderStatus'=>$data['issuse_status']);
      $this->db->where_in("order_id", $trimmed_array);
      $this->db->update("data_range_report_order",$pupdateData);
    }
    
     $this->db->where("issue_id", $data['issue_id']);
     $this->db->update("customerissue",$data);
     return true;
   }
   public function getIssueId($data){
      return $this->db->select('*')->from('customerissue')->like('order_id',$data['order_id'])->get()->result_array();
      
   }
   
   public function getUserList(){
    $currentDate=date("Y-m-d");
    return $this->db->select('*')->from('user_email')->where('customer_execution_time',$currentDate)->where('first_time_status','1')->where('user_status','3')->limit(1)->get()->result_array();
   }
   public function addTime($data=''){
    $ins=array('time'=>date('Y-m-d H:i:s'),'data'=>$data);
    $this->db->insert('test',$ins);
    return $this->db->insert_id();
   }
   public function getCustomerStatus(){
    return $this->db->select('*')->from('user_email')->where('customer_click_status','1')->get()->result_array();
   }
   public function getrembStatus(){
    return $this->db->select('*')->from('user_email')->where('remb_click_status','1')->get()->result_array();
   }
   public function getinventoryStatus(){
    return $this->db->select('*')->from('user_email')->where('inventory_click_status','1')->get()->result_array();
   }
   public function getdataRangeStatus(){
    return $this->db->select('*')->from('user_email')->where('datarange_click_status','1')->get()->result_array();
   }
   
   public function newUser(){
    return $this->db->select('*')->from('user_email')->where('first_time_status','0')->where('token !=','')->get()->result_array();
   }
   public function chnageFirtTimeLoginStatus($data){
      $updateArray=array('first_time_status'=>'1');
      $this->db->where("user_email", $data[0]['user_email']);
      $this->db->update("user_email",$updateArray);
      return $this->db->affected_rows();
   }
   public function draft($data){
    $table = 'customerissue';
     $primaryKey = 'customerissue.issue_id';
     $extraWhere='';
     $columns = array(
        array('db' => 'date', 'dt' => 0,'searchable'=>'customerissue.createdDate'),
        array('db' => 'caseId', 'dt' =>1,'searchable'=>'caseId'),
        array('db' => 'order_id', 'dt' =>2,'searchable'=>'order_id'),
        
        array('db' => 'caseId', 'dt' =>3,'formatter' => function( $d, $row ){
              $str ='<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              $str .='   <a  href="#/caselogEdit/'.$row['issue_id'].'" title="Edit issue"><i class="glyph-icon tooltip-button icon-pencil" title="Edit" data-original-title=".icon-pencil"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY customerissue.issue_id DESC';
     $sql= 'select  DATE_FORMAT(customerissue.createdDate, "%Y-%m-%d") as date,customerissue.* from customerissue $where $order $limit '; 

     $extraWhere .='customerissue.user_id ='.$data['user_id'].' AND customerissue.issuse_status="5"';

     SSP::totalCondition($extraWhere,'');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
    
   }
//   public function sendDraftCase($data){
//   
//    $issue_id=$data['issue_ids'];
//    $user_id=$data['user_ids'][0];
//    
//    $userData=$this->db->select('*')->from('user_email')->where('user_id',$user_id)->get()->result_array();
//    for($i=0;$i<count($issue_id);$i++){
//     $orderData=$this->db->select('*')->from('customerissue')->where('issue_id',$issue_id[$i])->get()->result_array();
//     $orderId=trim($orderData[0]['order_id']);
//     $oneOrederId=explode("|",$orderId);
//     
//      $path=$_SERVER["DOCUMENT_ROOT"]. '/js/contact.js --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password'].' --issueId='.$issue_id[$i];
//     $screperData= shell_exec('casperjs '.$path); 
//     $filesname=$_SERVER['DOCUMENT_ROOT'].'/js/message_'.$issue_id[$i].'.txt';
//          if(file_exists($filesname)){
////           $fileData=file_get_contents($filesname);
////           if (preg_match('/orders/',$fileData)){
//            $updateData=array('orderStatus'=>'1');
//            $trimmed_array=array_map('trim',$oneOrederId);
//      
//            $this->db->where_in("order_id", $trimmed_array);
//            $this->db->update("data_range_report_refund",$updateData);
//            $cupdateData=array('corder_status'=>'1');
//            $this->db->where_in("orderId", $trimmed_array);
//            $this->db->update("customer_report",$cupdateData);
//
//            $pupdateDatas=array('porder_status'=>'1');
//            $this->db->where_in("amazonOrderId", $trimmed_array);
//            $this->db->update("payment_reimburs",$pupdateDatas);
//
//
//            $pupdateData=array('oorderStatus'=>'1');
//            $this->db->where_in("order_id", $trimmed_array);
//            $this->db->update("data_range_report_order",$pupdateData);
//            
//            $cupdateData=array('issuse_status'=>'1');
//            $this->db->where("issue_id", $issue_id[$i]);
//            $this->db->update("customerissue",$cupdateData);
//        
//             sleep(5);
////           }
////           else {
////            return false;
////           }
//     }
//    }
//    return true;
//   }
   public function submitedInventory($data){
     $table = 'inventoryissue';
     $primaryKey = 'inventoryissue.issue_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'caseId', 'dt' => 0,'formatter' => function( $d, $row ){
              $str='<input type="checkbox"  name="issue_id" ng-model="inventory.issue_id['.$row['issue_id'].']" data-issue_id="'.$row['issue_id'].'" data-user_id="'.$row['user_id'].'" />';
              return $str;
       }),
        array('db' => 'date', 'dt' => 1,'searchable'=>'inventoryissue.createdDate'),
        array('db' => 'caseId', 'dt' => 2,'searchable'=>'caseId'),
        array('db' => 'msku', 'dt' =>3,'searchable'=>'msku'),
        
        array('db' => 'caseId', 'dt' =>4,'formatter' => function( $d, $row ){
              $str='<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY inventoryissue.createdDate DESC';
     $sql= 'select  DATE_FORMAT(inventoryissue.createdDate, "%Y-%m-%d") as date,inventoryissue.* from inventoryissue $where $order $limit '; 

     $extraWhere .='inventoryissue.user_id ='.$data['user_id'].' AND inventoryissue.issuse_status="1"';

     SSP::totalCondition($extraWhere,'');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
   }
   public function resolvedInventory($data){
     $table = 'inventoryissue';
     $primaryKey = 'inventoryissue.issue_id';
     $extraWhere='';
     $columns = array(
         array('db' => 'caseId', 'dt' => 0,'formatter' => function( $d, $row ){
              $str='<input type="checkbox"  name="issue_id" ng-model="inventory.issue_id['.$row['issue_id'].']" data-issue_id="'.$row['issue_id'].'" data-user_id="'.$row['user_id'].'" />';
              return $str;
       }),
        array('db' => 'date', 'dt' => 1,'searchable'=>'inventoryissue.createdDate'),
        array('db' => 'caseId', 'dt' => 2,'searchable'=>'caseId'),
        array('db' => 'msku', 'dt' =>3,'searchable'=>'msku'),
        
        array('db' => 'caseId', 'dt' =>4,'formatter' => function( $d, $row ){
              $str = '<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              $str .='    <a  href="#/caselogEdit/'.$row['issue_id'].'" title="Edit issue"><i class="glyph-icon tooltip-button icon-pencil" title="Edit" data-original-title=".icon-pencil"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY inventoryissue.createdDate DESC';
     $sql= 'select  DATE_FORMAT(inventoryissue.createdDate, "%Y-%m-%d") as date,inventoryissue.* from inventoryissue $where $order $limit '; 

     $extraWhere .='inventoryissue.user_id ='.$data['user_id'].' AND inventoryissue.issuse_status="5"';

     SSP::totalCondition($extraWhere,'');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
   }
   public function getInventoryCaselog($data){
     $table = 'inventoryissue';
     $primaryKey = 'inventoryissue.issue_id';
     $extraWhere='';
     $columns = array(
        array('db' => 'date', 'dt' => 0,'searchable'=>'inventoryissue.createdDate'),
        array('db' => 'caseId', 'dt' => 1,'searchable'=>'caseId'),
        array('db' => 'msku', 'dt' => 2,'searchable'=>'msku'),
        
        array('db' => 'caseId', 'dt' => 3,'formatter' => function( $d, $row ){
              $str='<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY inventoryissue.issue_id DESC';
     $sql= 'select  DATE_FORMAT(inventoryissue.createdDate, "%Y-%m-%d") as date,inventoryissue.* from inventoryissue $where $order $limit '; 

     $extraWhere .='inventoryissue.user_id ='.$data['user_id'].' AND inventoryissue.issuse_status="1"';

     SSP::totalCondition($extraWhere,'');

     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
   }
   public function getInventoryDraft($data){
     $table = 'inventoryissue';
     $primaryKey = 'inventoryissue.issue_id';
     $extraWhere='';
     $columns = array(
        array('db' => 'date', 'dt' => 0,'searchable'=>'inventoryissue.createdDate'),
        array('db' => 'caseId', 'dt' =>1,'searchable'=>'caseId'),
        array('db' => 'msku', 'dt' =>2,'searchable'=>'msku'),
        
        array('db' => 'caseId', 'dt' =>3,'formatter' => function( $d, $row ){
              //$str='<a  href="#/caselogView/'.$row['issue_id'].'" title="Add issue"><i class="glyph-icon tooltip-button  icon-eye" title="" data-original-title=".icon-eye"></i></a>';
              $str ='<a  href="#/inventorycaseEdit/'.$row['issue_id'].'" title="Edit issue"><i class="glyph-icon tooltip-button icon-pencil" title="Edit" data-original-title=".icon-pencil"></i></a>';
              return $str;
       })
     );
     
     $order= 'ORDER BY inventoryissue.issue_id DESC';
     $sql= 'select  DATE_FORMAT(inventoryissue.createdDate, "%Y-%m-%d") as date,inventoryissue.* from inventoryissue $where $order $limit '; 

     $extraWhere .='inventoryissue.user_id ='.$data['user_id'].' AND inventoryissue.issuse_status="5"';

     SSP::totalCondition($extraWhere,'');
     $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);

   return $data;
   }
   public function addinventoryIssue($data){
    $type=$data['type'];
    unset($data['type']);
    if($type=='draft'){
     $data['issuse_status']='5';
    }else{
     $data['issuse_status']='1';
    }
    
    $data['createdDate']=date('Y-m-d H:i:s');
    $this->db->insert('inventoryissue',$data);
    $issueId= $this->db->insert_id();
    if($issueId){
     $orderId=trim($data['transactionId']);
     $oneOrederId=explode("|",$orderId);
    // $finalOrderId=trim($oneOrederId[0]);
     if($type=='submit'){
     //$path=$_SERVER["DOCUMENT_ROOT"]. '/js/inventoryContact.js --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password'].' --issueId='.$issueId;
     $screperData= shell_exec('casperjs '.$path); 
     $filesname=$_SERVER['DOCUMENT_ROOT'].'/js/inmessage_'.$issueId.'.txt';
          if(file_exists($filesname)){
//           $fileData=file_get_contents($filesname);
//           if (preg_match('/orders/',$fileData)){
            $updateData=array('inventory_status'=>'1');
            $trimmed_array=array_map('trim',$oneOrederId);
      
            $this->db->where_in("transactionId", $trimmed_array);
            $this->db->update("inventory_adjustments",$updateData);
             return true;
//           }
//           else {
//            return false;
//           }
     }else{
         return false;
      }
     }else if($type=='draft'){
       $updateData=array('inventory_status'=>'5');
       $trimmed_array=array_map('trim',$oneOrederId);

       $this->db->where_in("transactionId", $trimmed_array);
       $this->db->update("inventory_adjustments",$updateData);
       return true;
     }
    }
   }
   public function getInventoryissue($data){
    return $this->db->select('*')->from('inventoryissue')->where('issue_id',$data['issue_id'])->get()->result_array();
   }
   public function sendDraftInventoryCase($data){
   
    $issue_id=$data['issue_ids'];
    $user_id=$data['user_ids'][0];
    
    $userData=$this->db->select('*')->from('user_email')->where('user_id',$user_id)->get()->result_array();
    for($i=0;$i<count($issue_id);$i++){
     $orderData=$this->db->select('*')->from('inventoryissue')->where('issue_id',$issue_id[$i])->get()->result_array();
     $orderId=trim($orderData[0]['transactionId']);
     $oneOrederId=explode("|",$orderId);
     
      $path=$_SERVER["DOCUMENT_ROOT"]. '/js/inventoryContact.js --email='.$userData[0]['user_email'].' --password='.$userData[0]['user_password'].' --issueId='.$issue_id[$i];
     $screperData= shell_exec('casperjs '.$path); 
     $filesname=$_SERVER['DOCUMENT_ROOT'].'/js/inmessage_'.$issue_id[$i].'.txt';
          if(file_exists($filesname)){
//           $fileData=file_get_contents($filesname);
//           if (preg_match('/orders/',$fileData)){
            $updateData=array('inventory_status'=>'1');
            $trimmed_array=array_map('trim',$oneOrederId);
      
            $this->db->where_in("transactionId", $trimmed_array);
            $this->db->update("inventory_adjustments",$updateData);
            
            $cupdateData=array('issuse_status'=>'1');
            $this->db->where("issue_id", $issue_id[$i]);
            $this->db->update("inventoryissue",$cupdateData);
        
             sleep(5);
//           }
//           else {
//            return false;
//           }
     }
    }
    return true;
   }
   public function inventoryCaseData($data){
    return $this->db->select('*')->from('inventoryissue')->where('issue_id',$data['issue_id'])->get()->result_array();
   }
   public function editInventoryCase($data){
    $data['modifyDate']=date('Y-m-d H:i:s');
    $this->db->where('issue_id',$data['issue_id']);
    $this->db->update('inventoryissue',$data);
    return true;
   }
    public function saveMailReply($data){
     $data['replyData']['createdDate']=date('Y-m-d H:i:s');
     $this->db->insert('case_log_reply_msg',$data['replyData']);
     $reply_id=$this->db->insert_id();
     if(!empty($reply_id)){
       for($i=0;$i<count($data['reply_file']);$i++){
         $fileData=array('reply_id'=>$reply_id,'file_name'=>$data['reply_file'][$i][0],'createdDate'=>date('Y-m-d H:i:s'));
         $this->db->insert('reply_attachment',$fileData);
       }
     }
     return true;
    }
    public function addDEQ6RembId($data){
     $userId=$data['user_id'];
     $DEQ6sql="SELECT c.*, CASE WHEN (c.reason='E'|| c.reason='Q' || c.reason='D') THEN 'Damaged_warehouse' WHEN c.reason='6' THEN 'Damaged inbound' END AS 'preason' from (select a.reason, a.msku,b.ptotal as remTotal,a.itotal as inventoryTotal ,(a.itotal-b.ptotal) as totalRecord from (SELECT i.reason,count(i.msku) as itotal, i.msku FROM `inventory_adjustments` as i WHERE (i.reason in('D','E','Q')) AND i.update_status='0' AND i.inventory_status='0' AND i.user_id=".$userId." group by i.msku) as a left join (SELECT p.msku,p.reason, count(p.msku) as ptotal FROM `payment_reimburs` as p where (p.reason in ('Damaged_warehouse') AND p.update_status='0' AND p.user_id=".$userId." AND p.porder_status='0') group by p.msku) as b on a.msku=b.msku Union select a.reason, a.msku,b.ptotal as remTotal,a.itotal as inventoryTotal, a.itotal-b.ptotal from (SELECT i.reason,count(i.msku) as itotal, i.msku FROM `inventory_adjustments` as i WHERE (i.reason in('6')) AND i.update_status='0' AND i.inventory_status='0' AND i.user_id=".$userId." group by i.msku) as a left join (SELECT p.msku,p.reason, count(p.msku) as ptotal FROM `payment_reimburs` as p where (p.reason in ('Damaged_inbound') AND p.update_status='0' AND p.user_id=".$userId." AND p.porder_status='0') group by p.msku) as b on a.msku=b.msku) as c where c.totalRecord IS NOT NULL limit 1";
     $DEQ6Data=  $this->db->query($DEQ6sql)->result_array();
    
      for ($i=0;$i<count($DEQ6Data); $i++){
        
        if($DEQ6Data[$i]['totalRecord'] ==0){
         $remlimit =$DEQ6Data[$i]['remTotal'];
         $inventorylimit =$DEQ6Data[$i]['inventoryTotal'];
        }else if($DEQ6Data[$i]['totalRecord'] <0){
          $remlimit =$DEQ6Data[$i]['inventoryTotal'];
          $inventorylimit =$DEQ6Data[$i]['inventoryTotal'];
        }else if($DEQ6Data[$i]['totalRecord'] >0){
          $remlimit =$DEQ6Data[$i]['remTotal'];
          $inventorylimit =$DEQ6Data[$i]['remTotal'];
        }
       
         $inventorySql="select i.inventory_id,i.user_id from inventory_adjustments as i  where i.msku='".$DEQ6Data[$i]['msku']."' AND i.update_status='0' AND i.inventory_status='0' AND i.reason='".$DEQ6Data[$i]['reason']."' AND i.user_id=".$userId." order by i.date DESC limit ".$inventorylimit." "; 
       $inventoryData=  $this->db->query($inventorySql)->result_array();
          $rembsql="select r.remId,r.payment_reimbur_id from  payment_reimburs as r where r.msku='".$DEQ6Data[$i]['msku']."' AND r.reason='".$DEQ6Data[$i]['preason']."' AND r.user_id=".$userId." AND r.porder_status='0' AND r.update_status='0' order by r.date DESC limit ".$remlimit." ";  
       $rembData=$this->db->query($rembsql)->result_array();
       
       
        for($j=0;$j<count($rembData);$j++){
           $updateArray=array('rembId'=>$rembData[$j]['remId'],'update_status'=>'1');
          
           $this->db->where('inventory_id',$inventoryData[$j]['inventory_id']);
           $this->db->update('inventory_adjustments',$updateArray);
           
           $rembupdateArray=array('update_status'=>'1');
           $this->db->where('payment_reimbur_id',$rembData[$j]['payment_reimbur_id']);
           $this->db->update('payment_reimburs',$rembupdateArray);
        }
       
       
      }
      return true;
    }
    public function getDEQ6user(){
     $currentDate=date('Y-m-d H:i:s');
     $sql="select user_id from user_email where deq6_time < '".$currentDate."' AND first_time_status='1' limit 1 ";
     return $this->db->query($sql)->result_array();
     
    }
    public function updateDEQ6user($data){
      $latestTime = date("Y-m-d H:i:s",strtotime(date("Y-m-d H:i:s")." +15 minutes"));
     $updateArray=array('deq6_time'=>$latestTime);
     $this->db->where('user_id',$data['user_id']);
     $this->db->update('user_email',$updateArray);
     return $this->db->affected_rows();
    }
    public function addMfRembId($data){
      $userId=$data['user_id'];
     $mfSql="select e.* from (select b.msku,b.iTotal,c.pTotal,(b.iTotal-c.pTotal) as total from (select a.msku,a.inTotal * (-1) as iTotal from (select sum(i.quantity) as inTotal,i.msku from  inventory_adjustments as i where i.reason in ('M','F') AND i.inventory_status='0' AND i.user_id=".$userId." AND i.update_status='0' AND i.inventory_status='0' group by i.msku ) as a WHERE a.inTotal<0) as b left join (select count(p.msku) as pTotal,p.msku from payment_reimburs as p WHERE p.user_id=".$userId." AND p.porder_status='0' AND p.update_status='0' AND p.reason in ('Lost_warehouse') GROUP by p.msku ) as c on b.msku=c.msku ) as e WHERE e.total IS NOT NULL";
     $mfData=$this->db->query($mfSql)->result_array();
     for ($i=0;$i<count($mfData); $i++){
        
        if($mfData[$i]['total'] ==0){
         $remlimit =$mfData[$i]['pTotal'];
         $inventorylimit =$mfData[$i]['iTotal'];
        }else if($mfData[$i]['total'] <0){
          $remlimit =$mfData[$i]['iTotal'];
          $inventorylimit =$mfData[$i]['iTotal'];
        }else if($mfData[$i]['total'] >0){
          $remlimit =$mfData[$i]['pTotal'];
          $inventorylimit =$mfData[$i]['pTotal'];
        }
        
        $inventorySql="select i.inventory_id,i.user_id from inventory_adjustments as i  where i.msku='".$mfData[$i]['msku']."' AND i.update_status='0' AND i.inventory_status='0' AND i.reason in ('M') AND i.user_id=".$userId." order by i.date DESC limit ".$inventorylimit." "; 
       $inventoryData=  $this->db->query($inventorySql)->result_array();
          $rembsql="select r.remId,r.payment_reimbur_id from  payment_reimburs as r where r.msku='".$mfData[$i]['msku']."' AND r.reason in('Lost_warehouse') AND r.user_id=".$userId." AND r.porder_status='0' AND r.update_status='0' order by r.date DESC limit ".$remlimit." ";  
       $rembData=$this->db->query($rembsql)->result_array();
       for($j=0;$j<count($rembData);$j++){
           $updateArray=array('rembId'=>$rembData[$j]['remId'],'update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
          
           $this->db->where('inventory_id',$inventoryData[$j]['inventory_id']);
           $this->db->update('inventory_adjustments',$updateArray);
           
           $rembupdateArray=array('update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
           $this->db->where('payment_reimbur_id',$rembData[$j]['payment_reimbur_id']);
           $this->db->update('payment_reimburs',$rembupdateArray);
        }
     }
    return true;
     
     
    }
    public function getMfuser(){
     $currentDate=date('Y-m-d H:i:s');
     $sql="select user_id from user_email where mf_time < '".$currentDate."' AND first_time_status='1' limit 1 ";
     return $this->db->query($sql)->result_array();
     
    }
    public function updateMfuser($data){
      $latestTime = date("Y-m-d H:i:s",strtotime(date("Y-m-d H:i:s")." +15 minutes"));
     $updateArray=array('mf_time'=>$latestTime);
     $this->db->where('user_id',$data['user_id']);
     $this->db->update('user_email',$updateArray);
     return $this->db->affected_rows();
    }
    public function skuHistory($data){
     $table = 'inventory_adjustments';
     $primaryKey = 'inventory_id';
     $columns = array(
          array('db' => 'date', 'dt' => 0,'searchable'=>'date'),
         array('db' => 'msku', 'dt' => 1,'searchable'=>'msku'),
         array('db' => 'reason','dt' => 2, 'searchable'=>'reason'),
          array('db' => 'rembId','dt' => 3, 'searchable'=>'rembId'),
          array('db' => 'transactionId','dt' => 4,'searchable'=>'transactionId'),
          array('db' => 'quantity','dt' => 5,'searchable'=>'quantity')
      );
      $order='ORDER BY inventory_adjustments.date DESC';
      $sql = 'select msku,inventory_id,date,reason,rembId,transactionId,CASE WHEN quantity<0 THEN quantity * (-1) ELSE quantity END AS quantity from inventory_adjustments $where $order $limit '; 
      
      $extraWhere ='inventory_adjustments.msku="'.$data['sku'].'" AND inventory_adjustments.user_id='.$data['user_id'].'';
      
      SSP::totalCondition($extraWhere,'');
      
      $data = $this->ssp->simple($_REQUEST, $this->_sql_details, $table, $primaryKey, $columns, $sql,$extraWhere);
     
      return $data;
    }
    public function checkRembId($data){
     
     $result=[];
     $inventoryData=$this->db->select('*')->from('inventory_adjustments')->where('rembId',$data['rembId'])->where('user_id',$data['user_id'])->where('reason',$data['reason'])->get()->result_array();
     
     if($data['reason']=='E' || $data['reason']=='Q' || $data['reason']=='D'){
      $reason='Damaged_warehouse';
     }else if($data['reason']=='6'){
      $reason='Damaged_inbound';
     }else if($data['reason']=='M'){
      $reason='Lost_warehouse';
     }
     
     $rembData=$this->db->select('*')->from('payment_reimburs')->where('remId',$data['rembId'])->where('reason',$reason)->where('user_id',$data['user_id'])->get()->result_array();
     $result['inventoryData']=$inventoryData;
     $result['rembData']=$rembData;
     return $result;
    }
    public function assignRembId($data){
     if($data['updateRem']['reason']=='E' || $data['updateRem']['reason']=='Q' || $data['updateRem']['reason']=='D'){
      $reson='Damaged_warehouse';
     }else if($data['updateRem']['reason']=='6'){
      $reson='Damaged_inbound';
     }else if($data['updateRem']['reason']=='M'){
      $reson='Lost_warehouse';
     }
   
     $reasonData=$this->db->select('reason,payment_reimbur_id')->from('payment_reimburs')->where('remId',$data['updateRem']['rembId'])->where('update_status','0')->get()->result_array();
     if($reson==$reasonData[0]['reason']){
      $inventoyupData=array('rembId'=>$data['updateRem']['rembId'],'update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
     
     $this->db->where('inventory_id',$data['updateRem']['inventory_id']);
     $this->db->update('inventory_adjustments',$inventoyupData);
     
     $inventoryOldData=array('rembId'=>'0','update_status'=>'0','modifyDate'=>date('Y-m-d H:i:s'));
     
     $this->db->where('inventory_id',$data['inventoryData'][0]['inventory_id']);
     $this->db->update('inventory_adjustments',$inventoryOldData);
     return $this->db->affected_rows();
     }else {
      return false;
     }
     
    }
    public function saveTempRembid($data){
     $temdata=$this->db->select('*')->from('temprembid')->where('inventory_id',$data['inventory_id'])->get()->result_array();
     if(!empty($temdata)){
      $updateTempdata=array('rembId'=>$data['rembId']);
      $this->db->where('inventory_id',$data['inventory_id']);
      $this->db->update('temprembid',$updateTempdata);
      return true;
     }else {
      $data['createdDate']=date('Y-m-d H:i:s');
      $this->db->insert('temprembid',$data);
      return $this->db->insert_id();
     }
    }
    public function updateRembId($data){
      if($data['updateRem']['reason']=='E' || $data['updateRem']['reason']=='Q' || $data['updateRem']['reason']=='D'){
      $reson='Damaged_warehouse';
     }else if($data['updateRem']['reason']=='6'){
      $reson='Damaged_inbound';
     }else if($data['updateRem']['reason']=='M'){
      $reson='Lost_warehouse';
     }
   
     $reasonData=$this->db->select('reason,payment_reimbur_id')->from('payment_reimburs')->where('remId',$data['updateRem']['rembId'])->where('update_status','0')->get()->result_array();
     if($reson==$reasonData[0]['reason']){
      //--update inventory table
      $inventoyupData=array('rembId'=>$data['updateRem']['rembId'],'update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
     $this->db->where('inventory_id',$data['updateRem']['inventory_id']);
     $this->db->update('inventory_adjustments',$inventoyupData);
     //-- update rembursement table
     $rembupData=array('update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
     
     $this->db->where('payment_reimbur_id',$data['rembData'][0]['payment_reimbur_id']);
     $this->db->update('payment_reimburs',$rembupData);
      return $this->db->affected_rows();
     }else {
      return FALSE;
     }
    }
    public function getDashboardData($data)
    {
     $result=[];
    $remResolveData= $this->db->select('sum(CASE WHEN total<0 THEN total * (-1) ELSE total END ) as total')->from('data_range_report_refund')->where('user_id',$data['user_id'])->where('orderStatus','2')->get()->result_array();
    
    $countRemSubmitedData= $this->db->select('count(data_id) as totalsubmitedCase')->from('data_range_report_refund')->where('user_id',$data['user_id'])->where('orderStatus','1')->get()->result_array();
    
    $countRemResolveddData= $this->db->select('count(data_id) as totalsubmitedCase')->from('data_range_report_refund')->where('user_id',$data['user_id'])->where('orderStatus','2')->get()->result_array();
    
    if(!empty($remResolveData[0]['total'])){
     $result['remResolveData']=$remResolveData[0]['total'];
    }else {
     $result['remResolveData']='0';
    }
    
    $result['countRemSubmitedData']=$countRemSubmitedData[0]['totalsubmitedCase'];
    $result['countRemResolveddData']=$countRemResolveddData[0]['totalsubmitedCase'];
  
    //$inventoryResolveData= "select IFNULL(ROUND(sum(IFNULL(b.total,0)),2),0.00) as total from (select i.msku,i.transactionId,CASE WHEN i.quantity<0 THEN i.quantity * (-1) ELSE i.quantity END AS quantity,i.date,i.reason,i.inventory_id from inventory_adjustments as i where  i.user_id=".$data['user_id']." AND i.inventory_status='2' ) as a left join (select data_range_report_order.product_sales as total,data_range_report_order.sku,data_range_report_order.datetime from data_range_report_order where data_range_report_order.data_id in (select max(data_range_report_order.data_id) from data_range_report_order where data_range_report_order.product_sales!=0 AND data_range_report_order.product_sales >0 AND  data_range_report_order.sku in (select i.msku FROM inventory_adjustments as i where  (i.user_id=".$data['user_id']." AND i.inventory_status='2' ) group by i.msku ) group by data_range_report_order.sku)) as b on a.msku=b.sku order by a.date DESC";
    
    $inventoryResolveData="select count(i.inventory_id) as total  from inventory_adjustments as i where (i.user_id=".$data['user_id']." AND i.inventory_status='2' )";
    $inventoryResolveCount= $this->db->query($inventoryResolveData)->result_array();
   
    if(!empty($inventoryResolveCount[0]['total'])){
    $result['inventoryResolveCount']=$inventoryResolveCount[0]['total'];}
    else {
     $result['inventoryResolveCount']='0';
    }
    $datadate=$this->db->select('customer_execution_time')->from('user_email')->where('user_id',$data['user_id'])->get()->result_array();
     
     if(!empty($datadate[0]['customer_execution_time']) && $datadate[0]['customer_execution_time'] !='0000-00-00 00:00:00' && $datadate[0]['customer_execution_time'] != null){
      $days_ago = date('Y-m-d', strtotime('-4 days', strtotime($datadate[0]['customer_execution_time'])));
      $result['lastUpdatedDataDate']=$days_ago;
     }else {
      $result['lastUpdatedDataDate']='Date not available';
     }
     return $result;
   
    }
    public function scheduleIssue($data){
     $data['createdDate']=date('Y-m-d H:i:s');
     $data['issuse_status']='0';
     $this->db->insert('customerissue',$data);
     return $this->db->insert_id();
    }
    public function updateTempRembId(){
     $temprembData= $this->db->select('*')->from('temprembid')->get()->result_array();
     if(count($temprembData)>0){
       for($i=0;$i<count($temprembData); $i++){
          $inventoryadData=$this->db->select('rembId')->from('inventory_adjustments')->where('inventory_id',$temprembData[$i]['inventory_id'])->where('user_id',$temprembData[$i]['user_id'])->get()->result_array();
          
          if($inventoryadData[0]['rembId'] !='' && $inventoryadData[0]['rembId'] !=0 && $inventoryadData[0]['rembId']!= null ){
           $this->db->where('id', $temprembData[$i]['id']);
           $this->db->delete('temprembid'); 
           return true;
          }else {
          if($temprembData[$i]['reason']=='E' || $temprembData[$i]['reason']=='Q' || $temprembData[$i]['reason']=='D')          {
           $reson='Damaged_warehouse';
          }else if($temprembData[$i]['reason']=='6'){
            $reson='Damaged_inbound';
          }else if($temprembData[$i]['reason']=='M'){
            $reson='Lost_warehouse';
          }
          
          $rembData=$this->db->select('*')->from('payment_reimburs')->where('remId',$temprembData[$i]['rembId'])->where('update_status','0')->where('reason',$reson)->where('user_id',$temprembData[$i]['user_id'])->get()->result_array();
         
          if(!empty($rembData)){
           $updatearray=array('rembId'=>$temprembData[$i]['rembId'],'update_status'=>'1');
           $this->db->where('inventory_id',$temprembData[$i]['inventory_id']);
           $this->db->update('inventory_adjustments',$updatearray);
           
           $updateremdata=array('update_status'=>'1');
           $this->db->where('payment_reimbur_id',$rembData[0]['payment_reimbur_id']);
           $this->db->update('payment_reimburs',$updateremdata);
           
           $this->db->where('id', $temprembData[$i]['id']);
           $this->db->delete('temprembid'); 
           return true;
          }else {
           return true;
          }
          }
       }
     }else{
      return false;
     }
    }
    public function autoAssignRembId($data){
     if($data['updateRem']['reason']=='E' || $data['updateRem']['reason']=='Q' || $data['updateRem']['reason']=='D'){
      $reson='Damaged_warehouse';
     }else if($data['updateRem']['reason']=='6'){
      $reson='Damaged_inbound';
     }else if($data['updateRem']['reason']=='M'){
      $reson='Lost_warehouse';
     }
     if(!empty($data['inventoryData'])){
      $updateoldremdData=array('update_status'=>'0','modifyDate'=>'Y-m-d H:i:s');
      $this->db->where('remId',$data['inventoryData'][0]['rembId']);
      $this->db->update('payment_reimburs',$updateoldremdData);
      $updatedInventoryData=array('rembId'=>$data['updateRem']['rembId'],'modifyDate'=>date('Y-m-d H:i:s'));
      $this->db->where('inventory_id',$data['updateRem']['inventory_id']);
      $this->db->update('inventory_adjustments',$updatedInventoryData);
      
      $newRembDataarray=array('update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
      $this->db->where('remId',$data['updateRem']['rembId']);
      $this->db->update('payment_reimburs',$newRembDataarray);
      return true;
     }else {
      return false;
     }
    }
    public function autoUpdateRembId($data){
     $invetoryoldData=$this->db->select('rembId,inventory_id')->from('inventory_adjustments')->where('inventory_id',$data['updateRem']['inventory_id'])->get()->result_array();
     if(!empty($invetoryoldData)){
      $updateOldRembId=array('update_status'=>'0','modifyDate'=>date('Y-m-d H:i:s'));
      $this->db->where('remId',$invetoryoldData[0]['rembId']);
      $this->db->update('payment_reimburs',$updateOldRembId);
     }
     
     $updatenewRemb=array('rembId'=>$data['updateRem']['rembId'],'update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
     $this->db->where('inventory_id',$data['updateRem']['inventory_id']);
     $this->db->update('inventory_adjustments',$updatenewRemb);
     
     $updatenewRembPayment=array('update_status'=>'1','modifyDate'=>date('Y-m-d H:i:s'));
     $this->db->where('remId',$data['updateRem']['rembId']);
     $this->db->update('payment_reimburs',$updatenewRembPayment);
     return true;
    }
    public function autoSaveTempRembid($data){
     $getinventoryData=$this->db->select('rembId')->from('inventory_adjustments')->where('inventory_id',$data['inventory_id'])->where('rembId !=0')->where('rembId != "" ') ->where('rembId != "null" ')->get()->result_array();
    
     if(!empty($getinventoryData)){
      $updateoldRem=array('update_status'=>'0','modifyDate'=>date('y-m-d H:i:s'));
      $this->db->where('remId',$getinventoryData[0]['rembId']);
      $this->db->update('payment_reimburs',$updateoldRem);
      
     }
     
     $updateinventoryData=array('rembId'=>'','update_status'=>'0','modifyDate'=>date('Y-m-d H:i:s'));
     $this->db->where('inventory_id',$data['inventory_id']);
     $this->db->update('inventory_adjustments',$updateinventoryData);
     
     
     $temdata=$this->db->select('*')->from('temprembid')->where('inventory_id',$data['inventory_id'])->get()->result_array();
     if(!empty($temdata)){
      $updateTempdata=array('rembId'=>$data['rembId']);
      $this->db->where('inventory_id',$data['inventory_id']);
      $this->db->update('temprembid',$updateTempdata);
     
     }else {
     if(!empty($data['temprembid'])){
     }else {
      unset($data['temprembid']);
     }
      $data['createdDate']=date('Y-m-d H:i:s');
      $this->db->insert('temprembid',$data);
      return $this->db->insert_id();
     }
    }
    
}

?>