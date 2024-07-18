import mongoose from 'mongoose';

const cardetails = new mongoose.Schema({

  CarNo: {
    type: String,
    required: true
  },
  Maintainancedate:{
    type: Date,
  },
  LastMaintained:{
    type:Date
  },
  Pickupdate:{
    type:Date,
  },
  Dropoffdate:{
    type:Date,
  },
  price: {
    type: Number,
    // required: true
  }
}, {
  timestamps: true
});

const Cardetails = mongoose.model('BikeBooking', cardetails);

export default Cardetails;