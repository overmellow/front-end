import { Types } from 'mongoose';

export interface SessionI {
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  expires: string;
}
