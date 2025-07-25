import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, MapPin, User, ArrowLeft, Save, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomReminder {
  id: string;
  time: string;
  unit: 'minutes' | 'hours' | 'days';
  type: 'notification' | 'email' | 'voice';
}

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
    customReminders: CustomReminder[];
  };
}

interface AppointmentFormProps {
  onSave: (appointment: AppointmentData) => void;
  onCancel: () => void;
}

export function AppointmentForm({ onSave, onCancel }: AppointmentFormProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
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

  const addCustomReminder = () => {
    const newReminder: CustomReminder = {
      id: crypto.randomUUID(),
      time: '30',
      unit: 'minutes',
      type: 'notification'
    };
    
    setFormData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        customReminders: [...prev.reminderSettings.customReminders, newReminder]
      }
    }));
  };

  const removeCustomReminder = (id: string) => {
    setFormData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        customReminders: prev.reminderSettings.customReminders.filter(r => r.id !== id)
      }
    }));
  };

  const updateCustomReminder = (id: string, field: keyof CustomReminder, value: string) => {
    setFormData(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        customReminders: prev.reminderSettings.customReminders.map(r => 
          r.id === id ? { ...r, [field]: value } : r
        )
      }
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-aurora relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-mesh opacity-25"></div>
      <div className="absolute inset-0 bg-gradient-radial"></div>
      <div className="max-w-2xl mx-auto relative z-10">
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
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Appointment Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Cardiology Follow-up, Annual Check-up"
                  className="transition-all duration-200 focus:shadow-md focus:scale-[1.02]"
                />
              </div>

              {/* Doctor and Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="doctor" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-secondary" />
                    Doctor Name *
                  </Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                    placeholder="Dr. Smith"
                    className="transition-all duration-200 focus:shadow-md focus:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-sm font-medium">Specialty</Label>
                  <Select value={formData.specialty} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, specialty: value }))
                  }>
                    <SelectTrigger className="transition-all duration-200 hover:shadow-md">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty} className="transition-colors hover:bg-primary/10">
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
                  <Label>Appointment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal transition-all duration-200 hover:shadow-md",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="transition-all duration-200 focus:shadow-md"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Location/Clinic Name
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Medical Center Name"
                    className="transition-all duration-200 focus:shadow-md focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Medical Street, City, State"
                    className="transition-all duration-200 focus:shadow-md focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this appointment (e.g., bring insurance card, fasting required, preparation instructions)..."
                  className="min-h-[100px] transition-all duration-200 focus:shadow-md resize-none"
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
            
            <CardContent className="space-y-6">
              {/* Quick Reminder Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Quick Reminder Options</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20 transition-all duration-200 hover:bg-secondary/30">
                    <Checkbox
                      id="oneDayBefore"
                      checked={formData.reminderSettings.oneDayBefore}
                      onCheckedChange={(checked) => 
                        updateReminderSetting('oneDayBefore', checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="oneDayBefore" className="text-sm font-medium cursor-pointer">
                        1 Day Before
                      </Label>
                      <p className="text-xs text-muted-foreground">Email and notification reminder</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20 transition-all duration-200 hover:bg-secondary/30">
                    <Checkbox
                      id="dayOf"
                      checked={formData.reminderSettings.dayOf}
                      onCheckedChange={(checked) => 
                        updateReminderSetting('dayOf', checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="dayOf" className="text-sm font-medium cursor-pointer">
                        Day of Appointment
                      </Label>
                      <p className="text-xs text-muted-foreground">Morning reminder at 8:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20 transition-all duration-200 hover:bg-secondary/30">
                    <Checkbox
                      id="oneHourBefore"
                      checked={formData.reminderSettings.oneHourBefore}
                      onCheckedChange={(checked) => 
                        updateReminderSetting('oneHourBefore', checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="oneHourBefore" className="text-sm font-medium cursor-pointer">
                        1 Hour Before
                      </Label>
                      <p className="text-xs text-muted-foreground">Push notification and optional voice call</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Reminders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Custom Reminders</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomReminder}
                    className="h-8 px-3 text-xs transition-all duration-200 hover:shadow-md"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Custom
                  </Button>
                </div>

                {formData.reminderSettings.customReminders.length === 0 ? (
                  <div className="text-center py-6 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No custom reminders yet</p>
                    <p className="text-xs text-muted-foreground">Click "Add Custom" to create personalized reminders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.reminderSettings.customReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="number"
                            value={reminder.time}
                            onChange={(e) => updateCustomReminder(reminder.id, 'time', e.target.value)}
                            className="w-16 h-8 text-sm"
                            min="1"
                            max="999"
                            placeholder="30"
                          />
                          <Select
                            value={reminder.unit}
                            onValueChange={(value) => updateCustomReminder(reminder.id, 'unit', value as 'minutes' | 'hours' | 'days')}
                          >
                            <SelectTrigger className="w-24 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="minutes">Min</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">before via</span>
                          <Select
                            value={reminder.type}
                            onValueChange={(value) => updateCustomReminder(reminder.id, 'type', value as 'notification' | 'email' | 'voice')}
                          >
                            <SelectTrigger className="w-32 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="notification">📱 Push</SelectItem>
                              <SelectItem value="email">📧 Email</SelectItem>
                              <SelectItem value="voice">🎙️ Voice Call</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomReminder(reminder.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Voice Features */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-primary mb-1">AI Voice Assistant</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our AI will call you with personalized reminders in natural language, including appointment details and preparation instructions.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Natural conversation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Smart scheduling</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Medication reminders</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Prep instructions</span>
                      </div>
                    </div>
                  </div>
                </div>
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