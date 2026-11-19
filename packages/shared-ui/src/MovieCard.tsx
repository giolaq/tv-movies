import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from './movies';
import { CARD_WIDTH, CARD_MARGIN } from './navigation';

export function MovieCard({ movie, active, onFocus, onSelect, width, cardRef }: {
  movie: Movie; active: boolean; onFocus: () => void;
  onSelect: () => void; width?: number;
  cardRef: (ref: View | null) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      onFocus={onFocus} onPress={onSelect}
      onHoverIn={event => {
        onFocus();
        if (Platform.OS === 'web') (event.currentTarget as unknown as HTMLElement).focus();
      }}
      style={[s.card, width !== undefined && { width }, Platform.OS === 'web' && s.pointer, active && s.active]}>
      <View style={[s.art, width !== undefined && s.responsiveArt]}>
        {failed ? <View style={s.fallback}><Text style={s.fallbackTitle}>{movie.title}</Text><Text style={s.fallbackLabel}>FRAME ORIGINAL</Text></View>
          : <Image source={{ uri: movie.poster }} style={s.image} onError={() => setFailed(true)} />}
        <View style={s.score}><Text style={s.scoreText}>★ {movie.rating}</Text></View>
        <View style={s.caption}><Text style={s.captionText}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text numberOfLines={1} style={s.title}>{movie.title}</Text>
      <Text style={s.year}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { width: CARD_WIDTH, padding: 5, borderWidth: 2, borderColor: 'transparent', borderRadius: 12, margin: CARD_MARGIN },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26', transform: [{ scale: 1.025 }] },
  pointer: { cursor: 'pointer' },
  art: { height: 235, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  responsiveArt: { height: undefined, aspectRatio: 2 / 3 },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, justifyContent: 'center', padding: 20 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  fallbackLabel: { color: '#d9f99d', fontSize: 9, marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815dd', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 11, fontWeight: '700' },
  caption: { position: 'absolute', bottom: 0, padding: 12, backgroundColor: '#0b131bd9', width: '100%' },
  captionText: { color: '#fff', fontSize: 9, letterSpacing: 2 },
  title: { color: '#f2f3ee', fontSize: 14, fontWeight: '600', marginTop: 12 },
  year: { color: '#96a29f', fontSize: 11, marginTop: 5, marginBottom: 5 },
});
