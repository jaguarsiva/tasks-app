export enum TaskStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PUSHED = 'PUSHED',
  REMOVED = 'REMOVED'
}

export default interface Task {
  id: string;
  userId: number;
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
}
