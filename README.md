nodejs-jsonrpc
==============

nodejs jsonrpc 2.0 server

```
var TestObject = function(){};

TestObject.prototype.test = function(callback, param1, param2)
{
    var result = param1 + " " + param2;

	callback.call(null, result);
}

var Server = new Server.JsonRpcServer({
		'host' : '127.0.0.1',
		'port' : '9000'
	}
);

Server.registerObject(TestObject);

Server.start();
```