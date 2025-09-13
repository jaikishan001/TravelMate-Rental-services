import VehicleCard from "../components/VehicleCard";

export default function VehicleHome() {
  const VehicleCards = [
    {
      image: "/car.png",
      title: "Economy Cars",
      description: "Perfect for city driving and budget-conscious travelers",
      tags: ["Fuel Efficient", "Easy Parking", "Automatic", "AC"],
      price: "From $25/day",
      rating: 4.8,
    },
    {
      image: "/luxury-sedan.png",
      title: "Luxury Vehicles",
      description: "Premium comfort and style for special occasions",
      tags: ["Premium Interior", "Advanced Tech", "Leather Seats", "GPS"],
      price: "From $85/day",
      rating: 4.9,
    },
    {
      image: "/suv-truck.jpg",
      title: "SUVs & Trucks",
      description: "Spacious vehicles for families and cargo needs",
      tags: ["7+ Seats", "Large Cargo", "4WD Available", "Safety Features"],
      price: "From $55/day",
      rating: 4.7,
    },
    {
      image: "/electric-bicycle.jpg",
      title: "Electric Bikes",
      description: "Eco-friendly transportation for urban exploration",
      tags: ["Eco-Friendly", "Long Range", "Easy Ride", "City Perfect"],
      price: "From $12/day",
      rating: 4.6,
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="text-center">
        <p className="text-3xl font-semibold pb-5 pt-20">Our Vehicle Categories</p>
        <p className="text-gray-400">Choose from our diverse fleet of well-maintained vehicles to suit every need and</p>
        <p className="text-gray-300">budget.</p>
      </div>
      <div className=" mt-7 pb-20 p-6 gap-6 grid grid-cols-2 xl:grid-cols-4">
        {VehicleCards.map((card, idx) => (
          <VehicleCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}
