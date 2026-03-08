import { useState }                 from "react";
import { useNavigate, Link }        from "react-router-dom";
import logo                         from "@src/assets/logo.png";
import { Eye, EyeOff, Loader2, Mail, Lock, User }
                                    from "lucide-react";
import { toast }                    from "sonner";
import { GoogleIcon, GitHubIcon }   from "@src/pages/register/components/IconsOAuth";
import PasswordStrengthIndicator    from "@src/pages/register/components/PasswordStrengthIndicator";
import { RegisterFormField }        from "@src/pages/register/components/RegisterFormField";
import registerManager              from "@src/api/registerManager";
import { isValidEmail }             from "@src/commons/utils";
import { StatusCodes }              from "http-status-codes";
import { OAuthPlaceholder }         from "@src/pages/register/components/OAuthPlaceholder";

const Register = () => {
    /* "/register page" */

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /* validate form submissions */
    const validate = () => {
        const e: Record<string, string> = {};
        
        // name is not present
        if (!name.trim()) 
            e.name = "Name is required";
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
        // confirm password not provided
        if (!confirmPassword.length) 
            e.confirmPassword = "Please confirm your password";
        // password and confirmPassword do not match
        else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
        
        // set errors
        setErrors(e);

        // weather validation was successfull
        return Object.keys(e).length === 0;
    };

    /* Handle form submission */
    const handleSubmit = async (ev: React.FormEvent) => {
        // prevent the page from reloading, we shall handle the request ourself
        ev.preventDefault();
        
        setIsLoading(true);

        if (!validate()) {
            setIsLoading(false);
            return;
        }

        try {
            const resRegisterManager = await registerManager({
                name, email, password
            });
            toast.success("Account created successfully");
            // make the user login after registration
            navigate("/login");
        } 
        catch (err) {
            // axios throws an error when the returned status is no 2XX
            // https://axios-http.com/docs/handling_errors
            if (err.response?.status === StatusCodes.CONFLICT) {
                toast.error("An account with this email already exists.")
                setErrors({"general": "An account with this email already exists."});
                // ask the user to login, since account already exists
                navigate("/login");
            }
            else {
                // TODO: Find out what went wrong
                console.log(`Register request failed with error: ${err?.message}`);
                toast.error("Something went wrong");
            }

        }
        
        setIsLoading(false);

    };

    // quick form validity check for form enable / disable
    const isFormValid = name.trim() && email.trim() && password.length >= 8 && confirmPassword === password;


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

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
                <div className="w-full max-w-md">
                    
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <img src={logo} alt="Open Pocket" className="w-12 h-12" />
                        <span className="font-display text-2xl font-bold text-foreground">Open Pocket</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-bold text-foreground">Create your account</h2>
                        <p className="mt-2 text-muted-foreground">Start saving and organizing</p>
                    </div>

                    {errors.general && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 
                                        text-destructive text-sm" role="alert">
                            {errors.general}
                        </div>
                    )}

                    {/* OAuth placeholders */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <OAuthPlaceholder icon={<GoogleIcon />} label="Google" />
                        <OAuthPlaceholder icon={<GitHubIcon />} label="GitHub" />
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

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name */}
                        <RegisterFormField label="Name" error={errors.name} id="name">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                autoComplete="name"
                                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                                placeholder="John Doe"
                                aria-invalid={!!errors.name}
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground 
                                            placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 
                                            focus:border-primary transition-all"
                            />
                        </RegisterFormField>

                        {/* Email */}
                        <RegisterFormField label="Email" error={errors.email} id="email">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                                placeholder="username@example.com"
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground 
                                            placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                                            focus:ring-ring/30 focus:border-primary transition-all"
                            />
                        </RegisterFormField>

                        {/* Password */}
                        <RegisterFormField label="Password" error={errors.password} id="password">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                                    placeholder="••••••••••••••"
                                    aria-invalid={!!errors.password}
                                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-card text-foreground 
                                                placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                                                focus:ring-ring/30 focus:border-primary transition-all"
                                />
                                <button 
                                    type="button" onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                                    hover:text-foreground transition-colors" 
                                    aria-label={showPassword ? "Hide password" : "Show password"}>
                                        
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>                        
                            <PasswordStrengthIndicator password={password} />
                        </RegisterFormField>

                        {/* Confirm Password */}
                        <RegisterFormField label="Confirm Password" error={errors.confirmPassword} id="confirmPassword">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => { 
                                    setConfirmPassword(e.target.value); 
                                    setErrors((p) => ({ ...p, confirmPassword: "" })); 
                                }}
                                placeholder="••••••••••••••"
                                aria-invalid={!!errors.confirmPassword}
                                className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-card text-foreground 
                                placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 
                                focus:border-primary transition-all"
                            />
                            <button type="button" 
                                    onClick={() => setShowConfirm(!showConfirm)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                                    hover:text-foreground transition-colors" 
                                    aria-label={showConfirm ? "Hide password" : "Show password"}>
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </RegisterFormField>
                        
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold 
                                        hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 
                                        focus:ring-offset-2 disabled:opacity-60 transition-all flex items-center 
                                        justify-center gap-2 mt-2"
                        >
                            {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>) : "Create account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account? {" "}
                        <Link to="/login" className="text-primary font-semibold hover:text-primary/80 
                                            transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
