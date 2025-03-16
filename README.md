# Substream Media Processor

## Overview

Substream Media Processor is a media management system that processes, organizes, and streams media files. It uses Temporal for workflow orchestration, MongoDB for data storage, and Express for API endpoints. The system is designed to scan directories for media files, extract metadata, and provide streaming capabilities.

## Architecture

The application consists of three main components:

1. **Injest** - Handles media file discovery and importing
2. **Propel** - Processes media files and provides streaming capabilities
3. **Persona** - Manages user data and watch history

## API Routes

### Injest API

Endpoints for scanning and importing media files.

#### Scan Directory Recursively for Media Files (mp4/mkv)

```
POST /v1/injest/scan
```

**Request Body:**

```json
{
  "directory": "/path/to/media/files"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "filesProcessed": 10
}
```

### Propel API

Endpoints for processing and streaming media.

#### Process Media

```
POST /v1/propel/process
```

**Request Body:**

```json
{
  "filePath": "/path/to/media/file.mp4"
}
```

**Response:**

```json
{
  "status": "STARTED",
  "workflowId": "abc123",
  "runId": "xyz789"
}
```

#### Get Workflow Status

```
GET /v1/propel/process/status/:workflowId
```

**Response:**

```json
{
  "status": "COMPLETED",
  "workflowId": "abc123",
  "runId": "xyz789",
  "taskQueue": "process-media",
  "pendingTasks": [],
  "data": {
    /* Media metadata */
  }
}
```

#### Stream Media

```
GET /v1/propel/stream/:userId/:mediaId
```

Streams the media file with proper HTTP range support for video players.

### Persona API

Endpoints for user management and watch history.

#### User Management

```
GET /v1/persona/users
POST /v1/persona/user
```

**Create User Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

#### Watch History

```
GET /v1/persona/:userId/watch/:mediaId
GET /v1/persona/:userId/watch
POST /v1/persona/:userId/watch/:mediaId
```

**Update Watch History Request Body:**

```json
{
  "position": 120,
  "duration": 3600
}
```

#### User Media

```
GET /v1/persona/:userId/media
```

**Query Parameters:**

```
category=MOVIE|TV
```

## Media Processing with Temporal

The application uses Temporal for reliable workflow orchestration. The media processing workflow includes:

1. **File Discovery** - Scanning directories for media files
2. **Metadata Extraction** - Parsing filenames for basic metadata
3. **External Enrichment** - Fetching additional metadata from TMDB/IMDB
4. **Database Storage** - Storing processed media information
5. **Streaming Preparation** - Making media ready for streaming

### Workflow Details

The `processMediaWorkflow` handles:

- Checking if media already exists in the database
- Extracting basic metadata from filenames
- Searching for additional metadata using external APIs
- Storing complete metadata in MongoDB
- Handling TV shows with seasons and episodes
- Error handling and rollback for failed processing

## Development & Running

### Prerequisites

- Node.js 22+
- [Temporal Server CLI](https://github.com/temporalio/cli?tab=readme-ov-file#quick-install)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the Temporal server & Substream Application bundle:

```bash
npm run startd
```

3. The server will be available at the displayed IP address and port (default: `localhost:7455`)

4. To stop all servers, run:

```bash
npm run stopd
```
