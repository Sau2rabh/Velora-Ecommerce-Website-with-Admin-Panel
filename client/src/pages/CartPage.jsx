import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const totalItems = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const mrp = Math.round(totalPrice * 1.4);
    const discount = mrp - totalPrice;
    const shipping = totalPrice > 500 ? 0 : 40;
    const finalAmount = totalPrice + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 pt-20">
                <ShoppingBag className="w-32 h-32 mb-4 text-gray-300" strokeWidth={1} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Hey, it feels so light!</h2>
                <p className="text-gray-500 text-sm mb-6">There is nothing in your bag. Let's add some items.</p>
                <Link to="/products" className="px-8 py-3 bg-pink-600 text-white font-bold rounded uppercase hover:bg-pink-700 transition-colors shadow-lg">
                    Add Items from Wishlist
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-8 pb-12">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Steps (Visual Only) */}
                <div className="flex justify-center mb-8 border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase">
                        <span className="text-green-600 border-b-2 border-green-600 pb-1">Bag</span>
                        <span className="text-gray-400">----------</span>
                        <span className="text-gray-400">Address</span>
                        <span className="text-gray-400">----------</span>
                        <span className="text-gray-400">Payment</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Cart Items */}
                    <div className="flex-1">
                        {/* Offers Header */}
                        <div className="border border-gray-200 rounded p-3 mb-4 flex items-center bg-white">
                            <Tag className="h-4 w-4 text-gray-700 mr-2" />
                            <span className="text-sm font-semibold text-gray-800">Available Offers</span>
                            <span className="ml-auto text-pink-600 font-bold text-xs cursor-pointer">Know More</span>
                        </div>

                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex border border-gray-200 rounded bg-white p-3 relative hover:shadow-sm transition-all duration-300">
                                    <Link to={`/product/${item._id}`} className="w-24 h-32 flex-shrink-0 bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </Link>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm text-gray-900">{item.brand || "Brand"}</h3>
                                                <p className="text-sm text-gray-600 mb-1 line-clamp-1">{item.name}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="bg-gray-100 px-2 py-1 text-xs font-bold rounded">Size: M</span>
                                            <div className="flex items-center bg-gray-100 px-2 py-1 text-xs font-bold rounded">
                                                <span>Qty:</span>
                                                <select 
                                                    className="bg-transparent outline-none ml-1 cursor-pointer" 
                                                    value={item.qty}
                                                    onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(x => <option key={x} value={x}>{x}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline space-x-2 mt-3">
                                            <span className="font-bold text-sm text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{Math.round(item.price * 1.4).toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-orange-500 font-bold">(40% OFF)</span>
                                        </div>
                                        
                                        <p className="text-[10px] text-gray-500 mt-1 flex items-center">
                                        <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />
                                        14 days return available
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Price Details */}
                    <div className="w-full lg:w-80">
                        <div className="border border-gray-200 rounded p-4 bg-white sticky top-24">
                            <h4 className="font-bold text-xs uppercase text-gray-500 mb-4 tracking-wider">Price Details ({totalItems} Items)</h4>
                            
                            <div className="space-y-3 mb-4 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Total MRP</span>
                                    <span>₹{mrp.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount on MRP</span>
                                    <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee</span>
                                    {shipping === 0 ? <span className="text-green-600">FREE</span> : <span>₹{shipping.toLocaleString('en-IN')}</span>}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4 text-gray-900">
                                <div className="flex justify-between font-bold text-lg mt-3">
                                    <span>Total Amount</span>
                                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="block w-full bg-pink-600 text-white font-bold py-3 text-center rounded uppercase tracking-widest hover:bg-pink-700 transition-colors shadow-md">
                                Place Order
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
