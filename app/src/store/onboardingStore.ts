import { create } from 'zustand';

interface OnboardingData {
    // Personal Info
    gender?: 'male' | 'female';
    name?: string;
    photoUrl?: string;
    dob?: Date;

    // Relationship Info
    relationshipStatus?: string;
    livingStyle?: string;
    anniversary?: Date;
    partnerName?: string;
}

interface OnboardingState extends OnboardingData {
    // Actions
    setGender: (gender: 'male' | 'female') => void;
    setPersonalInfo: (name: string, dob: Date, photoUrl?: string) => void;
    setRelationshipStatus: (status: string) => void;
    setLivingStyle: (style: string) => void;
    setAnniversary: (anniversary: Date, partnerName: string) => void;
    getAllData: () => OnboardingData;
    reset: () => void;
}

const initialState: OnboardingData = {
    gender: undefined,
    name: undefined,
    photoUrl: undefined,
    dob: undefined,
    relationshipStatus: undefined,
    livingStyle: undefined,
    anniversary: undefined,
    partnerName: undefined,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    ...initialState,

    setGender: (gender) => set({ gender }),

    setPersonalInfo: (name, dob, photoUrl) => set({ name, dob, photoUrl }),

    setRelationshipStatus: (relationshipStatus) => set({ relationshipStatus }),

    setLivingStyle: (livingStyle) => set({ livingStyle }),

    setAnniversary: (anniversary, partnerName) => set({ anniversary, partnerName }),

    getAllData: () => {
        const state = get();
        return {
            gender: state.gender,
            name: state.name,
            photoUrl: state.photoUrl,
            dob: state.dob,
            relationshipStatus: state.relationshipStatus,
            livingStyle: state.livingStyle,
            anniversary: state.anniversary,
            partnerName: state.partnerName,
        };
    },

    reset: () => set(initialState),
}));
