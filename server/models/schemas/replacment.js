const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReplacmentSchema = new Schema({
 TAID:{
   type: Number,
   required:true,

 },
 date:{
type:Date,
required:true,
 },
 courseName:{
   type:String,
   required:true
 }
});
module.exports = ReplacmentSchema;