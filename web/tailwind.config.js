/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': 'var(--color-primary)',
                'brand-dark': 'var(--bg-dark)',
            }
        },
    },
    plugins: [],
}
