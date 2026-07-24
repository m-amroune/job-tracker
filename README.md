# Job Tracker

A responsive job application tracker built with Next.js, React and TypeScript.

[View live demo](https://m-a-job-tracker.vercel.app/)

![Job Tracker interface](./public/assets/job_tracker.png)
---

## About the Project

Job Tracker is a simple application for managing job applications directly in the browser.

Applications can be added, edited, searched, filtered and sorted. Data is saved locally with `localStorage`.

---

## Features

- Add a company, position and offer link
- Edit existing applications
- Track applications through four statuses:
  `todo → applied → interview → rejected`
- Reset an application status
- Search by company or position
- Filter applications by status
- Sort applications by company, position, status or date
- Delete an application with confirmation
- Save data locally after page reload
- Responsive table on desktop and cards on mobile

---

## Built With

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)

---

## Installation

```bash
git clone https://github.com/m-amroune/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.