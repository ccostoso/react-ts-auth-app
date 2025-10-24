import { Button } from '@/components/ui/button';
import { GET_LOGGED_IN_USER_ENDPOINT } from '@/constants';
import type { IUser } from '@/interfaces';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url =
        import.meta.env.VITE_API_BASE_URL + GET_LOGGED_IN_USER_ENDPOINT;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data as IUser;
      setUser(data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error(
          e.response?.data?.message ||
            e.message ||
            'An unexpected error occurred'
        );
        navigate('/login');
      } else if (e instanceof Error) {
        toast.error(e.message);
        navigate('/login');
      } else {
        toast.error('An unexpected error occurred');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const onLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-2 rounded border border-gray-400 p-5 w-96">
        <h1 className="text-lg font-bold">User Information</h1>
        <hr className="my-2 border-gray-400" />
        <h1 className="flex justify-between">
          <span>ID:</span> <span>{user?.id}</span>
        </h1>
        <h1 className="flex justify-between">
          <span>Name:</span> <span>{user?.name}</span>
        </h1>
        <h1 className="flex justify-between">
          <span>Email:</span> <span>{user?.email}</span>
        </h1>
        <h1 className="flex justify-between">
          <span>Verified:</span> <span>{user?.verified ? 'Yes' : 'No'}</span>
        </h1>
        <Button className="w-full" onClick={onLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
