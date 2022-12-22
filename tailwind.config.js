/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                primary: '#2198F3',
                'primary-hover': '#0c85e2',
                secondary: '#6c757d',
                'secondary-hover': '#5a6268',
                success: '#52bf11',
                'success-hover': '#439c0e',
                info: '#BB1BF4',
                'info-hover': '#a70bde',
                warning: '#FF9A13',
                'warning-hover': '#ec8700',
                danger: '#FC1349',
                'danger-hover': '#e60338',
                dark: '#434a51',
                'dark-hover': '#32373c',
                light: '#fff',
                'light-hover': '#ececec'
            }
        },
    },
    plugins: [],
    variants: {
        backgroundColor: ["responsive", "dark", "hover"],
    },
};
