import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, GraduationCap, Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(loginStart());
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      dispatch(loginSuccess(res.data));
      toast.success("Welcome! Signed in with Google.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Google login failed";
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await authService.login({ email, password });
      dispatch(loginSuccess(res.data));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex bg-background">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity tracking-wide"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-text-primary">
              SmartPrep
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-text-primary font-heading mb-2">
            Welcome Back
          </h2>
          <p className="text-text-muted mb-8">
            Continue your journey to academic excellence.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-11"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-text-primary">
                  Password
                </label>
                <span className="text-xs text-primary-600 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-12"
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="keep-signed-in"
                className="w-4 h-4 rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="keep-signed-in"
                className="text-sm text-text-muted cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              id="login-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Official Google Login Button - uses popup, no redirect_uri needed */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="continue_with"
              shape="rectangular"
              size="large"
              width="384"
              theme="outline"
            />
          </div>

          <p className="text-center text-text-muted mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:underline"
            >
              Register for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Hero */}
      <div className="hidden lg:flex flex-1 auth-gradient flex-col items-center justify-between p-12 relative overflow-hidden">
        <div /> {/* Spacer for top */}
        <div className="text-center max-w-md z-10">
          <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-white text-xs font-semibold mb-6 backdrop-blur-sm">
            🌐 GLOBAL STUDY PLATFORM
          </div>
          <h2 className="text-5xl font-bold text-white font-heading mb-6 leading-tight">
            Study Smarter,
            <br />
            Not Harder.
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Join thousands of students using AI-powered insights to master their
            exams and accelerate their careers.
          </p>
          <div className="flex gap-6 justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/20">
              <p className="text-3xl font-bold text-white font-mono">10K+</p>
              <p className="text-blue-200 text-sm mt-1">Active Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/20">
              <p className="text-3xl font-bold text-white font-mono">95%</p>
              <p className="text-blue-200 text-sm mt-1">Average Pass Rate</p>
            </div>
          </div>
        </div>
        {/* Testimonial Section */}
        <div className="w-full max-w-lg mt-16 z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=1"
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-primary-600"
              />
              <img
                src="https://i.pravatar.cc/100?img=2"
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-primary-600"
              />
              <img
                src="https://i.pravatar.cc/100?img=3"
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-primary-600"
              />
              <div className="w-10 h-10 rounded-full border-2 border-primary-600 bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                +2k
              </div>
            </div>
            <p className="text-blue-100 text-sm italic">
              "This platform changed how I prepare for my finals."
            </p>
          </div>
        </div>
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Login;
