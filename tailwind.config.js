/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#2a5e6f",
                "secondary": "#CCAB48",
                "background-light": "#fafaf9",
                "background-dark": "#232629",
                "card-light": "#ffffff",
                "card-dark": "#2d3135",
                "surface-light": "#ffffff",
                "surface-dark": "#2d3135",
                "accent": "#CCAB48",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "serif": ["Merriweather", "serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(42, 94, 111, 0.15)',
                'float': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
