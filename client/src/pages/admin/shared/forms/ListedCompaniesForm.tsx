import { FormField } from '../FormField';
import { useState } from 'react';

interface ListedCompaniesFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const ListedCompaniesForm = ({
  formData,
  handleInputChange,
  errors = {}
}: ListedCompaniesFormProps) => {
  // Parse companies from JSON or use array
  const companiesArray = Array.isArray(formData.companies) 
    ? formData.companies 
    : (typeof formData.companies === 'string' ? JSON.parse(formData.companies || '[]') : []);

  const updateCompany = (index: number, field: string, value: any) => {
    const updated = [...companiesArray];
    if (!updated[index]) {
      updated[index] = { name: '', bse: null, nse: null };
    }
    if (field.startsWith('bse.')) {
      const bseField = field.split('.')[1];
      if (!updated[index].bse) updated[index].bse = { price: '', change: '', trend: 'down' };
      updated[index].bse[bseField] = value;
    } else if (field.startsWith('nse.')) {
      const nseField = field.split('.')[1];
      if (!updated[index].nse) updated[index].nse = { price: '', change: '', trend: 'down' };
      updated[index].nse[nseField] = value;
    } else {
      updated[index][field] = value;
    }
    handleInputChange('companies', JSON.stringify(updated));
  };

  const addCompany = () => {
    const updated = [...companiesArray, { name: '', bse: null, nse: null }];
    handleInputChange('companies', JSON.stringify(updated));
  };

  const removeCompany = (index: number) => {
    const updated = companiesArray.filter((_: any, i: number) => i !== index);
    handleInputChange('companies', JSON.stringify(updated));
  };

  const toggleBSE = (index: number) => {
    const updated = [...companiesArray];
    if (!updated[index]) updated[index] = { name: '', bse: null, nse: null };
    updated[index].bse = updated[index].bse ? null : { price: '', change: '', trend: 'down' };
    handleInputChange('companies', JSON.stringify(updated));
  };

  const toggleNSE = (index: number) => {
    const updated = [...companiesArray];
    if (!updated[index]) updated[index] = { name: '', bse: null, nse: null };
    updated[index].nse = updated[index].nse ? null : { price: '', change: '', trend: 'down' };
    handleInputChange('companies', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Companies
        </label>
        <div className="space-y-4">
          {companiesArray.map((company: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Company {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCompany(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  title="Remove company"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              
              <div className="space-y-3">
                <FormField
                  label="Company Name"
                  name={`company-${index}-name`}
                  value={company.name || ''}
                  onChange={(value) => updateCompany(index, 'name', value)}
                  required
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={!!company.bse}
                        onChange={() => toggleBSE(index)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">BSE</label>
                    </div>
                    {company.bse && (
                      <div className="space-y-2 pl-6">
                        <FormField
                          label="Price"
                          name={`company-${index}-bse-price`}
                          value={company.bse.price || ''}
                          onChange={(value) => updateCompany(index, 'bse.price', value)}
                        />
                        <FormField
                          label="Change"
                          name={`company-${index}-bse-change`}
                          value={company.bse.change || ''}
                          onChange={(value) => updateCompany(index, 'bse.change', value)}
                        />
                        <FormField
                          label="Trend"
                          name={`company-${index}-bse-trend`}
                          type="select"
                          value={company.bse.trend || 'down'}
                          onChange={(value) => updateCompany(index, 'bse.trend', value)}
                          options={[
                            { value: 'up', label: 'Up' },
                            { value: 'down', label: 'Down' }
                          ]}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={!!company.nse}
                        onChange={() => toggleNSE(index)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">NSE</label>
                    </div>
                    {company.nse && (
                      <div className="space-y-2 pl-6">
                        <FormField
                          label="Price"
                          name={`company-${index}-nse-price`}
                          value={company.nse.price || ''}
                          onChange={(value) => updateCompany(index, 'nse.price', value)}
                        />
                        <FormField
                          label="Change"
                          name={`company-${index}-nse-change`}
                          value={company.nse.change || ''}
                          onChange={(value) => updateCompany(index, 'nse.change', value)}
                        />
                        <FormField
                          label="Trend"
                          name={`company-${index}-nse-trend`}
                          type="select"
                          value={company.nse.trend || 'down'}
                          onChange={(value) => updateCompany(index, 'nse.trend', value)}
                          options={[
                            { value: 'up', label: 'Up' },
                            { value: 'down', label: 'Down' }
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addCompany}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Company
          </button>
        </div>
      </div>
      
      <FormField
        label="Disclaimer"
        name="disclaimer"
        type="textarea"
        rows={3}
        value={formData.disclaimer || ''}
        onChange={(value) => handleInputChange('disclaimer', value)}
        error={errors.disclaimer}
      />
    </div>
  );
};

