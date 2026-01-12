import React, { useState } from "react";

const Home = () => {
  const [user, setUser] = useState({
    username: "Ankit",
    caloriesGoal: 2500,
    caloriesConsumed: 1800,
    caloriesBurned: 400,
    workoutTime: 60,
  });

  const addCalories = () => {
    setUser((prev) => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + 200,
    }));
  };

  const burnCalories = () => {
    setUser((prev) => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + 100,
      workoutTime: prev.workoutTime + 15,
    }));
  };

  const remainingCalories =
    user.caloriesGoal - user.caloriesConsumed + user.caloriesBurned;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username} 💪
          </h1>
          <p className="text-gray-500">Your daily fitness dashboard</p>
        </div>

        {/* Profile */}
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {user.username[0]}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Stat title="Calories Eaten" value={`${user.caloriesConsumed} kcal`} />
        <Stat title="Calories Burned" value={`${user.caloriesBurned} kcal`} />
        <Stat title="Workout Time" value={`${user.workoutTime} min`} />
        <Stat title="Remaining Calories" value={`${remainingCalories} kcal`} />
      </div>

      {/* Actions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <ActionCard
          title="Add Food"
          description="Log 200 kcal meal"
          onClick={addCalories}
          button="Add Calories"
        />

        <ActionCard
          title="Log Workout"
          description="Burn 100 kcal workout"
          onClick={burnCalories}
          button="Burn Calories"
        />
      </div>
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h2>
  </div>
);

const ActionCard = ({ title, description, onClick, button }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
    >
      {button}
    </button>
  </div>
);

export default Home;
