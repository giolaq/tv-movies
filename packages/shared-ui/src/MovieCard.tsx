import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Movie } from './movies';
import { CARD_MARGIN } from './navigation';

export function MovieCard({ movie, width, artHeight, active, preferred, onFocus, onSelect, canHover, cardRef }: {
  movie: Movie; width: number; artHeight: number; active: boolean; preferred: boolean; onFocus: () => void; onSelect: () => void;
  canHover: () => boolean;
  cardRef: (ref: View | null) => void;
}) {
  const [failed, setFailed] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const narrow = Platform.OS === 'web' && windowWidth < 600;
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      hasTVPreferredFocus={preferred} onFocus={onFocus} onPress={onSelect}
      onHoverIn={() => {
        if (Platform.OS === 'web' || !canHover()) return;
        onFocus();
      }}
      style={[s.card, { width }, Platform.OS === 'web' && s.pointer, active && s.active]}>
      <View style={[s.art, Platform.OS === 'web' ? s.responsiveArt : { height: artHeight }]}>
        {failed ? <View style={s.fallback}><Text style={s.fallbackTitle}>{movie.title}</Text><Text style={s.fallbackLabel}>FRAME ORIGINAL</Text></View>
          : <Image source={{ uri: movie.poster }} style={s.image} onError={() => setFailed(true)} />}
        <View style={s.score}><Text style={[s.scoreText, narrow && s.narrowScoreText]}>★ {movie.rating}</Text></View>
        <View style={[s.caption, narrow && s.narrowCaption]}><Text numberOfLines={narrow ? 1 : undefined} style={[s.captionText, narrow && s.narrowCaptionText]}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text numberOfLines={narrow ? 2 : undefined} style={[s.title, narrow && s.narrowTitle]}>{movie.title}</Text>
      <Text style={[s.year, narrow && s.narrowYear]}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { padding: 5, borderWidth: 4, borderColor: 'transparent', borderRadius: 12, margin: CARD_MARGIN },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  art: { height: 300, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  pointer: { cursor: 'pointer' },
  responsiveArt: { height: undefined, aspectRatio: 2 / 3 },
  narrowScoreText: { fontSize: 12 },
  narrowCaption: { padding: 8 },
  narrowCaptionText: { fontSize: 10, letterSpacing: 1 },
  narrowTitle: { fontSize: 16, lineHeight: 21 },
  narrowYear: { fontSize: 12, lineHeight: 17 },
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
