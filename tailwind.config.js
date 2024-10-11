/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./pages/**/*.js",
        "./components/**/*.js",
    ],
    theme: {
        colors: {
            "error": "#ff7575",
            "warning": "#ffb22e",
            "success": "#67bd61",
            "background": "#2f2f2f",
            "foreground": "#f4f1d6",
            "highlight": "#ffb22e",
            "primary": "#c03131",
            "dark": "#444444",
            "light": "#f4f1d6",
            "background-alt": "#202020",
        },
        extend: {},
    },
    plugins: [],
}

