<?php
  class Http {
  static $CURL_OPTIONS = array(
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYHOST => 2,
  );
  protected $url = 'https://api.snapbill.com/v1/';
  protected $headers = array();
  protected $username = 'storagegenie';
  protected $password = 'storagegenie007_!';
  /**
   * Creates a new Connection. $options may contain the following fields:
   *
   *    host      - The domain name of the SnapBill API. Defaults to api.snapbill.com.
   *    secure    - Boolean flag indicating whether the connection should use SSL or not. Defaults to true.
   *    username  - The username to connect with. A password must be provided along with username.
   *    password  - The password to authenticate with.
   *    config    - Configuration file to load authentication details from if username and password are not specified.
   *                Defaults to .snapbill.cfg, under the current user's home directory.
   *
   * Example .snapbill.cfg file:
   *
   *    [api]
   *    username=me
   *    password=1234
   */
  function __construct($data) {
      $this->username = $data['username'];
      $this->password = $data['password'];
  }
  /**
   * POSTs a request to the API using the given action (which will be added to the URL) and arguments.
   * Returns the results of the API call, after they have been JSON decoded.
   */
  function post($action='', $args=array()) {
      $curl = $this->initializeCurl($action, $args);
      $result = curl_exec($curl);
      if($result === false) {
        $error = curl_error($curl);
        curl_close($curl);
        throw new Exception($error);
      }
      curl_close($curl);
      $result = json_decode($result, true);
      if ($result == NULL) {
        throw new Exception("Could not JSON-decode result");
      }
      return $result;
  }
  protected function initializeCurl($action, $args) {
    $url = $this->url.'/'.$action;
    $curl = curl_init($url);
    curl_setopt_array($curl, self::$CURL_OPTIONS);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    // Add headers in the form "key: value"
    $headers = array();
    foreach ($this->headers as $key => $value) {
      $headers[] = $key.': '.$value;
    }
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_USERPWD, $this->username.':'.$this->password);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $this->encodeParams($args));
    return $curl;
  }
  private function encodeParams($params) {
    // Extract nested 'data' parameters
    if (isset($params['data'])) {
      $data = $params['data'];
      unset($params['data']);
      foreach ($data as $k => $v) {
        $params["data-$k"] = $v;
      }
    }
    // Encode to string
    $str = '';
    foreach ($params as $k => $v) {
      $str .= '&'.$this->encodeParam($k, $v);
    }
    return substr($str, 1);
  }
  private function encodeParam($k, $v) {
    if (is_array($v)) {
      // Flatten array parameters
      $elems = array_map(function($elem) use ($k) {
        return urlencode($k).'[]='.urlencode((string)$elem);
      }, $v);
      return implode('&', $elems);
    } else {
      return urlencode($k).'='.urlencode((string)$v);
    }
  }
  private static function loadAuthFromConfig($file) {
    $config = parse_ini_file($file, true);
    $api = $config['api'];
    return array($api['user'], $api['password']);
  }
}
?>