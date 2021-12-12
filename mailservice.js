const nodemailer = require("nodemailer");

async function sendPost() {

let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "conquerorraj2626@outlook.com",
        pass: "Mohanraj@2626"
    }
});

const options = {
    from: "conquerorraj2626@outlook.com", // sender address
    to: "conquerorraj2626@gmail.com", // list of receivers
    subject: "Seems working perfectly", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>",
}

transporter.sendMail(options,(err,info)=>{
    if(!err){
        console.log("Sent:  ", info.response);
    }else{
        console.log(err);
    }
});

}

module.exports = sendPost().catch(console.error);