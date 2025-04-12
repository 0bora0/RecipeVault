import { FaChartPie } from "react-icons/fa";
import '../styles/NutritionFacts.css';

export default function NutritionFacts({ nutrition }) {
  const nutrients = nutrition.nutrients.filter(n =>
    ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name)
  );

  return (
    <div className="container mb-4">
      <div className="d-flex align-items-center mb-4">
        <FaChartPie className="text-danger me-2" size={24} />
        <h2 className="h4 mb-0 text-dark">Хранителни стойности (на 100г)</h2>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        {nutrients.map(nutrient => (
          <div key={nutrient.name} className="col">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body text-center">
                <h5 className="card-title text-muted">{nutrient.name}</h5>
                <p className="card-text fs-5 fw-bold text-primary">
                  {Math.round(nutrient.amount)} {nutrient.unit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
