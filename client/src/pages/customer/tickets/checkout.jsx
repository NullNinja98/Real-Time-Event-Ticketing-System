import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, User, MapPin, ArrowLeft } from 'lucide-react';

const Checkout = ({ selectedTickets, event, onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventName, eventDate, eventTime, eventVenue, image, totalAmount, totalQuantity } = location.state || {};

  const handleCloseModal = () => {
    setSuccessModal(false);
    navigate('/events');
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [successModal, setSuccessModal] = useState(false); 

  const handleBack = () => {
    window.history.back();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (input) => {
    return input
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();
  };

  const calculateTotal = () => {
    return Object.entries(selectedTickets).reduce(
      (total, [price, quantity]) => total + quantity * price,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Make API call to save payment data 
    try {
      const response = await fetch('http://localhost:8000/save/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.firstName + ' ' + formData.lastName,
          topic: eventName,
          ticketCount: totalQuantity,
          amount: totalAmount
        })
      });

      if (response.ok) {
        setSuccessModal(true); // Show success modal
      } else {
        alert('Payment failed! Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Left Side - Event & Ticket Details */}
      <div 
        className="w-1/2 relative bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute top-6 left-6">
          <button 
            onClick={handleBack}
            className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h1 className="text-3xl font-bold mb-4">{eventName}</h1>

          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="mr-3" />
              <span>{eventVenue}</span>
            </div>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex justify-between font-bold text-xl mt-4">
              <span>Total</span>
              <span>{totalAmount} LKR</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="w-1/2 bg-white overflow-y-auto p-12">
        <form className="max-w-md mx-auto space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
            <div className="relative">
              <User size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="userName"
                placeholder="User Name"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="relative">
                <User size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="relative">
                <User size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payment Method</h3>
            <div className="space-y-4">
              <div className="relative">
                <CreditCard size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    handleInputChange({
                      target: { 
                        name: 'cardNumber', 
                        value: formatted.replace(/\s/g, '')
                      }
                    });
                  }}
                  maxLength="19"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <input
                type="text"
                name="cardName"
                placeholder="Name on Card"
                value={formData.cardName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
              />

              <div className="grid grid-cols-3 gap-4">
                <select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Month</option>
                  {Array.from({length: 12}, (_, i) => 
                    <option key={i+1} value={String(i+1).padStart(2, '0')}>
                      {String(i+1).padStart(2, '0')}
                    </option>
                  )}
                </select>

                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Year</option>
                  {Array.from({length: 10}, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>

                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    maxLength="3"
                    value={formData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange({
                        target: { name: 'cvv', value }
                      });
                    }}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Payment Successful!</h2>
            <p className="mb-4">Thank you for your purchase.</p>
            <button 
              onClick={handleCloseModal} 
              className="py-2 px-4 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
