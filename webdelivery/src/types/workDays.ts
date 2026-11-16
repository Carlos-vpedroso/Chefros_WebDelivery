export interface WorkDay {
  id: string;
  businessId: string;
  day: number;
  active: boolean;
  workHours: WorkHour[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkHour {
  id: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}
