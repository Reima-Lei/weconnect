import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const [randomImage, setRandomImage] = useState("");
  const images = [
    "/images/login_img.png",
    "/images/login_img2.png",
    "/images/login_img3.png",
    "/images/ai_slop.png",
    "/images/layla_ml.png",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[600px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">Login to access to your account</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
                {/* SIGNUP LINK */}
                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign up
                  </Link>
                </div>
              </div>
            </div>
            {/* IMAGE COLUMN - RIGHT SIDE */}
            <div className="hidden md:flex md:w-1/2 items-center flex-col justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              {randomImage && (
                <img
                  src={randomImage}
                  alt="Sign up illustration"
                  className="w-3/4 h-auto object-cover"
                />
              )}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">Connect Anytime, Anywhere</h3>

                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Secure</span>
                  <span className="auth-badge">Fast</span>
                  <span className="auth-badge">Reliable</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;
