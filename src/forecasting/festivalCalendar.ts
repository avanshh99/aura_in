// Festival calendar database (2024-2026)
export const FESTIVAL_CALENDAR = {
    2024: [
        { name: 'Makar Sankranti', date: '2024-01-15', surgeMultiplier: 1.3 },
        { name: 'Holi', date: '2024-03-25', surgeMultiplier: 1.8 },
        { name: 'Ram Navami', date: '2024-04-17', surgeMultiplier: 1.4 },
        { name: 'Eid al-Fitr', date: '2024-04-11', surgeMultiplier: 1.5 },
        { name: 'Independence Day', date: '2024-08-15', surgeMultiplier: 1.2 },
        { name: 'Ganesh Chaturthi', date: '2024-09-07', surgeMultiplier: 2.0 },
        { name: 'Dussehra', date: '2024-10-12', surgeMultiplier: 2.2 },
        { name: 'Diwali', date: '2024-11-01', surgeMultiplier: 3.0 },
        { name: 'Christmas', date: '2024-12-25', surgeMultiplier: 1.5 }
    ],
    2025: [
        { name: 'Makar Sankranti', date: '2025-01-14', surgeMultiplier: 1.3 },
        { name: 'Holi', date: '2025-03-14', surgeMultiplier: 1.8 },
        { name: 'Ram Navami', date: '2025-04-06', surgeMultiplier: 1.4 },
        { name: 'Eid al-Fitr', date: '2025-03-31', surgeMultiplier: 1.5 },
        { name: 'Independence Day', date: '2025-08-15', surgeMultiplier: 1.2 },
        { name: 'Ganesh Chaturthi', date: '2025-08-27', surgeMultiplier: 2.0 },
        { name: 'Dussehra', date: '2025-10-02', surgeMultiplier: 2.2 },
        { name: 'Diwali', date: '2025-10-20', surgeMultiplier: 3.0 },
        { name: 'Christmas', date: '2025-12-25', surgeMultiplier: 1.5 }
    ],
    2026: [
        { name: 'Makar Sankranti', date: '2026-01-14', surgeMultiplier: 1.3 },
        { name: 'Holi', date: '2026-03-04', surgeMultiplier: 1.8 },
        { name: 'Ram Navami', date: '2026-03-27', surgeMultiplier: 1.4 },
        { name: 'Eid al-Fitr', date: '2026-03-21', surgeMultiplier: 1.5 },
        { name: 'Independence Day', date: '2026-08-15', surgeMultiplier: 1.2 },
        { name: 'Ganesh Chaturthi', date: '2026-09-16', surgeMultiplier: 2.0 },
        { name: 'Dussehra', date: '2026-10-22', surgeMultiplier: 2.2 },
        { name: 'Diwali', date: '2026-11-08', surgeMultiplier: 3.0 },
        { name: 'Christmas', date: '2026-12-25', surgeMultiplier: 1.5 }
    ]
};

export interface Festival {
    name: string;
    date: string;
    surgeMultiplier: number;
}

/**
 * Get upcoming festivals within the next N days
 */
export function getUpcomingFestivals(daysAhead: number = 14): Festival[] {
    const now = new Date();
    const year = now.getFullYear();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const currentYearFestivals = FESTIVAL_CALENDAR[year as keyof typeof FESTIVAL_CALENDAR] || [];

    return currentYearFestivals.filter(festival => {
        const festivalDate = new Date(festival.date);
        return festivalDate >= now && festivalDate <= futureDate;
    });
}
