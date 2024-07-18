import BikeBooking from '../models/bikeBooking.js';

// @desc    Create a new bike booking
// @route   POST /api/bike-bookings
// @access  Public
export const createBikeBooking = async (req, res) => {
  const { location, pickupdate,pickuptime, dropoffdate,dropofftime,duration, price } = req.body;

  try {
    const bikeBooking = new BikeBooking({
      location,
      pickupDate:pickupdate,
      pickupTime:pickuptime,
      dropOffDate:dropoffdate,
      dropOffTime:dropofftime,
      duration,
      price
    });

    const createdBikeBooking = await bikeBooking.save();
    res.status(201).json(createdBikeBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bike bookings
// @route   GET /api/bike-bookings
// @access  Public
export const getBikeBookings = async (req, res) => {
  try {
    const bikeBookings = await BikeBooking.find({});
    res.json(bikeBookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single bike booking
// @route   GET /api/bike-bookings/:id
// @access  Public
export const getBikeBookingById = async (req, res) => {
  try {
    const bikeBooking = await BikeBooking.findById(req.params.id);

    if (bikeBooking) {
      res.json(bikeBooking);
    } else {
      res.status(404).json({ message: 'Bike booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a bike booking
// @route   PUT /api/bike-bookings/:id
// @access  Public
export const updateBikeBooking = async (req, res) => {
  const { location, pickupDate,pickupTime,dropOffDate, dropOffTime, duration, price } = req.body;

  try {
    const bikeBooking = await BikeBooking.findById(req.params.id);

    if (bikeBooking) {
      bikeBooking.location = location || bikeBooking.location;
      bikeBooking.pickupDate = pickupDate || bikeBooking.pickupDate;
      bikeBooking.pickupTime = pickupTime || bikeBooking.pickupTime;
      bikeBooking.dropOffDate = dropOffDate || bikeBooking.dropOffDate;
      bikeBooking.dropOffTime = dropOffTime || bikeBooking.dropOffTime;
      bikeBooking.duration = duration || bikeBooking.duration;
      bikeBooking.price = price || bikeBooking.price;

      const updatedBikeBooking = await bikeBooking.save();
      res.json(updatedBikeBooking);
    } else {
      res.status(404).json({ message: 'Bike booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a bike booking
// @route   DELETE /api/bike-bookings/:id
// @access  Public
export const deleteBikeBooking = async (req, res) => {
  try {
    const bikeBooking = await BikeBooking.findById(req.params.id);

    if (bikeBooking) {
      await bikeBooking.remove();
      res.json({ message: 'Bike booking removed' });
    } else {
      res.status(404).json({ message: 'Bike booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};