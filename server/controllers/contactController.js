
import { validationResult } from 'express-validator';
import Contact from '../models/contact.js'; // Assuming you have a Contact model defined

// Handle POST request to /api/contact
// const contactUs = async (req, res) => {
//   // Validate request body using express-validator
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   // Extract email and message from validated request body
//   const { email, message } = req.body;

//   try {
//     // Create a new contact record
//     const newContact = new Contact({ email, message });
    
//     // Save the contact record to the database
//     await newContact.save();

//     // Respond with success message
//     return res.json({ message: 'Message saved successfully!' });
//   } catch (error) {
//     console.error('Error saving message:', error);
//     return res.status(500).json({ message: 'Failed to save message. Please try again later.' });
//   }
// };

// controllers/contactController.js

const contactUs = async (req, res) => {
  console.log(req.body);
  const { email, message } = req.body;
  console.log("dsbh",email,message);
  try {
    const newContact = new Contact({ email, message });
    await newContact.save();

    console.log("Saved contact:", newContact); // Optional: Log the saved contact
    res.json({ newContact }); // Respond with JSON containing the saved contact
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const getContacts = async (req, res) => {
  try {
    // Fetch all contacts from the database
    const contacts = await Contact.find();

    // Respond with fetched contacts
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts. Please try again later.' });
  }
};

export { contactUs, getContacts };