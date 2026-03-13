import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { EXAM_TYPES } from "../../utils/constants";
import { loginSuccess } from "../../store/authSlice";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    examType: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      dispatch(loginSuccess(res.data));
      toast.success("Signed in with Google! Welcome to SmartPrep.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Google sign-in failed");
    }
  };

  const handleGoogleError = () =>
    toast.error("Google sign-in failed. Please try again.");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex bg-background">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
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
            Create your account
          </h2>
          <p className="text-text-muted mb-8">
            Join 10,000+ students on SmartPrep today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input-field"
                required
                id="register-name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="input-field"
                required
                id="register-email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="input-field pr-12"
                  required
                  minLength={8}
                  id="register-password"
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
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Exam Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXAM_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setForm({ ...form, examType: type.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${form.examType === type.value ? "border-primary-600 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <p className="font-semibold text-sm text-text-primary">
                      {type.label}
                    </p>
                    <p className="text-xs text-text-muted">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              id="register-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
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
                or sign up with
              </span>
            </div>
          </div>

          {/* Official Google Sign Up Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="rectangular"
              size="large"
              width="384"
              theme="outline"
            />
          </div>

          <p className="text-center text-text-muted mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Hero */}
      <div className="hidden lg:flex flex-1 auth-gradient flex-col items-center justify-between p-12 relative overflow-hidden">
        <div /> {/* Spacer for top */}
        <div className="text-center max-w-md z-10">
          <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-white text-xs font-semibold mb-6 backdrop-blur-sm">
            NEW: AI STUDY PLANNER
          </div>
          <h2 className="text-5xl font-bold text-white font-heading mb-6 leading-tight">
            Study Smarter,
            <br />
            Not Harder.
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Master your exams with personalized study paths, adaptive practice
            sessions, and real-time performance tracking.
          </p>
          <div className="flex gap-6 justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/20">
              <p className="text-3xl font-bold text-white font-mono">10K+</p>
              <p className="text-blue-200 text-sm mt-1">Active Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/20">
              <p className="text-3xl font-bold text-white font-mono">95%</p>
              <p className="text-blue-200 text-sm mt-1">Pass Rate</p>
            </div>
          </div>
        </div>
        {/* Social Proof Avatars */}
        <div className="w-full max-w-lg mt-16 z-10 text-center flex flex-col items-center">
          <div className="flex -space-x-3 mb-3">
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
            <img
              src="https://i.pravatar.cc/100?img=4"
              alt="Student"
              className="w-10 h-10 rounded-full border-2 border-primary-600"
            />
            <div className="w-10 h-10 rounded-full border-2 border-primary-600 bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
              +2k
            </div>
          </div>
          <p className="text-blue-200 text-sm">
            Join top students from 500+ universities
          </p>
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

export default Register;
