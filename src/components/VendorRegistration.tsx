import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { uploadToCloudinary } from '@/lib/cloudinaryService';
import { ErrorDialog } from "@/components/ErrorDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Upload, Check, User, FileText, Shield, AlertCircle, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const businessDetailsSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  businessAddress: z.string().min(5, 'Business address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipcode: z.string().min(5, 'Zipcode must be at least 5 characters'),
  gstNumber: z.string().optional(),
});

const contactDetailsSchema = z.object({
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonEmail: z.string().email('Please enter a valid email address'),
  contactPersonPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  designation: z.string().min(2, 'Designation is required'),
});

const accountDetailsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BusinessDetailsForm = z.infer<typeof businessDetailsSchema>;
type ContactDetailsForm = z.infer<typeof contactDetailsSchema>;
type AccountDetailsForm = z.infer<typeof accountDetailsSchema>;

const designationOptions = [
  'CEO/Managing Director',
  'General Manager',
  'Operations Manager',
  'Sales Manager',
  'Marketing Manager',
  'Business Development Manager',
  'Project Manager',
  'Team Lead',
  'Senior Executive',
  'Executive',
  'Owner',
  'Partner',
  'Director',
  'Other'
];

const VendorRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessTypes, setBusinessTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  type UploadedFileMeta = {
    name: string;
    url: string;
  };


  type UploadedFiles = {
      panCard?: UploadedFileMeta;
      gstCertificate?: UploadedFileMeta;
      addressProof?: UploadedFileMeta;
      [key: string]: UploadedFileMeta | undefined;
  };


  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});

  const [fileErrors, setFileErrors] = useState({
    panCard: '',
    gstCertificate: '',
    addressProof: '',
  });
  const [fileUploadStatus, setFileUploadStatus] = useState({
    panCard: 'idle' as 'idle' | 'uploading' | 'success' | 'error',
    gstCertificate: 'idle' as 'idle' | 'uploading' | 'success' | 'error',
    addressProof: 'idle' as 'idle' | 'uploading' | 'success' | 'error',
  });
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const { toast } = useToast();


  const businessForm = useForm<BusinessDetailsForm>({
    resolver: zodResolver(businessDetailsSchema),
    mode: 'onBlur',
  });

  const contactForm = useForm<ContactDetailsForm>({
    resolver: zodResolver(contactDetailsSchema),
    mode: 'onBlur',
  });

  const accountForm = useForm<AccountDetailsForm>({
    resolver: zodResolver(accountDetailsSchema),
    mode: 'onBlur',
  });

  const validateFile = (file: File, type: string): string => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, JPG, JPEG, PNG files are allowed';
    }
    
    return '';
  };

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await businessForm.trigger();
      if (isValid && selectedBusinessType && !completedSteps.includes(1)) {
        setCompletedSteps([...completedSteps, 1]);
      }
    } else if (currentStep === 2) {
      isValid = await contactForm.trigger();
      if (isValid && selectedDesignation && !completedSteps.includes(2)) {
        setCompletedSteps([...completedSteps, 2]);
      }
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {

      const isValid = await accountForm.trigger();
    
      // Validate required files
      let hasFileErrors = false;
      const requiredFiles = ['panCard', 'gstCertificate', 'addressProof'] as const;
      const newFileErrors = { panCard: '', gstCertificate: '', addressProof: '' };
      
      requiredFiles.forEach(fileType => {
        if (!uploadedFiles[fileType]) {
          newFileErrors[fileType] = 'This document is required';
          hasFileErrors = true;
        }
      });
      
      setFileErrors(newFileErrors);
      
      if (isValid && !hasFileErrors) {
      // COMMENTED SAVE LOGIC WITH CLOUDINARY INTEGRATION:
        
        try {
          
          // Step 2: Prepare complete form data with uploaded file URLs
          const formData = {
            // Business Details
            businessName: businessForm.getValues().businessName,
            businessType: selectedBusinessType,
            website: businessForm.getValues().website,
            email: businessForm.getValues().email,
            phoneNumber: businessForm.getValues().phoneNumber,
            businessAddress: businessForm.getValues().businessAddress,
            city: businessForm.getValues().city,
            state: businessForm.getValues().state,
            zipcode: businessForm.getValues().zipcode,
            gstNumber: businessForm.getValues().gstNumber,
            
            // Contact Details
            contactPersonName: contactForm.getValues().contactPersonName,
            contactPersonEmail: contactForm.getValues().contactPersonEmail,
            contactPersonPhone: contactForm.getValues().contactPersonPhone,
            designation: selectedDesignation,
            
            // Account Details
            username: accountForm.getValues().username,
            password: accountForm.getValues().password,
            
            // Uploaded Documents URLs from Cloudinary
            documents: {
              panCardUrl: uploadedFiles.panCard?.url|| null,
              gstCertificateUrl: uploadedFiles.gstCertificate?.url || null,
              addressProofUrl: uploadedFiles.addressProof?.url || null,
            },
            
            // Metadata
            submittedAt: new Date().toISOString(),
            status: 'pending_review'
          };
          
          console.log('Complete form data to save:', formData);
          
          // Step 3: Save vendor registration to database/API
          const result = await fetch('/api/vendors/vendor-registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          if (!result.ok) {
            const errorData = await result.json();
            throw new Error(errorData?.error || "Registration failed");
          }

          const savedVendor = await result.json();
          console.log('Vendor registration saved successfully:', savedVendor);
          
          toast({
            title: "Application Submitted Successfully!",
            description: "Your vendor registration has been submitted. You will receive a confirmation email shortly.",
          });
          
        } catch (error: any) {
          setErrorMessage(error.message || "Something went wrong.");
          setErrorDialogOpen(true);
          toast({
            title: "Submission Failed",
            description: "There was an error submitting your application. Please try again.",
            variant: "destructive",
          });
          return;
        }
        // STATIC SUCCESS MESSAGE (UNCOMMENTED FOR DEMO)
        toast({
          title: "Application Submitted!",
          description: "Your vendor registration has been submitted successfully.",
        });

        // Reset all form states
        businessForm.reset();
        contactForm.reset();
        accountForm.reset();

        setUploadedFiles({
          panCard:{ name: '', url: '' },
          gstCertificate: { name: '', url: '' },
          addressProof: { name: '', url: '' },
        });

        setFileErrors({
          panCard: '',
          gstCertificate: '',
          addressProof: '',
        });
        setFileUploadStatus({
          panCard: 'idle',
          gstCertificate: 'idle',
          addressProof: 'idle',
        });

        // ✅ CLEAR SELECTED DROPDOWN VALUES
        setSelectedBusinessType('');     // or null based on your default state
        setSelectedDesignation('');      // or null

        // ✅ RESET CURRENT STEP AND COMPLETION
        setCurrentStep(1);
        setCompletedSteps([]);

        // ✅ CLEAR ANY OTHER STATES IF NEEDED
        setErrorMessage('');
        setErrorDialogOpen(false);

        // Mark step 3 as completed
        if (!completedSteps.includes(3)) {
          setCompletedSteps([...completedSteps, 3]);
        }
      }
    } 
    catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
      setErrorDialogOpen(true);
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (
    field: keyof UploadedFiles,
    files: FileList | null
  ) => {
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file, String(field));

      if (error) {
        setFileErrors(prev => ({ ...prev, [field]: error }));
        setFileUploadStatus(prev => ({ ...prev, [field]: 'error' }));
        return;
      }

      setFileUploadStatus(prev => ({ ...prev, [field]: 'uploading' }));

      try {
        const uploadResult = await uploadToCloudinary(file);

        const fileMeta: UploadedFileMeta = {
          name: uploadResult.original_filename,
          url: uploadResult.secure_url,
        };

        setUploadedFiles(prev => ({ ...prev, [field]: fileMeta }));
        setFileErrors(prev => ({ ...prev, [field]: '' }));
        setFileUploadStatus(prev => ({ ...prev, [field]: 'success' }));

        toast({
          title: 'File Uploaded Successfully',
          description: `${field} uploaded: ${fileMeta.name}`,
        });
      } catch (error) {
        console.error(`Error uploading ${field}:`, error);
        setFileErrors(prev => ({ ...prev, [field]: 'Upload failed. Please try again.' }));
        setFileUploadStatus(prev => ({ ...prev, [field]: 'error' }));

        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${field}. Please try again.`,
          variant: 'destructive',
        });
      }
    }
  };

  useEffect(() => {
  const fetchBusinessTypes = async () => {
    try {
      const res = await fetch("/api/vendor-categories");
      const data = await res.json();
      setBusinessTypes(data);
    } catch (err) {
      console.error("Failed to load business types", err);
    } finally {
      setLoading(false);
    }
  };

  fetchBusinessTypes();
}, []);


  const steps = [
    { number: 1, title: "Business Details", icon: FileText, completed: completedSteps.includes(1) },
    { number: 2, title: "Contact Person", icon: User, completed: completedSteps.includes(2) },
    { number: 3, title: "Documents & Account", icon: Shield, completed: completedSteps.includes(3) },
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6 max-w-3xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = step.completed;
        
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-500 text-white border-2 border-green-400' 
                  : isActive 
                    ? 'bg-slate-700 text-white border-2 border-slate-600' 
                    : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${
                  isActive ? 'text-slate-800' : 'text-gray-500'
                }`}>
                  Step {step.number}
                </div>
                <div className={`text-xs ${
                  isActive ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 mb-4 transition-colors duration-300 rounded-full ${
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const BusinessDetailsStep = () => (
    <div className="space-y-4">
      <div className="bg-slate-700 text-white p-3 rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Business Details</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-slate-700 font-medium text-sm">
              Business Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('businessName')}
              placeholder="Enter business name"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.businessName && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.businessName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType" className="text-slate-700 font-medium text-sm">
              Business Type <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedBusinessType}
              onValueChange={(value) => {
                setSelectedBusinessType(value);
                businessForm.setValue('businessType', value);
              }}
            >
              <SelectTrigger className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10 bg-white">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-[9999] max-h-60">
                {businessTypes.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.name}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {businessForm.formState.errors.businessType && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.businessType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-slate-700 font-medium text-sm">Website</Label>
            <Input
              {...businessForm.register('website')}
              placeholder="e.g., www.yourbusiness.com"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.website && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('email')}
              type="email"
              placeholder="Enter email address"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.email && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-slate-700 font-medium text-sm">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('phoneNumber')}
              placeholder="Enter phone number"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.phoneNumber && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress" className="text-slate-700 font-medium text-sm">
              Business Address <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('businessAddress')}
              placeholder="Enter business address"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.businessAddress && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.businessAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-slate-700 font-medium text-sm">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('city')}
              placeholder="Enter city"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.city && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-slate-700 font-medium text-sm">
              State <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('state')}
              placeholder="Enter state"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.state && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipcode" className="text-slate-700 font-medium text-sm">
              Zipcode <span className="text-red-500">*</span>
            </Label>
            <Input
              {...businessForm.register('zipcode')}
              placeholder="Enter zipcode"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {businessForm.formState.errors.zipcode && (
              <p className="text-red-500 text-xs">{businessForm.formState.errors.zipcode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstNumber" className="text-slate-700 font-medium text-sm">GST Number (optional)</Label>
            <Input
              {...businessForm.register('gstNumber')}
              placeholder="Enter GST number"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ContactDetailsStep = () => (
    <div className="space-y-4">
      <div className="bg-slate-700 text-white p-3 rounded-t-lg">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Contact Person</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPersonName" className="text-slate-700 font-medium text-sm">
              Contact Person Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...contactForm.register('contactPersonName')}
              placeholder="Full name"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {contactForm.formState.errors.contactPersonName && (
              <p className="text-red-500 text-xs">{contactForm.formState.errors.contactPersonName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation" className="text-slate-700 font-medium text-sm">
              Designation <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedDesignation}
              onValueChange={(value) => {
                setSelectedDesignation(value);
                contactForm.setValue('designation', value);
              }}
            >
              <SelectTrigger className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10 bg-white">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-[9999] max-h-60">
                {designationOptions.map((designation) => (
                  <SelectItem key={designation} value={designation} className="hover:bg-gray-100 cursor-pointer">
                    {designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {contactForm.formState.errors.designation && (
              <p className="text-red-500 text-xs">{contactForm.formState.errors.designation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonEmail" className="text-slate-700 font-medium text-sm">
              Contact Person Email <span className="text-red-500">*</span>
            </Label>
            <Input
              {...contactForm.register('contactPersonEmail')}
              type="email"
              placeholder="Enter contact person's email"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {contactForm.formState.errors.contactPersonEmail && (
              <p className="text-red-500 text-xs">{contactForm.formState.errors.contactPersonEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonPhone" className="text-slate-700 font-medium text-sm">
              Contact Person Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              {...contactForm.register('contactPersonPhone')}
              placeholder="Enter contact person's phone number"
              className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
            />
            {contactForm.formState.errors.contactPersonPhone && (
              <p className="text-red-500 text-xs">{contactForm.formState.errors.contactPersonPhone.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const AccountDetailsStep = () => (
    <div className="space-y-4">
      <div className="bg-slate-700 text-white p-3 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Documents & Account Setup</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Document Upload Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Document Upload
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Upload clear copies of the following documents. Files will be stored securely in cloud storage.
            <br />Accepted: PDF, JPG, PNG (Max: 5MB each)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PAN Card Upload */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                PAN Card <span className="text-red-500">*</span>
                {fileUploadStatus.panCard === 'success' && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors bg-white ${
                fileErrors.panCard ? 'border-red-300' : 
                fileUploadStatus.panCard === 'success' ? 'border-green-300 bg-green-50' :
                'border-slate-300 hover:border-slate-400'
              }`}>
                <div className="flex flex-col items-center">
                  {fileUploadStatus.panCard === 'success' ? (
                    <Check className="w-8 h-8 text-green-500 mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  )}
                  <p className="text-slate-600 text-sm mb-2">
                    {uploadedFiles.panCard ? uploadedFiles.panCard.name : 'No file chosen'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('panCard', e.target.files)}
                    className="hidden"
                    id="panCard"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    className="text-xs border border-gray-300"
                    onClick={() => document.getElementById('panCard')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {fileErrors.panCard && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {fileErrors.panCard}
                </div>
              )}
            </div>

            {/* GST Certificate Upload */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                GST Certificate <span className="text-red-500">*</span>
                {fileUploadStatus.gstCertificate === 'success' && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors bg-white ${
                fileErrors.gstCertificate ? 'border-red-300' : 
                fileUploadStatus.gstCertificate === 'success' ? 'border-green-300 bg-green-50' :
                'border-slate-300 hover:border-slate-400'
              }`}>
                <div className="flex flex-col items-center">
                  {fileUploadStatus.gstCertificate === 'success' ? (
                    <Check className="w-8 h-8 text-green-500 mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  )}
                  <p className="text-slate-600 text-sm mb-2">
                    {uploadedFiles.gstCertificate ? uploadedFiles.gstCertificate.name : 'No file chosen'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('gstCertificate', e.target.files)}
                    className="hidden"
                    id="gstCertificate"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    className="text-xs border border-gray-300"
                    onClick={() => document.getElementById('gstCertificate')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {fileErrors.gstCertificate && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {fileErrors.gstCertificate}
                </div>
              )}
            </div>

            {/* Address Proof Upload */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                Address Proof <span className="text-red-500">*</span>
                {fileUploadStatus.addressProof === 'success' && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors bg-white ${
                fileErrors.addressProof ? 'border-red-300' : 
                fileUploadStatus.addressProof === 'success' ? 'border-green-300 bg-green-50' :
                'border-slate-300 hover:border-slate-400'
              }`}>
                <div className="flex flex-col items-center">
                  {fileUploadStatus.addressProof === 'success' ? (
                    <Check className="w-8 h-8 text-green-500 mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  )}
                  <p className="text-slate-600 text-sm mb-2">
                    {uploadedFiles.addressProof ? uploadedFiles.addressProof.name : 'No file chosen'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('addressProof', e.target.files)}
                    className="hidden"
                    id="addressProof"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    className="text-xs border border-gray-300"
                    onClick={() => document.getElementById('addressProof')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {fileErrors.addressProof && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {fileErrors.addressProof}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Setup Section */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Setup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-medium text-sm">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                {...accountForm.register('username')}
                placeholder="Choose a unique username"
                className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
              />
              {accountForm.formState.errors.username && (
                <p className="text-red-500 text-xs">{accountForm.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                {...accountForm.register('password')}
                type="password"
                placeholder="Enter password"
                className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
              />
              {accountForm.formState.errors.password && (
                <p className="text-red-500 text-xs">{accountForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium text-sm">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                {...accountForm.register('confirmPassword')}
                type="password"
                placeholder="Confirm password"
                className="border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-10"
              />
              {accountForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs">{accountForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Join Our Vendor Network
            </h1>
            <p className="text-sm text-slate-600">Complete the registration process to start selling with us</p>
          </div>

          <StepIndicator />

          <Card className="border-gray-300 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {currentStep === 1 && <BusinessDetailsStep />}
              {currentStep === 2 && <ContactDetailsStep />}
              {currentStep === 3 && <AccountDetailsStep />}

              <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-gray-400 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-slate-700 hover:bg-slate-800 text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-slate-700 hover:bg-slate-800 text-white flex items-center justify-center" >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <ErrorDialog
            open={errorDialogOpen}
            onOpenChange={setErrorDialogOpen}
            title="Registration Failed"
            description={errorMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;