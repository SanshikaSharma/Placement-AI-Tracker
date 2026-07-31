function WelcomeBanner({ name = "Student" }) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <div className="bg-linear-to-r from-blue-700 to-indigo-700 rounded-2xl text-white p-8">

      <h1 className="text-4xl font-bold">
        {greeting}, {name} 👋
      </h1>

      <p className="mt-3 text-blue-100">
        Welcome to your Placement AI Dashboard.
      </p>

    </div>
  );
}

export default WelcomeBanner;