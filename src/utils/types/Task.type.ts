export default interface Task {
  id: string;
  userId: number;
  title: string;
  description: string;
  date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PUSHED' | 'REMOVED';
}
