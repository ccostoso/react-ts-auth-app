import axios from 'axios';
import { useEffect, useState } from 'react';

const VerifyEmailPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_VERIFY_EMAIL_ENDPOINT
          }?token=${token}`
        );
        setSuccess(true);
        setMessage(response.data.message);
      } catch (e) {
        setSuccess(false);
        if (axios.isAxiosError(e)) {
          setMessage(
            e.response?.data?.message ||
              e.message ||
              'An unexpected error occurred'
          );
        } else if (e instanceof Error) {
          setMessage(e.message);
        } else {
          setMessage('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading && <p className="text-blue-500">Verifying your email...</p>}
      {!loading && message && (
        <p className={success ? 'text-green-500' : 'text-red-500'}>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmailPage;
