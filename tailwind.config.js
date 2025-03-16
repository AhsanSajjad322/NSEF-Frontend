/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: {
                    DEFAULT: "#f9f9f9", // Very light grey background
                    darker: "#f0f0f0"
                },
                text: {
                    DEFAULT: "#212121", // Dark grey/Black text
                    light: "#757575", // Medium grey text
                },
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: '#ffffff', // White card background
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    50: '#e0f7fa',
                    100: '#b2ebf2',
                    200: '#80deea',
                    300: '#4dd0e1',
                    400: '#26c6da',
                    500: '#00bcd4', // Teal/Cyan - Sadapay Primary Accent
                    600: '#00acc1',
                    700: '#00838f',
                    800: '#006064',
                    900: '#004d40',
                    DEFAULT: '#00bcd4',
                    foreground: '#ffffff',
                },
                secondary: {
                    50: '#ffebee',
                    100: '#ffcdd2',
                    200: '#ef9a9a',
                    300: '#e57373',
                    400: '#ef5350',
                    500: '#f44336', // Use a red for destructive actions for now
                    600: '#e53935',
                    700: '#d32f2f',
                    800: '#c62828',
                    900: '#b71c1c',
                    DEFAULT: '#f44336',
                    foreground: '#ffffff',
                },
                muted: {
                    DEFAULT: '#e0e0e0', // Light grey for muted elements
                    foreground: '#9e9e9e'
                },
                accent: {
                    50: '#ffe0b2',
                    100: '#ffcc80',
                    200: '#ffb74d',
                    300: '#ffa726',
                    400: '#ff9800',
                    500: '#ff8f00', // Orange/Amber - Can be used for secondary accents
                    600: '#f57c00',
                    700: '#ef6c00',
                    800: '#e65100',
                    900: '#e64a19',
                    DEFAULT: '#ff8f00',
                    foreground: '#ffffff',
                },
                myGreen:{
                    900: "#10ccc3"
                },
                destructive: {
                    DEFAULT: '#f44336',
                    foreground: '#ffffff'
                },
                border: '#e0e0e0',
                input: '#f5f5f5',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}