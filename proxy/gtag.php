<?php
// Google Analytics Proxy for Partytown
// Upload to WordPress root: /proxy/gtag.php
// URL: https://fulanihairsecrets.com/proxy/gtag.php

$url = $_GET['url'] ?? '';
if (empty($url) || strpos($url, 'googletagmanager.com') === false && strpos($url, 'google-analytics.com') === false) {
    http_response_code(400);
    echo 'Invalid URL';
    exit;
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

header('Access-Control-Allow-Origin: *');
header('Content-Type: ' . ($contentType ?: 'application/javascript'));
header('Cache-Control: public, max-age=3600');
http_response_code($httpCode);
echo $response;
