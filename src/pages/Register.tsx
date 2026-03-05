import { useState }                 from "react";
import { useNavigate, Link }        from "react-router-dom";
import logo                         from "@src/assets/logo.png";
import { Eye, EyeOff, Loader2, Mail, Lock, User } 
                                    from "lucide-react";
import { toast }                    from "sonner";
import registerManager              from "@src/api/registerManager";
import { isValidEmail }             from "@src/commons/utils";
import PasswordStrengthIndicator    from "@src/components/auth/PasswordStrengthIndicator";

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
        ev.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        // here we nee to try to register
        setIsLoading(false);
    };

    const isFormValid = name.trim() && email.trim() && password.length >= 8 && confirmPassword === password;

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
                style={{ background: "linear-gradient(160deg, hsl(220 25% 14%) 0%, hsl(220 30% 22%) 50%, hsl(200 35% 28%) 100%)" }}
            >
                <div className="absolute inset-0 opacity-[0.07]">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
                </div>
                <div className="relative z-10 text-center px-12 max-w-lg">
                    <img src={logo} alt="Open Pocket" className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl" />
                    <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">Open Pocket</h1>
                    <p className="text-primary-foreground/80 text-lg leading-relaxed">
                        Save articles, videos, and stories from any publication, page, or app. Your personal reading list, open and free.
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
                        <p className="mt-2 text-muted-foreground">Start saving and organizing what matters.</p>
                    </div>

                    {errors.general && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
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
                            <span className="bg-background px-3 text-muted-foreground uppercase tracking-wider">or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name */}
                        <Field label="Name" error={errors.name} id="name">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                                placeholder="John Doe"
                                aria-invalid={!!errors.name}
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
                            />
                        </Field>

                        {/* Email */}
                        <Field label="Email" error={errors.email} id="email">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email}
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
                            />
                        </Field>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                                    placeholder="••••••••••••••"
                                    aria-invalid={!!errors.password}
                                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>}
                            <PasswordStrengthIndicator password={password} />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                                    placeholder="••••••••••••••"
                                    aria-invalid={!!errors.confirmPassword}
                                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showConfirm ? "Hide password" : "Show password"}>
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword}</p>}
                            {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                                <p className="mt-1.5 text-xs text-emerald-500">Passwords match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>) : "Create account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

/* Reusable field wrapper */
const Field = ({ label, error, id, children }: { label: string; error?: string; id: string; children: React.ReactNode }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        <div className="relative">{children}</div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
);

/* OAuth placeholder buttons */
const OAuthPlaceholder = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <button type="button" disabled className="flex items-center justify-center gap-2 h-11 rounded-lg border border-input bg-card text-muted-foreground text-sm font-medium opacity-60 cursor-not-allowed" aria-label={`Sign up with ${label} (coming soon)`}>
        {icon}<span>{label}</span><span className="text-[10px] opacity-70">Soon</span>
    </button>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);

const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
);

export default Register;
