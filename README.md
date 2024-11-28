# TICKBIT API

This API provides a comprehensive event management solution, including functionalities for creating, viewing, filtering, and interacting with events, tickets, and more.

## Table of Contents

Getting Started
Environment Variables
API Endpoints
Examples

### Getting Started

To use this API, clone the repository and install the required dependencies.

```bash
git clone <repository_url>
cd <repository_folder>
npm install
```

Run the server:

```bash
npm start
By default, the API will run on http://localhost:8000.
```

### Environment Variables

Ensure you have the following environment variables set up in a .env file:

```env
MONGO_URI=<your_mongo_database_url>
PORT=<server_port>
```

### API Endpoints

#### Events

Create an Event

```http
POST /api/events/:userId/create-event;
Content-Type: application/form-data
{
  "event_title": "Music Concert",
  "event_category": "Music",
  "event_type": "Live",
  "start_date": "2024-12-01",
  "start_time": "18:00",
  "end_time": "21:00",
  "location": "City Arena",
  "event_description": "An amazing live concert!",
  "image": "concert.jpg",
  "running_event": "true",
  "ticket_name": "VIP",
  "ticket_price": 50,
  "interested": 100,
  "userId": "648c1e76c705f1bc9f8e1a21"
}
```

Get Popular Events (fetches only six)

```http
GET /api/events/popular-event;
Content-Type: application/json

Query Parameters:(the filter are not really needed)
filter: Options (yesterday, today, tomorrow, this_weekend, free)
```

Get All Popular Events

```http
GET /api/events/all-popular-event;
Content-Type: application/json

Query Parameters:(the filter are not really needed)
filter: Options (yesterday, today, tomorrow, this_weekend, free)
```

Search Events

```http
GET /api/events/search;
Content-Type: application/json

Query Parameters: (the parameters are not really needed)
price: Numeric value (e.g., 50)
date: Date in YYYY-MM-DD format
category: Event category (e.g., Music, Sports)
location: Event location
```

Get Event Details

```http
GET /api/events/:eventId;
Content-Type: application/json

Response:
Event details
3 similar events
```

Random Events
Method: GET
Endpoint: /api/events/random 2. Tickets
Create Ticket (After Payment)
Method: POST
Endpoint: /api/tickets
Payload:

```json
{
  "eventId": "648c1e76c705f1bc9f8e1a20",
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "phoneNumber": "1234567890",
  "userId": "648c1e76c705f1bc9f8e1a21",
  "paymentStatus": "Paid"
}
```

Get Event Tickets
Method: GET
Endpoint: /api/tickets/:eventId 3. Shareable Event Link
Get Event by URL
Method: GET
Endpoint: /api/events/url/:eventId
Response:

```json
{
"success": true,
"message": "Event details retrieved successfully",
"event": { /\* Event details \_/ }
}
```

Examples 4. Filtering Popular Events
Request:
GET http://localhost:5000/api/events?filter=this_weekend

Response:

```json
{
  "success": true,
  "message": "All popular events retrieved successfully",
  "events": [
    {
      /* Event 1 */
    },
    {
      /* Event 2 */
    }
  ]
}
```

2.  Searching for Events
    Request:
    GET http://localhost:5000/api/events/search?category=Music&price=0

Response:

````json
{
  "success": true,
  "events": [
    { /* Event 1 */ },
    { /* Event 2 */ }
  ]
}
```
3. Creating a Ticket
Request:
POST http://localhost:5000/api/tickets

Payload:

```json
{
  "eventId": "648c1e76c705f1bc9f8e1a20",
  "fullName": "Jane Doe",
  "email": "janedoe@example.com",
  "phoneNumber": "0987654321",
  "userId": "648c1e76c705f1bc9f8e1b22",
  "paymentStatus": "Paid"
}
````

Response:

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": {
    /* Ticket details */
  }
}
```
