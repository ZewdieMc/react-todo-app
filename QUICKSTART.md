# Quick Start Guide 🚀

Get your Todoist-inspired Todo App up and running in minutes!

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Open in Browser
The app will automatically open at `http://localhost:3000`

**That's it!** You're ready to use the app with local storage.

---

## 🎓 First Steps

### Add Your First Task
1. Type a task in the input field
2. (Optional) Click the calendar icon to set a due date
3. Press Enter or click "Submit"

### Complete a Task
1. Click the checkbox next to the task
2. Earn 10 points! 🎉
3. Watch the success notification and hear the sound

### Set a Reminder
1. Click the bell icon on any task
2. Choose when you want to be reminded
3. Get notified at the right time!

### Search for Tasks
1. Type in the search bar at the top
2. Results filter instantly
3. Click X to clear search

### Switch Between Active/Completed
1. Click "Active" tab to see pending tasks
2. Click "Completed" tab to see finished tasks
3. Badge shows count for each

---

## ☁️ Enable Cloud Storage (Optional)

Want to access your todos from multiple devices? Set up cloud storage!

### Step 1: Get Firebase Credentials
See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### Step 2: Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Firebase credentials
# Use your favorite text editor
nano .env
# or
code .env
```

### Step 3: Restart the App
```bash
# Stop the current server (Ctrl+C)
# Start again
npm start
```

### Step 4: Enable Cloud Mode
1. In the app, look for Storage Settings
2. Click the "Cloud" button
3. Your data will now sync across devices! ☁️

---

## 🎯 Key Features at a Glance

| Feature | Icon/Location | What It Does |
|---------|--------------|--------------|
| **Add Task** | Input at top | Create new todos |
| **Due Date** | 📅 Calendar icon | Set deadlines |
| **Reminder** | 🔔 Bell icon | Get notified before due |
| **Search** | 🔍 Search bar | Filter tasks |
| **Points** | 🏆 Top right | Track your productivity |
| **Tabs** | Active/Completed | Organize by status |
| **Storage** | Local/Cloud toggle | Choose storage mode |
| **Comments** | 💬 Comment icon | Add detailed notes |
| **Notifications** | 🔔 Settings icon | Toggle sounds/alerts |

---

## 💡 Pro Tips

### Keyboard Shortcuts
- **Enter**: Submit new task
- **Escape**: Close modals/comments

### Productivity Hacks
1. **Use reminders for important tasks**: Set a reminder 1 day before big deadlines
2. **Batch similar tasks**: Use comments to add details
3. **Check completed tab regularly**: See your progress and stay motivated
4. **Search frequently**: Find tasks quickly instead of scrolling
5. **Enable cloud storage**: Never lose your todos

### Earning Points
- Complete tasks regularly to rack up points
- Each completed task = 10 points
- Use points as motivation to stay productive!

---

## 🔔 Notifications Setup

### Browser Notifications
1. When you first set a reminder, you'll see a permission prompt
2. Click "Allow" to enable desktop notifications
3. Get notified even when the tab is in the background

### Sound Notifications
1. Click the notification settings icon (🔔)
2. Toggle sound on/off
3. Sounds play for:
   - Completing tasks
   - Reminder alerts

---

## 📱 Mobile Usage

The app is fully responsive! Here's what to expect:

### On Mobile
- Touch-friendly buttons
- Full-width inputs
- Stacked layouts
- Easy scrolling
- All features work perfectly

### On Tablet
- Optimized spacing
- Comfortable touch targets
- Responsive pagination

### On Desktop
- Full feature set
- Hover effects
- Keyboard shortcuts
- Multi-column layouts

---

## 🎨 Customization

### Change Theme
Currently uses Todoist red (#dc4c3e). To customize:
1. Edit color variables in CSS files
2. Look for `#dc4c3e` in the codebase
3. Replace with your preferred color

### Adjust Pagination
Edit `TodoApp.jsx` to change items per page:
```jsx
const [todosPerPage] = useState(10); // Change to 5, 15, 20, etc.
```

---

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Notifications Not Working
- Check browser permissions
- Enable notifications in browser settings
- Allow notifications when prompted

### Cloud Sync Not Working
- Verify `.env` file exists in root directory
- Check Firebase credentials
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- Restart development server

### Search Not Working
- Clear search bar (click X)
- Refresh the page
- Check browser console for errors

### Points Not Saving
- Check if localStorage is enabled in browser
- Try a different browser
- Clear browser cache and reload

---

## 📚 Learn More

- **Full Features List**: See [FEATURES.md](./FEATURES.md)
- **Firebase Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Original README**: See [README.md](./README.md)

---

## 🚀 What's Next?

Now that you're set up:

1. ✅ Add your first task
2. ✅ Set a reminder
3. ✅ Complete a task and earn points
4. ✅ Try searching
5. ✅ Switch between tabs
6. ✅ (Optional) Enable cloud storage

**Happy task managing!** 🎉

---

## 📞 Need Help?

- Check browser console for errors
- Review the troubleshooting section
- Ensure all dependencies are installed
- Try restarting the development server

---

**Last Updated**: January 2025
