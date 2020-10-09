var dboLogin = require("../../dboperations/dboLogin");
var CryptoJS = require("crypto-js");

const Str = require('@supercharge/strings');
let authKey = Str.random(16);
let sessToken = Str.random(16);
let sessId = "";

exports.changepassword = async function(req,res,next){
    var jsonData = req.query.params;
    var reqparam = JSON.parse(jsonData);
    var newpass = reqparam.password;
    let flag = 0;
    console.log(reqparam);
    var result = await dboLogin.getPasswordHistory();
    result.forEach(element => { 
        if(element.password == newpass)
        {
            flag = 1;
            console.log(element.password); 
        }        
      }); 
      
    if(flag == 1)
    {
        res.status(200).send({Flag: flag});
    }
    else
    {
        //update user_details & password_history chk
    }
}
exports.login = async function(req, res, next){
    let result1;
    var jsonData = req.query.params;
   
    var reqparam = JSON.parse(jsonData);
    var bytes  = CryptoJS.AES.decrypt(reqparam.password, '8080808080808080');
    console.log(bytes);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    var result = await dboLogin.getLogin(reqparam.user_name,reqparam.password,reqparam.partnerCode,reqparam.ipAdd);
    
    var rows = JSON.parse(JSON.stringify(result[0]));
    if(rows[0].response == 0)
    {
        let ts = Date.now();

        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        
        let cur_dt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        
        let dt = Date.now();
        var qry = "insert into user_sessions (partner_id,user_id,session_token,auth_key,login_time,last_ping,status_since,login_group_id,role_id,login_status) values(" + rows[0].pId + "," + rows[0].userId + ",'" + sessToken + "','" + authKey + "','" + cur_dt + "','" + cur_dt + "','" + cur_dt + "'," + rows[0].loginGroupId + "," + rows[0].roleId + ",1)";
        
        var result = await dboLogin.insertUserSession(qry);
        var result_user = await dboLogin.updateUserDetails(cur_dt,result);
        //console.log(result);  //last inserted id
        sessId = result;
        var menuObj = await dboLogin.getMenuDetails(rows[0].pId,rows[0].roleId);
        result1 = menuObj;
    }
    else
    {
        sessId = "";
        sessToken = "";
    }
    res.status(200).send({Response:rows[0].response,UserId: rows[0].userId, Menu:result1, SessionToken: sessToken, SessionId: sessId});
}

exports.logout = async function(req, res, next){
    var result = await dboLogin.deleteUserSessions(sessId);
    var result1 = await dboLogin.updateUserStatus(1);
    res.status(200).send('Logout');
}