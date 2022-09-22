export default interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PUSHED' | 'REMOVED';
}
