'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, User, Mail, Phone, MapPin, FileText, X } from 'lucide-react';

interface Client {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
  status?: 'active' | 'inactive';
}

interface ClientFormProps {
  client?: Client;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: Client) => Promise<void>;
  mode: 'create' | 'edit';
}

export function ClientForm({ client, isOpen, onClose, onSubmit, mode }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    notes: '',
    status: 'active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form data when client prop changes (for edit mode)
  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        contactPerson: client.contactPerson || '',
        notes: client.notes || '',
        status: client.status || 'active'
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        notes: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [client, mode, isOpen]);

  const handleInputChange = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to save client' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-6 h-6 text-indigo-600" />
              {mode === 'create' ? 'Add New Client' : 'Edit Client'}
            </h2>
            <p className="text-slate-600 mt-1">
              {mode === 'create' 
                ? 'Create a new client record for your business'
                : 'Update client information and preferences'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    Company Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Acme Corporation"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g., 123 Business Ave, New York, NY 10001"
                  className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactPerson" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="orders@company.com"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Notes & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 mb-2 block">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any special requirements, preferences, or notes about this client..."
                rows={4}
                className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            {errors.submit && (
              <p className="text-red-600 text-sm">{errors.submit}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Building className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Create Client' : 'Update Client'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}