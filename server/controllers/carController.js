import Car from "../models/car.js";
import cloudinary from "../config/cloudinary.js";
import { io } from "../services/socketServices.js";
import Availability from "../models/availability.js";

// @desc    Create a new car
// @route   POST /api/cars
// @access  Public

export const createCar = async (req, res) => {
  const {
    carName,
    seats,
    luggage,
    doors,
    fuel,
    horsepower,
    engine,
    drive,
    type,
    image,
    price
  } = req.body;

  try {
    // Check if a car with the same name (model) already exists
    let existingCar = await Car.findOne({ carName });

    if (existingCar) {
      // If car already exists, increment totalCars in Availability
      await Availability.updateOne(
        { carName },
        { $inc: { totalCars: 1 } }
      );

      return res.status(200).json({ message: 'Car updated successfully', car: existingCar });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto', // Auto-detects the file type
    });

    // Create new car object with image URL from Cloudinary
    const newCar = new Car({
      carName,
      seats,
      luggage,
      doors,
      fuel,
      horsepower,
      engine,
      drive,
      type,
      image: result.secure_url,
      price // Store the secure URL returned by Cloudinary
    });

    // Save the new car to the database
    await newCar.save();

    // Create or update availability record
    let availability = await Availability.findOne({ carName });
    if (availability) {
      availability.totalCars++;
    } else {
      availability = new Availability({
        carName,
        totalCars: 1,
        bookings: 0,
      });
    }
    await availability.save();

    // Respond with success message and new car data
    res.status(201).json({ message: 'New car added successfully!', car: newCar });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single car by ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Public
export const updateCar = async (req, res) => {
  const {
    carName,
    seats,
    luggage,
    doors,
    fuel,
    horsepower,
    engine,
    drive,
    type,
  } = req.body;

  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        car.image = result.secure_url;
      }

      car.carName = carName || car.carName;
      car.seats = seats || car.seats;
      car.luggage = luggage || car.luggage;
      car.doors = doors || car.doors;
      car.fuel = fuel || car.fuel;
      car.horsepower = horsepower || car.horsepower;
      car.engine = engine || car.engine;
      car.drive = drive || car.drive;
      car.type = type || car.type;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Public
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.remove();
      res.json({ message: "Car removed" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Example update to handle booking


export const bookCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const availability = await Availability.findOne({ carName: car.carName });
    if (!availability) {
      return res.status(404).json({ message: "Availability data not found" });
    }

    const car_availability = availability.totalCars-availability.bookings;
    if (car_availability > 0) {
      availability.bookings += 1;
      await availability.save();

      // Emit socket event to notify clients about the booking
      io.emit("availabilityUpdated", availability);

      res.json({ message: "Car booked successfully", car });
    } else {
      res.status(400).json({ message: "No available units left" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const returnCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Find availability record for this car
    const availability = await Availability.findOne({ carName: car.carName });
    if (!availability) {
      return res.status(404).json({ message: "Availability data not found" });
    }

    // Ensure there are bookings to return
    if (availability.bookings > 0) {
      availability.bookings -= 1;
      await availability.save();

      // Emit socket event to notify clients about the availability update
      io.emit("availabilityUpdated", availability);

      res.json({ message: "Car returned successfully", car });
    } else {
      res.status(400).json({ message: "No bookings to return" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const cardetails = (req,res)=>{
  const {CarNo,Maintainancedate,LastMaintained,Pickupdate,Dropoffdate,price}  = req.body;
  
}


export const available = async(req,res)=>{
const {carName}=req.body;

const result = await Availability.findOne({carName})
console.log(result)
if(result)
{
  const {totalCars,bookings}= result
  const availability = totalCars-bookings;
  return res.json({availability}).status(200)
}
return res.json({mssg:"no data"}).status(200)


}