
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Upload, User, Building, Shield, AlertCircle } from 'lucide-react';

const VendorRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    // Business Details
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    gstNumber: '',
    
    // Contact Person
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    designation: '',
    
    // Documents & Account
    panCard: null,
    gstCertificate: null,
    addressProof: null,
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const steps = [
    { number: 1, title: 'Business Details', icon: Building },
    { number: 2, title: 'Contact Person', icon: User },
    { number: 3, title: 'Documents & Account', icon: Shield }
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }

    if (step === 2) {
      if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
      if (!formData.contactPersonEmail) newErrors.contactPersonEmail = 'Contact email is required';
      if (!formData.contactPersonPhone) newErrors.contactPersonPhone = 'Contact phone is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
    }

    if (step === 3) {
      if (!formData.panCard) newErrors.panCard = 'PAN card is required';
      if (!formData.addressProof) newErrors.addressProof = 'Address proof is required';
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      console.log('Form submitted:', formData);
    }
  };

  const StepIndicator = ({ step, isActive, isCompleted }: { step: any, isActive: boolean, isCompleted: boolean }) => {
    const Icon = step.icon;
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
          isCompleted 
            ? 'bg-green-500 border-green-500 text-white' 
            : isActive 
              ? 'bg-slate-500 border-slate-500 text-white' 
              : 'bg-white border-slate-300 text-slate-400'
        }`}>
          {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${isActive ? 'text-slate-600' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
            Step {step.number}
          </p>
          <p className={`text-sm ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
            {step.title}
          </p>
        </div>
      </div>
    );
  };

  const InputField = ({ name, label, ...props }: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <Input
        name={name}
        value={formData[name as keyof typeof formData] as string}
        onChange={handleInputChange}
        className={`h-12 ${errors[name] ? 'border-red-500 focus:border-red-500' : ''}`}
        {...props}
      />
      {errors[name] && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Our Vendor Network</h1>
          <p className="text-slate-600">Complete the registration process to start selling with us</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <StepIndicator 
                  step={step} 
                  isActive={currentStep === step.number}
                  isCompleted={currentStep > step.number}
                />
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-3">
                {React.createElement(steps[currentStep - 1].icon, { size: 24 })}
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 1: Business Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="businessName"
                      label="Business Name"
                      placeholder="Enter your business name"
                      className="border border-slate-200"
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className={`w-full h-12 px-3 border rounded-md bg-white ${
                          errors.businessType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select business type</option>
                        <option value="retailer">Retailer</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="service-provider">Service Provider</option>
                      </select>
                      {errors.businessType && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                          <AlertCircle size={14} />
                          {errors.businessType}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="email"
                      label="Business Email"
                      type="email"
                      placeholder="business@example.com"
                      className="border border-slate-200"
                      required
                    />
                    
                    <InputField
                      name="phone"
                      label="Phone Number"
                      placeholder="+91 XXXXX XXXXX"
                      className="border border-slate-200"
                      required
                    />
                  </div>

                  <InputField
                    name="website"
                    label="Website"
                    placeholder="https://www.yourwebsite.com"
                    className="border border-slate-200"
                  />

                  <InputField
                    name="address"
                    label="Business Address"
                    placeholder="Enter complete business address"
                    className="border border-slate-200"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      name="city"
                      label="City"
                      placeholder="City"
                      className="border border-slate-200"
                      required
                    />
                    <InputField
                      name="state"
                      label="State"
                      placeholder="State"
                      className="border border-slate-200"
                      required
                    />
                    <InputField
                      name="zipCode"
                      label="ZIP Code"
                      placeholder="ZIP Code"
                      className="border border-slate-200"
                      required
                    />
                  </div>

                  <InputField
                    name="gstNumber"
                    label="GST Number"
                    placeholder="Enter GST number"
                    className="border border-slate-200"
                  />
                </div>
              )}

              {/* Step 2: Contact Person */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="contactPersonName"
                      label="Contact Person Name"
                      placeholder="Full name"
                      className="border border-slate-200"
                      required
                    />
                    
                    <InputField
                      name="designation"
                      label="Designation"
                      placeholder="Job title/designation"
                      className="border border-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="contactPersonEmail"
                      label="Contact Email"
                      type="email"
                      className="border border-slate-200"
                      placeholder="contact@example.com"
                      required
                    />
                    
                    <InputField
                      name="contactPersonPhone"
                      label="Contact Phone"
                      placeholder="+91 XXXXX XXXXX"
                      className="border border-slate-200"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Account */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-800 text-sm">
                      <strong>Document Requirements:</strong> Please upload clear, readable copies of the following documents. 
                      Accepted formats: PDF, JPG, PNG (Max size: 5MB each)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`border-2 border-dashed rounded-lg p-6 hover:border-slate-400 transition-colors ${
                      errors.panCard ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}>
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <label className="block text-sm font-medium text-slate-700 mt-2 mb-2">
                          PAN Card <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'panCard')}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                        />
                        {errors.panCard && (
                          <div className="flex items-center justify-center gap-1 mt-2 text-red-600 text-sm">
                            <AlertCircle size={14} />
                            {errors.panCard}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-slate-400 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <label className="block text-sm font-medium text-slate-700 mt-2 mb-2">
                          GST Certificate
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'gstCertificate')}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className={`border-2 border-dashed rounded-lg p-6 hover:border-slate-400 transition-colors md:col-span-2 ${
                      errors.addressProof ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}>
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <label className="block text-sm font-medium text-slate-700 mt-2 mb-2">
                          Address Proof <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'addressProof')}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                        />
                        {errors.addressProof && (
                          <div className="flex items-center justify-center gap-1 mt-2 text-red-600 text-sm">
                            <AlertCircle size={14} />
                            {errors.addressProof}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Setup</h3>
                    <div className="space-y-4">
                      <InputField
                        name="username"
                        label="Username"
                        placeholder="Choose a unique username"
                        className="border border-slate-200"
                        required
                      />

                      <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        className="border border-slate-200"
                        required
                      />
                      
                      <InputField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        className="border border-slate-200"
                        placeholder="Confirm your password"
                        required
                      />

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-slate-600 border-slate-300 rounded mt-1"
                          />
                          <label htmlFor="agreeTerms" className="ml-3 text-sm text-slate-700">
                            I agree to the <a href="#" className="text-slate-600 hover:underline">Terms and Conditions</a> and 
                            <a href="#" className="text-slate-600 hover:underline"> Privacy Policy</a>. I understand that my application 
                            will be reviewed and I will be notified of the decision via email. <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {errors.agreeTerms && (
                          <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                            <AlertCircle size={14} />
                            {errors.agreeTerms}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    Next
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit Application
                    <CheckCircle size={16} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;
