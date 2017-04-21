<?php
	/**
	* 
	*/
	class Timezone
	{
            protected $CI;
            function __construct()
            {
              $this->CI =& get_instance();
              if($this->CI->session->userdata('timezone'))
              {
                date_default_timezone_set($this->CI->session->userdata('timezone')); 
              }else {
                  //date_default_timezone_set('Asia/Kolkata');
                  date_default_timezone_set('EST'); 
              }
            }
	}

?>