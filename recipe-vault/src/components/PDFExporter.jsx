import { PDFDownloadLink } from '@react-pdf/renderer';
import RecipePDF from './RecipePDF';
import { Button } from '@mui/material';

export default function PDFExporter({ recipe }) {
  return (
    <PDFDownloadLink
      document={<RecipePDF recipe={recipe} />}
      fileName={`${recipe.title}.pdf`}
    >
      {({ loading }) => (
        <Button variant="contained" disabled={loading}>
          {loading ? 'Генерира се...' : 'Изтегли PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}