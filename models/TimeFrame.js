const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const timeFrameSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }, 
  acadYearStart:{
    type: String,
    required: true
  },
    acadYearEnd:{
    type: String,
    required: true
  },
  semester:{
    type: String,
    enum:['1st', '2nd','3rd'],
    required: true
  },
  isActive:{
    type: Boolean,
    required: true
  }

});

const TimeFrame = mongoose.model('TimeFrame', timeFrameSchema)

module.exports = TimeFrame