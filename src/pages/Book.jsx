export default function Book() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Book a Session</h1>
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Additional Notes"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}