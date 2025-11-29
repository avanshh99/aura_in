import type { Season } from './types';

/**
 * Get current season based on month (Indian climate)
 */
export function getCurrentSeason(date: Date = new Date()): Season {
    const month = date.getMonth() + 1; // 1-12

    if (month >= 12 || month <= 2) {
        return 'WINTER'; // Dec, Jan, Feb
    } else if (month >= 3 && month <= 5) {
        return 'SUMMER'; // Mar, Apr, May
    } else if (month >= 6 && month <= 9) {
        return 'MONSOON'; // Jun, Jul, Aug, Sep
    } else {
        return 'POST_MONSOON'; // Oct, Nov
    }
}

/**
 * Get typical health risks for a season
 */
export function getSeasonalRiskFactors(season: Season): string[] {
    const riskMap: Record<Season, string[]> = {
        WINTER: [
            'Respiratory infections',
            'Influenza',
            'Pneumonia',
            'Air pollution effects',
            'Hypothermia (in some regions)'
        ],
        SUMMER: [
            'Heatstroke',
            'Dehydration',
            'Food poisoning',
            'Sunburn',
            'Heat exhaustion'
        ],
        MONSOON: [
            'Dengue',
            'Malaria',
            'Leptospirosis',
            'Waterborne diseases',
            'Fungal infections'
        ],
        POST_MONSOON: [
            'Dengue (continued)',
            'Viral fever',
            'Chikungunya',
            'Respiratory infections (onset)'
        ]
    };

    return riskMap[season];
}

/**
 * Get seasonal description
 */
export function getSeasonDescription(season: Season): string {
    const descriptions: Record<Season, string> = {
        WINTER: 'Winter season (Dec-Feb): Cold temperatures, high pollution in North India',
        SUMMER: 'Summer season (Mar-May): High temperatures, heat-related illnesses',
        MONSOON: 'Monsoon season (Jun-Sep): Heavy rainfall, vector-borne diseases peak',
        POST_MONSOON: 'Post-monsoon (Oct-Nov): Transition period, continued vector activity'
    };

    return descriptions[season];
}
