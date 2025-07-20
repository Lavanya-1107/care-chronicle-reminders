import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, Shield, ArrowRight } from "lucide-react";

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  chronicConditions: string[];
  medications: string;
  allergies: string;
  preferredReminderTime: string;
  reminderMethods: string[];
}

interface PatientOnboardingProps {
  onComplete: (data: PatientData) => void;
}

export function PatientOnboarding({ onComplete }: PatientOnboardingProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PatientData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    chronicConditions: [],
    medications: "",
    allergies: "",
    preferredReminderTime: "",
    reminderMethods: []
  });

  const commonConditions = [
    "Diabetes", "Hypertension", "Heart Disease", "Asthma", 
    "Arthritis", "COPD", "Kidney Disease", "Cancer", "Depression", "Anxiety"
  ];

  const reminderMethods = [
    "Visual Notifications", "Audio Alarms", "Voice Reminders", "Email", "SMS"
  ];

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: checked 
        ? [...prev.chronicConditions, condition]
        : prev.chronicConditions.filter(c => c !== condition)
    }));
  };

  const handleReminderMethodChange = (method: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      reminderMethods: checked 
        ? [...prev.reminderMethods, method]
        : prev.reminderMethods.filter(m => m !== method)
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onComplete(formData);
    toast({
      title: "Welcome to HealthCare Companion!",
      description: "Your profile has been created successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-secondary-soft/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full shadow-glow">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to HealthCare Companion</h1>
          <p className="text-muted-foreground">Let's set up your profile to provide personalized health reminders</p>
        </div>

        <Card className="shadow-medical border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {step === 1 && <User className="h-5 w-5" />}
                  {step === 2 && <Heart className="h-5 w-5" />}
                  {step === 3 && <Shield className="h-5 w-5" />}
                  Step {step} of 3
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Medical Information"}
                  {step === 3 && "Reminder Preferences"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-3 h-3 rounded-full ${
                      num <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <Label>Chronic Conditions</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {commonConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => 
                            handleConditionChange(condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={condition} className="text-sm font-normal">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                    placeholder="List your current medications, dosages, and frequency..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="List any allergies or adverse reactions..."
                    className="min-h-[80px]"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Preferred Reminder Time</Label>
                  <Select value={formData.preferredReminderTime} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, preferredReminderTime: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (7:00 PM)</SelectItem>
                      <SelectItem value="custom">Custom Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Reminder Methods</Label>
                  <div className="space-y-3">
                    {reminderMethods.map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={formData.reminderMethods.includes(method)}
                          onCheckedChange={(checked) => 
                            handleReminderMethodChange(method, checked as boolean)
                          }
                        />
                        <Label htmlFor={method} className="text-sm font-normal">
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-soft/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Default Reminder Schedule</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1 day before appointments</li>
                    <li>• Day of appointment (morning)</li>
                    <li>• 1 hour before appointment</li>
                    <li>• Medication reminders at specified times</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can customize these settings anytime from your dashboard.
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={nextStep} className="ml-auto" variant="medical">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto" variant="medical">
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}