import mongoose from 'mongoose';

const bikeBookingSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  dropOffDate: {
    type: Date,
    required: true
  },
  dropOffTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    // required: true
  },
  price: {
    type: Number,
    // required: true
  }
}, {
  timestamps: true
});

const BikeBooking = mongoose.model('BikeBooking', bikeBookingSchema);

export default BikeBooking;