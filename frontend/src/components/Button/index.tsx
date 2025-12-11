import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline-danger' | 'outline-primary' | 'outline-dark';
    children: ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
    return (
        <button className={`btn btn-${variant} ${className || ''}`} {...props}>
            {children}
        </button>
    );
}