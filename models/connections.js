var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var bcrypt1 = require('bcrypt');
var salt = bcrypt1.genSaltSync(10);

//var returnvariable = 0;
//*******************************  DATABASE CONNECTIVITY ******************************************************************** */
var condb = function()
{
        // database connectivity
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "myapp"
        });

      return con;
}// db connection end

//*******************************  Authentication of User ******************************************************************** */

//var isAuthenticate = function()

//*******************************  INSERT QUERY *************************************************************************** */

// INSERT query for SIGNUP
var inserting = function(reqbody,callback)
{
        //bcrypt password into hash variable
        var password = reqbody.password;
        var hash1 = bcrypt1.hashSync(password,10);

        //inserting variable declaration
        var post1 ={
            name : reqbody.first_name,
            password : reqbody.password,
            epassword : hash1,
            fname : reqbody.display_name,
            email : reqbody.email
        };

        var con = condb();

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = 'INSERT INTO `login` SET ?';
            var v1 =   con.query(sql,post1, function (err, result) {
                        if (err) 
                        {
                            if(err.code === 'ER_DUP_ENTRY')
                            {
                                console.log('ER_DUP_ENTRY');
                                return callback(false);
                            }
                            else
                            {
                                throw err;
                            }
                        
                        }
                        else
                        {
                        return callback(true);  
                        }
                       });
        });

}// INSERT query end


//*******************************  SELECT QUERY *************************************************************************** */

//SELECT query for login
var login = function(reqbody,callback)
{
    
    var con = condb();
    var ans = undefined;
    var post2 ={
        email : reqbody.Username
    }
 
             con.connect(function(err) {
                
                if (err) throw err; 
                console.log("Connected!");
                var sql = 'SELECT `epassword` from `login` where `email`= ?';
                con.query(sql,post2.email, function (err, result,fields) {
                   
                  
                    //console.log(result[0].epassword);
                    var hash1 = result[0].epassword;
                    var password = reqbody.Password;
                    
                    //console.log(err.code);
                    ans = bcrypt1.compareSync(password, hash1); 
                    console.log("connections.js-->login: "+ans);
                    // return ans; //true or false
            
                    return callback(ans);
                    
             });
        });
//   return ans;
}//SELECT query for login end


exports.inserting = inserting;
exports.login = login;
