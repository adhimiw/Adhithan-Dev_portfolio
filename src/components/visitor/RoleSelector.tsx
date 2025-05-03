import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, GraduationCap, School, Users } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

interface RoleSelectorProps {
  onRoleSelected?: (role: string) => void;
}

const RoleSelector = ({ onRoleSelected }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if role is already selected in localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('visitorRole');
    const storedVisitorId = localStorage.getItem('visitorId');
    
    if (storedRole && storedVisitorId) {
      setSelectedRole(storedRole);
      if (onRoleSelected) {
        onRoleSelected(storedRole);
      }
    }
  }, [onRoleSelected]);

  const handleRoleSelect = async (role: string) => {
    try {
      setSelectedRole(role);
      setIsSubmitting(true);
      setError(null);
      
      // Register visitor with backend
      const response = await axios.post(`${API_URL}/api/visitors`, { role });
      
      // Store visitor info in localStorage
      const newVisitorId = response.data.visitorId;
      localStorage.setItem('visitorRole', role);
      localStorage.setItem('visitorId', newVisitorId);
      console.log('[RoleSelector] New visitor ID stored in localStorage:', newVisitorId); // Added log

      // Call the callback if provided
      if (onRoleSelected) {
        onRoleSelected(role);
      }
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Error registering visitor:', err);
      setError('Failed to register. Please try again.');
      setSelectedRole(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If role is already selected, don't show the selector
  if (selectedRole && !isSubmitting) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 ${selectedRole ? 'dark:spider-card' : ''}`}>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to My Portfolio</h2>
        
        <p className="text-muted-foreground text-center mb-8">
          Please select your role to personalize your experience
        </p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleRoleSelect('HR')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border border-border transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 dark:hover:spider-button'
            } ${selectedRole === 'HR' ? 'border-primary bg-primary/10 dark:spider-button' : ''}`}
          >
            <UserRound size={36} className="mb-2" />
            <span className="font-medium">HR Professional</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('Student')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border border-border transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 dark:hover:spider-button'
            } ${selectedRole === 'Student' ? 'border-primary bg-primary/10 dark:spider-button' : ''}`}
          >
            <GraduationCap size={36} className="mb-2" />
            <span className="font-medium">Student</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('Teacher')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border border-border transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 dark:hover:spider-button'
            } ${selectedRole === 'Teacher' ? 'border-primary bg-primary/10 dark:spider-button' : ''}`}
          >
            <School size={36} className="mb-2" />
            <span className="font-medium">Teacher</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('Other')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border border-border transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 dark:hover:spider-button'
            } ${selectedRole === 'Other' ? 'border-primary bg-primary/10 dark:spider-button' : ''}`}
          >
            <Users size={36} className="mb-2" />
            <span className="font-medium">Other</span>
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          This information helps me understand who is visiting my portfolio.
          No personal data is collected.
        </p>
      </div>
    </div>
  );
};

export default RoleSelector;
