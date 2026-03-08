import { useState }             from "react";
import { useNavigate, Link }    from "react-router-dom";
import logo                     from "@src/assets/logo.png";
import { isValidEmail }         from "@src/commons/utils";
import { StatusCodes }          from "http-status-codes";
import { OAuthPlaceholder }     from "@src/pages/login/components/OAuthPlaceholder";
import loginManager             from "@src/api/loginManager";
import { toast }                from "@src/components/ui/sonner";
import { Eye, EyeOff, Loader2, Mail, Lock } 
                                from "lucide-react";
import { GitHubIcon, GoogleIcon, TwitterIcon } 
                                from "@src/pages/login/components/IconsOAuth";

const Login = () => {
    /* "/login" page */

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ 
        email?: string; 
        password?: string; 
        general?: string 
    }>({});

    /* validate form submissions */
    const validate = () => {
        const e: Record<string, string> = {};
        
        // email not provided
        if (!email.trim()) 
            e.email = "Email is required";
        // email is not valid
        else if (!isValidEmail(email)) 
            e.email = "Enter a valid email";

        // password not provided
        if (!password) 
            e.password = "Password is required";
        // password is too short
        else if (password.length < 8) 
            e.password = "Password must be at least 8 characters";
        
        // set errors
        setErrors(e);

        // weather validation was successfull
        return Object.keys(e).length === 0;
    };


    /* Handle form submission */
    const handleSubmit = async (ev: React.FormEvent) => {
        // prevent the page from reloading, we shall handle the request ourself
        ev.preventDefault();
        
        if (!validate())
            return;

        setIsLoading(true);

        try {
            const resLoginManager = await loginManager({
                email, password
            });
            
            /**
             * TODO: utilize the access token and refresh token returned here.
             * NOTE: The access token neeeds to be managed by react and the refresh
             * token shall be set in cookie. When the access token expires, the axios
             * interceptor shall automatically call /refresh endpoint
             */

            // navigate the user to home page after login
            navigate("/home");
        } 
        catch (err) {
            if (err.response?.status === StatusCodes.UNAUTHORIZED) {
                setErrors({"general": "The email address or password you entered is incorrect."});
            }
            else {
                // TODO: Find out what went wrong
                console.log(`Register request failed with error: ${err?.message}`);
                toast.error("Something went wrong");
            }

        }
        
        setIsLoading(false);

    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center
                            bg-gradient-to-b from-slate-800 via-slate-800 to-slate-800"
            >
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
                </div>

                {/* Logo and tagline */}
                <div className="relative z-10 text-center px-12 max-w-lg">
                    <img src={logo} alt="Open Pocket" className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl" />
                    <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">Open Pocket</h1>
                    <p className="text-primary-foreground/80 text-lg leading-relaxed">
                        Save URLs anywhere. Access URLs anywhere. 
                        Your personal reading  list, open and free.
                    </p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <img src={logo} alt="Open Pocket" className="w-12 h-12" />
                        <span className="font-display text-2xl font-bold text-foreground">Open Pocket</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-bold text-foreground">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
                    </div>

                    {errors.general && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 
                            text-destructive text-sm" role="alert">
                            {errors.general}
                        </div>
                    )}

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <OAuthPlaceholder icon={<GoogleIcon />} label="Google" />
                        <OAuthPlaceholder icon={<GitHubIcon />} label="GitHub" />
                        <OAuthPlaceholder icon={<TwitterIcon />} label="Twitter" />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-3 text-muted-foreground uppercase tracking-wider">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                       
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                                    placeholder="username@example.com"
                                    aria-invalid={!!errors.email}
                                    autoComplete="email"
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground 
                                                placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                                                focus:ring-ring/30 focus:border-primary transition-all"
                                />
                            </div>
                            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>

                                {/* TODO: add forgot password page */}
                                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                                    placeholder="••••••••••••••"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? "password-error" : "password-hint"}
                                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-card text-foreground 
                                                placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 
                                                focus:border-primary transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {errors.password ? (
                                <p id="password-error" className="mt-1.5 text-xs text-destructive">{errors.password}</p>
                            ) : (
                                <p id="password-hint" className="mt-1.5 text-xs text-muted-foreground">Minimum 8 characters</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-input text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                            />
                            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 
                                        focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 disabled:opacity-60 
                                        transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div >
        </div >
    );
};

export default Login;
