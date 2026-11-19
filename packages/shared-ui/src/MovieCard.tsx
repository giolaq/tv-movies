import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from './movies';
import { CARD_MARGIN } from './navigation';

export function MovieCard({ movie, width, artHeight, active, onFocus, onSelect, cardRef }: {
  movie: Movie; width: number; artHeight: number; active: boolean; onFocus: () => void; onSelect: () => void;
  cardRef: (ref: View | null) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      onFocus={onFocus} onPress={onSelect}
      onHoverIn={() => {
        if (Platform.OS !== 'web') onFocus();
      }}
      style={[s.card, { width }, Platform.OS === 'web' && s.pointer, active && s.active]}>
      <View style={[s.art, Platform.OS === 'web' ? s.responsiveArt : { height: artHeight }]}>
        {failed ? <View style={s.fallback}><Text style={s.fallbackTitle}>{movie.title}</Text><Text style={s.fallbackLabel}>FRAME ORIGINAL</Text></View>
          : <Image source={{ uri: movie.poster }} style={s.image} onError={() => setFailed(true)} />}
        <View style={s.score}><Text style={s.scoreText}>★ {movie.rating}</Text></View>
        <View style={s.caption}><Text style={s.captionText}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text style={s.title}>{movie.title}</Text>
      <Text style={s.year}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { padding: 5, borderWidth: 4, borderColor: 'transparent', borderRadius: 12, margin: CARD_MARGIN },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  art: { height: 300, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  pointer: { cursor: 'pointer' },
  responsiveArt: { height: undefined, aspectRatio: 2 / 3 },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, justifyContent: 'center', padding: 20 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  fallbackLabel: { color: '#d9f99d', fontSize: 24, fontWeight: '500', marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 24, fontWeight: '700' },
  caption: { position: 'absolute', bottom: 0, padding: 12, backgroundColor: '#0b131b', width: '100%' },
  captionText: { color: '#fff', fontSize: 24, fontWeight: '500', letterSpacing: 2 },
  title: { color: '#f2f3ee', fontSize: 28, fontWeight: '600', marginTop: 12 },
  year: { color: '#96a29f', fontSize: 24, fontWeight: '500', marginTop: 5, marginBottom: 5 },
});
