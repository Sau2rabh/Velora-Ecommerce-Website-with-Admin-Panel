import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { CheckCircle, Truck, CreditCard, ChevronRight, ShoppingBag, Check } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [loading, setLoading] = useState(false);

    const [locationLoading, setLocationLoading] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Reverse Geocoding with OpenStreetMap
                const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                
                const addressObj = data.address;
                const newAddress = {
                    ...shippingAddress,
                    address: `${addressObj.road || ''}, ${addressObj.suburb || ''}, ${addressObj.neighbourhood || ''}`.replace(/^, |^, |, $/g, ''),
                    city: addressObj.city || addressObj.town || addressObj.village || addressObj.state_district || '',
                    state: addressObj.state || '',
                    postalCode: addressObj.postcode || '',
                    country: addressObj.country || 'India'
                };
                
                setShippingAddress(newAddress);
                showSuccess("Location fetched successfully!");
            } catch (error) {
                console.error(error);
                showError("Failed to fetch address details");
            } finally {
                setLocationLoading(false);
            }
        }, (error) => {
            console.error(error);
            showError("Unable to retrieve your location");
            setLocationLoading(false);
        });
    };

    const handlePostalCodeChange = async (code) => {
        setShippingAddress(prev => ({ ...prev, postalCode: code }));
        
        if (code.length === 6) {
            setLocationLoading(true);
            try {
                const { data } = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setShippingAddress(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State,
                        country: 'India', // API is specific to India
                        address: prev.address || postOffice.Name
                    }));
                    showSuccess(`Found: ${postOffice.District}, ${postOffice.State}`);
                } else {
                    showError("Invalid PIN Code");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLocationLoading(false);
            }
        }
    };
    
    // Country List
    const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "China", "Other"];

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setShippingAddress({ ...shippingAddress, phoneNumber: value });
    };

    const [paymentMethod, setPaymentMethod] = useState('UPI');

    // Calculate Totals
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = totalPrice > 500 ? 0 : 40;
    const finalAmount = totalPrice + shippingPrice;

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (shippingAddress.phoneNumber.length !== 10) {
            showError("Please enter a valid 10-digit phone number");
            return;
        }
        setStep(2);
    };

    const placeOrder = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.qty
                })),
                shippingAddress: {
                    ...shippingAddress,
                    email: shippingAddress.email || user?.email // Fallback to user email if missing
                },
                paymentMethod,
                itemsPrice: totalPrice,
                shippingPrice,
                taxPrice: 0,
                totalPrice: finalAmount,
            };

            const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/orders', orderData, config);

            showSuccess('Order Placed Automatically!');
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-8 pb-32">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Steps */}
                <div className="flex justify-center mb-12">
                     <div className="flex items-center w-full max-w-2xl relative">
                        {/* Connecting Lines */}
                        <div className="absolute left-0 top-5 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div 
                            className="absolute left-0 top-5 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500 ease-out"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        ></div>

                        {/* Step 1: Bag */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="mt-3 text-xs font-bold tracking-widest uppercase text-green-600">Bag</span>
                        </div>

                        {/* Step 2: Address */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${step >= 1 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                {step > 1 ? <Check className="w-6 h-6" /> : <Truck className="w-5 h-5" />}
                            </div>
                            <span className={`mt-3 text-xs font-bold tracking-widest uppercase transition-colors ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>Address</span>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${step >= 2 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className={`mt-3 text-xs font-bold tracking-widest uppercase transition-colors ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Forms */}
                    <div className="flex-1">
                        {step === 1 ? (
                            <div className="bg-white rounded p-6 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold font-['Outfit'] flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-pink-600" /> Shipping Details
                                    </h2>
                                    <button 
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        className="text-xs font-bold text-pink-600 border border-pink-200 bg-pink-50 px-3 py-2 rounded hover:bg-pink-100 transition-colors flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Use Current Location
                                    </button>
                                </div>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    {/* Personal Details */}
                                    {/* Contact Details (Read-only) */}
                                    <div className="bg-gray-50 p-4 rounded mb-4 border border-gray-100">
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Contact Information</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500 bg-white"
                                                    value={shippingAddress.name}
                                                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                                <input 
                                                    type="email" 
                                                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500 bg-white"
                                                    value={shippingAddress.email}
                                                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                                             <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500"
                                                value={shippingAddress.phoneNumber}
                                                onChange={handlePhoneChange}
                                                placeholder="10-digit mobile number"
                                                maxLength="10" 
                                                pattern="\d{10}"
                                                title="Please enter exactly 10 digits"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Gender</label>
                                            <div className="flex gap-4 mt-3">
                                                {['Male', 'Female', 'Other'].map(g => (
                                                    <label key={g} className="flex items-center cursor-pointer">
                                                        <input 
                                                            type="radio" 
                                                            name="gender" 
                                                            value={g}
                                                            checked={shippingAddress.gender === g}
                                                            onChange={(e) => setShippingAddress({...shippingAddress, gender: e.target.value})}
                                                            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                                                            required
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">{g}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-4 pt-4"></div>

                                    {/* Address Details */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Postal Code (PIN)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                required
                                                maxLength="6"
                                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => handlePostalCodeChange(e.target.value)}
                                                placeholder="Enter 6-digit PIN"
                                            />
                                            {locationLoading && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Address (House No, Building, Street)</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500"
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                            placeholder="Complete address with landmark"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City / District</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500 bg-gray-50"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500 bg-gray-50"
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Country</label>
                                        <select 
                                            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-pink-500 bg-white"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                                        >
                                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors mt-6 shadow-lg">
                                        Continue to Payment
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold font-['Outfit'] mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-pink-600" /> Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
                                        <label key={method} className={`flex items-center p-4 border rounded cursor-pointer transition-all ${paymentMethod === method ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value={method}
                                                checked={paymentMethod === method}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                                            />
                                            <span className="ml-3 font-medium text-gray-900">{method}</span>
                                        </label>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-lg mb-4">You are paying ₹{finalAmount.toLocaleString('en-IN')}</h3>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={placeOrder}
                                            disabled={loading}
                                            className="flex-1 bg-pink-600 text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full lg:w-80">
                        <div className="bg-white rounded p-4 shadow-sm border border-gray-200 sticky top-24">
                            <h4 className="font-bold text-xs uppercase text-gray-500 mb-4 tracking-wider">Order Summary</h4>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-3">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                                            <p className="text-xs font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    {shippingPrice === 0 ? <span className="text-green-600">FREE</span> : <span>₹{shippingPrice}</span>}
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-100 pt-3 mt-3">
                                    <span>Total</span>
                                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
