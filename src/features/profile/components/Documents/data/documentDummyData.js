// data/documentDummyData.js

export const documentDummyData = [
  { 
    id: 1, 
    documentType: 'PASSPORT',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    fileName: 'PASSPORT_SHEFALI_GAJBHIYE.pdf', 
    type: 'PDF', 
    size: '3.2 MB', 
    uploadDate: '15/01/2024',
    expiryDate: '01/01/2025',
    category: 'Identity',
    shared: false
  },
  { 
    id: 2, 
    documentType: 'VISA',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    fileName: 'VISA_SHEFALI_GAJBHIYE.pdf', 
    type: 'PDF', 
    size: '2.1 MB', 
    uploadDate: '10/01/2024',
    expiryDate: '15/06/2024',
    category: 'Identity',
    shared: true
  },
  { 
    id: 3, 
    documentType: 'DRIVING_LICENSE',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    fileName: 'DRIVING_LICENSE_SHEFALI_GAJBHIYE.jpg', 
    type: 'JPG', 
    size: '1.8 MB', 
    uploadDate: '08/01/2024',
    expiryDate: '20/12/2025',
    category: 'Identity',
    shared: false
  },
  { 
    id: 4, 
    documentType: 'INSURANCE',
    firstName: 'SHEFALI',
    lastName: 'GAJBHIYE',
    fileName: 'INSURANCE_SHEFALI_GAJBHIYE.pdf', 
    type: 'PDF', 
    size: '890 KB', 
    uploadDate: '05/01/2024',
    expiryDate: '31/12/2024',
    category: 'Insurance',
    shared: false
  },
];

export const categories = ['all', 'Identity', 'Insurance', 'Financial', 'Tax', 'Contracts'];