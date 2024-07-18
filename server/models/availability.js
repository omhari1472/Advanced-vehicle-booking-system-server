import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true,
    unique: true,
  },
  totalCars: {
    type: Number,
    default: 0,
  },
  bookings: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Define a virtual property for availableCars
availabilitySchema.virtual('availableCars').get(function() {
  return this.totalCars - this.bookings;
});

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
