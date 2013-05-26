<?php

$method = ($argv[1] ? 'method1' : 'method2');

$context_options = array (
		'http' => array (
			'method'  => 'POST',
			'header'  => 'Content-type: application/x-www-form-urlencoded',
			'content' => json_encode(array(
					'jconrpc' => '2.0',
					'id'      => uniqid(),
					'method'  => $method,
					'params'  => array(
						'A', 'B', 'C'
					)
				)
			)
		)
 );



$result = file_get_contents('http://127.0.0.1:9909/', null, stream_context_create($context_options));

print_r(array(
		$method =>json_decode($result, true)
	)
);