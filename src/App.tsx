import React from 'react';
import { Heart, PawPrint, Search, Phone, Mail, MapPin } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="flex items-center gap-3 mb-4">
            <PawPrint size={40} className="text-rose-500" />
            <h1 className="text-5xl font-bold">Paws Connect</h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl text-center">
            Give a loving home to pets in need. Browse our available animals and make a difference in their lives.
          </p>
          <div className="flex gap-4">
            <button className="bg-rose-600 hover:bg-rose-700 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
              <Heart size={20} /> Adopt Now
            </button>
            <button className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
              <Search size={20} /> Browse Pets
            </button>
          </div>
        </div>
      </div>

      {/* Featured Pets Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Adorable Friends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Luna",
              image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80",
              type: "Dog",
              age: "2 years"
            },
            {
              name: "Oliver",
              image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80",
              type: "Cat",
              age: "1 year"
            },
            {
              name: "Max",
              image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80",
              type: "Dog",
              age: "4 years"
            }
          ].map((pet, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <PawPrint size={18} />
                  <span>{pet.type}</span>
                  <span>•</span>
                  <span>{pet.age}</span>
                </div>
                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md">
                  Meet {pet.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Adopt Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Adopt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save a Life</h3>
              <p className="text-gray-600">Give a loving home to a pet in need and make a difference in their life.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Loyal Companion</h3>
              <p className="text-gray-600">Find a faithful friend who will bring joy and love to your home.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Support Our Mission</h3>
              <p className="text-gray-600">Help us continue our work in rescuing and caring for animals in need.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Phone className="text-rose-600" size={24} />
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-rose-600" size={24} />
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-gray-600">adopt@pawfriends.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-rose-600" size={24} />
              <div>
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-gray-600">123 Pet Street, Pawville</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;