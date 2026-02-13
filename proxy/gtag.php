<?php
// Google Analytics Proxy for Partytown
// URL: https://api.fulanihairsecrets.com/proxy/gtag.php

// --- START OF SECURITY ADDITION ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// Only allow your specific domain to use this proxy
if (strpos($origin, 'fulanihairsecrets.com') !== false) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle browser pre-check (OPTIONS) - prevents CORS blocks
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- END OF SECURITY ADDITION ---

$url = $_GET['url'] ?? '';
if (empty($url) || strpos($url, 'googletagmanager.com') === false && strpos($url, 'google-analytics.com') === false) {
    http_response_code(400);
    echo 'Invalid URL';
    exit;
}

// --- ORIGINAL FETCH LOGIC (NO CHANGES) ---
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
// --- END OF ORIGINAL FETCH LOGIC ---

// Final Output (Changed '*' to your specific domain for security)
header('Content-Type: ' . ($contentType ?: 'application/javascript'));
header('Cache-Control: public, max-age=3600');
http_response_code($httpCode);
echo $response;
