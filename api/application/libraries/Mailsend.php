<?php
	/**
	* 
	*/
	class Mailsend
	{
		protected $CI;
		
		function __construct()
		{
			$this->CI =& get_instance();
			$this->CI->load->library('email');
            $this->CI->email->initialize(array(
              'protocol' => 'smtp',
              'smtp_host' => 'ssl://gator3042.hostgator.com',
              'smtp_user' => 'support@wizardofamz.com',
              'smtp_pass' => '#[^Am]gc#96Z',
              'smtp_port' => '465',
              'crlf' => "\r\n",
              'newline' => "\r\n",
              'mailtype' => "html"
			));
			
			
		}
		public function mail($to,$cc,$bcc,$subject,$message,$path)
		{
			
                    $this->CI->email->from('support@wizardofamz.com', 'Wizard of AMZ');
                    $this->CI->email->to($to);
                    //$this->email->cc('another@another-example.com');
                    //$this->email->bcc('them@their-example.com');.
                     $this->CI->email->attach($path);
                    $this->CI->email->subject($subject);
                    $this->CI->email->message($message);
                    $this->CI->email->send();

                    return $this->CI->email->print_debugger();
                }
                public function usermail($to,$cc,$bcc,$subject,$message)
		{
			$this->CI->email->from('your@example.com', 'Your Name');
            $this->CI->email->to($to);
            //$this->email->cc('another@another-example.com');
            //$this->email->bcc('them@their-example.com');
           
            $this->CI->email->subject($subject);
            $this->CI->email->message($message);
            $this->CI->email->send();

            return $this->CI->email->print_debugger();

            
		}
                
        }

?>