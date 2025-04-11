import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  image: { width: '100%', marginBottom: 15, maxHeight: 200 },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 }
});

export default function RecipePDF({ recipe }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        {recipe.image && (
          <Image 
            src={recipe.image} 
            style={styles.image} 
          />
        )}

        <View style={styles.section}>
          <Text style={styles.heading}>Категория:</Text>
          <Text>{recipe.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Съставки:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index}>• {ingredient}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Инструкции:</Text>
          <Text>{recipe.instructions}</Text>
        </View>
      </Page>
    </Document>
  );
}