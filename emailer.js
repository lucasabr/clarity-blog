const nodemailer = require("nodemailer");
class emailer{


    sendEmail(email){
    
        // create reusable transporter object using the default SMTP transport
        nodemailer.createTestAccount(async (err, account) => {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                    user: process.env.GMAIL_USER, 
                    pass: process.env.GMAIL_PASS, 
                },
            });
    
            let info = await transporter.sendMail({
                from: '"Clarity Blog" <claritybotconfirm@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Please confirm your account with Clarity", // Subject line
                text: "Hello world?", // plain text body
            });
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        })
    
    
    }
}

module.exports = emailer