import { useState } from "react";
import { PatientOnboarding } from "@/components/PatientOnboarding";
import { Dashboard } from "@/components/Dashboard";
import { AppointmentForm } from "@/components/AppointmentForm";

type AppView = 'onboarding' | 'dashboard' | 'addAppointment' | 'addMedication' | 'settings';

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

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  const handleOnboardingComplete = (data: PatientData) => {
    setPatientData(data);
    setCurrentView('dashboard');
  };

  const handleAddAppointment = () => {
    setCurrentView('addAppointment');
  };

  const handleAddMedication = () => {
    setCurrentView('addMedication');
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleSaveAppointment = (appointmentData: any) => {
    // In a real app, this would save to a database
    console.log('Saving appointment:', appointmentData);
    setCurrentView('dashboard');
  };

  if (currentView === 'onboarding') {
    return <PatientOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'dashboard' && patientData) {
    return (
      <Dashboard 
        patientName={`${patientData.firstName} ${patientData.lastName}`}
        onAddAppointment={handleAddAppointment}
        onAddMedication={handleAddMedication}
        onSettings={handleSettings}
      />
    );
  }

  if (currentView === 'addAppointment') {
    return (
      <AppointmentForm 
        onSave={handleSaveAppointment}
        onCancel={handleBackToDashboard}
      />
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-aurora relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-radial"></div>
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-primary">HealthCare Companion</h1>
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
