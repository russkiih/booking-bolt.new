import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAppointment } from '@/contexts/AppointmentContext';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const serviceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price must be a positive number'),
});

type Service = z.infer<typeof serviceSchema>;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const { toast } = useToast();
  const { appointments, services, addService, removeService } = useAppointment();

  const form = useForm<Service>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration: 30,
      price: 0,
    },
  });

  const onSubmit = async (values: Service) => {
    try {
      await addService(values);
      toast({
        title: 'Service Added',
        description: 'The new service has been successfully added.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error adding the service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const appointmentColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'service',
      header: 'Service',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return new Date(row.getValue('date')).toLocaleString();
      },
    },
  ];

  const serviceColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'duration',
      header: 'Duration (minutes)',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        return `$${row.getValue('price')}`;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeService(row.original.id)}
          >
            Remove
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'outline'}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'outline'}
          onClick={() => setActiveTab('services')}
        >
          Services
        </Button>
      </div>
      {activeTab === 'appointments' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
          <DataTable columns={appointmentColumns} data={appointments} />
        </div>
      )}
      {activeTab === 'services' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Services</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Service</Button>
            </form>
          </Form>
          <DataTable columns={serviceColumns} data={services} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;