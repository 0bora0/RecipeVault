import { useParams } from 'react-router-dom';

export default function TestRoute() {
  const { id } = useParams();
  return <h1>Тест успешен! ID: {id}</h1>;
}