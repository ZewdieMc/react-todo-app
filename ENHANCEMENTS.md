# 🎯 Enhanced Todo App - Todoist-Inspired

A powerful, feature-rich todo application built with React, inspired by Todoist's clean design and functionality. This enhanced version includes smart reminders, sound notifications, browser notifications, and a beautiful modern UI.

## ✨ New Features

### 🔔 Smart Reminder System
- **Multiple reminder options**: Choose from 5 minutes to 1 week before due date
- **Visual reminder indicators**: Bell icons show which tasks have reminders set
- **Customizable per task**: Each task can have its own reminder setting
- **Automatic notifications**: Get notified at the right time

### 🔊 Sound Notifications
- **Pleasant notification sounds**: Web Audio API-generated notification tones
- **Success sounds**: Celebration sound when completing tasks
- **Customizable**: Enable/disable sounds from settings
- **Non-intrusive**: Short, pleasant tones that don't disturb

### 🌐 Browser Notifications
- **Desktop notifications**: Get notified even when the tab is in the background
- **Rich notifications**: Shows task name and time remaining
- **Click to focus**: Click notification to bring app to foreground
- **Permission-based**: Respects browser notification settings

### 📅 Advanced Date/Time Picker
- **Date AND time selection**: Set precise due dates with times
- **Interactive calendar**: Easy-to-use date picker interface
- **Time intervals**: 15-minute interval selection
- **Clear formatting**: Displays dates in readable format (e.g., "Dec 25, 2025 2:30 PM")

### 🎨 Modern Todoist-Inspired UI
- **Clean, minimal design**: Focused on productivity
- **Todoist color scheme**: Red accent color (#dc4c3e)
- **Smooth animations**: Subtle transitions and hover effects
- **Responsive design**: Works beautifully on mobile and desktop
- **Custom checkbox styling**: Circular checkboxes with checkmarks

### 🏆 Gamification
- **Productivity Score**: Earn 10 points for completing tasks
- **Visual feedback**: Beautiful gradient display with trophy icon
- **Persistent tracking**: Points saved in localStorage

### ⚙️ Notification Settings
- **Settings panel**: Easily toggle sound and browser notifications
- **Visual toggles**: Clear on/off switches
- **Instant feedback**: Test sounds immediately
- **Persistent preferences**: Settings saved locally

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd react-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

### Adding a Task
1. Type your task in the input field
2. (Optional) Click the date picker to set a due date and time
3. Click the + button or press Enter

### Setting Reminders
1. Tasks with due dates show a bell icon
2. Click the bell icon to open reminder options
3. Select when you want to be reminded (5 min to 1 week before)
4. The bell will turn red when a reminder is active

### Managing Notifications
1. Click the settings gear icon (⚙️) in the top right
2. Toggle sound notifications on/off
3. Toggle browser notifications on/off (requires browser permission)
4. Your preferences are saved automatically

### Completing Tasks
1. Click the circular checkbox next to a task
2. Hear a success sound (if enabled)
3. Earn 10 points for your productivity score!
4. Task will show as completed with a checkmark

### Other Features
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove a task
- **Comments**: Click the comment icon to add notes
- **Reorder**: Use up/down arrows to reorder tasks
- **Drag & Drop**: Drag tasks to reorder them

## 🛠️ Technical Details

### New Dependencies
- `react-datepicker`: Advanced date and time picker
- `date-fns`: Date utility library
- `@radix-ui/react-*`: Headless UI components
- `lucide-react`: Modern icon library

### New Components
- **NotificationSettings**: Settings panel for notification preferences
- **Enhanced ReminderSettings**: Improved reminder selection with dropdown UI
- **notificationSound.js**: Web Audio API-based sound generation utility

### Key Technologies
- **React 18**: Modern React with hooks
- **Web Audio API**: For generating notification sounds
- **Notifications API**: For browser notifications
- **localStorage**: For persisting data and preferences
- **CSS Modules**: Scoped styling
- **Draft.js**: Rich text editing for tasks

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with notification permission)
- Mobile browsers: Full support with responsive design

## 🎨 Design Philosophy

This app follows Todoist's design principles:
1. **Simplicity**: Clean, uncluttered interface
2. **Focus**: Everything serves the goal of task management
3. **Delight**: Subtle animations and feedback
4. **Accessibility**: Clear labels, good contrast, keyboard support
5. **Performance**: Fast, responsive, optimized

## 🔐 Privacy

- All data stored locally in your browser
- No server, no tracking, no data collection
- Your tasks stay on your device
- Notifications are generated locally

## 📱 Mobile Support

The app is fully responsive and includes:
- Touch-friendly buttons
- Optimized layouts for small screens
- Swipe gestures support (via drag-and-drop)
- Mobile-optimized date picker

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by [Todoist](https://todoist.com/)
- Icons from React Icons
- UI patterns from modern web design best practices

## 🐛 Known Issues

None at the moment! If you find any bugs, please report them in the issues section.

## 🔮 Future Enhancements

- Subtasks support
- Task categories/projects
- Task filtering and search
- Recurring tasks
- Task statistics and insights
- Keyboard shortcuts
- Dark mode
- Task sharing
- Calendar integration

---

Made with ❤️ using React and modern web technologies
