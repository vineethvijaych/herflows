export interface CycleEntry {
  id: string;
  userId: string;
  date: Date;
  flowLevel?: string;
  mood?: string;
  symptoms: string[];
  notes?: string;
  createdAt: Date;
}

export interface CycleEstimate {
  id: string;
  userId: string;
  estimatedStartDate: Date;
  generatedAt: Date;
  disclaimerShown: boolean;
  disclaimerText: string;
}
