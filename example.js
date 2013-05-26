var Server = require('./server.js');

var TestObject = function()
{

}

TestObject.prototype.method1 = function(callback, arg1, arg2, arg3)
{
	var self = this;

	setTimeout(function()
	{		 
		callback.call(null, [
				{'Method' : 'method1'},
				{'Time'   : self.getTime()},
				{'Arg1'   : arg1},
				{'Arg2'   : arg2},
				{'Arg3'   : arg3}
			]
		);
	}, 10000);
}

TestObject.prototype,getTime = function()
{
	var d = new Date();

	return d.getTime();
}

TestObject.prototype.method2 = function(callback, arg1, arg2)
{
	var self = this;

	callback.call(null, [
			{'Method' : 'method2'},
			{'Time'   : self.getTime()},
			{'Arg1'   : arg1},
			{'Arg2'   : arg2}
		]
	);
}

var Server = new Server.JsonRpcServer({
		'host' : '127.0.0.1',
		'port' : '9909'
	}
);

Server.registerObject(TestObject);

Server.start();