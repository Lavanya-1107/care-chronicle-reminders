import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, User, ArrowLeft, Save } from "lucide-react";

interface AppointmentData {
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  address: string;
  notes: string;
  reminderSettings: {
    oneDayBefore: boolean;
    dayOf: boolean;
    oneHourBefore: boolean;
    customReminders: string[];
  };
}

interface AppointmentFormProps {
  onSave: (appointment: AppointmentData) => void;
  onCancel: () => void;
}

export function AppointmentForm({ onSave, onCancel }: AppointmentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AppointmentData>({
    title: "",
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    location: "",
    address: "",
    notes: "",
    reminderSettings: {
      oneDayBefore: true,
      dayOf: true,
      oneHourBefore: true,
      customReminders: []
    }
  });

  const specialties = [
    "Cardiology", "Endocrinology", "Nephrology", "Pulmonology", 
    "Neurology", "Oncology", "Rheumatology", "Gastroenterology",
    "Dermatology", "Orthopedics", "Primary Care", "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.doctor || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Appointment Scheduled",
      description: `Your ${formData.title} appointment has been added successfully.`,
    });
  };

  const updateReminderSetting = (key: keyof typeof formData.reminderSettings, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-secondary-soft/10 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onCancel} size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Schedule New Appointment</h1>
            <p className="text-muted-foreground">Add a new medical appointment with reminder settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-medical border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment Details
              </CardTitle>
              <CardDescription>
                Enter the details of your medical appointment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Appointment Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Appointment Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Cardiology Follow-up, Annual Check-up"
                />
              </div>

              {/* Doctor and Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor Name *</Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                    placeholder="Dr. Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={formData.specialty} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, specialty: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location/Clinic Name</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Medical Center Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Medical Street, City, State"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this appointment..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reminder Settings */}
          <Card className="mt-6 shadow-medical border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Reminder Settings
              </CardTitle>
              <CardDescription>
                Configure when you want to be reminded about this appointment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneDayBefore"
                    checked={formData.reminderSettings.oneDayBefore}
                    onCheckedChange={(checked) => 
                      updateReminderSetting('oneDayBefore', checked as boolean)
                    }
                  />
                  <Label htmlFor="oneDayBefore" className="text-sm font-normal">
                    Remind me 1 day before the appointment
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dayOf"
                    checked={formData.reminderSettings.dayOf}
                    onCheckedChange={(checked) => 
                      updateReminderSetting('dayOf', checked as boolean)
                    }
                  />
                  <Label htmlFor="dayOf" className="text-sm font-normal">
                    Remind me on the day of the appointment (morning)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneHourBefore"
                    checked={formData.reminderSettings.oneHourBefore}
                    onCheckedChange={(checked) => 
                      updateReminderSetting('oneHourBefore', checked as boolean)
                    }
                  />
                  <Label htmlFor="oneHourBefore" className="text-sm font-normal">
                    Remind me 1 hour before the appointment
                  </Label>
                </div>
              </div>

              <div className="bg-primary-soft/20 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">AI Voice Reminder</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI assistant will provide voice reminders using natural language. 
                  You can customize voice settings in your profile preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="medical">
              <Save className="h-4 w-4" />
              Save Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}