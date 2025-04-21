export interface Task {
  id:number;
  title: string;
  description: string;
  status: string;
  responseType: string;
}

export interface InternshipAi {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  technology: string;
  companyName: string;
  category: string;
  active: boolean;
  taskAiList: Task[];
}
