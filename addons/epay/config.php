<?php

return [
    [
        'name' => 'wechat',
        'title' => '微信',
        'type' => 'array',
        'content' => [],
        'value' => [
            'appid' => 'wxd83493130905c3e5',
            'app_id' => 'wxd83493130905c3e5',
            'app_secret' => '525a24ba98262db64130f0d7be412a80',
            'miniapp_id' => 'wxd83493130905c3e5',
            'mch_id' => '1541584471',
            'key' => 'qwertyuiopyang111111111111111111',
            'mode' => 'normal',
            'sub_mch_id' => '',
            'sub_appid' => '',
            'sub_app_id' => '',
            'sub_miniapp_id' => '',
            'notify_url' => '/addons/epay/api/notifyx/type/wechat',
            'cert_client' => '/addons/epay/certs/apiclient_cert.pem',
            'cert_key' => '/addons/epay/certs/apiclient_key.pem',
            'log' => '1',
        ],
        'rule' => '',
        'msg' => '',
        'tip' => '微信参数配置',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => 'alipay',
        'title' => '支付宝',
        'type' => 'array',
        'content' => [],
        'value' => [
            'app_id' => '',
            'mode' => 'normal',
            'notify_url' => '/addons/epay/api/notifyx/type/alipay',
            'return_url' => '/addons/epay/api/returnx/type/alipay',
            'private_key' => '',
            'ali_public_key' => '',
            'app_cert_public_key' => '',
            'alipay_root_cert' => '',
            'log' => '1',
            'scanpay' => '0',
        ],
        'rule' => 'required',
        'msg' => '',
        'tip' => '支付宝参数配置',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => '__tips__',
        'title' => '温馨提示',
        'type' => 'array',
        'content' => [],
        'value' => '请注意微信支付证书路径位于/addons/epay/certs目录下，请替换成你自己的证书<br>appid：APP的appid<br>app_id：公众号的appid<br>app_secret：公众号的secret<br>miniapp_id：小程序ID<br>mch_id：微信商户ID<br>key：微信商户支付的密钥',
        'rule' => '',
        'msg' => '',
        'tip' => '微信参数配置',
        'ok' => '',
        'extend' => '',
    ],
];
