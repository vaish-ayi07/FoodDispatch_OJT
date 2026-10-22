# FoodDispatch_OJT

# 🍔 FoodDispatch — Live Food Order Dispatch & Driver Tracking

**FoodDispatch** is a hyper-local food delivery tracking application designed to simplify communication between customers, delivery drivers, and restaurants. It helps customers track their order progress while allowing drivers and restaurants to manage deliveries through a simple, responsive dashboard.

This project is being developed as part of the **Semester 1 On-the-Job Training (OJT) — Product Development, 2026**.

## 🎯 Project Objectives

- Enable customers to check their food order status.
- Allow drivers to view assigned deliveries and update order progress.
- Help restaurants manage incoming orders and food preparation.
- Demonstrate driver location tracking through live or simulated location updates.
- Provide a responsive interface for both desktop and mobile devices.

## ✨ Key Features

- **Order Tracking:** View the current status of food orders.
- **Driver Dashboard:** View assigned deliveries and update delivery statuses.
- **Restaurant Dashboard:** Manage orders and update preparation progress.
- **Driver Location Tracking:** Display the driver's current or simulated location.
- **Search and Filters:** Find orders quickly using search and status filters.
- **Data Persistence:** Store demo data using browser localStorage or sample JSON files.
- **Responsive Design:** Support laptop and mobile screen sizes.
- **Data Export:** Export the main order table to CSV or PDF as an additional feature.
- **Role-Based Actions:** Restrict actions based on whether the user is a customer, driver, or restaurant.

## 👥 User Roles

| Role | Responsibilities |
|---|---|
| Customer | View order details, track order status, and monitor delivery progress. |
| Driver | View assigned orders and update delivery status. |
| Restaurant | Manage incoming orders and update food preparation status. |

## 🛠️ Technology Stack

### Core Technologies

- HTML5 — Page structure
- CSS3 — Styling and responsive layouts
- JavaScript — Application logic and interactivity
- Bootstrap 5 — Responsive UI components
- localStorage / JSON — Sample data and persistence
- Git and GitHub — Version control and project collaboration

### Optional Stretch Technologies

- React + Vite — Component-based frontend development
- Leaflet — Map-based driver location visualization

*Optional technologies will be explored after the core requirements are working.*

## 🔄 Order Workflow

The expected order lifecycle is:

**Order Placed → Preparing → Ready for Pickup → Picked Up → Delivered**

The application will display order progress and allow authorized users to perform the appropriate status updates.

## 📍 Driver Tracking

FoodDispatch aims to provide visibility into delivery progress through driver location updates.

For the initial demonstration, the application may use simulated coordinates or periodically updated sample locations. Actual GPS tracking and real-time location streaming can be explored as future enhancements.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code (recommended)
- Basic knowledge of HTML, CSS, and JavaScript
- Git (optional, for version control)

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd FoodDispatch
   ```

3. Open the project folder in Visual Studio Code.

4. Run the application by opening `index.html` in your browser or using the **Live Server** extension in Visual Studio Code.

*If the project uses React + Vite in the future, the setup instructions will be updated accordingly.*

## 🧪 Testing Checklist

- [ ] Sample orders display correctly.
- [ ] Customers can view their order status.
- [ ] Drivers can access assigned deliveries and update permitted statuses.
- [ ] Restaurants can manage orders and preparation progress.
- [ ] Unauthorized actions are blocked.
- [ ] Search and status filters work correctly.
- [ ] Data persists after refreshing the page.
- [ ] Driver location updates display correctly in the demo.
- [ ] The layout works on desktop and mobile screen sizes.
- [ ] The complete core workflow can be demonstrated successfully.

## 📦 Expected Deliverables

- Working FoodDispatch web application
- Sample order and driver data
- Responsive user interface
- README and setup instructions
- Critical-path testing checklist
- Deployed demonstration using GitHub Pages or Vercel

## 🔮 Future Enhancements

- Real-time GPS tracking for delivery drivers
- Interactive maps with route visualization
- Customer notifications for order updates
- Backend integration and database storage
- Authentication and secure role-based access
- Estimated delivery time calculations

## 🎓 Project Information

| Detail | Description |
|---|---|
| Project Name | FoodDispatch |
| Project Code | PST_PD_031 |
| Program | Semester 1 OJT — 2026 |
| Domain | Food Technology / Delivery Management |
| Project Type | Product Development |
| Primary Stack | HTML, CSS, JavaScript, Bootstrap 5 |
| Deployment | GitHub Pages or Vercel |

## 👩‍💻 Author

**Sampreeti Ghosh**

Computer Science Engineering Student  
Product Development OJT — 2026

---

*FoodDispatch — Making local food delivery easier to track, manage, and deliver.*
