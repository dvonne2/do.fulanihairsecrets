<?php
// Same-origin proxy for Meta Pixel script to bypass Web Worker CORS restrictions (Partytown).
// Strictly proxies https://connect.facebook.net/en_US/fbevents.js

$url = 'https://connect.facebook.net/en_US/fbevents.js';

$body = false;

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
}

if ($body === false) {
  http_response_code(502);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Upstream fetch failed';
  exit;
}

header('Content-Type: application/javascript; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=86400, stale-while-revalidate=604800');
header('X-Content-Type-Options: nosniff');

echo $body;
