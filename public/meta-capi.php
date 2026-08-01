<?php
// Meta CAPI Server-Side Proxy
// Upload this file to WordPress root (same folder as wp-config.php)
// URL: https://fulanihairsecrets.com/meta-capi.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://fulanihairsecrets.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'POST only']); exit; }

$PIXEL_ID = '220381209723501';
$ACCESS_TOKEN = 'EAANBi9i7mZAABQLWJEFT1pCHgkBoudFR93ILCLcBNEHJKOA3L2b0eIlOUrgZBtW4OUEJ3MEV6NyAMfXrKExXLQqS5Io3OBh4MHEZBE6vDVBVUe0iTdjwZCNTTzMXZBtrbLKIWm226zrNQO9YRhpFHvpqGjfZBdJrDZB3ZB4uZAN2kxVJAMf7G9DNzxZCPuSqk6V1pe9AZDZD';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['event_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event_name']);
    exit;
}

// Log event_id for dedup debugging
error_log("CAPI event: " . $input['event_name'] . " event_id: " . ($input['event_id'] ?? 'MISSING'));

// Normalize event_source_url: strip query params and fragments to match browser pixel
$sourceUrl = $input['event_source_url'] ?? 'https://fulanihairsecrets.com';
$parsedUrl = parse_url($sourceUrl);
$normalizedUrl = ($parsedUrl['scheme'] ?? 'https') . '://' . ($parsedUrl['host'] ?? 'fulanihairsecrets.com') . ($parsedUrl['path'] ?? '/');

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
if (strpos($ip, ',') !== false) {
    $ip = trim(explode(',', $ip)[0]);
}
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (isset($input['user_data']) && is_array($input['user_data'])) {
    if (empty($input['user_data']['client_ip_address'])) {
        $input['user_data']['client_ip_address'] = $ip;
    }
    if (empty($input['user_data']['client_user_agent'])) {
        $input['user_data']['client_user_agent'] = $userAgent;
    }
}

$payload = json_encode([
    'data' => [[
        'event_name' => $input['event_name'],
        'event_time' => $input['event_time'] ?? time(),
        'event_id' => $input['event_id'] ?? '',
        'action_source' => 'website',
        'event_source_url' => $normalizedUrl,
        'user_data' => $input['user_data'] ?? new stdClass(),
        'custom_data' => $input['custom_data'] ?? new stdClass()
    ]]
]);

$url = "https://graph.facebook.com/v21.0/{$PIXEL_ID}/events?access_token={$ACCESS_TOKEN}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode === 200 ? 200 : 502);
echo $response;
?>
