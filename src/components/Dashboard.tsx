import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Pill, 
  Bell, 
  Plus, 
  Settings, 
  User,
  Heart,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  taken: boolean;
}

interface Reminder {
  id: string;
  type: 'appointment' | 'medication';
  title: string;
  time: string;
  urgent: boolean;
}

interface DashboardProps {
  patientName: string;
  onAddAppointment: () => void;
  onAddMedication: () => void;
  onSettings: () => void;
}

export function Dashboard({ patientName, onAddAppointment, onAddMedication, onSettings }: DashboardProps) {
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Cardiology Follow-up",
      doctor: "Dr. Smith",
      date: "2024-07-25",
      time: "10:00 AM",
      type: "Follow-up",
      location: "Medical Center"
    },
    {
      id: "2",
      title: "Diabetes Check-up",
      doctor: "Dr. Johnson",
      date: "2024-07-30",
      time: "2:30 PM",
      type: "Routine",
      location: "Clinic A"
    }
  ]);

  const [medications] = useState<Medication[]>([
    {
      id: "1",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      nextDose: "2:00 PM",
      taken: false
    },
    {
      id: "2",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      nextDose: "8:00 AM",
      taken: true
    }
  ]);

  const [reminders] = useState<Reminder[]>([
    {
      id: "1",
      type: "appointment",
      title: "Cardiology appointment tomorrow at 10:00 AM",
      time: "1 day before",
      urgent: true
    },
    {
      id: "2",
      type: "medication",
      title: "Time to take Metformin 500mg",
      time: "Now",
      urgent: true
    }
  ]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-secondary-soft/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg shadow-glow">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">HealthCare Companion</h1>
                <p className="text-muted-foreground">Welcome back, {patientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSettings}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Reminders */}
        {reminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Active Reminders
            </h2>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className={`border-l-4 ${
                  reminder.urgent ? 'border-l-accent bg-accent-soft/20' : 'border-l-primary bg-primary-soft/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {reminder.urgent ? (
                          <AlertCircle className="h-5 w-5 text-accent" />
                        ) : (
                          <Bell className="h-5 w-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-muted-foreground">{reminder.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Snooze</Button>
                        <Button size="sm" variant="success">
                          <CheckCircle className="h-4 w-4" />
                          Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="medical" 
            className="h-20 flex-col gap-2" 
            onClick={onAddAppointment}
          >
            <Plus className="h-6 w-6" />
            Add Appointment
          </Button>
          <Button 
            variant="soft" 
            className="h-20 flex-col gap-2" 
            onClick={onAddMedication}
          >
            <Pill className="h-6 w-6" />
            Add Medication
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            View Calendar
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Bell className="h-6 w-6" />
            Reminder Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                Your scheduled medical appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{appointment.title}</h4>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Dr. {appointment.doctor} • {appointment.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={onAddAppointment}>
                <Plus className="h-4 w-4" />
                Add New Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-secondary" />
                Medications
              </CardTitle>
              <CardDescription>
                Your current medication schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{medication.name}</h4>
                    <Badge variant={medication.taken ? "default" : "secondary"}>
                      {medication.taken ? "Taken" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {medication.dosage} • {medication.frequency}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Next dose: {medication.nextDose}
                    </span>
                    {!medication.taken && (
                      <Button size="sm" variant="success">
                        Mark Taken
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={onAddMedication}>
                <Plus className="h-4 w-4" />
                Add New Medication
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Summary */}
        <Card className="mt-8 shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              Health Summary
            </CardTitle>
            <CardDescription>
              Your health metrics and reminders overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary-soft/20 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {appointments.length}
                </div>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
              </div>
              <div className="text-center p-4 bg-secondary-soft/20 rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {medications.length}
                </div>
                <p className="text-sm text-muted-foreground">Active Medications</p>
              </div>
              <div className="text-center p-4 bg-accent-soft/20 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">
                  {reminders.length}
                </div>
                <p className="text-sm text-muted-foreground">Active Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}