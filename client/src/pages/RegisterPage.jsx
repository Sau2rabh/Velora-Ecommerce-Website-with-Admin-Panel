import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
             <img 
                src="https://t3.ftcdn.net/jpg/08/91/14/86/240_F_891148675_GhhKThFNjHOkSITtgoe51RCNxLqsY2O2.jpg" 
                alt="Background" 
                className="w-full h-full object-cover filter blur-[3px] scale-105"
            />
             <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-black/30 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-md border border-white/10 overflow-hidden group"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="text-center mb-10 relative">
            <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-gray-400 mb-2 tracking-tighter font-['Outfit'] drop-shadow-sm"
            >
                Velora.
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-pink-200/80 text-[10px] tracking-[0.3em] uppercase font-bold"
            >
                Join the Community
            </motion.p>
        </div>
        
        {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-100 px-4 py-3 rounded-xl relative mb-4 text-xs font-medium flex items-center justify-center shrink-0">
                {message}
            </motion.div>
        )}
        {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-100 px-4 py-3 rounded-xl relative mb-4 text-xs font-medium flex items-center justify-center shrink-0">
                {error}
            </motion.div>
        )}
        
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-4">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input 
                    type="text" 
                    id="name" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/40 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all duration-300 placeholder-gray-500 text-white text-sm shadow-inner group-hover:bg-gray-900/60"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input 
                    type="email" 
                    id="email" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/40 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all duration-300 placeholder-gray-500 text-white text-sm shadow-inner group-hover:bg-gray-900/60"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input 
                    type="password" 
                    id="password" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/40 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all duration-300 placeholder-gray-500 text-white text-sm shadow-inner group-hover:bg-gray-900/60"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/40 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all duration-300 placeholder-gray-500 text-white text-sm shadow-inner group-hover:bg-gray-900/60"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
             className="w-full flex justify-center items-center py-4 px-4 border border-white/10 rounded-2xl shadow-lg shadow-pink-900/20 text-sm font-bold uppercase tracking-widest text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed bg-[length:200%_auto] hover:bg-right mt-2"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : <span className="flex items-center gap-2">Register <ArrowRight className="h-4 w-4" /></span>}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="mt-6 text-sm text-gray-400">
            Have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="ml-2 font-bold text-white hover:text-pink-200 transition-colors">
                Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
