const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');//body-parser中间件来解析请求体
const nodeCmd = require('node-cmd');

var app = express();

//运用跨域的中间件
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //自定义中间件，设置跨域需要的响应头。
    next();
};
app.use(allowCrossDomain);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//设置模板
app.set('views', 'gitviews');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

// 设置路由
app.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

//项目进程接口开始
app.get('/list', function(req, res) {
    nodeCmd.get('pm2 list', function(err, data, stderr) {
        res.json(data);
    });
});
app.get('/stop', function(req, res) {
    nodeCmd.get('pkill node', function(err, data, stderr) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});
app.get('/start', function(req, res) {
    nodeCmd.get('chmod -R 775 node_modules/', function(err, data, stderr) {
        if (err) {
            res.json(err);
        } else {
            nodeCmd.get('pm2 start npm -- run pm2dev', function(err, data, stderr) {
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
app.get('/restart', function(req, res) {
    nodeCmd.get('pm2 restart npm -- run pm2dev', function(err, data, stderr) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});
app.get('/delete', function(req, res) {
    nodeCmd.get('pm2 delete npm', function(err, data, stderr) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});
// 项目进程接口结束

// 项目模拟接口开始
// 登陆
app.get('/login', function(req, res) {
	fs.readFile('src/jsonData/login.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//状态
app.post('/common/status', function(req, res) {
	console.log(req.body.type);//打印出请求体的信息
	fs.readFile('src/jsonData/status.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/kh/bind-quality', function(req, res) {
	fs.readFile('src/jsonData/bind-quality.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/order/this-month', function(req, res) {
	fs.readFile('src/jsonData/this-month.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/order/trend-team', function(req, res) {
	fs.readFile('src/jsonData/trend-team.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/order/return-data', function(req, res) {
	fs.readFile('src/jsonData/return-data.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/kh/new-trend', function(req, res) {
	fs.readFile('src/jsonData/new-trend.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/kh/bargain-quantity', function(req, res) {
	fs.readFile('src/jsonData/bargain-quantity.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/order/sale-distribute', function(req, res) {
	fs.readFile('src/jsonData/sale-distribute.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/user/sys-msg/list', function(req, res) {
	fs.readFile('src/jsonData/sys-msg-list.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/order/stat-user', function(req, res) {
	fs.readFile('src/jsonData/stat-user.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/kh-analyze/distribute', function(req, res) {
	fs.readFile('src/jsonData/distribute.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/customers/customer/staff', function(req, res) {
	fs.readFile('src/jsonData/staff.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/goods-analyze/goods-brand-analyze', function(req, res) {
	fs.readFile('src/jsonData/goods-brand-analyze.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/goods-analyze/brand-sales-trend', function(req, res) {
	fs.readFile('src/jsonData/brand-sales-trend.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.get('/v1/product/products/product-brands', function(req, res) {
	fs.readFile('src/jsonData/product-brand.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/goods-analyze/product-analyze', function(req, res) {
	fs.readFile('src/jsonData/product-analyze.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});


//
app.post('/v1/stat/order/order-list', function(req, res) {
	fs.readFile('src/jsonData/order-list.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.get('/v1/stat/kh/sales-service', function(req, res) {
	fs.readFile('src/jsonData/sales-service.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/kh/custom-manage', function(req, res) {
	fs.readFile('src/jsonData/custom-manage.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/customers/customer/list', function(req, res) {
	fs.readFile('src/jsonData/customer-list.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});

//
app.post('/v1/stat/kh-analyze/out-list', function(req, res) {
	fs.readFile('src/jsonData/out-list.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
//
app.post('/v1/stat/kh-analyze/list', function(req, res) {
	fs.readFile('src/jsonData/kh-analyze-list.json', 'utf-8', function (err, data) {
		if (err) {
			res.send('读取文件失败!');
		} else {
			res.send(data);
		}
	})
});
var server = app.listen(3001, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at ', host, port);
});