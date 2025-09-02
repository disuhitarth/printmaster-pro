'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, Package, FileText, User, Truck, Palette, Ruler, MapPin } from 'lucide-react';
import { generateJobCode } from '@/lib/utils';

interface CreateJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreate: (jobData: any) => Promise<void>;
}

interface LocationSpec {
  name: string;
  widthIn: number;
  heightIn: number;
  colors: number;
  pms: string[];
  underbase: boolean;
  halftoneLpi?: number;
  placementNote?: string;
}

export function CreateJobForm({ isOpen, onClose, onJobCreate }: CreateJobFormProps) {
  const [formData, setFormData] = useState({
    // Header fields (exact names from prompt)
    clientName: '',
    oeNumber: '',
    csrRepName: 'Sarah M.',
    
    // Product fields
    productId: '',
    qty: '',
    
    // Ship Date
    shipDate: '',
    
    // Courier
    courier: 'UPS Ground',
    
    // Client Request Options (exact names)
    rush24hr: false,
    prePro: false,
    needPhoto: false,
    
    // Notes
    notes: '',
    
    // Locations with printing specs
    locations: [] as LocationSpec[],
    
    // Size breakdown
    sizeBreakdown: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    },
  });

  const [currentLocation, setCurrentLocation] = useState<LocationSpec>({
    name: 'Front',
    widthIn: 0,
    heightIn: 0,
    colors: 1,
    pms: [''],
    underbase: false,
    halftoneLpi: 55,
    placementNote: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (size: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      sizeBreakdown: {
        ...prev.sizeBreakdown,
        [size]: value
      }
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setCurrentLocation(prev => ({ ...prev, [field]: value }));
  };

  const handlePMSChange = (index: number, value: string) => {
    const newPms = [...currentLocation.pms];
    newPms[index] = value;
    setCurrentLocation(prev => ({ ...prev, pms: newPms }));
  };

  const addPMSColor = () => {
    setCurrentLocation(prev => ({
      ...prev,
      pms: [...prev.pms, '']
    }));
  };

  const removePMSColor = (index: number) => {
    setCurrentLocation(prev => ({
      ...prev,
      pms: prev.pms.filter((_, i) => i !== index)
    }));
  };

  const addLocation = () => {
    if (currentLocation.name && currentLocation.widthIn > 0 && currentLocation.heightIn > 0) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, { ...currentLocation }]
      }));
      setCurrentLocation({
        name: formData.locations.length === 0 ? 'Back' : 'Sleeve',
        widthIn: 0,
        heightIn: 0,
        colors: 1,
        pms: [''],
        underbase: false,
        halftoneLpi: 55,
        placementNote: '',
      });
    }
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalQty = () => {
    return Object.values(formData.sizeBreakdown).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalQty = calculateTotalQty();
    if (totalQty === 0) {
      alert('Please specify quantities for at least one size.');
      return;
    }

    if (formData.locations.length === 0) {
      alert('Please add at least one print location.');
      return;
    }

    const jobData = {
      oeNumber: formData.oeNumber,
      clientId: 'client-1', // Using the test client we created
      csrId: 'cmeurjclm00018udrk39f1go4', // Using the CSR user ID we found
      shipDate: formData.shipDate,
      rush24hr: formData.rush24hr,
      prePro: formData.prePro,
      needPhoto: formData.needPhoto,
      productId: formData.productId,
      qtyTotal: totalQty.toString(),
      courier: formData.courier,
      notes: formData.notes,
      sizeBreakdown: formData.sizeBreakdown,
    };

    try {
      await onJobCreate(jobData);
      onClose();
      // Reset form
      setFormData({
        clientName: '',
        oeNumber: '',
        csrRepName: 'Sarah M.',
        productId: '',
        qty: '',
        shipDate: '',
        courier: 'UPS Ground',
        rush24hr: false,
        prePro: false,
        needPhoto: false,
        notes: '',
        locations: [],
        sizeBreakdown: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
      });
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating job. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Information */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Label htmlFor="clientName" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Client Name *
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="oeNumber" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    OE# *
                  </Label>
                  <Input
                    id="oeNumber"
                    value={formData.oeNumber}
                    onChange={(e) => handleInputChange('oeNumber', e.target.value)}
                    placeholder="e.g., OE-1029"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="csrRep" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-600" />
                    CSR Rep Name *
                  </Label>
                  <select
                    id="csrRep"
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={formData.csrRepName}
                    onChange={(e) => handleInputChange('csrRepName', e.target.value)}
                  >
                    <option value="Sarah M.">Sarah M.</option>
                    <option value="John D.">John D.</option>
                    <option value="Mike R.">Mike R.</option>
                  </select>
                </div>
                <div className="relative">
                  <Label htmlFor="shipDate" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Ship Date *
                  </Label>
                  <Input
                    id="shipDate"
                    type="date"
                    value={formData.shipDate}
                    onChange={(e) => handleInputChange('shipDate', e.target.value)}
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="bg-gradient-to-br from-white to-emerald-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Label htmlFor="productId" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    Product ID *
                  </Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    onChange={(e) => handleInputChange('productId', e.target.value)}
                    placeholder="e.g., G500 Black"
                    className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="courier" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Courier
                  </Label>
                  <select
                    id="courier"
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.courier}
                    onChange={(e) => handleInputChange('courier', e.target.value)}
                  >
                    <option value="UPS Ground">UPS Ground</option>
                    <option value="UPS Next Day">UPS Next Day</option>
                    <option value="FedEx Ground">FedEx Ground</option>
                    <option value="FedEx Express">FedEx Express</option>
                    <option value="Local Pickup">Local Pickup</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Request Options */}
          <Card className="bg-gradient-to-br from-white to-amber-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Client Request Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center space-x-3 p-4 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rush24hr}
                    onChange={(e) => handleInputChange('rush24hr', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-2 border-red-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-slate-700">24hr Turnaround</span>
                </label>
                <label className="flex items-center space-x-3 p-4 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prePro}
                    onChange={(e) => handleInputChange('prePro', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Pre-Pro</span>
                </label>
                <label className="flex items-center space-x-3 p-4 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.needPhoto}
                    onChange={(e) => handleInputChange('needPhoto', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Need Photo</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Size Breakdown */}
          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-600" />
                Size Breakdown (Qty)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(formData.sizeBreakdown).map(([size, qty]) => (
                  <div key={size} className="relative">
                    <Label htmlFor={`size-${size}`} className="text-sm font-semibold text-slate-700 mb-2 block text-center">{size}</Label>
                    <Input
                      id={`size-${size}`}
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) => handleSizeChange(size, parseInt(e.target.value) || 0)}
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center font-medium"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Badge variant="outline" className="text-lg px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-800">
                  Total: {calculateTotalQty()} pieces
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Print Locations */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Print Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Added Locations */}
              {formData.locations.length > 0 && (
                <div className="mb-6 space-y-3">
                  {formData.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{location.name}</Badge>
                        <span className="text-sm font-medium text-slate-700">
                          {location.widthIn}" × {location.heightIn}" • {location.colors} color{location.colors > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-slate-600">
                          {location.pms.filter(p => p).join(', ')}
                        </span>
                        {location.underbase && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Underbase</Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(index)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Location */}
              <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Add Print Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label htmlFor="locationName" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Location
                    </Label>
                    <select
                      id="locationName"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={currentLocation.name}
                      onChange={(e) => handleLocationChange('name', e.target.value)}
                    >
                      <option value="Front">Front</option>
                      <option value="Back">Back</option>
                      <option value="Sleeve">Sleeve</option>
                      <option value="Tag">Tag</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Label htmlFor="colors" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-purple-600" />
                      # of Colours
                    </Label>
                    <Input
                      id="colors"
                      type="number"
                      min="1"
                      value={currentLocation.colors}
                      onChange={(e) => {
                        const colors = parseInt(e.target.value) || 1;
                        setCurrentLocation(prev => ({
                          ...prev,
                          colors,
                          pms: Array(colors).fill('').map((_, i) => prev.pms[i] || '')
                        }));
                      }}
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="width" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4 text-green-600" />
                      Width (inches)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.25"
                      min="0"
                      value={currentLocation.widthIn}
                      onChange={(e) => handleLocationChange('widthIn', parseFloat(e.target.value) || 0)}
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="height" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4 text-green-600" />
                      Height (inches)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.25"
                      min="0"
                      value={currentLocation.heightIn}
                      onChange={(e) => handleLocationChange('heightIn', parseFloat(e.target.value) || 0)}
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* PMS Colors */}
                <div>
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    PMS Colours
                  </Label>
                  <div className="space-y-3">
                    {currentLocation.pms.map((pms, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          value={pms}
                          onChange={(e) => handlePMSChange(index, e.target.value)}
                          placeholder={`PMS Color ${index + 1}`}
                          className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                        {currentLocation.pms.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePMSColor(index)}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPMSColor}
                      className="bg-white/60 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label htmlFor="placementNote" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      Placement Note
                    </Label>
                    <Input
                      id="placementNote"
                      value={currentLocation.placementNote}
                      onChange={(e) => handleLocationChange('placementNote', e.target.value)}
                      placeholder="e.g., Center, 2″ below collar"
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="halftoneLpi" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-teal-600" />
                      Halftone LPI (optional)
                    </Label>
                    <Input
                      id="halftoneLpi"
                      type="number"
                      value={currentLocation.halftoneLpi || ''}
                      onChange={(e) => handleLocationChange('halftoneLpi', parseInt(e.target.value) || undefined)}
                      className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentLocation.underbase}
                      onChange={(e) => handleLocationChange('underbase', e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Requires Underbase</span>
                  </label>
                </div>

                <Button
                  type="button"
                  onClick={addLocation}
                  disabled={!currentLocation.name || currentLocation.widthIn <= 0 || currentLocation.heightIn <= 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any special instructions or notes..."
                rows={4}
                className="bg-white/80 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-6 -mx-6 -mb-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={calculateTotalQty() === 0 || formData.locations.length === 0}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-12 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </form>
      </div>
  );
}