var express = require('express');
var nodeCmd = require('node-cmd');

var app = express();

app.set('views', 'gitviews');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

//查看项目进程
app.get('/list', function (req, res) {
	nodeCmd.get('pm2 list', function(err, data, stderr){
		res.json(data);
    });
});
app.get('/stop', function (req, res) {
	nodeCmd.get('pkill node', function(err, data, stderr){
		if (err) {
        	res.json(err);
		} else {
			res.json(data);
		}
    });
});

app.get('/start', function (req, res) {
	nodeCmd.get('chmod -R 775 node_modules/', function(err, data, stderr){
		if (err) {
        	res.json(err);
		} else {
			nodeCmd.get('pm2 start npm -- run pm2dev', function(err, data, stderr){
				if (err) {
		        	res.json(err);
				} else {
					res.json(data);
				}
		    });
			// res.json(data);
		}
    });
});

app.get('/restart', function (req, res) {
	nodeCmd.get('pm2 restart npm -- run pm2dev', function(err, data, stderr){
		if (err) {
        	res.json(err);
		} else {
			res.json(data);
		}
    });
});

app.get('/delete', function (req, res) {
	nodeCmd.get('pm2 delete npm', function(err, data, stderr){
		if (err) {
        	res.json(err);
		} else {
			res.json(data);
		}
    });
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});