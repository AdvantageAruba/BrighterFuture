import React, { useState } from 'react';
import { useIntakeForms, IntakeFormData } from '../hooks/useIntakeForms';

const ComprehensiveIntakeForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const { createIntakeForm, loading, error } = useIntakeForms();
  
  const [formData, setFormData] = useState<IntakeFormData>({
    // Step 1: Biographical Information
    child_name: '',
    date_of_birth: '',
    sponsor_id: '',
    guardian1_name: '',
    guardian1_email: '',
    guardian1_address: '',
    guardian1_cell_phone: '',
    guardian1_home_phone: '',
    guardian1_work_phone: '',
    guardian1_relationship: '',
    guardian2_name: '',
    guardian2_email: '',
    guardian2_address: '',
    guardian2_cell_phone: '',
    guardian2_home_phone: '',
    guardian2_work_phone: '',
    guardian2_relationship: '',
    household_members: ['', '', '', '', ''],
    
    // Step 2: Medical & School Information
    physician_name: '',
    physician_phone: '',
    physician_address: '',
    pediatrician_name: '',
    pediatrician_phone: '',
    allergies: '',
    current_medical_conditions: '',
    hospitalizations_surgeries: '',
    school_name: '',
    school_phone: '',
    school_address: '',
    has_iep: false,
    grade_level: '',
    school_based_services: '',
    service_providers: ['', '', '', ''],
    
    // Step 3: Medical & Behavioral History
    diagnosis: '',
    diagnosing_date: '',
    diagnosing_provider: '',
    provider_credentials: '',
    facility_name: '',
    current_medications: '',
    seizure_history: '',
    other_diagnoses: '',
    family_history: '',
    aggressive_behavior_history: '',
    previous_interventions: '',
    
    // Step 4: Main Areas of Concern
    communication_forms: '',
    sensory_needs: '',
    primary_concerns: ['', '', '', ''],
    therapy_goals: '',
    urgency_assessment: '',
    
    // Step 5: Developmental History
    pregnancy_complications: '',
    gestational_age: '',
    birth_weight: '',
    first_smile_age: '',
    sitting_age: '',
    crawling_age: '',
    walking_age: '',
    speaking_age: '',
    developmental_regression: '',
    motor_skills_rating: 3,
    language_skills_rating: 3,
    social_skills_rating: 3,
    cognitive_skills_rating: 3,
    additional_developmental_info: '',
    
    // Step 6: Social & Play Skills
    play_skills_preferences: '',
    play_style_description: '',
    repetitive_behaviors: '',
    interest_in_children: '',
    response_to_peers: '',
    social_rules_understanding: '',
    emotional_comprehension_level: '',
    emotional_expression_level: '',
    empathy_level: '',
    additional_social_info: '',
    
    // Step 7: Therapy History & Availability
    previous_therapy_experience: '',
    therapy_type: '',
    therapy_description: '',
    insurance_coverage: false,
    insurance_provider: '',
    policy_member_id: '',
    insurance_questions: '',
    preferred_days: [],
    preferred_time_slot: '',
    hours_per_week: '',
    scheduling_restrictions: '',
    additional_info: ''
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        status: 'pending',
        submitted_by: 'Online Form',
        contact_email: formData.guardian1_email || '',
        contact_phone: formData.guardian1_cell_phone || formData.guardian1_home_phone || ''
      };

      const result = await createIntakeForm(submissionData);
      
      if (result.success) {
        alert('Intake form submitted successfully! We will contact you soon.');
        setCurrentStep(1);
        // Reset form data
        setFormData({
          child_name: '',
          date_of_birth: '',
          sponsor_id: '',
          guardian1_name: '',
          guardian1_email: '',
          guardian1_address: '',
          guardian1_cell_phone: '',
          guardian1_home_phone: '',
          guardian1_work_phone: '',
          guardian1_relationship: '',
          guardian2_name: '',
          guardian2_email: '',
          guardian2_address: '',
          guardian2_cell_phone: '',
          guardian2_home_phone: '',
          guardian2_work_phone: '',
          guardian2_relationship: '',
          household_members: ['', '', '', '', ''],
          physician_name: '',
          physician_phone: '',
          physician_address: '',
          pediatrician_name: '',
          pediatrician_phone: '',
          allergies: '',
          current_medical_conditions: '',
          hospitalizations_surgeries: '',
          school_name: '',
          school_phone: '',
          school_address: '',
          has_iep: false,
          grade_level: '',
          school_based_services: '',
          service_providers: ['', '', '', ''],
          diagnosis: '',
          diagnosing_date: '',
          diagnosing_provider: '',
          provider_credentials: '',
          facility_name: '',
          current_medications: '',
          seizure_history: '',
          other_diagnoses: '',
          family_history: '',
          aggressive_behavior_history: '',
          previous_interventions: '',
          communication_forms: '',
          sensory_needs: '',
          primary_concerns: ['', '', '', ''],
          therapy_goals: '',
          urgency_assessment: '',
          pregnancy_complications: '',
          gestational_age: '',
          birth_weight: '',
          first_smile_age: '',
          sitting_age: '',
          crawling_age: '',
          walking_age: '',
          speaking_age: '',
          developmental_regression: '',
          motor_skills_rating: 3,
          language_skills_rating: 3,
          social_skills_rating: 3,
          cognitive_skills_rating: 3,
          additional_developmental_info: '',
          play_skills_preferences: '',
          play_style_description: '',
          repetitive_behaviors: '',
          interest_in_children: '',
          response_to_peers: '',
          social_rules_understanding: '',
          emotional_comprehension_level: '',
          emotional_expression_level: '',
          empathy_level: '',
          additional_social_info: '',
          previous_therapy_experience: '',
          therapy_type: '',
          therapy_description: '',
          insurance_coverage: false,
          insurance_provider: '',
          policy_member_id: '',
          insurance_questions: '',
          preferred_days: [],
          preferred_time_slot: '',
          hours_per_week: '',
          scheduling_restrictions: '',
          additional_info: ''
        });
      } else {
        alert(`Error submitting form: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const handleInputChange = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof IntakeFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) 
        ? (prev[field] as string[]).map((item: string, i: number) => 
            i === index ? value : item
          )
        : prev[field]
    }));
  };

  const handleCheckboxChange = (field: keyof IntakeFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? checked 
          ? [...(prev[field] as string[]), value]
          : (prev[field] as string[]).filter((item: string) => item !== value)
        : prev[field]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Biographical Information</h2>
            
            {/* Child Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name *
                </label>
                                 <input
                   type="text"
                   value={formData.child_name}
                   onChange={(e) => handleInputChange('child_name', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Enter child's full name"
                   required
                 />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                                 <input
                   type="date"
                   value={formData.date_of_birth}
                   onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   required
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sponsor ID/AZV Subscriber ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sponsor ID if applicable"
              />
            </div>

            {/* Guardian 1 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Caregiver/Legal Guardian #1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cell phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Home phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Work phone number"
                  />
                </div>
              </div>
            </div>

            {/* Guardian 2 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Caregiver/Legal Guardian #2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name (if applicable)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cell phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Home phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Work phone number"
                  />
                </div>
              </div>
            </div>

                         {/* Household Members */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-medium text-gray-700">
                   Who Lives in the Home? (please include any pets)
                 </label>
                 <button
                   type="button"
                   onClick={() => {
                     setFormData(prev => ({
                       ...prev,
                       household_members: [...prev.household_members, '']
                     }));
                   }}
                   className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                 >
                   <span>+</span>
                   <span>Add Member</span>
                 </button>
               </div>
               {formData.household_members.map((member: string, index: number) => (
                 <div key={index} className="flex items-center space-x-2 mb-2">
                   <input
                     type="text"
                     value={member}
                     onChange={(e) => handleArrayChange('household_members', index, e.target.value)}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder={`Household member ${index + 1}`}
                   />
                   {formData.household_members.length > 1 && (
                     <button
                       type="button"
                       onClick={() => {
                         setFormData(prev => ({
                           ...prev,
                           household_members: prev.household_members.filter((_: string, i: number) => i !== index)
                         }));
                       }}
                       className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                       title="Remove member"
                     >
                       ×
                     </button>
                   )}
                 </div>
               ))}
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical & School Information</h2>
            
            {/* Primary Care Physician */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Care Physician</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name/Affiliation</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Physician name and credentials"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Office address"
                />
              </div>
            </div>

            {/* School Information */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
              <p className="text-sm text-gray-600 mb-4">Skip this part if student goes to Brighter Future Academy</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name of School/Teacher</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="School name and teacher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="School phone number"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="School address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Does your child have an active IEP?</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level & Placement Setting</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., EC Classroom, Gen. Education Setting, Resource"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you looking to have school-based services in conjunction with home-based services?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select...</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="not-applicable">Not Applicable</option>
                </select>
              </div>
            </div>

            {/* Other Service Providers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Service Providers (Speech/OT/etc.) - Please include Facility, Names of Providers, and Contact Information
              </label>
              {[1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder={`Service provider ${index} - Facility, Provider Name, Contact Info`}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical & Behavioral History</h2>
            
            {/* Diagnosis Information */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Primary diagnosis"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosing Date (Month/Year)</label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosing Provider (Name/Credentials)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provider name and credentials"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility of Diagnosis</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital or clinic name"
                  />
                </div>
              </div>
            </div>

            {/* Current Medications & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="List current medications..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="List any allergies..."
                />
              </div>
            </div>

            {/* Seizure History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">History of Seizures</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe any seizure history..."
              />
            </div>

            {/* Other Diagnoses & Family History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Diagnoses</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="If none, please indicate..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family History of Autism or Related Disorders</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="If none, please indicate..."
                />
              </div>
            </div>

            {/* Aggressive Behavior */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavior Assessment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child have a history of aggressive behavior that can cause harm to self or others?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="If so, please provide a brief overview (what it looks like, why it typically happens, and how often/how long the behavior can occur)..."
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  If you answered "Yes," have there been any specific behavior interventions previously implemented for your child?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select...</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="not-applicable">Not Applicable</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Areas of Concern</h2>
            
            {/* Communication Forms */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Forms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verbal Communication</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Non-Verbal Communication</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Challenges</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe any specific communication challenges or difficulties..."
                />
              </div>
            </div>

            {/* Sensory Needs */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensory Needs & Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity to Sounds</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-sensitive">Very Sensitive</option>
                    <option value="moderately-sensitive">Moderately Sensitive</option>
                    <option value="normal">Normal</option>
                    <option value="less-sensitive">Less Sensitive</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity to Lights</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-sensitive">Very Sensitive</option>
                    <option value="moderately-sensitive">Moderately Sensitive</option>
                    <option value="normal">Normal</option>
                    <option value="less-sensitive">Less Sensitive</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity to Touch</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-sensitive">Very Sensitive</option>
                    <option value="moderately-sensitive">Moderately Sensitive</option>
                    <option value="normal">Normal</option>
                    <option value="less-sensitive">Less Sensitive</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity to Smells</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-sensitive">Very Sensitive</option>
                    <option value="moderately-sensitive">Moderately Sensitive</option>
                    <option value="normal">Normal</option>
                    <option value="less-sensitive">Less Sensitive</option>
                    <option value="not-applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sensory Preferences & Aversions</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe any specific sensory preferences, aversions, or seeking behaviors..."
                />
              </div>
            </div>

            {/* Main Areas of Concern */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Concerns</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are the main areas of concern for your child? (Check all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      'Communication difficulties',
                      'Social interaction challenges',
                      'Behavioral issues',
                      'Learning difficulties',
                      'Sensory processing problems',
                      'Motor skills development',
                      'Emotional regulation',
                      'Attention and focus',
                      'Sleep issues',
                      'Eating difficulties',
                      'Toilet training',
                      'Other'
                    ].map((concern, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{concern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please describe your main concerns in detail
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe the specific behaviors, challenges, or areas where your child needs support..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your goals for your child's therapy?
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="What would you like your child to achieve or improve through therapy services?"
                  />
                </div>
              </div>
            </div>

            {/* Urgency & Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How urgent is the need for services?
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                <option value="immediate">Immediate - Need services right away</option>
                <option value="high">High - Need services within 1-2 months</option>
                <option value="moderate">Moderate - Need services within 3-6 months</option>
                <option value="low">Low - Planning for future needs</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Developmental History</h2>
            
            {/* Early Development */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Early Development & Pregnancy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Complications</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any complications during pregnancy? If none, please indicate..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Complications</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any complications during birth? If none, please indicate..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gestational Age at Birth</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="full-term">Full Term (37-42 weeks)</option>
                    <option value="preterm">Preterm (32-36 weeks)</option>
                    <option value="very-preterm">Very Preterm (28-31 weeks)</option>
                    <option value="extremely-preterm">Extremely Preterm (less than 28 weeks)</option>
                    <option value="post-term">Post Term (over 42 weeks)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Weight</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7 lbs 2 oz or 3.2 kg"
                  />
                </div>
              </div>
            </div>

            {/* Developmental Milestones */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Developmental Milestones</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your child first smile?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 6 weeks, 2 months, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your child first sit without support?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 6 months, 8 months, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your child first crawl?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 8 months, 10 months, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your child first walk?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12 months, 15 months, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your child first say words?</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12 months, 18 months, etc."
                  />
                </div>
              </div>
            </div>

            {/* Developmental Regression */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Developmental Regression</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Has your child experienced any loss of skills or developmental regression?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                  <option value="">Select...</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="unsure">Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  If yes, please describe what skills were lost and when this occurred
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe the skills that were lost, when it happened, and any other relevant details..."
                />
              </div>
            </div>

            {/* Current Developmental Level */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Developmental Level</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motor Skills Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="age-appropriate">Age Appropriate</option>
                    <option value="mildly-delayed">Mildly Delayed</option>
                    <option value="moderately-delayed">Moderately Delayed</option>
                    <option value="significantly-delayed">Significantly Delayed</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language Skills Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="age-appropriate">Age Appropriate</option>
                    <option value="mildly-delayed">Mildly Delayed</option>
                    <option value="moderately-delayed">Moderately Delayed</option>
                    <option value="significantly-delayed">Significantly Delayed</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Skills Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="age-appropriate">Age Appropriate</option>
                    <option value="mildly-delayed">Mildly Delayed</option>
                    <option value="moderately-delayed">Moderately Delayed</option>
                    <option value="significantly-delayed">Significantly Delayed</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cognitive Skills Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="age-appropriate">Age Appropriate</option>
                    <option value="mildly-delayed">Mildly Delayed</option>
                    <option value="moderately-delayed">Moderately Delayed</option>
                    <option value="significantly-delayed">Significantly Delayed</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Developmental Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any other developmental information or concerns you'd like to share?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Additional developmental information, unique behaviors, or other concerns..."
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Social & Play Skills</h2>
            
            {/* Play Skills */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Play Skills & Preferences</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What types of play does your child enjoy? (Check all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    'Pretend/Imaginative play',
                    'Building with blocks/construction toys',
                    'Puzzles and problem-solving games',
                    'Physical play (running, jumping, climbing)',
                    'Art and creative activities',
                    'Music and movement',
                    'Reading books',
                    'Watching videos/screens',
                    'Playing with cars/trains',
                    'Playing with dolls/stuffed animals',
                    'Outdoor play',
                    'Water play',
                    'Other'
                  ].map((playType, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{playType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How does your child typically play? Describe their play style
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe how your child plays - alone, with others, repetitive behaviors, etc..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child engage in repetitive play behaviors?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                  <option value="">Select...</option>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                  <option value="sometimes">Sometimes</option>
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    If yes, please describe the repetitive behaviors
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe any repetitive play behaviors, lining up toys, spinning objects, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Social Interaction */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Interaction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest in Other Children</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-interested">Very Interested</option>
                    <option value="somewhat-interested">Somewhat Interested</option>
                    <option value="neutral">Neutral</option>
                    <option value="not-interested">Not Interested</option>
                    <option value="avoids">Actively Avoids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response to Other Children</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="excited">Excited</option>
                    <option value="happy">Happy</option>
                    <option value="neutral">Neutral</option>
                    <option value="anxious">Anxious</option>
                    <option value="fearful">Fearful</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How does your child interact with peers? Describe their social behaviors
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe how your child interacts with other children, any challenges or strengths..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child understand and follow social rules?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                  <option value="">Select...</option>
                  <option value="always">Always</option>
                  <option value="usually">Usually</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never</option>
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide examples of social rules your child follows or struggles with
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Examples: taking turns, sharing, personal space, greetings, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Emotional Expression */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotional Expression & Understanding</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Understanding of Emotions</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expression of Emotions</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="very-expressive">Very Expressive</option>
                    <option value="somewhat-expressive">Somewhat Expressive</option>
                    <option value="neutral">Neutral</option>
                    <option value="limited">Limited Expression</option>
                    <option value="flat">Flat Affect</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How does your child show happiness, sadness, anger, or other emotions?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe how your child expresses different emotions..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child understand how others are feeling?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                  <option value="">Select...</option>
                  <option value="always">Always</option>
                  <option value="usually">Usually</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never</option>
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide examples of when your child shows empathy or understanding of others' feelings
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Examples: comforting someone who's sad, sharing when someone needs something, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Additional Social Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any other social or play-related information you'd like to share?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Additional information about your child's social skills, play preferences, or behaviors..."
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Skills</h2>
            
            {/* Communication Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How does your child communicate? What methods do they use?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe communication methods (words, gestures, sounds, etc.)..."
              />
            </div>

            {/* Communication Reasons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What does your child communicate about? What are the main reasons they communicate?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe what your child communicates about (wants, needs, feelings, etc.)..."
              />
            </div>

            {/* Other Communication Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are there other ways your child communicates that we should know about?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe any additional communication methods or unique behaviors..."
              />
            </div>

            {/* Recognizable Words */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many words does your child say that others can understand?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Estimate the number of recognizable words and give examples..."
              />
            </div>

            {/* Response to Directions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How does your child respond to directions or instructions?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe how your child follows directions, what helps, what doesn't..."
              />
            </div>

            {/* Eye Contact Consistency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How consistent is your child's eye contact during communication?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe eye contact consistency during different communication situations..."
              />
            </div>

            {/* Gesture Imitation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Does your child imitate gestures or actions? What types?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe what gestures or actions your child imitates..."
              />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Therapy History & Availability</h2>
            
            {/* Previous Therapy Experience */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Therapy Experience</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Has your child received therapy services before?
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    If yes, what type of therapy?
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="aba">Applied Behavior Analysis (ABA)</option>
                    <option value="speech">Speech Therapy</option>
                    <option value="occupational">Occupational Therapy</option>
                    <option value="physical">Physical Therapy</option>
                    <option value="play">Play Therapy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe your child's previous therapy experience
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe the therapy services, duration, outcomes, and any concerns..."
                />
              </div>
            </div>

            {/* Insurance & Payment Information */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance & Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have health insurance that covers therapy services?
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Insurance company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy/Group Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Policy or group number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID/Subscriber Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Member ID or subscriber number"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any additional insurance information or questions?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional insurance details, coverage questions, or payment arrangements..."
                />
              </div>
            </div>

            {/* Availability & Scheduling Preferences */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Scheduling Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred days of the week for therapy
                  </label>
                  <div className="space-y-2">
                                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Preferred time of day
                   </label>
                   <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <option value="">Select...</option>
                     <option value="8:30-9:45">8:30 – 9:45 am</option>
                     <option value="10:00-10:45">10:00 – 10:45 am</option>
                     <option value="11:00-11:45">11:00 – 11:45 am</option>
                     <option value="12:00-12:45">12:00 – 12:45 pm</option>
                     <option value="14:30-15:15">2:30 – 3:15 pm</option>
                     <option value="15:30-16:15">3:30 – 4:15 pm</option>
                     <option value="16:30-17:15">4:30 – 5:15 pm</option>
                   </select>
                 </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many hours per week are you looking for?
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select...</option>
                  <option value="1-5">1-5 hours per week</option>
                  <option value="6-10">6-10 hours per week</option>
                  <option value="11-15">11-15 hours per week</option>
                  <option value="16-20">16-20 hours per week</option>
                  <option value="20+">More than 20 hours per week</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any scheduling restrictions or special considerations?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Work schedules, school schedules, other commitments, or special needs..."
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any other information you'd like to share about your therapy needs or preferences?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Additional information, questions, or specific requests for therapy services..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">Brighter Future Intake Form</h1>
            <p className="text-blue-100 text-lg">First Steps - Complete Application</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h2>
          <p className="text-blue-800 text-sm mb-3">
            Please complete and submit this form to schedule an appointment for an evaluation. If you have any questions you can E-mail: brightefuturearuba@gmail.com or call Cell: 5920662
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
                     {/* Step Indicator */}
           <div className="mb-8">
             <div className="flex items-center justify-between">
               {Array.from({ length: totalSteps }, (_, index) => (
                 <div key={index} className="flex items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                     index + 1 < currentStep 
                       ? 'bg-green-500 text-white' 
                       : index + 1 === currentStep 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-200 text-gray-600'
                   }`}>
                     {index + 1 < currentStep ? '✓' : index + 1}
                   </div>
                   {index < totalSteps - 1 && (
                     <div className={`w-16 h-1 mx-2 ${
                       index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                     }`} />
                   )}
                 </div>
               ))}
             </div>
                           <div className="text-center mt-2 text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
           </div>
          
          {/* Step content */}
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-md transition-colors ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
            
                         {currentStep < totalSteps ? (
               <button
                 onClick={nextStep}
                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
               >
                 Next
               </button>
             ) : (
                               <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {loading ? 'Submitting...' : 'Submit Form'}
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveIntakeForm;
