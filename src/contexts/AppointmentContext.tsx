import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  service: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface AppointmentContextType {
  appointments: Appointment[];
  services: Service[];
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentSnapshot = await getDocs(appointmentsCollection);
    const appointmentList = appointmentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
    setAppointments(appointmentList);
  };

  const fetchServices = async () => {
    const servicesCollection = collection(db, 'services');
    const serviceSnapshot = await getDocs(servicesCollection);
    const serviceList = serviceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
    setServices(serviceList);
  };

  const bookAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    const appointmentsCollection = collection(db, 'appointments');
    await addDoc(appointmentsCollection, appointment);
    fetchAppointments();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const servicesCollection = collection(db, 'services');
    await addDoc(servicesCollection, service);
    fetchServices();
  };

  const removeService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
    fetchServices();
  };

  const value = {
    appointments,
    services,
    bookAppointment,
    addService,
    removeService,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};