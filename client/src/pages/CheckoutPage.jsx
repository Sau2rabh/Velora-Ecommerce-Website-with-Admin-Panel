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
        <div className="bg-gray-50 dark:bg-black min-h-screen pt-8 pb-32 transition-colors duration-500">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Steps */}
                <div className="flex justify-center mb-8 md:mb-12">
                     <div className="flex items-center w-full max-w-xl md:max-w-2xl relative px-2">
                        {/* Connecting Lines */}
                        <div className="absolute left-8 md:left-0 top-5 w-[calc(100%-64px)] md:w-full h-1 bg-gray-200 dark:bg-zinc-900 -z-10 rounded-full shadow-inner"></div>
                        <div 
                            className="absolute left-8 md:left-0 top-5 h-1 bg-pink-600 -z-10 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        ></div>

                        {/* Step 1: Bag */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] transform transition-all hover:scale-110">
                                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="mt-2 md:mt-3 text-[8px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-pink-600">Bag</span>
                        </div>

                        {/* Step 2: Address */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${step >= 1 ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-700'}`}>
                                {step > 1 ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Truck className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                            <span className={`mt-2 md:mt-3 text-[8px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors duration-500 ${step >= 1 ? 'text-pink-600' : 'text-gray-400 dark:text-gray-700'}`}>Address</span>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${step >= 2 ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-700'}`}>
                                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className={`mt-2 md:mt-3 text-[8px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors duration-500 ${step >= 2 ? 'text-pink-600' : 'text-gray-400 dark:text-gray-700'}`}>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left Side: Forms */}
                    <div className="flex-1">
                        {step === 1 ? (
                            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/5">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold font-['Outfit'] flex items-center gap-3 dark:text-white uppercase tracking-tight">
                                        <div className="p-2 bg-pink-500/10 rounded-lg">
                                            <Truck className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        Shipping Details
                                    </h2>
                                    <button 
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-500/20 bg-pink-50 dark:bg-pink-500/5 px-4 py-2.5 rounded-full hover:bg-pink-100 dark:hover:bg-pink-500/10 transition-all flex items-center gap-2 hover:scale-105"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Detect Location
                                    </button>
                                </div>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    {/* Personal Details */}
                                    {/* Contact Details (Read-only) */}
                                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl mb-6 border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-4 tracking-[0.2em]">Personal Information</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner"
                                                    value={shippingAddress.name}
                                                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner"
                                                    value={shippingAddress.email}
                                                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Mobile Number</label>
                                             <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner"
                                                value={shippingAddress.phoneNumber}
                                                onChange={handlePhoneChange}
                                                placeholder="10-digit mobile number"
                                                maxLength="10" 
                                                pattern="\d{10}"
                                                title="Please enter exactly 10 digits"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Gender</label>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                {['Male', 'Female', 'Other'].map(g => (
                                                    <label key={g} className="group/radio flex items-center cursor-pointer bg-gray-50 dark:bg-black/40 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-pink-500/30 transition-all min-w-[100px] flex-1">
                                                        <input 
                                                            type="radio" 
                                                            name="gender" 
                                                            value={g}
                                                            checked={shippingAddress.gender === g}
                                                            onChange={(e) => setShippingAddress({...shippingAddress, gender: e.target.value})}
                                                            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                                                            required
                                                        />
                                                        <span className={`ml-2 text-[10px] md:text-xs font-bold uppercase tracking-wider ${shippingAddress.gender === g ? 'text-pink-600' : 'text-gray-500 dark:text-gray-600'}`}>{g}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>



                                    {/* Address Details */}
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Postal Code (PIN)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                required
                                                maxLength="6"
                                                className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => handlePostalCodeChange(e.target.value)}
                                                placeholder="6-digit PIN"
                                            />
                                            {locationLoading && <div className="absolute right-4 top-4 w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Complete Address</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner"
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                            placeholder="House No, Building, Street, Area"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">City / District</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner font-bold"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">State</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner font-bold"
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-widest">Country</label>
                                        <select 
                                            className="w-full border border-gray-200 dark:border-white/5 rounded-xl p-4 focus:outline-none focus:border-pink-500 bg-white dark:bg-black/40 text-gray-900 dark:text-white transition-all shadow-inner appearance-none"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                                        >
                                            {countries.map(c => <option key={c} value={c} className="bg-white dark:bg-black">{c}</option>)}
                                        </select>
                                    </div>

                                    <button type="submit" className="group relative w-full bg-black dark:bg-pink-600 text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-gray-800 dark:hover:bg-pink-500 transition-all mt-8 shadow-xl shadow-pink-600/10 overflow-hidden">
                                        <span className="relative z-10">Continue to Payment</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                    </button>
                                </form>
                            </div>
                         ) : (
                            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-white/5">
                                <h2 className="text-2xl font-bold font-['Outfit'] mb-8 flex items-center gap-3 dark:text-white uppercase tracking-tight">
                                    <div className="p-2 bg-pink-500/10 rounded-lg">
                                        <CreditCard className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    Payment Method
                                </h2>
                                <div className="space-y-4">
                                    {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
                                        <label key={method} className={`flex items-center p-5 border rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-pink-500 bg-pink-50 dark:bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.1)]' : 'border-gray-100 dark:border-white/5 dark:bg-black/20 hover:border-gray-300 dark:hover:border-white/20'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value={method}
                                                checked={paymentMethod === method}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                                            />
                                            <span className={`ml-4 font-bold uppercase tracking-widest text-sm ${paymentMethod === method ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-600'}`}>{method}</span>
                                        </label>
                                    ))}
                                </div>
                                
                                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
                                    <h3 className="font-black text-[10px] uppercase text-gray-400 dark:text-gray-500 mb-6 tracking-[0.3em]">Confirmation</h3>
                                    <p className="text-lg font-bold mb-8 dark:text-white uppercase tracking-tighter">You are paying ₹{finalAmount.toLocaleString('en-IN')}</p>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={placeOrder}
                                            disabled={loading}
                                            className="flex-1 group relative bg-black dark:bg-pink-600 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-800 dark:hover:bg-pink-500 transition-all shadow-xl shadow-pink-600/10 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            <span className="relative z-10">{loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Place Order'}</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full xl:w-96">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5 xl:sticky xl:top-24">
                            <h4 className="font-black text-[10px] uppercase text-gray-400 dark:text-gray-500 mb-6 tracking-[0.2em]">Order Summary</h4>
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0 border border-gray-100 dark:border-white/5 shadow-inner">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 uppercase tracking-tight font-['Outfit']">{item.name}</p>
                                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mt-1 tracking-widest">Qty: {item.qty}</p>
                                            <p className="text-xs font-bold mt-1 dark:text-pink-400">₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-100 dark:border-white/5 pt-6 space-y-3 text-xs">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                    <span>Shipping</span>
                                    {shippingPrice === 0 ? <span className="text-green-600 dark:text-green-400 font-black">Free</span> : <span className="font-bold">₹{shippingPrice}</span>}
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white border-t border-gray-100 dark:border-white/5 pt-6 mt-6">
                                    <span className="uppercase tracking-tighter font-['Outfit']">Total</span>
                                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-pink-500/5 rounded-xl border border-pink-500/10 hidden lg:block">
                                <p className="text-[10px] text-pink-600 dark:text-pink-400 font-black uppercase tracking-widest text-center">
                                    Safe & Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
