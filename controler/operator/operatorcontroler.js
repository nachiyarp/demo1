var dboOperator = require("../../dboperations/dboOperators");
var dboskill = require("../../dboperations/dboskills");
var dboLogin = require("../../dboperations/dboLogin");

const Str = require('@supercharge/strings');
let authKey = Str.random(16);
let sessToken = Str.random(16);
let sessId = "";
exports.login = async function(req, res, next){
    let result1;
    // console.log(req[0].partner_id);
    var jsonData = req.query.params;
    //console.log(jsonData['skill_id']);
    var reqparam = JSON.parse(jsonData);
    //console.log(reqparam);
    
    //console.log("log123");
    //  var result = await dboOperator.getoperatorinfo(req.parnter_id);
    //  var resultskill = await dboskill.getskillinfo(req.parnter_id,req.skill_id)
    var result = await dboLogin.getLogin(reqparam.user_name,reqparam.password,reqparam.partnerCode,reqparam.ipAdd);
    console.log("result");
    //console.log(result[0]);
    var rows = JSON.parse(JSON.stringify(result[0]));
    //console.log(rows[0].response);  
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
        //var qry = "insert into user_sessions (partner_id,user_id,session_token,auth_key,login_time,last_ping,status_since,ip_address,login_group_id,role_id,login_status) \
        var qry = "insert into user_sessions (partner_id,user_id,session_token,auth_key,login_time,last_ping,status_since,login_group_id,role_id,login_status) values(" + rows[0].pId + "," + rows[0].userId + ",'" + sessToken + "','" + authKey + "','" + cur_dt + "','" + cur_dt + "','" + cur_dt + "'," + rows[0].loginGroupId + "," + rows[0].roleId + ",1)";
        
        //console.log(qry);
        var result = await dboLogin.insertUserSession(qry);
        console.log(result);  //last inserted id
        sessId = result;
        var menuObj = await dboLogin.getMenuDetails(rows[0].pId,rows[0].roleId);
        //var sessDet = 
        result1 = menuObj;
    }
    else
    {
        sessId = "";
        sessToken = "";
    }
   
    //res.status(200).send(result1);
    res.status(200).send({Response:rows[0].response, Menu:result1, SessionToken: sessToken, SessionId: sessId});
    
   // res.send(JSON.stringify({"response": result}));
}


exports.login1 = async function(req, res, next){
       var result = await dboLogin.getLogin1()
    res.status(200).send(result);
    
   // res.send(JSON.stringify({"response": result}));
}
exports.logout = async function(req, res, next){
    res.status(200).send('Hello logout');
}
exports.getalloperators =  async function(req,res,next){
    var jsonData = req.query.operator;
    var queryparams = JSON.parse(jsonData);
    var result = await dboOperator.getoperatorinfo(queryparams.parnter_id);
    res.status(200).send(result);
}
exports.getalloperators =  async function(req,res,next){
    var resultskill = await dboskill.getskillinfo(req.parnter_id,req.skill_id)
    var jsonData = req.query.operator;
    var queryparams = JSON.parse(jsonData);
    var result = await dboOperator.getoperatorinfo(queryparams.parnter_id);
    res.status(200).send(result);
}