export default interface User {
  id: string;
  username: string;
  fullname: string;
  createdOn: string;
  gender: 'MALE' | 'FEMALE';
}
