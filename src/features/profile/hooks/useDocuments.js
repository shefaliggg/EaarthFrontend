// hooks/useDocuments.js

import { useState } from 'react';
import { documentDummyData } from '../components/Documents/data/documentDummyData';

export const useDocuments = () => {
  const [documents, setDocuments] = useState(documentDummyData);
  const [loading, setLoading] = useState(false);

  // Future: Replace with actual API calls
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/documents');
      // setDocuments(response.data);
      setDocuments(documentDummyData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (documentData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/documents', documentData);
      // setDocuments([response.data, ...documents]);
      
      const newDoc = {
        id: documents.length + 1,
        ...documentData,
      };
      setDocuments([newDoc, ...documents]);
      return newDoc;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/documents/${docId}`);
      
      setDocuments(documents.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const shareDocument = async (docId) => {
    try {
      // TODO: Replace with actual API call
      // await api.patch(`/documents/${docId}/share`);
      
      setDocuments(documents.map(doc => 
        doc.id === docId ? { ...doc, shared: !doc.shared } : doc
      ));
    } catch (error) {
      console.error('Error sharing document:', error);
      throw error;
    }
  };

  const updateExpiry = async (docId, newExpiryDate) => {
    try {
      // TODO: Replace with actual API call
      // await api.patch(`/documents/${docId}`, { expiryDate: newExpiryDate });
      
      setDocuments(documents.map(doc => 
        doc.id === docId ? { ...doc, expiryDate: newExpiryDate } : doc
      ));
    } catch (error) {
      console.error('Error updating expiry:', error);
      throw error;
    }
  };

  return {
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    shareDocument,
    updateExpiry,
  };
};