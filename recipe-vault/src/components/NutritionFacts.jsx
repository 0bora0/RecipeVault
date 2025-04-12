export default function NutritionFacts({ nutrition }) {
              const nutrients = nutrition.nutrients.filter(n => 
                ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name)
              );
            
              return (
                <div className="nutrition-facts">
                  <h2>Хранителни стойности (на 100г)</h2>
                  <div className="nutrients-grid">
                    {nutrients.map(nutrient => (
                      <div key={nutrient.name} className="nutrient-item">
                        <span className="nutrient-name">{nutrient.name}</span>
                        <span className="nutrient-amount">
                          {Math.round(nutrient.amount)}{nutrient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }