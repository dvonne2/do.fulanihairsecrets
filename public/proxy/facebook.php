<?php
// Same-origin proxy for Meta Pixel script to bypass Web Worker CORS restrictions (Partytown).
// Strictly proxies https://connect.facebook.net/en_US/fbevents.js

header('Access-Control-Allow-Origin: https://fulanihairsecrets.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$url = 'https://connect.facebook.net/en_US/fbevents.js';

if (isset($_GET['url'])) {
  $candidate = $_GET['url'];
  if (is_string($candidate) && $candidate !== '') {
    $parsed = parse_url($candidate);
    $scheme = isset($parsed['scheme']) ? strtolower($parsed['scheme']) : '';
    $host = isset($parsed['host']) ? strtolower($parsed['host']) : '';
    $user = isset($parsed['user']) ? $parsed['user'] : null;
    $pass = isset($parsed['pass']) ? $parsed['pass'] : null;

    if ($scheme === 'https' && $host === 'connect.facebook.net' && $user === null && $pass === null) {
      $url = $candidate;
    } else {
      http_response_code(400);
      header('Content-Type: text/plain; charset=UTF-8');
      echo 'Invalid url';
      exit;
    }
  }
}

$body = false;
$contentType = null;

if (function_exists('curl_init')) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HEADER, false);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
  curl_setopt($ch, CURLOPT_TIMEOUT, 8);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
  curl_setopt($ch, CURLOPT_USERAGENT, 'FulaniHairSecrets-PartytownProxy/1.0');
  $body = curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
  curl_close($ch);

  if ($body === false || $status < 200 || $status >= 300) {
    $body = false;
  }
} else {
  $context = stream_context_create([
    'http' => [
      'method' => 'GET',
      'timeout' => 8,
      'header' => "User-Agent: FulaniHairSecrets-PartytownProxy/1.0\r\n",
    ],
    'ssl' => [
      'verify_peer' => true,
      'verify_peer_name' => true,
    ],
  ]);

  $body = @file_get_contents($url, false, $context);

  if (isset($http_response_header) && is_array($http_response_header)) {
    foreach ($http_response_header as $h) {
      if (is_string($h) && stripos($h, 'Content-Type:') === 0) {
        $contentType = trim(substr($h, strlen('Content-Type:')));
        break;
      }
    }
  }
}

if ($body === false) {
  http_response_code(502);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Upstream fetch failed';
  exit;
}

$finalType = 'application/javascript; charset=UTF-8';
if (is_string($contentType) && $contentType !== '') {
  $finalType = $contentType;
}

header('Content-Type: ' . $finalType);
header('Cache-Control: public, max-age=7200, stale-while-revalidate=604800');
header('X-Content-Type-Options: nosniff');

echo $body;
