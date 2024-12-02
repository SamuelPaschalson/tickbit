const express = require("express");
const {
  create_event,
  popular_event,
  all_popular_event,
  search,
  events,
  eventsById,
  create_ticket,
} = require("../controllers/eventController");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../upload");

router.post("/:userId/create-event", auth, upload.single("image"), create_event);
router.get("/popular-event", popular_event);
router.get("/all-popular-event", all_popular_event);
router.get("/search", search);
router.get("/events", auth, events);
router.get("/:eventId", eventsById);
router.post("/:eventId/create-ticket", auth, create_ticket);

module.exports = router;
