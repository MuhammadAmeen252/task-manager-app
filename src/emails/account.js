//for integrate sending email to user go to https://app.sendgrid.com/guide/integrate
const sgMail= require('@sendgrid/mail')


    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const sendWelcomeMail = (email,name)=>{
        sgMail.send({
            to:email,
            from:'sheikh.ameen252@gmail.com',
            subject:'Thanks for joining in!',
            text:'Hey! '+name+' Welcome to Task App. Let me know how you get along with this App'
        })
    }
    const sendDeleteProfileMail = (email,name)=>{
        sgMail.send({
            to:email,
            from:'sheikh.ameen252@gmail.com',
            subject:'Your account has been deleted successfully!',
            text:'Hey! '+name+' we have deleted your account information from our app. Kindly let us know about your complaints or queries so we can work on them.'
        })
    }
    module.exports={
        sendWelcomeMail,
        sendDeleteProfileMail
    }
