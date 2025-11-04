'use client';

import { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import { DesignationFormProps } from '@/app/utils/api/designation';

interface DesignationEntry {
  name: string;
  description: string;
}

const initialDesignationState: DesignationEntry = {
  name: '',
  description: ''
};

export default function DesignationForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: DesignationFormProps) {
  const [designations, setDesignations] = useState<DesignationEntry[]>([
    {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (initialData) {
      onSubmit(designations[0]);
    } else {
      const validDesignations = designations.filter(
        designation => designation.name.trim() !== ''
      );
      
      if (validDesignations.length > 0) {
        validDesignations.forEach(designation => onSubmit(designation));
      }
    }
    
    // Reset form after successful submission
    setDesignations([{ ...initialDesignationState }]);
    onClose();
  };

  const handleDesignationChange = (
    index: number, 
    field: keyof DesignationEntry, 
    value: string
  ): void => {
    setDesignations(prevDesignations => {
      const updatedDesignations = [...prevDesignations];
      updatedDesignations[index] = { 
        ...updatedDesignations[index], 
        [field]: value 
      };
      return updatedDesignations;
    });
  };

  const addDesignation = (): void => {
    setDesignations(prevDesignations => [
      ...prevDesignations, 
      { ...initialDesignationState }
    ]);
  };

  const removeDesignation = (index: number): void => {
    if (designations.length > 1) {
      setDesignations(prevDesignations => 
        prevDesignations.filter((_, i) => i !== index)
      );
    }
  };

  const getSubmitButtonText = (): string => {
    if (initialData) return 'Update';
    return designations.length > 1 
      ? `Create ${designations.length} Designations` 
      : 'Create Designation';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Designation' : 'Add New Designations'}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {designations.map((designation, index) => (
          <div 
            key={index} 
            className="relative p-3 border border-gray-200 rounded-lg space-y-3"
          >
            {!initialData && designations.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => removeDesignation(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                  aria-label={`Remove designation ${index + 1}`}
                >
                  ×
                </button>
                
                <div className="text-sm font-medium text-gray-600">
                  Designation {index + 1}
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Designation Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={designation.name}
                  onChange={(e) => handleDesignationChange(index, 'name', e.target.value)}
                  placeholder="Enter designation name"
                  required label={''}                />
              </div>
              
              <Input
                label="Description"
                value={designation.description}
                onChange={(e) => handleDesignationChange(index, 'description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
        ))}

        {!initialData && (
          <Button
            type="button"
            variant="secondary"
            onClick={addDesignation}
            className="w-full"
          >
            + Add Another Designation
          </Button>
        )}

        <div className="flex justify-end space-x-2 pt-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
