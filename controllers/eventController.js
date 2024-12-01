const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Event = require("../models/Event");
const upload = require("../upload");
const moment = require("moment");

exports.create_event = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const {
      event_title,
      event_category,
      event_type,
      start_date,
      start_time,
      end_time,
      location,
      event_description,
      running_event,
      ticket_name,
      ticket_price,
    } = req.body;

    // Ensure the image file is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded image

    try {
      const newEvent = new Event({
        event_title,
        event_category,
        event_type,
        start_date,
        start_time,
        end_time,
        location,
        event_description,
        image: imagePath,
        running_event,
        ticket_name,
        ticket_price,
        userId: req.params.userId, // Assuming userId is attached to req.user by middleware
      });

      await newEvent.save();

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event: newEvent,
      });
    } catch (error) {
      console.error("Error occurred while creating a new event", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

exports.popular_event = async (req, res) => {
  try {
    const { filter } = req.query; // Expect a filter parameter in the query string
    let filterCriteria = {};

    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");
    const weekendStart = moment()
      .endOf("week")
      .subtract(1, "days")
      .startOf("day"); // Saturday
    const weekendEnd = moment().endOf("week").startOf("day"); // Sunday

    // Define filter criteria based on the query
    if (filter === "yesterday") {
      filterCriteria.start_date = yesterday.format("YYYY-MM-DD");
    } else if (filter === "today") {
      filterCriteria.start_date = today.format("YYYY-MM-DD");
    } else if (filter === "tomorrow") {
      filterCriteria.start_date = tomorrow.format("YYYY-MM-DD");
    } else if (filter === "this_weekend") {
      filterCriteria.start_date = {
        $gte: weekendStart.format("YYYY-MM-DD"),
        $lte: weekendEnd.format("YYYY-MM-DD"),
      };
    } else if (filter === "free") {
      filterCriteria.ticket_price = 0;
    }
    // Fetch all events and sort them by the 'interested' field in descending order
    const popularEvents = await Event.find(filterCriteria)
      .sort({ interested: -1 }) // Sort by 'interested' in descending order
      .limit(6); // Limit to the top 6
    // Return the top 6 popular events
    return res.status(200).json({
      success: true,
      message: "Top popular events retrieved successfully",
      events: popularEvents,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.all_popular_event = async (req, res) => {
  try {
    const { filter } = req.query; // Expect a filter parameter in the query string
    let filterCriteria = {};

    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");
    const weekendStart = moment()
      .endOf("week")
      .subtract(1, "days")
      .startOf("day"); // Saturday
    const weekendEnd = moment().endOf("week").startOf("day"); // Sunday

    // Define filter criteria based on the query
    if (filter === "yesterday") {
      filterCriteria.start_date = yesterday.format("YYYY-MM-DD");
    } else if (filter === "today") {
      filterCriteria.start_date = today.format("YYYY-MM-DD");
    } else if (filter === "tomorrow") {
      filterCriteria.start_date = tomorrow.format("YYYY-MM-DD");
    } else if (filter === "this_weekend") {
      filterCriteria.start_date = {
        $gte: weekendStart.format("YYYY-MM-DD"),
        $lte: weekendEnd.format("YYYY-MM-DD"),
      };
    } else if (filter === "free") {
      filterCriteria.ticket_price = 0;
    }
    // Fetch all events and sort them by the 'interested' field in descending order
    const popularEvents = await Event.find(filterCriteria).sort({
      interested: -1,
    }); // Sort by 'interested' in descending order
    // Return the top 6 popular events
    return res.status(200).json({
      success: true,
      message: "All popular events retrieved successfully",
      events: popularEvents,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { price, start_date, category, location } = req.query; // Extract query parameters
    let filterCriteria = {};
    // Add price filter if provided
    if (price !== undefined) {
      if (price === "0") {
        filterCriteria.ticket_price = 0; // Free events
      } else {
        filterCriteria.ticket_price = { $gt: 0 }; // Paid events
      }
    }
    // Add date filter if provided
    if (start_date) {
      const [start, end] = start_date.split(","); // Accept ranges like "2024-11-25,2024-11-27"
      if (start && end) {
        filterCriteria.start_date = { $gte: start, $lte: end };
      } else if (start) {
        filterCriteria.start_date = start;
      }
    }
    // Add category filter if provided
    if (category) {
      filterCriteria.event_category = { $regex: new RegExp(category, "i") }; // Case-insensitive match
    }
    // Add location filter if provided
    if (location) {
      filterCriteria.location = { $regex: new RegExp(location, "i") }; // Case-insensitive match
    }
    // Fetch events based on the filter criteria
    const events = await Event.find(filterCriteria).sort({ interested: -1 });
    // Return the filtered events
    res.status(200).json({
      success: true,
      message: "Filtered events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.events = async (req, res) => {
  try {
    const { limit } = req.query; // Optional: Limit the number of random events
    // Define the aggregation pipeline with the $sample stage
    const randomEvents = await Event.aggregate([
      {
        $sample: { size: limit ? parseInt(limit, 20) : 20 }, // Default to 10 events if limit not provided
      },
    ]);
    // Respond with the randomized events
    res.status(200).json({
      success: true,
      message: "Random events retrieved successfully",
      events: randomEvents,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.eventsById = async (req, res) => {
  try {
    const { eventId } = req.params; // Get the event ID from the route parameters
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    // Find 3 similar events based on event_type
    const similarEvents = await Event.find({
      event_type: event.event_type, // Match the event type
      _id: { $ne: event._id }, // Exclude the current event
    }).limit(3); // Limit to 3 similar events
    // Respond with the event details and similar events
    res.status(200).json({
      success: true,
      message: "Event details and similar events retrieved successfully",
      event,
      similarEvents,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create_ticket = async (req, res) => {
  try {
    const {
      eventId,
      fullName,
      email,
      quantity,
      phoneNumber,
      userId,
      paymentStatus,
    } = req.body;
    // Validate the input
    if (
      !eventId ||
      !fullName ||
      !email ||
      !quantity ||
      !phoneNumber ||
      !userId ||
      !paymentStatus
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Fetch the event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    // Check payment status
    if (paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
    // Create the ticket
    const newTicket = new Ticket({
      ticket_title: `${event.event_title} Ticket`,
      ticket_category: event.event_category,
      ticket_type: event.ticket_name,
      start_date: event.start_date,
      quantity: quantity, // Default to 1 as each ticket is unique to a user
      price: event.ticket_price,
      fullName,
      email,
      phoneNumber,
      payment_Status: paymentStatus,
      userId,
    });
    // Save the ticket to the database
    await newTicket.save();
    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error occurred while fetching popular event", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
