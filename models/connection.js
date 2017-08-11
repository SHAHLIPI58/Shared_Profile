var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var condb = function(reqbody)
{
        var name = reqbody.first_name;
        var password = reqbody.password;
        var email = reqbody.email;
        var fname = reqbody.display_name;


        var hash = bcrypt.hashSync(password);
        //inserting variable declaration
        var post1 ={
            name : reqbody.first_name,
            password : reqbody.password,
            epassword : hash,
            fname : reqbody.display_name,
            email : reqbody.email
        };
        
        
        

        // database connectivity
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "myapp"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = 'INSERT INTO `login` SET ?';
            var v1 =   con.query(sql,post1, function (err, result) {
                        if (err) throw err;
                        return sql;  
                       });
         });

}

exports.condb = condb;

