import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => (
        <div className={className}>
            <label className="form-label">{label}</label>
            <input ref={ref} className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
);