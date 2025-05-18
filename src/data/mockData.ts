import { Department, Complaint } from '@/types';

export const departments: Department[] = [
  {
    id: '1',
    name: 'Public Works',
    categories: ['Infrastructure'],
  },
  {
    id: '2',
    name: 'Police Department',
    categories: ['Public Safety'],
  },
  {
    id: '3',
    name: 'Environmental Services',
    categories: ['Environmental'],
  },
  {
    id: '4',
    name: 'Social Services',
    categories: ['Social Services'],
  },
];

export const initialComplaints: Complaint[] = [
  {
    id: '1',
    fullName: 'John Doe',
    contactInfo: 'john@example.com',
    category: 'Infrastructure',
    description: 'Pothole on Main Street needs repair',
    status: 'Received',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    category: 'Public Safety',
    description: 'Street lights not working in downtown area',
    status: 'Under Review',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-15'),
  },
]; 