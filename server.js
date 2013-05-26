var http   = require('http');

var JsonRpcServer = function(options)
{
	this.options = options || {};

	this.host = this.options.host || '127.0.0.1';
	this.port = this.options.port || '8080';
}

JsonRpcServer.prototype.registerObject = function(jsObject)
{
	this.jsObject = jsObject;
}

JsonRpcServer.prototype.execute = function(request, response, buffer)
{
	try
	{
		var data = JSON.parse(buffer);
	}
	catch(error)
	{
		this.errorResponse(response, null, -32700, 'Parse error: ' + error.toString());

		return;
	}

	if (!data.id || !data.method)
	{
		this.errorResponse(response, null, -32600, 'Invalid Request');

		return;
	}

	var jsObject = new this.jsObject();

	if (typeof(jsObject[data.method]) !== 'function')
	{
		this.errorResponse(response, data.id, -36001, 'Method ' + data.method + ' not found');

		return;
	}

	var callback = function(result)
	{
		response.writeHead(200, {
			'Content-Type': 'application/json'
		});

		response.write(JSON.stringify(
				{
					'id'     : data.id,
					'result' : result,
					'error'  : null
				}
			)
		);

		response.end();
	}

	var args = [callback];

	for (arg in data.params)
	{
		args.push(data.params[arg])
	}

	try
	{
		jsObject[data.method].apply(null, args);
	}
	catch(error)
	{
		this.errorResponse(response, data.id, -32603, 'Internal JSON-RPC error: ' + error.toString());

    	return;
	}

}

JsonRpcServer.prototype.handle = function(request, response)
{
	if (request.method !== 'POST')
	{
	   this.errorResponse(response, null, -36000, 'Method not allowed (POST only)');

	   return;
	}

	var buffer = '';

	var self   = this;

	request.addListener('data', function(chunk)
		{
			buffer = buffer + chunk;
		}
	);

	request.addListener('end', function()
		{
			self.execute(request, response, buffer);
		}
	);
}

JsonRpcServer.prototype.errorResponse = function(response, id, code, message)
{
	response.writeHead(200, {
		'Content-Type': 'application/json'
	});

	response.write(JSON.stringify(
			{
				'id'     : id,
				'error'  : {
					'code'    : code,
					'message' : message
				}
			}
		)
	);

	response.end();
}

JsonRpcServer.prototype.start = function()
{
	http.createServer(this.handle.bind(this)).listen(this.port, this.host);

	console.log('JsonRpcServer stated on host: ' + this.host + ' port: ' + this.port);
}

exports.JsonRpcServer = JsonRpcServer;

