import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { authService } from '@/services/authService.js';
import { showError, showSuccess } from '@/components/Common/Toast.jsx';
import { Button } from '@/components/Common/Button.jsx';
import { Input } from '@/components/Common/Input.jsx';

export const LoginForm = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
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
    if (!formData.usernameOrEmail?.trim()) validationErrors.usernameOrEmail = 'Username or Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(
          formData.usernameOrEmail.trim(),
          formData.password
      );

      if (result.success) {
        const { token, username, userId, email } = result.data;
        login({
          name: username,
          username,
          userId,
          email
        }, token);

        showSuccess('Welcome back!');
        navigate('/dashboard', { replace: true });   // Changed to /dashboard
      } else {
        showError(result.error || 'Invalid credentials');
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
              {errors.submit}
            </div>
        )}

        <Input
            label="Username or Email"
            name="usernameOrEmail"
            type="text"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            error={errors.usernameOrEmail}
            placeholder="john_doe or john@example.com"
            disabled={isLoading}
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
            required
        />

        <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            loading={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
          >
            Create one
          </button>
        </p>
      </form>
  );
};

export default LoginForm;