interface IRegisterFormFieldProps {
    label: string,
    error?: string,
    id: string,
    children: React.ReactNode
}

export const RegisterFormField = ({ label, error, id, children }: IRegisterFormFieldProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        
        <div className="relative">{children}</div>
        
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
);

export default RegisterFormField;
