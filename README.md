# Document Dashboard

## Description

A simple React application that displays a set of document types as draggable cards. Users can reorder the cards via drag-and-drop and view larger images of each document by clicking on them.

## Features

- Load and display documents from a static JSON file.
- Display documents as cards with thumbnails.
- Show a loading spinner while images are loading.
- Drag-and-drop functionality to reorder cards.
- Click on a card to view an enlarged image in an overlay.
- Close the overlay by clicking outside the image or pressing the ESC key.

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm (v6 or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/document-dashboard.git
   cd document-dashboard


**Thought Process**
Component Breakdown:

    Card: Represents each document with an image and title. Handles image loading state.
    Spinner: Displays a loading indicator while images are loading.
    ImageOverlay: Shows a larger view of the document image when a card is clicked.

State Management:
    documents: Stores the list of documents loaded from the JSON file.
    selectedDoc: Tracks the currently selected document for the overlay view.

Drag-and-Drop:
Implemented using react-beautiful-dnd to allow users to reorder the cards. The onDragEnd function updates the state based on the new order.

Accessibility:
The overlay can be closed using the ESC key, enhancing user accessibility.

Styling:
Used CSS for simplicity, ensuring a clean and responsive layout.






<!-- Part 5: General questions 
● Design the hypothetical API for this project if you had to allow for adding, removing and 
updating the elements. Consider long-term maintenance as well.
Designing a robust and maintainable API for managing documents based on the type as the primary key involves careful consideration of RESTful principles, scalability, security, and long-term maintenance. Below is a comprehensive design for such an API, covering all CRUD (Create, Read, Update, Delete) operations along with best practices to ensure maintainability. -->

1. API Overview
The API will manage a collection of documents, each identified uniquely by the type field. The primary operations include:

Create: Add new documents.
Read: Retrieve documents, either all or specific ones based on type.
Update: Modify existing documents identified by type.
Delete: Remove documents identified by type.
Base URL

For the purposes of this design, we'll assume the API is hosted locally:

http://localhost:8000/api/documents

2. API Endpoints
2.1. Create a New Document
Endpoint: POST /api/documents

Description: Adds a new document to the collection.

Request Headers:

Content-Type: application/json
Request Body:
{
  "type": "bank-draft-3",
  "title": "Bank Draft 3",
  "position": 5
}

Response:
201 Created
{
  "message": "Document created successfully",
  "document": {
    "type": "bank-draft-3",
    "title": "Bank Draft 3",
    "position": 5
  }
}

400 Bad Request (e.g., if type already exists)
{
  "error": "Document with type 'bank-draft-3' already exists."
}

2.2. Retrieve All Documents
Endpoint: GET /api/documents
Description: Fetches a list of all documents.
Response:
200 OK
{
  "documents": [
    { "type": "bank draft", "title": "Bank Draft", "position": 0 },
    { "type": "bill-of-lading", "title": "Bill of Lading", "position": 1 },
    { "type": "invoice", "title": "Invoice", "position": 2 },
    { "type": "bank-draft-2", "title": "Bank Draft 2", "position": 3 },
    { "type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4 }
  ]
}

2.3. Retrieve Documents by Type
Endpoint: GET /api/documents/{type}
Description: Fetches documents matching the specified type.
Parameters:
type (string): The unique identifier for the document(s).
Response:
200 OK
{
  "documents": [
    { "type": "bank draft", "title": "Bank Draft", "position": 0 }
  ]
}

404 Not Found (if no documents match the type)
{
  "error": "No documents found for type 'nonexistent-type'."
}

2.4. Bulk Update Documents
Endpoint: PUT /api/documents/
Description: Updates multiple documents based on their type in a single request.

Request Headers:

Content-Type: application/json
Request Body:

The request body should contain an array of documents to be updated. Each document must include the type to identify it and the fields to be updated (title and/or position).
{
  "documents": [
    {
      "type": "bank draft",
      "title": "Updated Bank Draft",
      "position": 0
    },
    {
      "type": "invoice",
      "title": "Updated Invoice",
      "position": 2
    }
  ]
}
Response:

200 OK: All documents updated successfully.
{
  "message": "Documents updated successfully.",
  "updatedDocuments": [
    {
      "type": "bank draft",
      "title": "Updated Bank Draft",
      "position": 0
    },
    {
      "type": "invoice",
      "title": "Updated Invoice",
      "position": 2
    }
  ]
}

400 Bad Request: If the request body is malformed or missing required fields.
{
  "error": "Invalid request format. 'documents' array is required."
}

404 Not Found: If one or more documents with the specified type do not exist.
{
  "error": "Documents with types ['nonexistent-type'] not found."
}

2.5. Update a Document by Type
Endpoint: PUT /api/documents/{type}

Description: Updates the document identified by type.

Parameters:

type (string): The unique identifier for the document to update.
Request Headers:

Content-Type: application/json
Request Body:
{
  "title": "Updated Bank Draft",
  "position": 0
}
Response:

200 OK
{
  "message": "Document updated successfully",
  "document": {
    "type": "bank draft",
    "title": "Updated Bank Draft",
    "position": 0
  }
}
404 Not Found (if no document matches the type)
{
  "error": "Document with type 'nonexistent-type' not found."
}

2.6. Delete a Document by Type
Endpoint: DELETE /api/documents/{type}
Description: Deletes the document identified by type.
Parameters:
type (string): The unique identifier for the document to delete.
Response:
200 OK
{
  "message": "Document deleted successfully."
}

404 Not Found (if no document matches the type)
{
  "error": "Document with type 'nonexistent-type' not found."
}

3. API Design Considerations
3.1. Uniqueness and Validation
Primary Key: type is treated as the primary key. Ensure that it is unique across all documents.
Validation: Implement server-side validation to check for the presence and uniqueness of type during creation and updates.
Case Sensitivity: Decide whether type should be case-sensitive. Typically, it's best to enforce a consistent case (e.g., lowercase) to prevent duplication issues.

3.2. Data Consistency
Atomic Operations: Ensure that CRUD operations are atomic to prevent partial updates that could lead to data inconsistency.
Position Management: When updating the position field, ensure that no two documents have the same position unless explicitly allowed.

3.3. Error Handling
Consistent Error Responses: Standardize error responses with meaningful messages and appropriate HTTP status codes.
Edge Cases: Handle cases where multiple documents might have the same type (if allowed), or where type contains special characters or spaces.

3.4. Security
Authentication: Implement authentication (e.g., JWT, OAuth) to restrict access to authorized users.
Authorization: Ensure that only users with the right permissions can perform certain operations (e.g., only admins can delete documents).
Input Sanitization: Protect against injection attacks by sanitizing and validating all input data.
Rate Limiting: Implement rate limiting to protect the API from abuse.

3.5. Performance and Scalability
Indexing: Index the type field in the database to optimize lookup times for read, update, and delete operations.

Pagination: For the GET /api/documents endpoint, implement pagination to handle large datasets efficiently.

GET /api/documents?page=1&limit=10
Caching: Utilize caching strategies (e.g., Redis) for frequently accessed data to reduce database load.

3.6. Documentation and Versioning
API Documentation: Use tools like Swagger or Postman to document the API endpoints, request/response formats, and examples.

Versioning: Implement API versioning to manage changes and ensure backward compatibility.

/api/v1/documents

3.7. Long-Term Maintenance
Modular Codebase: Structure the codebase in a modular fashion to facilitate easy updates and maintenance.
Automated Testing: Implement unit and integration tests to ensure the reliability of CRUD operations.
Continuous Integration/Continuous Deployment (CI/CD): Set up CI/CD pipelines to automate testing and deployment processes.
Monitoring and Logging: Use monitoring tools (e.g., Prometheus, Grafana) and logging (e.g., ELK Stack) to track API performance and troubleshoot issues.
