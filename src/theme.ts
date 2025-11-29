// Hospital-themed color palette
export const theme = {
    light: {
        // Primary - Medical Green/Blue
        primary: '#10B981',      // Emerald green
        primaryHover: '#059669', // Darker emerald
        primaryLight: '#D1FAE5', // Light emerald background

        // Secondary - Medical Cyan
        secondary: '#06B6D4',    // Cyan
        secondaryHover: '#0891B2',
        secondaryLight: '#CFFAFE',

        // Accent - Sky Blue
        accent: '#3B82F6',
        accentHover: '#2563EB',
        accentLight: '#DBEAFE',

        // Backgrounds
        bg: {
            primary: '#F9FAFB',    // Off-white
            secondary: '#FFFFFF',  // White
            tertiary: '#F3F4F6',   // Light gray
        },

        // Text
        text: {
            primary: '#1F2937',    // Dark gray
            secondary: '#6B7280',  // Medium gray
            tertiary: '#9CA3AF',   // Light gray
            inverse: '#FFFFFF',    // White
        },

        // Borders
        border: {
            light: '#E5E7EB',
            medium: '#D1D5DB',
            dark: '#9CA3AF',
        },

        // Status colors
        status: {
            success: {
                bg: '#D1FAE5',
                text: '#065F46',
                border: '#10B981',
            },
            warning: {
                bg: '#FEF3C7',
                text: '#92400E',
                border: '#F59E0B',
            },
            danger: {
                bg: '#FEE2E2',
                text: '#991B1B',
                border: '#EF4444',
            },
            info: {
                bg: '#DBEAFE',
                text: '#1E40AF',
                border: '#3B82F6',
            },
        },
    },

    dark: {
        // Primary
        primary: '#10B981',
        primaryHover: '#34D399',
        primaryLight: '#064E3B',

        // Secondary
        secondary: '#06B6D4',
        secondaryHover: '#22D3EE',
        secondaryLight: '#164E63',

        // Accent
        accent: '#3B82F6',
        accentHover: '#60A5FA',
        accentLight: '#1E3A8A',

        // Backgrounds
        bg: {
            primary: '#0F172A',    // Slate-950
            secondary: '#1E293B',  // Slate-800
            tertiary: '#334155',   // Slate-700
        },

        // Text
        text: {
            primary: '#F1F5F9',    // Off-white
            secondary: '#CBD5E1',  // Light slate
            tertiary: '#94A3B8',   // Medium slate
            inverse: '#0F172A',    // Dark slate
        },

        // Borders
        border: {
            light: '#334155',
            medium: '#475569',
            dark: '#64748B',
        },

        // Status colors (dark mode)
        status: {
            success: {
                bg: '#064E3B',
                text: '#86EFAC',
                border: '#10B981',
            },
            warning: {
                bg: '#78350F',
                text: '#FCD34D',
                border: '#F59E0B',
            },
            danger: {
                bg: '#7F1D1D',
                text: '#FCA5A5',
                border: '#EF4444',
            },
            info: {
                bg: '#1E3A8A',
                text: '#93C5FD',
                border: '#3B82F6',
            },
        },
    },
};

export type ThemeMode = 'light' | 'dark';
export type Theme = typeof theme.light;
