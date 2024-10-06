import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

const Navbar = () => {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Appointment Booking
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/book">
            <Button variant="outline">Book Appointment</Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;