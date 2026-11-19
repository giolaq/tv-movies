import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from './movies';

export function MovieCard({ movie, active, onFocus, onPress, disabled, cardRef }: {
  movie: Movie; active: boolean; onFocus: () => void; onPress: () => void; disabled: boolean;
  cardRef: (ref: View | null) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      disabled={disabled} focusable={!disabled} hasTVPreferredFocus={active && !disabled}
      onFocus={onFocus} onPress={onPress}
      style={[s.card, active && s.active]}>
      <View style={s.art}>
        {failed ? <View style={s.fallback}><Text style={s.fallbackTitle}>{movie.title}</Text><Text style={s.fallbackLabel}>FRAME ORIGINAL</Text></View>
          : <Image source={{ uri: movie.poster }} style={s.image} onError={() => setFailed(true)} />}
        <View style={s.score}><Text style={s.scoreText}>★ {movie.rating}</Text></View>
        <View style={s.caption}><Text style={s.captionText}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text numberOfLines={2} style={s.title}>{movie.title}</Text>
      <Text style={s.year}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { width: 260, padding: 8, borderWidth: 3, borderColor: 'transparent', borderRadius: 12, margin: 10 },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  art: { height: 280, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, justifyContent: 'center', padding: 20 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  fallbackLabel: { color: '#d9f99d', fontSize: 18, marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815dd', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 20, fontWeight: '700' },
  caption: { position: 'absolute', bottom: 0, padding: 12, backgroundColor: '#0b131bd9', width: '100%' },
  captionText: { color: '#fff', fontSize: 18, letterSpacing: 1 },
  title: { color: '#f2f3ee', fontSize: 24, lineHeight: 30, height: 60, fontWeight: '600', marginTop: 12 },
  year: { color: '#b8c5c1', fontSize: 20, marginTop: 5, marginBottom: 5 },
});
