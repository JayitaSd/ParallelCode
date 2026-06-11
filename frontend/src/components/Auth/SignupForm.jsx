import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { authService } from '@/services/authService.js';
import { showError, showSuccess } from '@/components/Common/Toast.jsx';
import { Button } from '@/components/Common/Button.jsx';
import { Input } from '@/components/Common/Input.jsx';

export const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.username?.trim()) validationErrors.username = 'Username is required';
    if (!formData.email?.trim()) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.signup(
          formData.username.trim(),
          formData.email.trim(),
          formData.password
      );

      if (result.success) {
        const { token, username, userId, email } = result.data || {};
        login({ name: username, username, userId, email }, token);
        showSuccess('Account created successfully!');
        navigate('/dashboard', { replace: true });
      } else {
        showError(result.error || 'Signup failed');
        setErrors({ submit: result.error });
      }
    } catch (error) {
      showError('Signup failed. Please try again.');
      setErrors({ submit: 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
              {errors.submit}
            </div>
        )}

        <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />

        <Button type="submit" variant="primary" className="w-full mt-6" loading={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
            Sign in
          </button>
        </p>
      </form>
  );
};

export default SignupForm;