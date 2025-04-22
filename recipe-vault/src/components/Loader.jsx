import { useLoading } from '../context/LoadingContext';
import loadingGif from '../assets/loading.gif';
import '../styles/Loader.css';

export default function Loader() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <img src={loadingGif} alt="Loading..." className="loader-gif" />
    </div>
  );
}
