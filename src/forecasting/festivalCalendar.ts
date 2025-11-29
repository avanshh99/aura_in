import type { FestivalInfo } from './types';

/**
 * Static Indian festival calendar with health risk mappings
 */
const FESTIVAL_DATABASE: Omit<FestivalInfo, 'date'>[] = [
    {
        id: 'diwali',
        name: 'Diwali',
        region: 'Pan-India',
        healthRisks: ['Burns', 'Respiratory issues', 'Eye injuries', 'Noise-induced trauma'],
        affectedDepartments: ['Emergency', 'Pulmonology', 'Ophthalmology', 'Plastic Surgery'],
        historicalSurgeMultiplier: 3.0 // 300% increase
    },
    {
        id: 'holi',
        name: 'Holi',
        region: 'North India',
        healthRisks: ['Skin allergies', 'Eye irritation', 'Respiratory issues', 'Accidents'],
        affectedDepartments: ['Dermatology', 'Ophthalmology', 'Emergency'],
        historicalSurgeMultiplier: 1.8
    },
    {
        id: 'ganesh-chaturthi',
        name: 'Ganesh Chaturthi',
        region: 'Maharashtra, South India',
        healthRisks: ['Waterborne diseases', 'Accidents', 'Crowd-related injuries'],
        affectedDepartments: ['Emergency', 'General Medicine'],
        historicalSurgeMultiplier: 1.5
    },
    {
        id: 'durga-puja',
        name: 'Durga Puja',
        region: 'West Bengal, East India',
        healthRisks: ['Foodborne illnesses', 'Accidents', 'Crowd injuries'],
        affectedDepartments: ['Emergency', 'Gastroenterology'],
        historicalSurgeMultiplier: 1.6
    },
    {
        id: 'eid',
        name: 'Eid',
        region: 'Pan-India',
        healthRisks: ['Foodborne illnesses', 'Overeating complications'],
        affectedDepartments: ['Gastroenterology', 'General Medicine'],
        historicalSurgeMultiplier: 1.3
    },
    {
        id: 'christmas',
        name: 'Christmas',
        region: 'Pan-India',
        healthRisks: ['Alcohol-related incidents', 'Accidents'],
        affectedDepartments: ['Emergency'],
        historicalSurgeMultiplier: 1.2
    },
    {
        id: 'new-year',
        name: 'New Year',
        region: 'Pan-India',
        healthRisks: ['Alcohol-related incidents', 'Accidents', 'Hypothermia'],
        affectedDepartments: ['Emergency'],
        historicalSurgeMultiplier: 1.4
    }
];

/**
 * Approximate festival dates for 2025 (these would ideally come from an API or database)
 * Note: Indian festivals follow lunar calendar, so dates vary year to year
 */
const FESTIVAL_DATES_2025: Record<string, { month: number; day: number }> = {
    'diwali': { month: 10, day: 20 }, // October 20, 2025 (approximate)
    'holi': { month: 3, day: 14 }, // March 14, 2025
    'ganesh-chaturthi': { month: 8, day: 27 }, // August 27, 2025
    'durga-puja': { month: 9, day: 30 }, // September 30, 2025
    'eid': { month: 3, day: 30 }, // Eid al-Fitr (approximate)
    'christmas': { month: 12, day: 25 },
    'new-year': { month: 1, day: 1 }
};

/**
 * Get upcoming festivals within the next N days
 */
export function getUpcomingFestivals(
    daysAhead: number = 30,
    currentDate: Date = new Date()
): FestivalInfo[] {
    const upcoming: FestivalInfo[] = [];
    const currentYear = currentDate.getFullYear();

    for (const festivalData of FESTIVAL_DATABASE) {
        const dateInfo = FESTIVAL_DATES_2025[festivalData.id];
        if (!dateInfo) continue;

        // Create festival date for current year
        const festivalDate = new Date(currentYear, dateInfo.month - 1, dateInfo.day);

        // If festival has passed this year, check next year
        if (festivalDate < currentDate) {
            festivalDate.setFullYear(currentYear + 1);
        }

        // Calculate days until festival
        const daysUntil = Math.floor(
            (festivalDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Include if within the lookahead window
        if (daysUntil >= 0 && daysUntil <= daysAhead) {
            upcoming.push({
                ...festivalData,
                date: festivalDate
            });
        }
    }

    // Sort by date
    return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get festival by ID
 */
export function getFestivalById(id: string): FestivalInfo | null {
    const festivalData = FESTIVAL_DATABASE.find(f => f.id === id);
    if (!festivalData) return null;

    const dateInfo = FESTIVAL_DATES_2025[id];
    if (!dateInfo) return null;

    const currentYear = new Date().getFullYear();
    const festivalDate = new Date(currentYear, dateInfo.month - 1, dateInfo.day);

    return {
        ...festivalData,
        date: festivalDate
    };
}

/**
 * Get all festivals
 */
export function getAllFestivals(): FestivalInfo[] {
    return FESTIVAL_DATABASE.map(festivalData => {
        const dateInfo = FESTIVAL_DATES_2025[festivalData.id];
        const currentYear = new Date().getFullYear();
        const festivalDate = new Date(
            currentYear,
            dateInfo?.month ? dateInfo.month - 1 : 0,
            dateInfo?.day || 1
        );

        return {
            ...festivalData,
            date: festivalDate
        };
    });
}
