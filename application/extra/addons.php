<?php

return [
    'autoload' => false,
    'hooks' => [
        'sms_send' => [
            'alisms',
        ],
        'sms_notice' => [
            'alisms',
        ],
        'sms_check' => [
            'alisms',
        ],
        'app_init' => [
            'epay',
            'wanlshop',
        ],
        'user_sidenav_after' => [
            'recharge',
            'signin',
            'wanlshop',
            'withdraw',
        ],
        'config_init' => [
            'third',
        ],
        'upgrade' => [
            'wanlshop',
        ],
    ],
    'route' => [
        '/third$' => 'third/index/index',
        '/third/connect/[:platform]' => 'third/index/connect',
        '/third/callback/[:platform]' => 'third/index/callback',
        '/third/bind/[:platform]' => 'third/index/bind',
        '/third/unbind/[:platform]' => 'third/index/unbind',
    ],
    'priority' => [],
];
