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

    // Validate
    const validationErrors = {};

    if (!formData.username?.trim()) {
      validationErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      validationErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email?.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

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
        const { token, username } = result.data;
        login({ name: username, username }, token);
        showSuccess('Account created successfully!');
        navigate('/', { replace: true });
      } else {
        showError(result.error || 'Signup failed. Please try again.');
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
    <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
      {errors.submit && (
        <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {errors.submit}
        </div>
      )}

      <Input
        label="Username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="john_doe"
        disabled={isLoading}
        autoComplete="username"
        helpText="3+ characters, letters and numbers only"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="you@example.com"
        disabled={isLoading}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="••••••••"
        disabled={isLoading}
        autoComplete="new-password"
        helpText="At least 6 characters"
        required
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="••••••••"
        disabled={isLoading}
        autoComplete="new-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-6"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
