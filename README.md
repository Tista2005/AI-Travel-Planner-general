# 🌍 AI-Powered Travel Planner Generator

Welcome to the **AI-Powered Travel Planner Generator**, a smart web application built using **IBM Watsonx**.
This system helps users generate **personalized itineraries** based on their preferences such as budget, duration, and number of travelers.

It is strictly focused on **travel-related queries**. Any unrelated question will be answered politely with:

> “Sorry, I can only help with travel planning.”

---

## 🚀 Key Features

* ✈️ **AI-driven trip planning** with day-wise itineraries
* 💰 **Budget-friendly suggestions** based on input
* 👥 Supports multiple travelers
* 🤖 Powered by **IBM Watsonx (Runtime + Studio)**
* 🎨 **User-friendly interface** with a simple design

---

## 🧠 Tech Stack

**Frontend:** React, TypeScript, TailwindCSS
**Backend:** FastAPI (Python)
**AI Model:** IBM Watsonx (Runtime, Studio, Cloud Object Storage)
**Deployment Ready:** Compatible with Render / Cloud platforms

---

## 🖼️ Sample Output

📌 Example Input:

```
Plan a 7-day trip to Delhi for 2 people with a budget of ₹20,000
```

📌 Example Response:

* Day-wise itinerary (historical sites, activities)
* Budget breakdown (travel, food, stay, activities)
* Travel tips (weather, packing suggestions, safety notes)

![AI Travel Planner Screenshot](https://github.com/Tista2005/AI-Travel-Planner-general/blob/main/output.png)

---

## 🛠️ Getting Started

### 🔧 Backend Setup

1. Navigate to backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:

   ```bash
   uvicorn app:app --reload
   ```

### 🎨 Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start development server:

   ```bash
   npm run dev
   ```

⚠️ **Note:** Both frontend and backend must be running together for the app to work.

---

## 🧪 Testing

✅ Valid Query:

```
Plan a 5-day trip to Goa with ₹15,000 for 3 people
```

❌ Invalid Query:

```
Tell me about cricket
```

**Response:** “Sorry, I can only help with travel planning.”

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Developer

**Tista Samui**
