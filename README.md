# Alfa List - Modern Todo Application

A sleek and feature-rich todo list application built with modern web technologies. Following Material Design principles, it offers a beautiful and intuitive user interface with both light and dark themes.

## Features

### Task Management
- Create, read, update, and delete tasks
- Duplicate task detection with notifications
- Beautiful animations for all interactions
- Task categorization (Personal, Work, Shopping, Other)
- Priority levels (Low, Medium, High)
- Due date support
- Task completion tracking

### User Interface
- Light and Dark theme support
- Material Design principles
- Responsive design for all devices
- Smooth animations and transitions
- Task statistics
- Visual priority indicators

### Organization
- Filter tasks (All, Active, Completed)
- Sort by:
  - Date Added
  - Due Date
  - Priority
  - Category
- Task statistics dashboard

### Notifications
- Real-time feedback for all actions
- Warning notifications for empty tasks
- Error notifications for duplicates
- Success notifications for completions

## Technical Features

### Frontend
- Modern JavaScript (ES6+)
- Responsive CSS with Flexbox
- Material Design Icons
- Custom animations and transitions
- Dynamic theme switching
- Local storage for theme preference

### Backend
- Node.js with Express
- MongoDB database
- RESTful API architecture
- CORS enabled
- Error handling middleware

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-list.git
   cd todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB:
   ```bash
   mongod
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 5500
   ```

## API Endpoints

- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Color Scheme

### Light Theme
- Primary Color: #344CCA (Royal Blue)
- Secondary Color: #171EA4 (Dark Blue)
- Background: Gradient from #F0F0F5 to #E0E0EB
- Text: #1A1A2E (Dark Navy)

### Dark Theme
- Background: #1E1E2E (Dark Gray)
- Text: #E1E1E6 (Light Gray)
- Accents: Various shades of blue and purple

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material Design for design inspiration
- Font Awesome for icons
- Google Fonts for the Poppins font family