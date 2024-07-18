import mongoose from 'mongoose';

const documentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  drivingLicense: {
    type: String,
    // required: true
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
