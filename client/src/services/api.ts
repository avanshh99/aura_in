// API Configuration
// TODO: Replace with actual API Base URL provided by the user
const API_BASE_URL = 'https://api.medisentient.example.com/v1';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const api = {
    /**
     * Deploy staff to a specific department
     */
    deployStaff: async (department: string, count: number): Promise<ApiResponse<void>> => {
        try {
            // Mocking the request for now since we don't have the real endpoint yet
            console.log(`[API] POST ${API_BASE_URL}/staff/deploy`, { department, count });

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success (randomly fail 10% of the time for realism)
            if (Math.random() > 0.9) {
                throw new Error('Network congestion detected. Retry request.');
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    /**
     * Order supplies for the hospital
     */
    orderSupplies: async (item: string, quantity: number, priority: 'NORMAL' | 'URGENT'): Promise<ApiResponse<void>> => {
        try {
            console.log(`[API] POST ${API_BASE_URL}/supplies/order`, { item, quantity, priority });

            await new Promise(resolve => setTimeout(resolve, 2000));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
};
