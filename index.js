const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const port = 3000

app.use(bodyParser.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

const middleware = (req, res, next) => {
    console.log(`Request URL : ${req.url}\nRequest Type : ${req.method}\n`)
    next()
}

const middlewareCheck = (req, res, next) => {
    if (req.body.product_price <= 0) {
        res.send({"error" : "product_price tidak boleh <=0"})
    }
    else if (isNaN(req.body.product_price)) {
        res.send({"error" : "product_price wajib diisi dengan angka"})
    }
    else{
        next()
    }
}

conn.connect((err) => {
    if(err) throw err;
    console.log('Mysql Connected...');
});

app.use(middleware, (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/api/product', (req, res, next) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error": null, "response": results}))
    });
});

app.get('/api/product/:id', (req, res, next) => {
    let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error": null, "response": results}))
    });
});

app.post('/api/product',middlewareCheck, (req, res, next) => {
    let data = {product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data,(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error": null, "response": "Insert data success"}))
    });
});

app.put('/api/product/:id',middlewareCheck, (req, res, next) => {
    let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error": null, "response": "Update data success"}))
    });
});

app.delete('/api/product/:id', (req, res, next) => {
    let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error": null, "response": "Delete data success"}))
    });
});

app.listen(port, () => {
    console.log(`Server started on localhost:${port}`)
})
