import type { Hospital } from '../types';

// Mock hospital data for the network
export const MOCK_HOSPITALS: Hospital[] = [
    {
        id: 'hosp-001',
        name: 'AIIMS Delhi',
        location: {
            lat: 28.5665,
            lng: 77.2102,
            city: 'Delhi',
            state: 'Delhi',
        },
        capacity: {
            beds: { total: 200, available: 4150 },
            icu: { total: 300, available: 45 },
            er: { total: 150, available: 20 },
        },
        staff: {
            doctors: { total: 600, onDuty: 180 },
            nurses: { total: 1500, onDuty: 450 },
        },
        inventory: {
            oxygenCylinders: 500,
            ventilators: 100,
            bloodUnits: 900,
            burnKits: 50,
        },
        currentOccupancy: 82,
        credentials: {
            username: 'aiims_delhi',
            passwordHash: 'demo123', // In real app, this would be hashed
        },
    },
    {
        id: 'hosp-002',
        name: 'Fortis Vasant Kunj',
        location: {
            lat: 28.5189,
            lng: 77.1575,
            city: 'Delhi',
            state: 'Delhi',
        },
        capacity: {
            beds: { total: 400, available: 120 },
            icu: { total: 50, available: 15 },
            er: { total: 30, available: 8 },
        },
        staff: {
            doctors: { total: 200, onDuty: 40 },
            nurses: { total: 280, onDuty: 90 },
        },
        inventory: {
            oxygenCylinders: 150,
            ventilators: 25,
            bloodUnits: 200,
            burnKits: 30,
        },
        currentOccupancy: 70,
        credentials: {
            username: 'fortis_vk',
            passwordHash: 'demo123',
        },
    },
    {
        id: 'hosp-003',
        name: 'Lilavati Hospital Mumbai',
        location: {
            lat: 19.0583,
            lng: 72.8323,
            city: 'Mumbai',
            state: 'Maharashtra',
        },
        capacity: {
            beds: { total: 323, available: 85 },
            icu: { total: 40, available: 10 },
            er: { total: 25, available: 5 },
        },
        staff: {
            doctors: { total: 100, onDuty: 35 },
            nurses: { total: 250, onDuty: 80 },
        },
        inventory: {
            oxygenCylinders: 120,
            ventilators: 20,
            bloodUnits: 150,
            burnKits: 20,
        },
        currentOccupancy: 74,
        credentials: {
            username: 'lilavati_mumbai',
            passwordHash: 'demo123',
        },
    },
    {
        id: 'hosp-004',
        name: 'Apollo Bangalore',
        location: {
            lat: 12.9249,
            lng: 77.6745,
            city: 'Bangalore',
            state: 'Karnataka',
        },
        capacity: {
            beds: { total: 550, available: 160 },
            icu: { total: 75, available: 22 },
            er: { total: 40, available: 12 },
        },
        staff: {
            doctors: { total: 180, onDuty: 60 },
            nurses: { total: 400, onDuty: 130 },
        },
        inventory: {
            oxygenCylinders: 250,
            ventilators: 40,
            bloodUnits: 350,
            burnKits: 35,
        },
        currentOccupancy: 71,
        credentials: {
            username: 'apollo_blr',
            passwordHash: 'demo123',
        },
    },
    {
        id: 'hosp-005',
        name: 'JIPMER Puducherry',
        location: {
            lat: 11.9362,
            lng: 79.7873,
            city: 'Puducherry',
            state: 'Puducherry',
        },
        capacity: {
            beds: { total: 1200, available: 280 },
            icu: { total: 150, available: 40 },
            er: { total: 80, available: 18 },
        },
        staff: {
            doctors: { total: 350, onDuty: 110 },
            nurses: { total: 800, onDuty: 250 },
        },
        inventory: {
            oxygenCylinders: 300,
            ventilators: 60,
            bloodUnits: 500,
            burnKits: 40,
        },
        currentOccupancy: 77,
        credentials: {
            username: 'jipmer_pondy',
            passwordHash: 'demo123',
        },
    },
];

export function getHospitalById(id: string): Hospital | undefined {
    return MOCK_HOSPITALS.find(h => h.id === id);
}

export function getHospitalByCredentials(username: string, password: string): Hospital | undefined {
    return MOCK_HOSPITALS.find(
        h => h.credentials?.username === username && h.credentials?.passwordHash === password
    );
}

export function getHospitalsByCity(city: string): Hospital[] {
    return MOCK_HOSPITALS.filter(h => h.location.city === city);
}
