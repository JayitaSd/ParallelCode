import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { authService } from '@/services/authService.js';
import { showError, showSuccess } from '@/components/Common/Toast.jsx';
import { Button } from '@/components/Common/Button.jsx';
import { Input } from '@/components/Common/Input.jsx';

export const LoginForm = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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
    if (!formData.username?.trim()) validationErrors.username = 'Username is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(formData.username.trim(), formData.password);

      if (result.success) {
        const { token, username } = result.data;
        login({ name: username, username }, token);
        showSuccess('Welcome back!');
        navigate('/', { replace: true });
      } else {
        showError(result.error || 'Login failed. Please try again.');
        setErrors({ submit: result.error });
      }
    } catch (error) {
      showError('Login failed. Please try again.');
      setErrors({ submit: 'Login failed' });
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
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-6"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={isLoading}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create one
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
