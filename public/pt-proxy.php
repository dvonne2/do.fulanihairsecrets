<?php
// Partytown proxy for Meta Pixel script.
// Serves https://connect.facebook.net/en_US/fbevents.js from same-origin to avoid Worker CORS restrictions.

$rawUrl = isset($_GET['url']) ? $_GET['url'] : '';
if (!is_string($rawUrl) || $rawUrl === '') {
  http_response_code(400);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Missing url';
  exit;
}

$parsed = parse_url($rawUrl);
$host = isset($parsed['host']) ? $parsed['host'] : '';
$path = isset($parsed['path']) ? $parsed['path'] : '';
$scheme = isset($parsed['scheme']) ? $parsed['scheme'] : '';

// Strict allowlist to reduce abuse risk.
if ($scheme !== 'https' || $host !== 'connect.facebook.net' || $path !== '/en_US/fbevents.js') {
  http_response_code(403);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Forbidden';
  exit;
}

$body = false;
$status = 0;
$err = '';

if (function_exists('curl_init')) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $rawUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
  curl_setopt($ch, CURLOPT_TIMEOUT, 8);
  curl_setopt($ch, CURLOPT_USERAGENT, 'FulaniHairSecrets-PartytownProxy/1.0');

  $body = curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = (string) curl_error($ch);
  curl_close($ch);
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

  $body = @file_get_contents($rawUrl, false, $context);
  // When using file_get_contents, we don't get a clean status code; assume success if body is present.
  $status = $body === false ? 0 : 200;
}

if ($body === false || $status < 200 || $status >= 300) {
  http_response_code(502);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Upstream fetch failed';
  if ($err) {
    echo "\n" . $err;
  }
  exit;
}

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: public, max-age=86400, stale-while-revalidate=604800');
header('X-Content-Type-Options: nosniff');

echo $body;
