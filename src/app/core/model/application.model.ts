// application.model.ts
export interface Application {
  id: number;
  coverLetter: string;
  cv: string;
  statusApplication: string;
  user: any; // Define the User model as needed
  offer: any; // Define the Offer model as needed
}
