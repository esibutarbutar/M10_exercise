const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mysql = require('mysql2')

// parse aplication/json 
app.use(bodyParser.json());

//create database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

//connect to database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

//tampilkan semua data product
app.get('/api/product', (req, res) => {
    let sql = 'SELECT * FROM product';
    let query = conn.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': results}));
    });
});

//tampilkan data product berdasarkan id
app.get('/api/product/:id', (req, res) =>{
    let sql = 'SELECT * FROM products WHERE product_id='+req.params.id;
    let query = conn.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': results}))
    });
});

//tambahkan data product baru
app.post('/api/product', (req, res) =>{
    let data = {product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = 'INSERT INTO products SET ?';
    let query = conn.query(sql, data,(err, results) =>{
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'insert data succes'}));
    });
});

//edit data product berdasarkan id
app.put('/api/product/:id', (req, res) =>{
    let sql = "UPDATE products SET product_name'"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'Update data success'}));
    });
});

//delete data product berdasarkan id
app.delete('/api/product/:id', (req, res) =>{
    let sql = "DELETE FROM products WHERE product_id="+req.params.id+"";
    let query = conn.query(sql, (err, results)=>{
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'Delete data succes'}));
    });
});


app.get('/api/comments', (req, res) => {
    let sql = "SELECT * FROM comments ORDER BY comment_created DESC LIMIT 5"
    let query = conn.query(sql, (err, results) => {
        if (err) throw err
        res.json(results)
    })
})

// tampilkan data comment berdasarkan comment_id
app.get('/api/comments/:id', (req, res) => {
    let sql = "SELECT * FROM comments WHERE comment_id=" + req.params.id
    let query = conn.query(sql, (err, results) => {
        if (err) throw err
        if (results.length === 0) {
            res.statusCode = 404
            res.end('ID Not Found')
        }
        else {
            res.json(results)
        }
    })
})

// tampilkan data comment berdasarkan cust_id diurutkan terbaru
app.get('/api/comments/customer/:id', (req, res) => {
    let sql = "SELECT * FROM comments WHERE cust_id=" + req.params.id + " ORDER BY comment_created DESC"
    let query = conn.query(sql, (err, results) => {
        if (err) throw err
        if (results.length === 0) {
            res.statusCode = 404
            res.end('ID Not Found')
        }
        else {
            res.json(results)
        }
    })
})

// tambahkan data comment baru
app.post('/api/comments', (req, res) => {
    let data = {
        cust_id      : req.body.cust_id,
        product_id   : req.body.product_id,
        comment_text : req.body.comment_text
    }
    let sql = "INSERT INTO comments SET ?"
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err
        console.log(data);
        res.json({"status" : "SUCCESS"})
    })
})


// hapus data comment berdasarkan comment_id
app.delete('/api/comments/:id', (req, res) => {
    let sql = "DELETE FROM comments WHERE comment_id="+ req.params.id ;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send({"status":"DELETED"})
    });
});


//server listening
app.listen(3000, () =>{
    console.log('Server started on port 3000...')
})