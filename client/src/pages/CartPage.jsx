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
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-black pt-20 transition-colors duration-500">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full"></div>
                    <ShoppingBag className="w-32 h-32 text-gray-300 dark:text-gray-800 relative z-10" strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-['Outfit'] uppercase tracking-wider">Hey, it feels so light!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">There is nothing in your bag. Let's add some items.</p>
                <Link to="/products" className="group relative px-10 py-4 bg-black dark:bg-pink-600 text-white font-bold rounded-full uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-pink-500 transition-all shadow-xl overflow-hidden">
                    <span className="relative z-10">Explore Collections</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen pt-8 pb-20 transition-colors duration-500">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Steps (Visual Only) */}
                <div className="flex justify-center mb-12 border-b border-gray-200 dark:border-white/5 pb-6">
                    <div className="flex items-center space-x-4 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
                        <span className="text-pink-600 dark:text-pink-500 border-b-2 border-pink-600 dark:border-pink-500 pb-2">Bag</span>
                        <span className="text-gray-300 dark:text-gray-800">----------</span>
                        <span className="text-gray-400 dark:text-gray-600">Address</span>
                        <span className="text-gray-300 dark:text-gray-800">----------</span>
                        <span className="text-gray-400 dark:text-gray-600">Payment</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Cart Items */}
                    <div className="flex-1">
                        {/* Offers Header */}
                        <div className="border border-pink-100 dark:border-pink-500/20 rounded-2xl p-4 mb-6 flex items-center bg-white dark:bg-pink-500/5 backdrop-blur-md">
                            <Tag className="h-5 w-5 text-pink-600 dark:text-pink-400 mr-3" />
                            <div>
                                <span className="text-sm font-bold text-gray-800 dark:text-white block">Available Offers</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">10% Instant Discount on HDFC Cards</span>
                            </div>
                            <span className="ml-auto text-pink-600 dark:text-pink-400 font-bold text-xs cursor-pointer hover:underline uppercase tracking-tighter">Know More</span>
                        </div>

                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="group flex border border-gray-200 dark:border-white/5 rounded-2xl bg-white dark:bg-zinc-900/50 p-4 relative hover:shadow-xl hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-500 overflow-hidden">
                                     {/* Background Glow */}
                                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-pink-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                    <Link to={`/product/${item._id}`} className="w-28 h-36 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </Link>
                                    <div className="ml-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-base text-gray-900 dark:text-white font-['Outfit'] uppercase tracking-wide">{item.brand || "Brand"}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{item.name}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id, item.size)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-110 p-2">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 mt-2">
                                            {item.size && (
                                                <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg dark:text-gray-300 border border-gray-200 dark:border-white/5">Size: {item.size}</span>
                                            )}
                                            <div className="flex items-center bg-gray-100 dark:bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg dark:text-gray-300 border border-gray-200 dark:border-white/5">
                                                <span>Qty:</span>
                                                <select 
                                                    className="bg-transparent outline-none ml-1 cursor-pointer font-bold" 
                                                    value={item.qty}
                                                    onChange={(e) => updateQuantity(item._id, Number(e.target.value), item.size)}
                                                >
                                                    {[1, 2, 3, 4, 5].map(x => <option key={x} value={x} className="bg-white dark:bg-black">{x}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline space-x-3 mt-4">
                                            <span className="font-bold text-lg text-gray-900 dark:text-white font-['Outfit']">₹{item.price?.toLocaleString('en-IN')}</span>
                                            <span className="text-sm text-gray-400 line-through">₹{Math.round(item.price * 1.4).toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-pink-600 dark:text-pink-400 font-black uppercase tracking-tighter">40% OFF</span>
                                        </div>
                                        
                                        <div className="flex items-center mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest flex items-center">
                                                <ShieldCheck className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                                                14 days return available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Price Details */}
                    <div className="w-full lg:w-80">
                        <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl sticky top-24 shadow-sm">
                            <h4 className="font-black text-[10px] uppercase text-gray-400 dark:text-gray-500 mb-6 tracking-[0.2em]">Price Details ({totalItems} Items)</h4>
                            
                            <div className="space-y-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between font-medium">
                                    <span>Total MRP</span>
                                    <span>₹{mrp.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Discount on MRP</span>
                                    <span className="text-green-600 dark:text-green-400">-₹{discount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Platform Fee</span>
                                    <span className="text-green-600 dark:text-green-400 uppercase text-[10px] font-black tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Shipping Fee</span>
                                    {shipping === 0 ? <span className="text-green-600 dark:text-green-400 uppercase text-[10px] font-black tracking-widest">Free</span> : <span className="font-bold">₹{shipping.toLocaleString('en-IN')}</span>}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/5 pt-6 mb-8 text-gray-900 dark:text-white">
                                <div className="flex justify-between font-bold text-xl font-['Outfit']">
                                    <span className="uppercase tracking-tighter">Total Amount</span>
                                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="group relative block w-full bg-pink-600 text-white font-bold py-4 text-center rounded-xl uppercase tracking-[0.2em] text-xs hover:bg-pink-700 transition-all shadow-xl shadow-pink-600/20 overflow-hidden">
                                <span className="relative z-10">Place Order</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
