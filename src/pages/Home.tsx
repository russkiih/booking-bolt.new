import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to Appointment Booking</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Book your appointments easily and manage your schedule efficiently.
      </p>
      <Link to="/book">
        <Button size="lg">Book an Appointment</Button>
      </Link>
    </div>
  );
};

export default Home;