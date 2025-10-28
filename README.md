<a name="readme-top"></a>

<div align="center">

  <h3><b>React ToDo App</b></h3>

</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#triangular_flag_on_post-deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ](#faq)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 Todo App<a name="about-project"></a>
<img src='./todo.gif'>
React Todo is an application that is developed with ReactJs. It is used to add, edit and delete items/tasks into the Todo list.

## 🛠 Built With <a name="built-with"></a>
- React


### Tech Stack <a name="tech-stack"></a>
- [React](react.dev)
- [Create React App](http://create-react-app.dev/)

<!-- Features -->

### Key Features <a name="key-features"></a>

- ✅ **Add, edit, and delete tasks** - Full CRUD operations for todo items
- 🔍 **Search functionality** - Filter tasks by title or comments
- 📅 **Due dates with date/time picker** - Set specific deadlines for your tasks
- ⏰ **Smart reminders** - Get notified before tasks are due (5 min to 1 week options)
- 🔔 **Sound & browser notifications** - Audio alerts and desktop notifications
- 📊 **Points system** - Earn 10 points for each completed task
- 📑 **Active/Completed tabs** - Organize tasks by completion status
- 📄 **Pagination** - Smart pagination with ellipsis for large lists
- 💾 **Dual storage options**:
  - 🖥️ Local storage (browser-based)
  - ☁️ Cloud storage (Firebase - access across devices)
- 📱 **Mobile responsive** - Works seamlessly on all screen sizes
- 🎨 **Todoist-inspired UI** - Modern, clean interface with smooth animations
- 💬 **Comments on tasks** - Add detailed notes to your todos
- 🎯 **Drag and drop** - Reorder tasks easily

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

 Have a look at the [live demo ](https://react-todo-zed.netlify.app/) of the project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.
  
  
### Prerequisites

In order to run this project you need:
  - npm installed
  - node installed

### Setup

Clone this repository to your desired folder:
```sh
  cd my-folder
  git clone git@github.com/ZewdieMc/react-todo-app.git
```
### Install

Install this project with:
```sh
  cd react-todo-app/
  npm install
```

### Firebase Setup (Optional - For Cloud Storage)

To enable cloud storage and sync across devices:

1. Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Create a `.env` file from the example:
   ```sh
   cp .env.example .env
   ```
3. Add your Firebase credentials to the `.env` file
4. Restart the development server

**Note**: The app works perfectly with local storage without Firebase setup. Cloud storage is optional for cross-device synchronization.

### Usage

To run the project:
```sh
  npm start
```

### Run tests

To run tests, run the following command:
  
  ```sh
    npm test
  ```

To check for css errors run:
```sh
  npx stylelint "**/*.{css,scss}"
```
To check for js errors run:
```sh
  npx eslint .
```

### Deployment

Deployed using Github Pages.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 Zewdie Habtie

- GitHub: [@ZewdieMc](https://github.com/ZewdieMc)
- Twitter: [@HabtieZewdie](https://twitter.com/HabtieZewdie)
- LinkedIn: [Zewdie Habtie](https://linkedin.com/in/zewdie-habtie-sisay-947153172)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- Install React Router and Create components.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/ZewdieMc/react-todo-app/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project send your feedback to encourage me to do more.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I would like to thank Microverse for offering me this opportunity to learn, and practice our skills.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FAQ (optional) -->

## ❓ FAQ <a name="faq"></a>

- Why React?
  - React has broader community support, and it is a very popular library.
  - React is flexible and can be used to build different types of applications.
  - React is easy to learn and use.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.
(Check the LICENSE file)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
