<?php

return [

    [
        'name' => 'sign',
        'title' => '签名',
        'type' => 'string',
        'content' => [],
        'value' => '智能鲜蜂',
        'rule' => 'required',
        'msg' => '',
        'tip' => '',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => 'template',
        'title' => '短信模板',
        'type' => 'array',
        'content' => [],
        'value' => [
            'register' => 'SMS_114000000',
            'resetpwd' => 'SMS_114000000',
            'changepwd' => 'SMS_114000000',
            'changemobile' => 'SMS_114000000',
            'profile' => 'SMS_114000000',
            'notice' => 'SMS_114000000',
            'mobilelogin' => 'SMS_214526006',
        ],
        'rule' => 'required',
        'msg' => '',
        'tip' => '',
        'ok' => '',
        'extend' => '',
    ],
    [
        'name' => '__tips__',
        'title' => '温馨提示',
        'type' => 'string',
        'content' => [],
        'value' => '应用key和密钥你可以通过 https://ak-console.aliyun.com/?spm=a2c4g.11186623.2.13.fd315777PX3tjy#/accesskey 获取',
        'rule' => 'required',
        'msg' => '',
        'tip' => '',
        'ok' => '',
        'extend' => '',
    ],
];
