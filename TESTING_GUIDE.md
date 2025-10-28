# 🧪 Testing Guide - Enhanced Todo App

## Quick Test Checklist

### ✅ Basic Functionality Tests

1. **Add a Task**
   - [ ] Enter "Test Task" in the input field
   - [ ] Press Enter or click the + button
   - [ ] Task appears in the list
   - [ ] Input field clears

2. **Add a Task with Due Date**
   - [ ] Enter "Meeting with team" in input
   - [ ] Click the date picker
   - [ ] Select tomorrow at 2:00 PM
   - [ ] Task shows with formatted date/time
   - [ ] Bell icon appears next to the task

### 🔔 Reminder System Tests

3. **Set a Reminder**
   - [ ] Click the bell icon on a task with due date
   - [ ] Dropdown menu appears with options
   - [ ] Select "15 minutes before"
   - [ ] Bell icon turns red/active
   - [ ] Click bell again to verify selection is saved

4. **Change Reminder**
   - [ ] Click bell icon on task with existing reminder
   - [ ] Current selection shows checkmark
   - [ ] Select different option (e.g., "1 hour before")
   - [ ] Selection updates immediately

5. **Remove Reminder**
   - [ ] Click bell icon on task with reminder
   - [ ] Select "No reminder"
   - [ ] Bell icon becomes inactive

### 🔊 Sound Notification Tests

6. **Enable Sound Notifications**
   - [ ] Click settings gear icon (⚙️) in top right
   - [ ] Settings panel opens
   - [ ] Toggle "Sound Notifications" ON
   - [ ] Hear test notification sound
   - [ ] Toggle remains in ON position

7. **Test Success Sound**
   - [ ] Complete a task by clicking checkbox
   - [ ] Hear pleasant success sound (3 notes)
   - [ ] Task shows checkmark
   - [ ] Points increase by 10

8. **Test Reminder Sound**
   - [ ] Create task with due date in 2 minutes
   - [ ] Set reminder for "5 minutes before"
   - [ ] Wait for reminder time
   - [ ] Hear notification sound
   - [ ] Toast notification appears

### 🌐 Browser Notification Tests

9. **Enable Browser Notifications**
   - [ ] Click settings gear icon
   - [ ] Toggle "Browser Notifications" ON
   - [ ] Browser prompts for permission
   - [ ] Click "Allow"
   - [ ] Toggle shows as active

10. **Test Browser Notification**
    - [ ] Create task due in 2 minutes
    - [ ] Set reminder for "5 minutes before"
    - [ ] Minimize or switch to different tab
    - [ ] Browser notification appears at reminder time
    - [ ] Click notification to return to app

### 🎨 UI/UX Tests

11. **Check Modern Design**
    - [ ] Clean white background with subtle shadows
    - [ ] Red accent color (#dc4c3e) on buttons
    - [ ] Circular checkboxes with smooth animations
    - [ ] Hover effects on buttons and tasks
    - [ ] Proper spacing and typography

12. **Test Responsiveness**
    - [ ] Resize browser window to mobile width
    - [ ] Layout adapts to smaller screen
    - [ ] All features remain accessible
    - [ ] Date picker works on mobile
    - [ ] Settings panel displays correctly

### 🏆 Productivity Score Tests

13. **Test Point System**
    - [ ] Note current points
    - [ ] Complete a task
    - [ ] Points increase by 10
    - [ ] Uncomplete the task
    - [ ] Points decrease by 10
    - [ ] Points persist after page reload

### 📝 Existing Features Tests

14. **Test Edit Function**
    - [ ] Click edit icon on a task
    - [ ] Rich text editor appears
    - [ ] Make changes to task text
    - [ ] Click Save
    - [ ] Changes are saved

15. **Test Comment Function**
    - [ ] Click comment icon on a task
    - [ ] Comment popup appears
    - [ ] Enter comment text
    - [ ] Click Save (green icon)
    - [ ] Comment is saved (hover shows comment)

16. **Test Delete Function**
    - [ ] Click trash icon on a task
    - [ ] Confirmation modal appears
    - [ ] Click "Confirm"
    - [ ] Task is deleted

17. **Test Reordering**
    - [ ] Click up arrow on task (not first)
    - [ ] Task moves up one position
    - [ ] Click down arrow on task (not last)
    - [ ] Task moves down one position

18. **Test Drag & Drop**
    - [ ] Click and hold on a task
    - [ ] Drag to new position
    - [ ] Release
    - [ ] Task stays in new position

### 💾 Persistence Tests

19. **Test Data Persistence**
    - [ ] Add several tasks with various settings
    - [ ] Set reminders on some tasks
    - [ ] Add comments to tasks
    - [ ] Complete some tasks
    - [ ] Change notification settings
    - [ ] Refresh the page (F5)
    - [ ] All data remains intact

### 🔍 Edge Cases Tests

20. **Test Empty States**
    - [ ] Try to add empty task
    - [ ] Warning message appears
    - [ ] No task is added

21. **Test Past Due Dates**
    - [ ] Add task with due date in the past
    - [ ] Task accepts the date
    - [ ] Date displays correctly

22. **Test Multiple Reminders**
    - [ ] Create 3 tasks with reminders
    - [ ] All reminders work independently
    - [ ] Each notification is distinct

## 🎯 Critical Success Criteria

### Must Work:
- ✅ All existing features (edit, delete, comment, reorder)
- ✅ Date/time picker for due dates
- ✅ Reminder settings per task
- ✅ Sound notifications
- ✅ Browser notifications
- ✅ Settings panel
- ✅ Data persistence
- ✅ Responsive design
- ✅ Modern Todoist-like UI

### Nice to Have:
- Smooth animations
- Accessibility features
- Error handling
- Loading states

## 🐛 Known Behavior

1. **Reminder Check Frequency**: Reminders are checked every minute, so there may be up to 1 minute delay
2. **Browser Notifications**: Require user permission and won't work if permission is denied
3. **Sound on Mobile**: May require user interaction first due to browser autoplay policies
4. **Time Zones**: All times use the user's local timezone

## 📊 Performance Tests

23. **Test with Many Tasks**
    - [ ] Add 20+ tasks
    - [ ] App remains responsive
    - [ ] Pagination works correctly
    - [ ] All features work normally

24. **Test Memory Usage**
    - [ ] Open browser dev tools
    - [ ] Monitor memory usage
    - [ ] Use app for extended period
    - [ ] No significant memory leaks

## ✨ User Experience Tests

25. **Test First-Time User Experience**
    - [ ] Clear all localStorage
    - [ ] Reload app
    - [ ] UI is intuitive
    - [ ] All features are discoverable
    - [ ] No errors in console

## 🎉 Success Indicators

If all tests pass, you should see:
- Clean, modern Todoist-inspired interface
- Smooth animations and transitions
- Working reminders with sound and browser notifications
- All original features intact and working
- No console errors
- Responsive design on all devices
- Data persists across sessions

## 🚀 Next Steps After Testing

If issues are found:
1. Document the issue
2. Check browser console for errors
3. Verify browser compatibility
4. Check notification permissions
5. Clear cache and test again

If all tests pass:
1. Merge to develop branch
2. Test on different browsers
3. Deploy to production
4. Gather user feedback

---

Happy Testing! 🎊
