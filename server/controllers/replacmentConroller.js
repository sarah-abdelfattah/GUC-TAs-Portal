const ObjectId = require('mongoose')
const Replacment = require('../models/schemas/replacment');
exports.addReplacment = async function (req, res) {
try{
const TAID=req.body.TAID,
const date=req.body.date,
const coursename=req.body.date,
if(!TAID||!date|| !coursename){
    return res.send({ error: 'please enter all data' });}
    const newReplacment = new Replacment({
        //TODO a4eel el sender
      TAID:TAID,
      date:date,
      courseName:coursename
});
newReplacment.save()  
}

catch (err) {
        console.log('~ err', err);
        return res.send({ err: err });
    }
}