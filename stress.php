<?php

$count = 1;

while(true)
{
	$context_options = array (
			'http' => array (
				'method'  => 'POST',
				'header'  => 'Content-type: application/x-www-form-urlencoded',
				'content' => json_encode(array(
						'jconrpc' => '2.0',
						'id'      => uniqid(),
						'method'  => 'method2',
						'params'  => array(
							'A', 'B'
						)
					)
				)
			)
	);

	$start  = microtime(true);

	$result = file_get_contents('http://127.0.0.1:9909/', null, stream_context_create($context_options));

	$result = json_decode($result, true);


	echo $result['id'] . ' count: ' . $count . ' time: ' . (microtime(true) - $start) . PHP_EOL;

	$count++;

	usleep(1000);
}